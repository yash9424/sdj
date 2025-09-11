'use client'

export default function AdminDashboard() {
  const stats = [
    { name: 'Total Sales', value: '1,200 M', change: '75.95%', changeText: 'vs 1.2M Target', icon: '💰', color: 'bg-sky-500', isPositive: true },
    { name: 'Total Orders', value: '16,920', change: '3%', changeText: 'Vs last month', icon: '📦', color: 'bg-red-500', isPositive: false },
    { name: 'Order Complete', value: '16,581', change: '98%', changeText: 'Vs last month', icon: '✅', color: 'bg-green-500', isPositive: true },
    { name: 'Cancel Order', value: '338', change: '2%', changeText: '227 Design changing', icon: '❌', color: 'bg-purple-500', isPositive: true },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={stat.name} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-white text-lg`}>
                {stat.icon}
              </div>
              <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
            </div>
            <div className="mb-3">
              <p className="text-sm text-gray-500 mb-1">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-800">
                {stat.name === 'Total Sales' && 'AED '}{stat.value}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${
                stat.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.isPositive ? '+' : '-'}{stat.change}
              </span>
              <span className="text-xs text-gray-500">{stat.changeText}</span>
              {stat.name === 'Total Orders' && (
                <span className="text-xs text-blue-600 underline cursor-pointer">View orders</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Target Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">Target</h3>
            <button className="text-gray-400 hover:text-gray-600">⋯</button>
          </div>
          <p className="text-sm text-gray-500 mb-6">Revenue Target / Today</p>
          
          <div className="relative w-40 h-40 mx-auto mb-6">
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="60" fill="none" stroke="#f3f4f6" strokeWidth="12"/>
              <circle cx="80" cy="80" r="60" fill="none" stroke="#0ea5e9" strokeWidth="12" 
                strokeDasharray="235" strokeDashoffset="88" strokeLinecap="round"/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-800">62.28%</p>
                <p className="text-sm text-gray-500">-37.72%</p>
              </div>
            </div>
          </div>
          
          <p className="text-center text-sm text-gray-600 mb-4">
            You succeed earn <span className="font-semibold">~0.74M</span> today.<br/>
            Current Sells Revenue is <span className="text-sky-600 font-semibold">409%</span> !
          </p>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-500 mb-1">Target</p>
              <p className="font-semibold text-gray-800 flex items-center justify-center">
                <span className="text-red-500 mr-1">↓</span>AED 1.2M
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Revenue</p>
              <p className="font-semibold text-gray-800 flex items-center justify-center">
                <span className="text-green-500 mr-1">↑</span>AED 298k
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Sells</p>
              <p className="font-semibold text-gray-800 flex items-center justify-center">
                <span className="text-green-500 mr-1">↑</span>AED 747k
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">Statistic</h3>
            <button className="text-gray-400 hover:text-gray-600">⋯</button>
          </div>
          <p className="text-sm text-gray-500 mb-4">Revenue and Sales</p>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Cancel</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Revenue</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Sales</span>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between text-white text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Revenue</span>
                <span className="font-semibold">0.68 M</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-white text-xs mt-1">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Sales</span>
                <span className="font-semibold">92.6%</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-white text-xs mt-1">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span>Cancel</span>
                <span className="font-semibold">7.4%</span>
              </div>
            </div>
          </div>
          
          <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 relative overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 360 120">
              {/* Gradient Definitions */}
              <defs>
                <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05"/>
                </linearGradient>
                <linearGradient id="salesGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#eab308" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#eab308" stopOpacity="0.05"/>
                </linearGradient>
                <linearGradient id="cancelGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0.05"/>
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Grid */}
              <g opacity="0.1">
                {[...Array(12)].map((_, i) => (
                  <line key={i} x1={30 + i * 25} y1="10" x2={30 + i * 25} y2="90" stroke="#6b7280" strokeWidth="0.5"/>
                ))}
                {[...Array(5)].map((_, i) => (
                  <line key={i} x1="30" y1={20 + i * 15} x2="330" y2={20 + i * 15} stroke="#6b7280" strokeWidth="0.5"/>
                ))}
              </g>
              
              {/* Revenue Area */}
              <path
                d="M30,70 Q55,45 80,50 T130,35 Q155,25 180,30 T230,20 Q255,15 280,25 T330,35 L330,90 L30,90 Z"
                fill="url(#revenueGradient)"
              />
              
              {/* Sales Area */}
              <path
                d="M30,75 Q55,55 80,60 T130,45 Q155,35 180,40 T230,30 Q255,25 280,35 T330,45 L330,90 L30,90 Z"
                fill="url(#salesGradient)"
              />
              
              {/* Cancel Area */}
              <path
                d="M30,85 Q55,75 80,80 T130,70 Q155,65 180,70 T230,60 Q255,55 280,65 T330,70 L330,90 L30,90 Z"
                fill="url(#cancelGradient)"
              />
              
              {/* Revenue Line with Glow */}
              <path
                d="M30,70 Q55,45 80,50 T130,35 Q155,25 180,30 T230,20 Q255,15 280,25 T330,35"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                filter="url(#glow)"
                strokeLinecap="round"
              />
              
              {/* Sales Line with Glow */}
              <path
                d="M30,75 Q55,55 80,60 T130,45 Q155,35 180,40 T230,30 Q255,25 280,35 T330,45"
                fill="none"
                stroke="#eab308"
                strokeWidth="3"
                filter="url(#glow)"
                strokeLinecap="round"
              />
              
              {/* Cancel Line with Glow */}
              <path
                d="M30,85 Q55,75 80,80 T130,70 Q155,65 180,70 T230,60 Q255,55 280,65 T330,70"
                fill="none"
                stroke="#ec4899"
                strokeWidth="3"
                filter="url(#glow)"
                strokeLinecap="round"
              />
              
              {/* Interactive Data Points */}
              <g>
                <circle cx="180" cy="30" r="4" fill="#3b82f6" className="drop-shadow-lg">
                  <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle cx="180" cy="40" r="4" fill="#eab308" className="drop-shadow-lg">
                  <animate attributeName="r" values="4;6;4" dur="2s" begin="0.5s" repeatCount="indefinite"/>
                </circle>
                <circle cx="180" cy="70" r="4" fill="#ec4899" className="drop-shadow-lg">
                  <animate attributeName="r" values="4;6;4" dur="2s" begin="1s" repeatCount="indefinite"/>
                </circle>
              </g>
              
              {/* Hover Points */}
              <g opacity="0.7">
                {[80, 130, 180, 230, 280].map((x, i) => (
                  <g key={i}>
                    <circle cx={x} cy="30" r="2" fill="#3b82f6"/>
                    <circle cx={x} cy="40" r="2" fill="#eab308"/>
                    <circle cx={x} cy="70" r="2" fill="#ec4899"/>
                  </g>
                ))}
              </g>
            </svg>
            
            {/* Y-axis Labels */}
            <div className="absolute left-1 top-4 bottom-4 flex flex-col justify-between text-xs text-gray-400">
              <span>1.2M</span>
              <span>1M</span>
              <span>800K</span>
              <span>600K</span>
              <span>400K</span>
              <span>200K</span>
              <span>0</span>
            </div>
            
            {/* Month labels */}
            <div className="absolute bottom-1 left-8 right-4 flex justify-between text-xs text-gray-500">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>
        </div>

        {/* Business Growth */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">Business Growth</h3>
            <button className="text-gray-400 hover:text-gray-600">⋯</button>
          </div>
          <p className="text-sm text-gray-500 mb-6">Based on Country</p>
          
          <div className="bg-gray-900 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between text-white mb-2">
              <span className="text-sm">Revenue</span>
              <span className="font-semibold">6.12 M</span>
            </div>
            <div className="flex items-center justify-between text-white text-sm mb-1">
              <span>Income</span>
              <span className="text-green-400">58% ↗</span>
            </div>
            <div className="flex items-center justify-between text-white text-sm">
              <span>Growth</span>
              <span className="text-green-400">30% ↗</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xs">🇦🇪</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">UAE</p>
                  <p className="text-xs text-gray-500">1,98,249 Customers</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full">
                  <div className="w-3/4 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium">58%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-xs">🇮🇳</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">INDIA</p>
                  <p className="text-xs text-gray-500">1,21,249 Customers</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full">
                  <div className="w-1/4 h-2 bg-orange-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium">18%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Orders Table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-800">Latest Order</h3>
            <span className="bg-sky-100 text-sky-600 px-2 py-1 rounded-full text-xs font-medium">2 New</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <span>📅</span>
              <span>Select Date</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <span>🔽</span>
              <span>Filters</span>
            </button>
            <button className="px-4 py-2 bg-sky-100 text-sky-600 rounded-lg text-sm font-medium">
              See All
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-3 font-medium">Source</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-gray-100">
                <td className="py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 text-xs">🛍️</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">On Shop</span>
                      <span className="text-gray-400">📞</span>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <div>
                    <p className="font-medium text-gray-800">Ibnul Shams Al Asad</p>
                    <p className="text-gray-500 text-xs">shams@hotmail.com</p>
                  </div>
                </td>
                <td className="py-4 font-semibold text-gray-800">AED 8,12,100</td>
                <td className="py-4">
                  <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-xs font-medium">Processing</span>
                </td>
                <td className="py-4">
                  <div className="flex items-center space-x-2">
                    <button className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <span className="text-gray-600">👁️</span>
                    </button>
                    <button className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <span className="text-gray-600">✏️</span>
                    </button>
                  </div>
                </td>
              </tr>
              
              <tr className="border-b border-gray-100">
                <td className="py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">a</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Amazon</span>
                      <span className="text-gray-400">✉️</span>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <div>
                    <p className="font-medium text-gray-800">Ilham Budi Agung</p>
                    <p className="text-gray-500 text-xs">ilhambudi@google.com</p>
                  </div>
                </td>
                <td className="py-4 font-semibold text-gray-800">AED 13,49,000</td>
                <td className="py-4">
                  <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-xs font-medium">Processing</span>
                </td>
                <td className="py-4">
                  <div className="flex items-center space-x-2">
                    <button className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <span className="text-gray-600">👁️</span>
                    </button>
                    <button className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <span className="text-gray-600">✏️</span>
                    </button>
                  </div>
                </td>
              </tr>
              
              <tr className="border-b border-gray-100">
                <td className="py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 text-xs">🛍️</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">On Shop</span>
                      <span className="text-gray-400">📞</span>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <div>
                    <p className="font-medium text-gray-800">Mohammad Karim</p>
                    <p className="text-gray-500 text-xs">m_karim@yahoo.com</p>
                  </div>
                </td>
                <td className="py-4 font-semibold text-gray-800">AED 27,250</td>
                <td className="py-4">
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">Cancel</span>
                </td>
                <td className="py-4">
                  <div className="flex items-center space-x-2">
                    <button className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <span className="text-gray-600">👁️</span>
                    </button>
                    <button className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <span className="text-gray-600">✏️</span>
                    </button>
                  </div>
                </td>
              </tr>
              
              <tr>
                <td className="py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 text-xs">🛍️</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">On Shop</span>
                      <span className="text-gray-400">📞</span>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <div>
                    <p className="font-medium text-gray-800">Layla Al-Mansoori</p>
                    <p className="text-gray-500 text-xs">layla.mansoori@email.com</p>
                  </div>
                </td>
                <td className="py-4 font-semibold text-gray-800">AED 45,890</td>
                <td className="py-4">
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">Complete</span>
                </td>
                <td className="py-4">
                  <div className="flex items-center space-x-2">
                    <button className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <span className="text-gray-600">👁️</span>
                    </button>
                    <button className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <span className="text-gray-600">✏️</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}