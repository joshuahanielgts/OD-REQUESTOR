'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, Download, Calendar } from 'lucide-react'
import Navbar from '@/components/Navbar'
import AuthGuard from '@/components/AuthGuard'
import RequestTable from '@/components/RequestTable'
import { useAuth } from '@/hooks/useAuth'
import { supabase, ODRequest } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'
import { exportToPDF, exportToCSV } from '@/utils/exportUtils'

export default function TodayODActivitiesPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<ODRequest[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTodayRequests = async () => {
    setLoading(true)
    try {
      const today = new Date().toISOString().split('T')[0]
      
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
        .eq('status', 'approved_by_hod')
        .eq('date', today)
        .order('from_date', { ascending: true })

      if (error) throw error
      setRequests(data || [])
    } catch (error: any) {
      toast.error('Failed to fetch today\'s activities')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodayRequests()

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchTodayRequests, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    fetchTodayRequests()
    toast.success('Data refreshed')
  }

  const handleExportPDF = () => {
    exportToPDF(requests, `Today_OD_Activities_${new Date().toISOString().split('T')[0]}`)
    toast.success('PDF exported successfully')
  }

  const handleExportCSV = () => {
    exportToCSV(requests, `Today_OD_Activities_${new Date().toISOString().split('T')[0]}`)
    toast.success('CSV exported successfully')
  }

  const getTodayStats = () => {
    const uniqueStudents = new Set(requests.map(req => req.student_id)).size
    const uniqueEvents = new Set(requests.map(req => req.reason)).size
    
    // Group by periods
    const periodGroups: { [key: string]: number } = {}
    requests.forEach(req => {
      const period = `${new Date(req.from_date).toLocaleDateString()} - ${new Date(req.to_date).toLocaleDateString()}`
      periodGroups[period] = (periodGroups[period] || 0) + 1
    })

    const mostBusyPeriod = Object.entries(periodGroups).reduce(
      (max, [period, count]) => count > max.count ? { period, count } : max,
      { period: 'None', count: 0 }
    )

    return { uniqueStudents, uniqueEvents, mostBusyPeriod }
  }

  const { uniqueStudents, uniqueEvents, mostBusyPeriod } = getTodayStats()

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Today's OD Activities</h1>
                <p className="mt-2 text-gray-600 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  {new Date().toLocaleDateString('en-IN', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
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
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleExportCSV}
                    className="btn-success flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="btn-success flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Statistics */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">📊</span>
                    </div>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Total Activities</p>
                    <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold">👥</span>
                    </div>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Students on OD</p>
                    <p className="text-2xl font-bold text-gray-900">{uniqueStudents}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-bold">🎯</span>
                    </div>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Unique Events</p>
                    <p className="text-2xl font-bold text-gray-900">{uniqueEvents}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-bold">⏰</span>
                    </div>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Busy Period</p>
                    <p className="text-xs font-bold text-gray-900">
                      {mostBusyPeriod.period !== 'None' ? mostBusyPeriod.period : 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {mostBusyPeriod.count > 0 ? `${mostBusyPeriod.count} activities` : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Update Notice */}
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Live Updates:</span> This page automatically refreshes every 5 minutes to show the latest activities.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Activities Table */}
          <div className="bg-white shadow rounded-lg">
            {requests.length === 0 && !loading ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Calendar className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No activities today</h3>
                <p className="text-gray-500">
                  There are no approved OD activities scheduled for today.
                </p>
              </div>
            ) : (
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Today's Schedule
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    All approved on-duty activities for today, organized by time periods
                  </p>
                </div>
                
                <RequestTable
                  requests={requests}
                  loading={loading}
                  showActions={false}
                  role={(user?.role === 'faculty' ? 'class_incharge' : user?.role) || 'student'}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}