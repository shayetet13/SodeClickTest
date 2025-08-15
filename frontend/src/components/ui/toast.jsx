import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

const Toast = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose,
  isVisible = false 
}) => {
  const [show, setShow] = useState(isVisible)

  useEffect(() => {
    setShow(isVisible)
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setShow(false)
        setTimeout(() => onClose?.(), 300) // Wait for animation to complete
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500',
          icon: <CheckCircle className="h-5 w-5" />,
          gradient: 'from-green-400 to-green-600'
        }
      case 'error':
        return {
          bg: 'bg-red-500',
          icon: <AlertCircle className="h-5 w-5" />,
          gradient: 'from-red-400 to-red-600'
        }
      case 'warning':
        return {
          bg: 'bg-yellow-500',
          icon: <AlertTriangle className="h-5 w-5" />,
          gradient: 'from-yellow-400 to-yellow-600'
        }
      default:
        return {
          bg: 'bg-blue-500',
          icon: <Info className="h-5 w-5" />,
          gradient: 'from-blue-400 to-blue-600'
        }
    }
  }

  const typeStyles = getTypeStyles()

  if (!show) return null

  return (
    <div 
      className={`${
        show 
          ? 'animate-[slideInFromTop_0.6s_ease-out_forwards]' 
          : 'animate-[slideOutToTop_0.4s_ease-in_forwards]'
      }`}
      style={{ 
        animationFillMode: 'both'
      }}
    >
      <div className={`bg-gradient-to-r ${typeStyles.gradient} text-white px-8 py-5 rounded-2xl shadow-2xl border-2 border-white/30 backdrop-blur-xl min-w-96 max-w-lg relative overflow-hidden`}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-ping"></div>
        
        {/* Floating Sparkles */}
        <div className="absolute top-2 right-6 w-2 h-2 bg-white/60 rounded-full animate-bounce delay-100"></div>
        <div className="absolute top-4 right-12 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-3 right-8 w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce delay-500"></div>
        
        <div className="flex items-start gap-4 relative z-10">
          <div className="flex-shrink-0 mt-1">
            <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
              {typeStyles.icon}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-base font-semibold leading-6 drop-shadow-lg">{message}</p>
          </div>
          <button
            onClick={() => {
              setShow(false)
              setTimeout(() => onClose?.(), 300)
            }}
            className="flex-shrink-0 ml-2 p-2 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-110"
          >
            <X className="h-5 w-5 drop-shadow-lg" />
          </button>
        </div>
        
        {/* Enhanced Progress Bar */}
        {duration > 0 && (
          <div className="mt-4 relative">
            <div className="h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <div 
                className="h-full bg-gradient-to-r from-white/80 via-white/60 to-white/80 rounded-full shadow-lg"
                style={{
                  animation: `shrink ${duration}ms linear forwards`
                }}
              />
            </div>
            {/* Progress Glow Effect */}
            <div className="absolute inset-0 h-2 bg-white/10 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  )
}

// Toast Container Component
const ToastContainer = ({ toasts, removeToast }) => {
  if (typeof document === 'undefined') return null
  return createPortal(
    <div className="fixed top-4 right-4 z-[9999] p-0 flex flex-col items-end gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="flex justify-end pointer-events-auto">
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            isVisible={true}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>,
    document.body
  )
}

// Hook for using toasts
export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random()
    const newToast = { id, message, type, duration }
    
    setToasts(prev => [...prev, newToast])
    
    return id
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const success = (message, duration) => addToast(message, 'success', duration)
  const error = (message, duration) => addToast(message, 'error', duration)
  const warning = (message, duration) => addToast(message, 'warning', duration)
  const info = (message, duration) => addToast(message, 'info', duration)

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    ToastContainer: () => <ToastContainer toasts={toasts} removeToast={removeToast} />
  }
}

export default Toast
