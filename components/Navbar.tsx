'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'
import Logo from './Logo'

export default function Navbar() {
  const { signOut, user } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    toast.success('Logged out successfully')
    router.push('/')
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <Logo size="medium" />
          </Link>
          
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm text-gray-600">
                  Welcome, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}