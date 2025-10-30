import React, { useState } from 'react'

const MissionCard = ({ mission, user, onComplete, planetHealth }) => {
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState([])
  const [isCompleting, setIsCompleting] = useState(false)

  const isCompleted = user.completedMissions?.includes(mission.id)

  const handleComplete = async () => {
    if (isCompleted) return

    setIsCompleting(true)
    
    // Simulate mission completion delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (mission.type === 'quiz') {
      setShowQuiz(true)
    } else {
      onComplete(mission.id, mission.points, mission.title)
    }
    
    setIsCompleting(false)
  }

  const handleQuizSubmit = (answers) => {
    const correctAnswers = answers.filter(answer => answer.isCorrect).length
    if (correctAnswers >= 2) {
      onComplete(mission.id, mission.points, mission.title)
      setShowQuiz(false)
    }
  }

  const getMissionIcon = () => {
    switch (mission.type) {
      case 'qr': return 'fas fa-qrcode'
      case 'delivery': return 'fas fa-truck'
      case 'quiz': return 'fas fa-shield-alt'
      case 'social': return 'fas fa-user-friends'
      default: return 'fas fa-star'
    }
  }

  const getButtonText = () => {
    if (isCompleting) return 'Completing...'
    if (isCompleted) return 'Completed!'
    return 'Start Mission'
  }

  if (showQuiz) {
    return (
      <div className="border-2 border-green-300 rounded-xl p-4 sm:p-6 bg-white shadow-lg animate-fadeIn">
        <h3 className="font-bold text-gray-900 mb-4 text-sm sm:text-base">Safety Quiz: {mission.title}</h3>
        <div className="space-y-3 mb-4">
          {mission.quizQuestions?.map((question, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg">
              <p className="font-medium text-xs sm:text-sm mb-2">{question.question}</p>
              <div className="space-y-1">
                {question.options.map((option, optIndex) => (
                  <label key={optIndex} className="flex items-center space-x-2 text-xs sm:text-sm">
                    <input type="radio" name={`question-${index}`} className="text-green-500" />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowQuiz(false)}
            className="flex-1 py-2 px-3 sm:px-4 bg-gray-500 text-white rounded-lg font-medium text-sm hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => handleQuizSubmit([{isCorrect: true}])}
            className="flex-1 py-2 px-3 sm:px-4 bg-green-500 text-white rounded-lg font-medium text-sm hover:bg-green-600 transition-colors"
          >
            Submit
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`border-2 ${isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-green-300'} rounded-xl p-4 sm:p-6 transition-all duration-300 hover:shadow-md animate-fadeIn`}>
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${isCompleted ? 'bg-green-500' : 'bg-green-100'} rounded-lg flex items-center justify-center transition-colors duration-300`}>
          <i className={`${getMissionIcon()} ${isCompleted ? 'text-white' : 'text-green-600'} text-sm sm:text-base`}></i>
        </div>
        <div className="text-right">
          <span className={`${isCompleted ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700'} px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors duration-300`}>
            +{mission.points} pts
          </span>
          {mission.healthBonus && (
            <div className="text-xs text-green-600 mt-1 hidden sm:block">+{mission.healthBonus}% health</div>
          )}
        </div>
      </div>
      
      <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2">{mission.title}</h3>
      <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">{mission.description}</p>
      
      {/* Mission-specific UI */}
      {mission.type === 'qr' && !isCompleted && (
        <div className="mb-3 sm:mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs sm:text-sm text-blue-700 mb-2">Scan cylinder QR code:</p>
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center mx-auto">
            <i className="fas fa-camera text-blue-400 text-xl sm:text-2xl"></i>
          </div>
          <button className="w-full mt-2 py-2 bg-blue-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-600 transition-colors">
            Simulate Scan
          </button>
        </div>
      )}

      {mission.type === 'social' && !isCompleted && (
        <div className="mb-3 sm:mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-xs sm:text-sm text-purple-700 mb-2">Invite friends:</p>
          <div className="flex space-x-2">
            <input 
              type="text" 
              value="https://eco-mission.com/invite/123" 
              readOnly 
              className="flex-1 text-xs border border-purple-300 rounded px-2 py-1"
            />
            <button className="px-2 sm:px-3 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600 transition-colors">
              Copy
            </button>
          </div>
        </div>
      )}

      <button 
        onClick={handleComplete}
        disabled={isCompleted || isCompleting}
        className={`w-full py-2 sm:py-3 px-4 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
          isCompleted 
            ? 'bg-green-500 text-white cursor-default' 
            : isCompleting
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-green-500 text-white hover:bg-green-600 hover:scale-105 shadow-lg hover:shadow-xl'
        }`}
      >
        {isCompleting ? (
          <span className="flex items-center justify-center">
            <i className="fas fa-spinner fa-spin mr-2"></i>
            {getButtonText()}
          </span>
        ) : isCompleted ? (
          <span className="flex items-center justify-center">
            <i className="fas fa-check mr-2"></i>
            {getButtonText()}
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <i className="fas fa-play mr-2"></i>
            {getButtonText()}
          </span>
        )}
      </button>

      {isCompleted && mission.socialReward && (
        <div className="mt-2 sm:mt-3 p-2 bg-green-100 rounded-lg text-center">
          <i className="fas fa-users text-green-600 mr-1"></i>
          <span className="text-xs sm:text-sm text-green-700">Planets connected!</span>
        </div>
      )}
    </div>
  )
}

export default MissionCard