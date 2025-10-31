import React, { useEffect, useState } from 'react'

const Notification = ({ type, title, message, duration, onClose }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    setIsVisible(true)
    
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.max(0, prev - (100 / (duration / 50))))
    }, 50)

    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, duration)

    return () => {
      clearTimeout(timer)
      clearInterval(progressInterval)
    }
  }, [duration, onClose])

  const getNotificationStyles = () => {
    const baseStyles = "transform transition-all duration-300 ease-out w-full max-w-sm bg-white/95 backdrop-blur-md rounded-xl shadow-lg border-l-4 p-4 relative overflow-hidden"
    
    switch (type) {
      case 'success':
        return `${baseStyles} border-green-500`
      case 'warning':
        return `${baseStyles} border-yellow-500`
      case 'error':
        return `${baseStyles} border-red-500`
      case 'info':
        return `${baseStyles} border-blue-500`
      default:
        return `${baseStyles} border-gray-500`
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
      case 'warning':
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z'
      case 'error':
        return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
      case 'info':
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      default:
        return 'M15 17h5l-5 5v-5zM4 6h16M4 12h16M4 18h16'
    }
  }

  return (
    <div className={`${getNotificationStyles()} ${
      isVisible 
        ? 'translate-x-0 opacity-100' 
        : 'translate-x-full opacity-0'
    }`}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
        <div 
          className={`h-full transition-all duration-50 ease-linear ${
            type === 'success' ? 'bg-green-500' :
            type === 'warning' ? 'bg-yellow-500' :
            type === 'error' ? 'bg-red-500' :
            type === 'info' ? 'bg-blue-500' :
            'bg-gray-500'
          }`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex items-start space-x-3">
        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIcon()} />
        </svg>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
          <p className="text-gray-600 text-sm mt-1">{message}</p>
        </div>
        <button 
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Notification