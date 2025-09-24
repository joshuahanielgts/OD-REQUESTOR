'use client'

import { useState, useEffect } from 'react'
import { Plus, RefreshCw, Filter } from 'lucide-react'
import Navbar from '@/components/Navbar'
import AuthGuard from '@/components/AuthGuard'
import RequestForm from '@/components/RequestForm'
import RequestTable from '@/components/RequestTable'
import { useAuth } from '@/hooks/useAuth'
import { supabase, ODRequest } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('ongoing')
  const [requests, setRequests] = useState<ODRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [showRequestForm, setShowRequestForm] = useState(false)

  const fetchRequests = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('od_requests')
        .select('*')
        .eq('student_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRequests(data || [])
    } catch (error: any) {
      toast.error('Failed to fetch requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [user])

  const filterRequests = (status: string) => {
    switch (status) {
      case 'ongoing':
        return requests.filter(req => 
          req.status === 'pending' || 
          req.status === 'approved_by_class_incharge'
        )
      case 'approved':
        return requests.filter(req => req.status === 'approved_by_hod')
      case 'rejected':
        return requests.filter(req => 
          req.status === 'rejected_by_class_incharge' || 
          req.status === 'rejected_by_hod'
        )
      default:
        return requests
    }
  }

  const handleRefresh = () => {
    fetchRequests()
    toast.success('Data refreshed')
  }

  const handleRequestSuccess = () => {
    setActiveTab('ongoing')
    fetchRequests()
  }

  const tabs = [
    { id: 'ongoing', label: 'Ongoing', count: filterRequests('ongoing').length },
    { id: 'approved', label: 'Approved', count: filterRequests('approved').length },
    { id: 'rejected', label: 'Rejected', count: filterRequests('rejected').length },
  ]

  return (
    <AuthGuard requiredRole="student">
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
                <p className="mt-2 text-gray-600">
                  Manage your on-duty requests and track their status
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <button
                  onClick={handleRefresh}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={() => setShowRequestForm(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Request OD</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-srm-blue text-srm-blue'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Requests Table */}
          <div className="bg-white shadow rounded-lg">
            <RequestTable
              requests={filterRequests(activeTab)}
              loading={loading}
              showActions={false}
              role="student"
            />
          </div>
        </div>

        <RequestForm
          isOpen={showRequestForm}
          onClose={() => setShowRequestForm(false)}
          onSuccess={handleRequestSuccess}
        />
      </div>
    </AuthGuard>
  )
}