'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, Users, CheckCircle, XCircle, Clock } from 'lucide-react'
import Navbar from '@/components/Navbar'
import AuthGuard from '@/components/AuthGuard'
import RequestTable from '@/components/RequestTable'
import { useAuth } from '@/hooks/useAuth'
import { supabase, ODRequest } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'

export default function ClassInchargeDashboard() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<ODRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')

  const fetchRequests = async () => {
    if (!user) return

    setLoading(true)
    try {
      // Get requests for students in the same class as the class in-charge
      const { data, error } = await supabase
        .from('od_requests')
        .select('*')
        .eq('class', user.class)
        .eq('year', user.year)
        .eq('section', user.section)
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

  const handleApprove = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('od_requests')
        .update({ status: 'approved_by_class_incharge' })
        .eq('id', requestId)

      if (error) throw error

      toast.success('Request approved successfully')
      fetchRequests()
    } catch (error: any) {
      toast.error('Failed to approve request')
    }
  }

  const handleReject = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('od_requests')
        .update({ status: 'rejected_by_class_incharge' })
        .eq('id', requestId)

      if (error) throw error

      toast.success('Request rejected')
      fetchRequests()
    } catch (error: any) {
      toast.error('Failed to reject request')
    }
  }

  const filterRequests = (status: string) => {
    switch (status) {
      case 'pending':
        return requests.filter(req => req.status === 'pending')
      case 'approved':
        return requests.filter(req => req.status === 'approved_by_class_incharge')
      case 'rejected':
        return requests.filter(req => req.status === 'rejected_by_class_incharge')
      default:
        return requests
    }
  }

  const getStats = () => {
    return {
      pending: requests.filter(req => req.status === 'pending').length,
      approved: requests.filter(req => req.status === 'approved_by_class_incharge').length,
      rejected: requests.filter(req => req.status === 'rejected_by_class_incharge').length,
      total: requests.length
    }
  }

  const stats = getStats()

  const tabs = [
    { id: 'pending', label: 'Pending Review', count: stats.pending, icon: Clock },
    { id: 'approved', label: 'Approved', count: stats.approved, icon: CheckCircle },
    { id: 'rejected', label: 'Rejected', count: stats.rejected, icon: XCircle },
  ]

  return (
    <AuthGuard requiredRole="class_incharge">
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Class In-charge Dashboard</h1>
                <p className="mt-2 text-gray-600">
                  Review and approve OD requests for {user?.class} {user?.year}-{user?.section}
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={fetchRequests}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-gray-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                        activeTab === tab.id
                          ? 'border-srm-blue text-srm-blue'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span>{tab.label}</span>
                      {tab.count > 0 && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Requests Table */}
          <div className="bg-white shadow rounded-lg">
            <RequestTable
              requests={filterRequests(activeTab)}
              loading={loading}
              showActions={activeTab === 'pending'}
              role="class_incharge"
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}