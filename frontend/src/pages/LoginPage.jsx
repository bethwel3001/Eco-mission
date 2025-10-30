import React from 'react'
import Login from '../components/Login'

const LoginPage = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <i className="fas fa-leaf text-white text-2xl"></i>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Eco-Mission</h2>
          <p className="mt-2 text-sm text-gray-600">Save your planet, one mission at a time</p>
        </div>
        <Login onLogin={onLogin} />
      </div>
    </div>
  )
}

export default LoginPage