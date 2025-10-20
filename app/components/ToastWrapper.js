'use client'

import { ToastProvider, ToastContainer } from './Toast'

export default function ToastWrapper({ children }) {
  return (
    <ToastProvider>
      {children}
      <ToastContainer />
    </ToastProvider>
  )
}