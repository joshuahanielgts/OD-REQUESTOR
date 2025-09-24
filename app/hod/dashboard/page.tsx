'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, Check, X, Eye, Download } from 'lucide-react'
import Navbar from '@/components/Navbar'
import AuthGuard from '@/components/AuthGuard'
import RequestTable from '@/components/RequestTable'
import ProofViewer from '@/components/ProofViewer'
import { useAuth } from '@/hooks/useAuth'
import { supabase, ODRequest } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'

export default function HODDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('pending')
  const [requests, setRequests] = useState<ODRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProof, setSelectedProof] = useState<string | null>(null)

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('od_requests')
        .select(`
          *,
          users (
            name,
            roll_no,
            class,
            year,
            section
          )
        `)
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

    // Set up real-time subscription
    const subscription = supabase
      .channel('od_requests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'od_requests' }, () => {
        fetchRequests()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const filterRequests = (status: string) => {
    return requests.filter(req => req.status === status)
  }

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('od_requests')
        .update({ status: 'approved' })
        .eq('id', id)

      if (error) throw error

      toast.success('Request approved successfully')
      fetchRequests()
    } catch (error: any) {
      toast.error('Failed to approve request')
    }
  }

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('od_requests')
        .update({ status: 'rejected' })
        .eq('id', id)

      if (error) throw error

      toast.success('Request rejected')
      fetchRequests()
    } catch (error: any) {
      toast.error('Failed to reject request')
    }
  }

  const handleRefresh = () => {
    fetchRequests()
    toast.success('Data refreshed')
  }

  const tabs = [
    { id: 'pending', label: 'Pending', count: filterRequests('pending').length },
    { id: 'approved', label: 'Approved', count: filterRequests('approved').length },
    { id: 'rejected', label: 'Rejected', count: filterRequests('rejected').length },
  ]

  const renderPendingRequestCards = () => {
    const pendingRequests = filterRequests('pending')

    if (pendingRequests.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Check className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
          <p className="text-gray-500">No pending requests at the moment.</p>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {pendingRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {request.reason}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>📅 {new Date(request.from_date).toLocaleDateString('en-IN')} - {new Date(request.to_date).toLocaleDateString('en-IN')}</span>
                      <span>👤 {request.name} ({request.roll_no})</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Students:</h4>
                  <div className="flex items-center space-x-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {request.users?.roll_no}
                    </span>
                    <span className="text-sm text-gray-600">
                      {request.users?.name} • {request.users?.class} {request.users?.year}-{request.users?.section}
                    </span>
                  </div>
                </div>

                {request.reason && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Description:</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {request.reason}
                    </p>
                  </div>
                )}

                {request.proof_url && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Attached Proof:</h4>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            📄
                          </div>
                          <span className="text-sm font-medium text-green-800">
                            Proof Document
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedProof(request.proof_url!)}
                            className="flex items-center space-x-1 text-green-700 hover:text-green-800 text-sm"
                          >
                            <Eye className="h-4 w-4" />
                            <span>Preview</span>
                          </button>
                          <button
                            onClick={() => {
                              const link = document.createElement('a')
                              link.href = request.proof_url!
                              link.download = `proof-${request.roll_no}-${request.reason.replace(/[^a-zA-Z0-9]/g, '-')}`
                              document.body.appendChild(link)
                              link.click()
                              document.body.removeChild(link)
                            }}
                            className="flex items-center space-x-1 text-green-700 hover:text-green-800 text-sm"
                          >
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex lg:flex-col space-x-3 lg:space-x-0 lg:space-y-3 lg:ml-6 mt-4 lg:mt-0">
                <button
                  onClick={() => handleApprove(request.id)}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-srm-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Check className="h-4 w-4" />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => handleReject(request.id)}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <X className="h-4 w-4" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <AuthGuard requiredRole="hod">
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">HOD Dashboard</h1>
                <p className="mt-2 text-gray-600">
                  Review and manage on-duty requests
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={handleRefresh}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
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
                        ? 'border-srm-purple text-srm-purple'
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

          {/* Content */}
          <div className="bg-white shadow rounded-lg">
            {activeTab === 'pending' ? (
              <div className="p-6">
                {renderPendingRequestCards()}
              </div>
            ) : (
              <RequestTable
                requests={filterRequests(activeTab)}
                loading={loading}
                showActions={false}
                role="hod"
              />
            )}
          </div>
        </div>

        {selectedProof && (
          <ProofViewer
            url={selectedProof}
            onClose={() => setSelectedProof(null)}
          />
        )}
      </div>
    </AuthGuard>
  )
}