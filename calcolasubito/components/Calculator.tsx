'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Star,
  Share2,
  Link2,
  Printer,
  History,
  RotateCcw,
  Trash2,
  RefreshCw,
  Download,
  Upload,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { CALCULATOR_CATALOG } from '@/lib/calculator-catalog'
import { useAppPreferences } from '@/components/AppPreferencesProvider'

interface CalculatorProps {
  title: string
  description: string
  children: ReactNode
  keyword?: string
}

type SnapshotValue = string | string[]

interface FormSnapshot {
  timestamp: number
  values: Record<string, SnapshotValue>
}

const FAVORITES_STORAGE_KEY = 'calcolasubito:favorites'
const RECENTS_STORAGE_KEY = 'calcolasubito:recents'
const SNAPSHOT_STORAGE_PREFIX = 'calcolasubito:snapshots:'
const MAX_RECENTS = 8
const MAX_SNAPSHOTS = 6

function readStringListStorage(key: string): string[] {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) {
      return []
    }
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.filter((entry): entry is string => typeof entry === 'string')
  } catch {
    return []
  }
}

function readSnapshotsStorage(key: string): FormSnapshot[] {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) {
      return []
    }
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.filter((entry): entry is FormSnapshot => {
      return (
        typeof entry === 'object' &&
        entry !== null &&
        typeof (entry as FormSnapshot).timestamp === 'number' &&
        typeof (entry as FormSnapshot).values === 'object' &&
        (entry as FormSnapshot).values !== null
      )
    })
  } catch {
    return []
  }
}

function writeJsonStorage(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore storage failures (private mode/quota)
  }
}

async function copyTextToClipboard(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value)
      return true
    }
  } catch {
    // Fallback to legacy method
  }

  try {
    const textarea = document.createElement('textarea')
    textarea.value = value
    textarea.setAttribute('readonly', 'true')
    textarea.style.position = 'absolute'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    const copied = document.execCommand('copy')
    document.body.removeChild(textarea)
    return copied
  } catch {
    return false
  }
}

function formatSnapshotExportFileName(calculatorId: string | null): string {
  const safeId = calculatorId ?? 'calculator'
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  return `${safeId}-snapshot-${timestamp}.json`
}

function sanitizeSnapshots(value: unknown): FormSnapshot[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((entry): entry is FormSnapshot => {
    if (typeof entry !== 'object' || entry === null) {
      return false
    }

    const maybeSnapshot = entry as FormSnapshot
    if (typeof maybeSnapshot.timestamp !== 'number') {
      return false
    }

    if (typeof maybeSnapshot.values !== 'object' || maybeSnapshot.values === null) {
      return false
    }

    return true
  })
}

function getCurrentCalculatorId(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean)
  return segments[0] ?? null
}

function appendSnapshotValue(values: Record<string, SnapshotValue>, name: string, nextValue: string): void {
  const previous = values[name]
  if (previous === undefined) {
    values[name] = nextValue
    return
  }
  if (Array.isArray(previous)) {
    values[name] = [...previous, nextValue]
    return
  }
  values[name] = [previous, nextValue]
}

function extractFormValues(form: HTMLFormElement): Record<string, SnapshotValue> {
  const values: Record<string, SnapshotValue> = {}
  const checkboxNames = new Set<string>()
  const radioNames = new Set<string>()
  const elements = Array.from(form.elements)

  for (const element of elements) {
    if (
      !(element instanceof HTMLInputElement) &&
      !(element instanceof HTMLSelectElement) &&
      !(element instanceof HTMLTextAreaElement)
    ) {
      continue
    }

    const { name } = element
    if (!name) {
      continue
    }

    if (element instanceof HTMLInputElement) {
      if (element.type === 'checkbox') {
        checkboxNames.add(name)
        if (element.checked) {
          appendSnapshotValue(values, name, element.value || 'on')
        }
        continue
      }

      if (element.type === 'radio') {
        radioNames.add(name)
        if (element.checked) {
          values[name] = element.value
        }
        continue
      }

      values[name] = element.value
      continue
    }

    if (element instanceof HTMLSelectElement) {
      if (element.multiple) {
        values[name] = Array.from(element.selectedOptions).map((option) => option.value)
      } else {
        values[name] = element.value
      }
      continue
    }

    values[name] = element.value
  }

  for (const name of checkboxNames) {
    if (values[name] === undefined) {
      values[name] = ''
    }
  }

  for (const name of radioNames) {
    if (values[name] === undefined) {
      values[name] = ''
    }
  }

  return values
}

function applySnapshotToForm(form: HTMLFormElement, snapshot: FormSnapshot): void {
  const elements = Array.from(form.elements)

  for (const element of elements) {
    if (
      !(element instanceof HTMLInputElement) &&
      !(element instanceof HTMLSelectElement) &&
      !(element instanceof HTMLTextAreaElement)
    ) {
      continue
    }

    const { name } = element
    if (!name) {
      continue
    }

    const snapshotValue = snapshot.values[name]
    if (snapshotValue === undefined) {
      continue
    }

    if (element instanceof HTMLInputElement) {
      if (element.type === 'checkbox') {
        if (Array.isArray(snapshotValue)) {
          element.checked = snapshotValue.includes(element.value || 'on')
        } else {
          element.checked = snapshotValue === (element.value || 'on')
        }
        element.dispatchEvent(new Event('change', { bubbles: true }))
        continue
      }

      if (element.type === 'radio') {
        if (Array.isArray(snapshotValue)) {
          element.checked = snapshotValue.includes(element.value)
        } else {
          element.checked = snapshotValue === element.value
        }
        element.dispatchEvent(new Event('change', { bubbles: true }))
        continue
      }

      element.value = Array.isArray(snapshotValue) ? snapshotValue[0] ?? '' : snapshotValue
      element.dispatchEvent(new Event('input', { bubbles: true }))
      element.dispatchEvent(new Event('change', { bubbles: true }))
      continue
    }

    if (element instanceof HTMLSelectElement) {
      if (element.multiple) {
        const selectedValues = Array.isArray(snapshotValue) ? snapshotValue : [snapshotValue]
        for (const option of Array.from(element.options)) {
          option.selected = selectedValues.includes(option.value)
        }
      } else {
        element.value = Array.isArray(snapshotValue) ? snapshotValue[0] ?? '' : snapshotValue
      }
      element.dispatchEvent(new Event('change', { bubbles: true }))
      continue
    }

    element.value = Array.isArray(snapshotValue) ? snapshotValue[0] ?? '' : snapshotValue
    element.dispatchEvent(new Event('input', { bubbles: true }))
    element.dispatchEvent(new Event('change', { bubbles: true }))
  }
}

export default function Calculator({
  title,
  description,
  children,
  keyword,
}: CalculatorProps) {
  const pathname = usePathname()
  const formSectionRef = useRef<HTMLElement | null>(null)
  const importInputRef = useRef<HTMLInputElement | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [recents, setRecents] = useState<string[]>([])
  const [snapshots, setSnapshots] = useState<FormSnapshot[]>([])
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const { text, language } = useAppPreferences()

  const calculatorId = useMemo(() => getCurrentCalculatorId(pathname), [pathname])
  const snapshotStorageKey = useMemo(() => `${SNAPSHOT_STORAGE_PREFIX}${pathname}`, [pathname])

  const currentCalculator = useMemo(() => {
    if (!calculatorId) {
      return null
    }
    return CALCULATOR_CATALOG.find((calculator) => calculator.id === calculatorId) ?? null
  }, [calculatorId])

  const isFavorite = useMemo(() => {
    if (!currentCalculator) {
      return false
    }
    return favorites.includes(currentCalculator.id)
  }, [currentCalculator, favorites])

  const favoriteCalculators = useMemo(() => {
    return favorites
      .map((id) => CALCULATOR_CATALOG.find((calculator) => calculator.id === id) ?? null)
      .filter((calculator): calculator is (typeof CALCULATOR_CATALOG)[number] => calculator !== null)
      .slice(0, 6)
  }, [favorites])

  const recentCalculators = useMemo(() => {
    return recents
      .map((id) => CALCULATOR_CATALOG.find((calculator) => calculator.id === id) ?? null)
      .filter(
        (calculator): calculator is (typeof CALCULATOR_CATALOG)[number] =>
          calculator !== null && calculator.id !== currentCalculator?.id
      )
      .slice(0, 5)
  }, [currentCalculator?.id, recents])

  const relatedCalculators = useMemo(() => {
    if (!currentCalculator) {
      return []
    }
    return CALCULATOR_CATALOG.filter(
      (calculator) =>
        calculator.id !== currentCalculator.id && calculator.category === currentCalculator.category
    ).slice(0, 4)
  }, [currentCalculator])

  useEffect(() => {
    if (!feedbackMessage) {
      return
    }
    const timeoutId = window.setTimeout(() => setFeedbackMessage(null), 3200)
    return () => window.clearTimeout(timeoutId)
  }, [feedbackMessage])

  useEffect(() => {
    const nextFavorites = readStringListStorage(FAVORITES_STORAGE_KEY)
    setFavorites(nextFavorites)

    const storedRecents = readStringListStorage(RECENTS_STORAGE_KEY)
    let nextRecents = storedRecents
    if (currentCalculator) {
      nextRecents = [currentCalculator.id, ...storedRecents.filter((id) => id !== currentCalculator.id)].slice(
        0,
        MAX_RECENTS
      )
      writeJsonStorage(RECENTS_STORAGE_KEY, nextRecents)
    }
    setRecents(nextRecents)
    setSnapshots(readSnapshotsStorage(snapshotStorageKey))
  }, [currentCalculator, snapshotStorageKey])

  useEffect(() => {
    const section = formSectionRef.current
    if (!section) {
      return
    }

    const onSubmitCapture = (event: Event) => {
      const target = event.target
      if (!(target instanceof HTMLFormElement)) {
        return
      }

      const values = extractFormValues(target)
      if (Object.keys(values).length === 0) {
        return
      }

      setSnapshots((previous) => {
        const updated: FormSnapshot[] = [{ timestamp: Date.now(), values }, ...previous].slice(0, MAX_SNAPSHOTS)
        writeJsonStorage(snapshotStorageKey, updated)
        return updated
      })
    }

    section.addEventListener('submit', onSubmitCapture, true)
    return () => {
      section.removeEventListener('submit', onSubmitCapture, true)
    }
  }, [snapshotStorageKey])

  const toggleFavorite = () => {
    if (!currentCalculator) {
      return
    }
    const updatedFavorites = isFavorite
      ? favorites.filter((id) => id !== currentCalculator.id)
      : [currentCalculator.id, ...favorites.filter((id) => id !== currentCalculator.id)]
    setFavorites(updatedFavorites)
    writeJsonStorage(FAVORITES_STORAGE_KEY, updatedFavorites)
    setFeedbackMessage(isFavorite ? text.calculator.favoriteRemoved : text.calculator.favoriteAdded)
  }

  const copyCalculatorLink = async () => {
    const copied = await copyTextToClipboard(window.location.href)
    if (copied) {
      setFeedbackMessage(text.calculator.copiedLink)
    } else {
      setFeedbackMessage(text.calculator.copyLinkError)
    }
  }

  const shareCalculator = async () => {
    const shareData = {
      title,
      text: description,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        setFeedbackMessage(text.calculator.shareCompleted)
      } catch {
        setFeedbackMessage(text.calculator.shareCanceled)
      }
      return
    }

    await copyCalculatorLink()
  }

  const getMainForm = (): HTMLFormElement | null => {
    const section = formSectionRef.current
    if (!section) {
      return null
    }
    return section.querySelector('form')
  }

  const printCalculator = () => {
    window.print()
  }

  const resetFormValues = () => {
    const form = getMainForm()
    if (!form) {
      setFeedbackMessage(text.calculator.formNotFound)
      return
    }

    form.reset()
    for (const element of Array.from(form.elements)) {
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLSelectElement ||
        element instanceof HTMLTextAreaElement
      ) {
        element.dispatchEvent(new Event('input', { bubbles: true }))
        element.dispatchEvent(new Event('change', { bubbles: true }))
      }
    }

    setFeedbackMessage(text.calculator.formReset)
  }

  const submitFormNow = () => {
    const form = getMainForm()
    if (!form) {
      setFeedbackMessage(text.calculator.formNotFound)
      return
    }

    if (typeof form.requestSubmit === 'function') {
      form.requestSubmit()
    } else {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    }
    setFeedbackMessage(text.calculator.calculationSubmitted)
  }

  const restoreLastInputs = () => {
    if (snapshots.length === 0) {
      setFeedbackMessage(text.calculator.noHistory)
      return
    }

    const section = formSectionRef.current
    const form = section?.querySelector('form')
    if (!section || !form) {
      setFeedbackMessage(text.calculator.formNotFound)
      return
    }

    const latestSnapshot = snapshots[0]
    if (!latestSnapshot) {
      setFeedbackMessage(text.calculator.noHistory)
      return
    }

    applySnapshotToForm(form, latestSnapshot)
    setFeedbackMessage(text.calculator.restoreCompleted)
  }

  const clearSnapshots = () => {
    setSnapshots([])
    try {
      window.localStorage.removeItem(snapshotStorageKey)
    } catch {
      // Ignore storage failures
    }
    setFeedbackMessage(text.calculator.historyCleared)
  }

  const exportSnapshots = () => {
    if (snapshots.length === 0) {
      setFeedbackMessage(text.calculator.noExportHistory)
      return
    }

    const payload = {
      version: 1,
      pathname,
      title,
      exportedAt: new Date().toISOString(),
      snapshots,
    }

    try {
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = formatSnapshotExportFileName(calculatorId)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      setFeedbackMessage(text.calculator.exportCompleted)
    } catch {
      setFeedbackMessage(text.calculator.exportError)
    }
  }

  const openImportDialog = () => {
    importInputRef.current?.click()
  }

  const handleImportSnapshots = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) {
      return
    }

    try {
      const content = await selectedFile.text()
      const parsed: unknown = JSON.parse(content)
      const maybeSnapshots =
        typeof parsed === 'object' && parsed !== null && 'snapshots' in parsed
          ? (parsed as { snapshots: unknown }).snapshots
          : parsed

      const importedSnapshots = sanitizeSnapshots(maybeSnapshots).slice(0, MAX_SNAPSHOTS)
      if (importedSnapshots.length === 0) {
        setFeedbackMessage(text.calculator.importNoUsableData)
      } else {
        setSnapshots(importedSnapshots)
        writeJsonStorage(snapshotStorageKey, importedSnapshots)
        setFeedbackMessage(`${text.calculator.importCompleted} (${importedSnapshots.length})`)
      }
    } catch {
      setFeedbackMessage(text.calculator.importError)
    } finally {
      event.target.value = ''
    }
  }

  return (
    <div className="min-h-screen page-surface relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-16 space-y-8">
        <header className="glass-panel rounded-3xl p-8 md:p-10 fade-in-up" data-reveal>
          <p className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-700">
            {keyword || 'Calcolatore online'}
          </p>
          <h1 className="font-display mt-4 text-3xl md:text-5xl text-slate-900">{title}</h1>
          <p className="mt-3 text-base md:text-lg text-slate-600 max-w-3xl">{description}</p>
        </header>

        <section className="portal-card md:p-8 p-6 fade-in-up space-y-5" data-reveal>
          <input
            ref={importInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleImportSnapshots}
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={toggleFavorite}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-cyan-300 hover:text-cyan-700 transition-colors"
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-current text-amber-500' : ''}`} />
              {isFavorite ? text.calculator.favorite : text.calculator.addFavorite}
            </button>
            <button
              type="button"
              onClick={copyCalculatorLink}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-cyan-300 hover:text-cyan-700 transition-colors"
            >
              <Link2 className="w-4 h-4" />
              {text.calculator.copyLink}
            </button>
            <button
              type="button"
              onClick={shareCalculator}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-cyan-300 hover:text-cyan-700 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              {text.calculator.share}
            </button>
            <button
              type="button"
              onClick={printCalculator}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-cyan-300 hover:text-cyan-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              {text.calculator.print}
            </button>
            <button
              type="button"
              onClick={resetFormValues}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-cyan-300 hover:text-cyan-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              {text.calculator.resetForm}
            </button>
            <button
              type="button"
              onClick={submitFormNow}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-cyan-300 hover:text-cyan-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              {text.calculator.recalculate}
            </button>
            <button
              type="button"
              onClick={restoreLastInputs}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-cyan-300 hover:text-cyan-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              {text.calculator.restoreValues}
            </button>
            <button
              type="button"
              onClick={exportSnapshots}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-cyan-300 hover:text-cyan-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              {text.calculator.exportHistory}
            </button>
            <button
              type="button"
              onClick={openImportDialog}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-cyan-300 hover:text-cyan-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              {text.calculator.importHistory}
            </button>
            {snapshots.length > 0 && (
              <button
                type="button"
                onClick={clearSnapshots}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                {text.calculator.clearHistory}
              </button>
            )}
          </div>

          {feedbackMessage && (
            <p className="text-sm text-cyan-700 font-semibold" role="status" aria-live="polite">
              {feedbackMessage}
            </p>
          )}

          {snapshots.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                <History className="w-4 h-4" />
                {text.calculator.localHistory} ({snapshots.length})
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {text.calculator.localHistoryLastSaved}:{' '}
                {new Date(snapshots[0]?.timestamp ?? Date.now()).toLocaleString(language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'it-IT')}
              </p>
            </div>
          )}
        </section>

        <section ref={formSectionRef} className="portal-card md:p-8 p-6 fade-in-up" data-reveal>
          {children}
        </section>

        {(relatedCalculators.length > 0 || recentCalculators.length > 0 || favoriteCalculators.length > 0) && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 fade-in-up" data-reveal>
            <article className="portal-card">
              <h2 className="font-display text-lg text-slate-900 mb-3">{text.calculator.relatedCalculators}</h2>
              <ul className="space-y-2 text-sm">
                {relatedCalculators.map((calculator) => (
                  <li key={calculator.id}>
                    <Link href={`/${calculator.id}`} className="text-cyan-700 hover:underline">
                      {calculator.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </article>

            <article className="portal-card">
              <h2 className="font-display text-lg text-slate-900 mb-3">{text.calculator.recentCalculators}</h2>
              {recentCalculators.length === 0 ? (
                <p className="text-sm text-slate-600">{text.calculator.noRecentItems}</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {recentCalculators.map((calculator) => (
                    <li key={calculator.id}>
                      <Link href={`/${calculator.id}`} className="text-cyan-700 hover:underline">
                        {calculator.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </article>

            <article className="portal-card">
              <h2 className="font-display text-lg text-slate-900 mb-3">{text.calculator.favorites}</h2>
              {favoriteCalculators.length === 0 ? (
                <p className="text-sm text-slate-600">{text.calculator.noFavoriteItems}</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {favoriteCalculators.map((calculator) => (
                    <li key={calculator.id}>
                      <Link href={`/${calculator.id}`} className="text-cyan-700 hover:underline">
                        {calculator.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </section>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 gap-5 fade-in-up" data-reveal>
          <article className="portal-card">
            <h2 className="font-display text-xl text-slate-900 mb-3">{text.calculator.privacyByDesign}</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {text.calculator.privacyByDesignText}
            </p>
          </article>

          <article className="portal-card">
            <h2 className="font-display text-xl text-slate-900 mb-3">{text.calculator.professionalUse}</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {text.calculator.professionalUseText}
            </p>
          </article>
        </section>
      </div>
    </div>
  )
}
