import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [message, setMessage] = useState(null)

  const showToast = useCallback((msg) => setMessage(msg), [])
  const dismiss = useCallback(() => setMessage(null), [])

  return (
    <ToastContext.Provider value={{ showToast, dismiss }}>
      {children}
      {message && (
        <div className="toast show" role="status" onClick={dismiss}>
          {message}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)