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
    const baseStyles = "transform transition-all duration-300 ease-out max-w-sm w-full bg-white/95 backdrop-blur-md rounded-xl shadow-lg border-l-4 p-4 relative overflow-hidden"
    
    switch (type) {
      case 'success':
        return `${baseStyles} border-green-500`
      case 'warning':
        return `${baseStyles} border-yellow-500`
      case 'error':
        return `${baseStyles} border-red-500`
      case 'info':
        return `${baseStyles} border-blue-500`
      case 'celebration':
        return `${baseStyles} border-purple-500`
      default:
        return `${baseStyles} border-gray-500`
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle text-green-500'
      case 'warning':
        return 'fas fa-exclamation-triangle text-yellow-500'
      case 'error':
        return 'fas fa-times-circle text-red-500'
      case 'info':
        return 'fas fa-info-circle text-blue-500'
      case 'celebration':
        return 'fas fa-trophy text-purple-500'
      default:
        return 'fas fa-bell text-gray-500'
    }
  }

  return (
    <div className={`${getNotificationStyles()} ${
      isVisible 
        ? 'translate-x-0 opacity-100' 
        : 'translate-x-full opacity-0'
    }`}>
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
        <div 
          className={`h-full transition-all duration-50 ease-linear ${
            type === 'success' ? 'bg-green-500' :
            type === 'warning' ? 'bg-yellow-500' :
            type === 'error' ? 'bg-red-500' :
            type === 'info' ? 'bg-blue-500' :
            'bg-purple-500'
          }`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex items-start space-x-3">
        <i className={`${getIcon()} text-lg mt-0.5 flex-shrink-0`}></i>
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
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  )
}

export default Notification