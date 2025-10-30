
import React from 'react'
import Header from './Header'

const Analytics = ({ user, onLogout }) => {
  const stats = [
    { label: 'CO2 Saved', value: '124 kg', icon: 'fas fa-cloud', color: 'text-green-500' },
    { label: 'Trees Equivalent', value: '8 trees', icon: 'fas fa-tree', color: 'text-green-600' },
    { label: 'Energy Saved', value: '890 kWh', icon: 'fas fa-bolt', color: 'text-yellow-500' },
    { label: 'Water Saved', value: '3,400 L', icon: 'fas fa-tint', color: 'text-blue-500' }
  ]

  const activity = [
    { action: 'Cylinder Return', date: '2 days ago', points: 100 },
    { action: 'Eco Delivery', date: '1 week ago', points: 50 },
    { action: 'Safety Quiz', date: '2 weeks ago', points: 75 },
    { action: 'Referral Bonus', date: '3 weeks ago', points: 200 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header user={user} onLogout={onLogout} />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Eco Analytics</h1>
        <p className="text-gray-600 mb-8">Track your environmental impact and mission progress</p>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                  <i className={`${stat.icon} ${stat.color} text-lg`}></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progress Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Progress</h2>
            <div className="space-y-4">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May'].map((month, index) => (
                <div key={month} className="flex items-center justify-between">
                  <span className="text-gray-600 w-12">{month}</span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${20 + (index * 20)}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-gray-900 font-medium w-12 text-right">{20 + (index * 20)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {activity.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.action}</p>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    +{item.points} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Impact Visualization */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Your Environmental Impact</h2>
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-4">
              <i className="fas fa-seedling text-white text-3xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">You've made a difference!</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Your sustainable choices have prevented 124 kg of CO2 from entering the atmosphere. 
              That's equivalent to planting 8 trees!
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Analytics