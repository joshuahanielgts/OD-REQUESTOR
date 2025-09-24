'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, Plus, Clock, CheckCircle, XCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import AuthGuard from '@/components/AuthGuard'
import RequestTable from '@/components/RequestTable'
import RequestForm from '@/components/RequestForm'
import { useAuth } from '@/hooks/useAuth'
import { supabase, ODRequest } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'

export default function MyRequestsPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<ODRequest[]>([])
  const [activeTab, setActiveTab] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showRequestForm, setShowRequestForm] = useState(false)

  const fetchMyRequests = async () => {
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
      toast.error('Failed to fetch your requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyRequests()

    // Set up real-time subscription for user's requests
    if (user) {
      const subscription = supabase
        .channel('my_od_requests')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'od_requests',
            filter: `student_id=eq.${user.id}`
          }, 
          () => {
            fetchMyRequests()
          }
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [user])

  const filterRequests = (status: string) => {
    switch (status) {
      case 'pending':
        return requests.filter(req => req.status === 'pending')
      case 'approved':
        return requests.filter(req => req.status === 'approved_by_hod')
      case 'rejected':
        return requests.filter(req => req.status.startsWith('rejected'))
      default:
        return requests
    }
  }

  const handleRefresh = () => {
    fetchMyRequests()
    toast.success('Requests refreshed')
  }

  const handleRequestSuccess = () => {
    fetchMyRequests()
    setActiveTab('pending')
  }

  const getStatusStats = () => {
    const pending = requests.filter(req => req.status === 'pending').length
    const approved = requests.filter(req => req.status === 'approved_by_hod').length
    const rejected = requests.filter(req => req.status.startsWith('rejected')).length

    return { pending, approved, rejected, total: requests.length }
  }
  
  const { pending, approved, rejected, total } = getStatusStats()

  const tabs = [
    { id: 'all', label: 'All Requests', count: total },
    { id: 'pending', label: 'Pending', count: pending, icon: Clock },
    { id: 'approved', label: 'Approved', count: approved, icon: CheckCircle },
    { id: 'rejected', label: 'Rejected', count: rejected, icon: XCircle },
  ]

  return (
    <AuthGuard requiredRole="student">
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My OD Requests</h1>
                <p className="mt-2 text-gray-600">
                  Track and manage all your on-duty requests
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
                  <span>New Request</span>
                </button>
              </div>
            </div>
          </div>

          {/* Status Overview Cards */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-bold">📊</span>
                    </div>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Total Requests</p>
                    <p className="text-2xl font-bold text-gray-900">{total}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Pending Review</p>
                    <p className="text-2xl font-bold text-yellow-600">{pending}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Approved</p>
                    <p className="text-2xl font-bold text-green-600">{approved}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <XCircle className="h-5 w-5 text-red-600" />
                    </div>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Rejected</p>
                    <p className="text-2xl font-bold text-red-600">{rejected}</p>
                  </div>
                </div>
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
                    className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-srm-blue text-srm-blue'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.icon && <tab.icon className="h-4 w-4" />}
                    <span>{tab.label}</span>
                    {tab.count > 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Quick Actions for Pending Requests */}
          {activeTab === 'pending' && pending > 0 && (
            <div className="mb-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-yellow-800">
                      {pending} request{pending > 1 ? 's' : ''} awaiting review
                    </h4>
                    <p className="text-sm text-yellow-600 mt-1">
                      Your requests are currently being reviewed by the HOD. You'll be notified once a decision is made.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Message for Approved Requests */}
          {activeTab === 'approved' && approved > 0 && (
            <div className="mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-green-800">
                      {approved} approved request{approved > 1 ? 's' : ''}
                    </h4>
                    <p className="text-sm text-green-600 mt-1">
                      Congratulations! Your requests have been approved. Make sure to attend the events as scheduled.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

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