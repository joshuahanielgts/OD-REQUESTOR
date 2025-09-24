'use client'

import Link from 'next/link'
import { Users, GraduationCap, Shield } from 'lucide-react'
import Logo from '@/components/Logo'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <Logo size="large" />
          </div>
          <h2 className="text-2xl font-semibold text-srm-blue mb-2">
            On-Duty Management System
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Manage your on-duty requests efficiently. Select your role to continue.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Link
            href="/login/student"
            className="group card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
                <GraduationCap className="h-8 w-8 text-srm-blue" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Student</h3>
              <p className="text-gray-600">
                Submit and track your on-duty requests
              </p>
            </div>
          </Link>

          <Link
            href="/login/faculty"
            className="group card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
                <Users className="h-8 w-8 text-srm-green" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Class In-charge</h3>
              <p className="text-gray-600">
                Review and approve student OD requests
              </p>
            </div>
          </Link>

          <Link
            href="/login/hod"
            className="group card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4 group-hover:bg-purple-200 transition-colors">
                <Shield className="h-8 w-8 text-srm-purple" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">HOD</h3>
              <p className="text-gray-600">
                Final approval for OD requests
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            © 2024 SRM Institute of Science and Technology. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}