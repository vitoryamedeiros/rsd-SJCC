"use client"

import type React from "react"

// Adapted from: https://ui.shadcn.com/docs/components/toast
import { useState, useEffect, useCallback } from "react"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

type ToastProps = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type Toast = ToastProps & {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((toastId?: string) => {
    setToasts((toasts) => {
      if (toastId) {
        return toasts.filter((toast) => toast.id !== toastId)
      }
      return []
    })
  }, [])

  const toast = useCallback(
    ({ ...props }: Omit<ToastProps, "id">) => {
      const id = genId()

      const newToast = {
        ...props,
        id,
      }

      setToasts((toasts) => [...toasts, newToast].slice(-TOAST_LIMIT))

      const timeout = setTimeout(() => {
        dismiss(id)
        toastTimeouts.delete(id)
      }, TOAST_REMOVE_DELAY)

      toastTimeouts.set(id, timeout)

      return id
    },
    [dismiss],
  )

  useEffect(() => {
    return () => {
      for (const timeout of toastTimeouts.values()) {
        clearTimeout(timeout)
      }
    }
  }, [])

  return {
    toast,
    dismiss,
    toasts,
  }
}
