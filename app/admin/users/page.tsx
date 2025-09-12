'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, MoreVertical, Edit, Trash2, Eye } from 'lucide-react'

interface User {
  _id: string
  username: string
  email: string
  mobile?: string
  createdAt: string
  isBlocked?: boolean
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showActions, setShowActions] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 10

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('API response data:', data)
        setUsers(data.users || [])
      } else {
        const errorData = await response.json()
        console.error('API error:', errorData)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          setUsers(users.filter(user => user._id !== userId))
          setShowActions(null)
        }
      } catch (error) {
        console.error('Failed to delete user:', error)
      }
    }
  }

  const viewUser = (user: User) => {
    setSelectedUser(user)
    setShowViewModal(true)
    setShowActions(null)
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map(user => user._id))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  const deleteSelectedUsers = async () => {
    if (selectedUsers.length === 0) return
    
    if (confirm(`Are you sure you want to delete ${selectedUsers.length} selected users?`)) {
      try {
        const deletePromises = selectedUsers.map(userId => 
          fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
        )
        await Promise.all(deletePromises)
        setUsers(users.filter(user => !selectedUsers.includes(user._id)))
        setSelectedUsers([])
        setSelectAll(false)
      } catch (error) {
        console.error('Failed to delete users:', error)
      }
    }
  }

  const toggleUserBlock = async (userId: string, isBlocked: boolean) => {
    try {
      const response = await fetch('/api/admin/users/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId,
          isBlocked: !isBlocked 
        })
      })
      if (response.ok) {
        setUsers(users.map(user => 
          user._id === userId ? { ...user, isBlocked: !isBlocked } : user
        ))
      }
    } catch (error) {
      console.error('Failed to toggle user block:', error)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.mobile && user.mobile.includes(searchTerm))
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && !user.isBlocked) ||
      (statusFilter === 'blocked' && user.isBlocked)
    
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
        <div className="ml-3 text-gray-600">Loading users...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by username, email, or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">All Users</option>
            <option value="active">Active Users</option>
            <option value="blocked">Blocked Users</option>
          </select>
          {selectedUsers.length > 0 && (
            <button 
              onClick={deleteSelectedUsers}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              <Trash2 size={16} />
              <span>Delete Selected ({selectedUsers.length})</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-sky-600 bg-white border-gray-300 rounded focus:ring-sky-500"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Mobile</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Joined</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleSelectUser(user._id)}
                      className="w-4 h-4 text-sky-600 bg-white border-gray-300 rounded focus:ring-sky-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-gray-600">{user.mobile || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleUserBlock(user._id, user.isBlocked || false)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        user.isBlocked ? 'bg-red-500' : 'bg-green-500'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          user.isBlocked ? 'translate-x-1' : 'translate-x-6'
                        }`}
                      />
                    </button>
                    <span className={`ml-2 text-sm font-medium ${
                      user.isBlocked ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button
                        onClick={() => setShowActions(showActions === user._id ? null : user._id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical size={16} className="text-gray-600" />
                      </button>
                      
                      {showActions === user._id && (
                        <div className="absolute right-0 top-10 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <button 
                            onClick={() => viewUser(user)}
                            className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-50 text-gray-700"
                          >
                            <Eye size={16} />
                            <span>View Details</span>
                          </button>
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-red-50 text-red-600"
                          >
                            <Trash2 size={16} />
                            <span>Delete User</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {paginatedUsers.length === 0 && filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-2">No users found</div>
            <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Showing {startIndex + 1}-{Math.min(startIndex + usersPerPage, filteredUsers.length)} of {filteredUsers.length} users</span>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-3 py-1">{currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">User Details</h2>
              <button 
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {selectedUser.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{selectedUser.username}</h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Mobile</label>
                  <p className="font-medium">{selectedUser.mobile || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Joined</label>
                  <p className="font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}