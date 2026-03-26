/**
 * React hook per usare il Worker Pool nei componenti
 * Gestisce il ciclo di vita del pool e fornisce funzione calculate() asincrona
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { getWorkerPool, disposeWorkerPool } from '@/lib/worker-pool'

export function useCalculatorWorker() {
  const poolRef = useRef<ReturnType<typeof getWorkerPool> | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Inizializzare il pool al mount
  useEffect(() => {
    // Inizializzare solo se in browser (client-side)
    if (typeof window !== 'undefined') {
      poolRef.current = getWorkerPool()
    }

    // Cleanup al unmount
    return () => {
      // Non disponiamo il pool globale qui perché è singleton
      // Lo lascediamo attivo per l'intera sessione
    }
  }, [])

  const calculate = useCallback(
    async (type: string, payload: Record<string, any>) => {
      if (!poolRef.current) {
        throw new Error('Worker pool not initialized')
      }

      try {
        setIsLoading(true)
        const result = await poolRef.current.runTask(type, payload)
        return result
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  return {
    calculate,
    isLoading,
    poolSize: poolRef.current?.getPoolSize() ?? 0,
    queueLength: poolRef.current?.getQueueLength() ?? 0,
  }
}
