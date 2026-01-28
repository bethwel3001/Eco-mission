import React from 'react'
import { FaGithub, FaLeaf } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Brand */}
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-md flex items-center justify-center">
              <FaLeaf className="text-white w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Eco-Mission</h3>
              <p className="text-sm text-gray-600 max-w-xs">
                Gamifying sustainable energy habits to heal our planet, one mission at a time.
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6">
            <span className="text-sm text-gray-500">Open Source</span>
            <a
              href="https://github.com/bethwel3001/Eco-mission.git"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <FaGithub className="w-5 h-5" />
              <span className="text-sm font-medium">GitHub</span>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 border-t border-gray-100"></div>

        {/* Copyright */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            © 2025 Eco-Mission. Making sustainability engaging through gamification.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
