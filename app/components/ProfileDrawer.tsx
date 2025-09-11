'use client'

import { AnimatePresence } from 'framer-motion'
import { User, Package, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'

interface ProfileDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProfileDrawer({ isOpen, onClose }: ProfileDrawerProps) {
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div onClick={onClose} className="fixed inset-0 z-40" />
          <div className="absolute top-16 right-4 w-48 bg-white rounded-lg shadow-lg border z-50">
            <div className="py-2">
              <Link href="/profile" onClick={onClose}>
                <div className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer">
                  <User size={16} className="mr-3 text-gray-600" />
                  <span className="text-gray-800">My Profile</span>
                </div>
              </Link>
              
              <Link href="/orders" onClick={onClose}>
                <div className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer">
                  <Package size={16} className="mr-3 text-gray-600" />
                  <span className="text-gray-800">My Orders</span>
                </div>
              </Link>
              
              <div onClick={handleLogout} className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer">
                <LogOut size={16} className="mr-3 text-red-600" />
                <span className="text-red-600">Logout</span>
              </div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}