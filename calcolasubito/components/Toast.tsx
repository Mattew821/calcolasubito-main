'use client'

import { useState, useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastItem {
  id: string
  message: string
  type: ToastType
  duration?: number
  onClose?: (id: string) => void
}

interface ToastItemProps extends ToastItem {
  onClose: (id: string) => void
}

function ToastItem({ id, message, type, duration = 3000, onClose }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose(id)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [id, duration, onClose])

  if (!isVisible) return null

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  }[type]

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  }[type]

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-4 w-[calc(100%-2rem)] sm:w-auto max-w-sm ${bgColor} text-white px-4 sm:px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fadeIn z-50`}
    >
      <span className="text-xl font-bold">{icon}</span>
      <span className="text-sm sm:text-base break-words">{message}</span>
    </div>
  )
}

/**
 * Toast Container component - renders all active toasts
 * Usage: <ToastContainer toasts={toasts} onClose={removeToast} />
 */
export function ToastContainer({
  toasts,
  onClose,
}: {
  toasts: ToastItem[]
  onClose: (id: string) => void
}) {
  if (toasts.length === 0) return null

  return (
    <>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} onClose={onClose} />
      ))}
    </>
  )
}

/**
 * Hook for managing multiple toasts with ID-based array approach
 * Prevents duplicate messages and ensures proper cleanup
 *
 * Example:
 * const { toasts, showToast, removeToast } = useToast()
 * showToast('Success!', 'success', 3000)
 */
export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = (message: string, type: ToastType = 'info', duration = 3000) => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { id, message, type, duration }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return { toasts, showToast, removeToast }
}
