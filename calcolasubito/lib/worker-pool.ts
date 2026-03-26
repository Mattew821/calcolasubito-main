/**
 * Pool di Web Worker con dimensionamento automatico
 * Usa navigator.hardwareConcurrency per sfruttare tutti i core disponibili
 */

type TaskPayload = Record<string, any>

interface PendingTask {
  id: string
  type: string
  payload: TaskPayload
  resolve: (result: any) => void
  reject: (error: Error) => void
}

export class WorkerPool {
  private workers: Worker[] = []
  private availableWorkers: Worker[] = []
  private taskQueue: PendingTask[] = []
  private taskIdCounter = 0
  private taskMap = new Map<string, PendingTask>()

  constructor() {
    // Determinare numero di worker basato su hardwareConcurrency
    const cores =
      typeof navigator !== 'undefined' && navigator.hardwareConcurrency
        ? Math.min(navigator.hardwareConcurrency, 4) // Max 4 per evitare oversubscription
        : 2

    // Creare worker pool
    for (let i = 0; i < cores; i++) {
      this.createWorker()
    }
  }

  private createWorker(): void {
    try {
      // Next.js webpack 5 supporta new Worker(new URL(..., import.meta.url))
      const worker = new Worker(
        new URL('./workers/calculations.worker.ts', import.meta.url)
      )

      worker.onmessage = (event: MessageEvent) => {
        this.handleWorkerMessage(worker, event)
      }

      worker.onerror = (error: ErrorEvent) => {
        console.error('Worker error:', error)
        // Rimuovere il worker difettoso
        const index = this.workers.indexOf(worker)
        if (index > -1) {
          this.workers.splice(index, 1)
          this.availableWorkers = this.availableWorkers.filter(w => w !== worker)
        }
        // Rigenerare il worker
        this.createWorker()
      }

      this.workers.push(worker)
      this.availableWorkers.push(worker)
    } catch (error) {
      console.error('Failed to create worker:', error)
    }
  }

  private handleWorkerMessage(worker: Worker, event: MessageEvent): void {
    const { id, result, error } = event.data

    const task = this.taskMap.get(id)
    if (!task) return

    this.taskMap.delete(id)

    if (error) {
      task.reject(new Error(error))
    } else {
      task.resolve(result)
    }

    // Rimettere il worker in lista disponibili
    this.availableWorkers.push(worker)

    // Processare la prossima task in coda
    this.processQueue()
  }

  private processQueue(): void {
    if (this.taskQueue.length === 0 || this.availableWorkers.length === 0) {
      return
    }

    const task = this.taskQueue.shift()
    if (!task) return

    const worker = this.availableWorkers.shift()
    if (!worker) {
      this.taskQueue.unshift(task) // Rimettere in coda
      return
    }

    // Inviare la task al worker
    worker.postMessage({
      id: task.id,
      type: task.type,
      payload: task.payload,
    })
  }

  async runTask(type: string, payload: TaskPayload): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = `task-${++this.taskIdCounter}`

      const task: PendingTask = {
        id,
        type,
        payload,
        resolve,
        reject,
      }

      this.taskMap.set(id, task)

      if (this.availableWorkers.length > 0) {
        // Worker disponibile subito
        const worker = this.availableWorkers.shift()!
        worker.postMessage({
          id,
          type,
          payload,
        })
      } else {
        // Mettere in coda
        this.taskQueue.push(task)
      }

      // Timeout per evitare promise sospese (max 30s)
      const timeout = setTimeout(() => {
        this.taskMap.delete(id)
        reject(new Error(`Task ${id} timed out after 30 seconds`))
      }, 30000)

      // Cancellare il timeout quando la task completa
      const originalResolve = resolve
      const originalReject = reject
      task.resolve = (value) => {
        clearTimeout(timeout)
        originalResolve(value)
      }
      task.reject = (error) => {
        clearTimeout(timeout)
        originalReject(error)
      }
    })
  }

  terminate(): void {
    this.workers.forEach(worker => {
      try {
        worker.terminate()
      } catch (error) {
        console.error('Error terminating worker:', error)
      }
    })
    this.workers = []
    this.availableWorkers = []
    this.taskQueue = []
    this.taskMap.clear()
  }

  getPoolSize(): number {
    return this.workers.length
  }

  getQueueLength(): number {
    return this.taskQueue.length
  }
}

// Singleton pool per l'intera app
let globalPool: WorkerPool | null = null

export function getWorkerPool(): WorkerPool {
  if (!globalPool) {
    globalPool = new WorkerPool()
  }
  return globalPool
}

export function disposeWorkerPool(): void {
  if (globalPool) {
    globalPool.terminate()
    globalPool = null
  }
}
