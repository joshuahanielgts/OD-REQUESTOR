'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, Download, Filter } from 'lucide-react'
import Navbar from '@/components/Navbar'
import AuthGuard from '@/components/AuthGuard'
import RequestTable from '@/components/RequestTable'
import FilterBar from '@/components/FilterBar'
import { useAuth } from '@/hooks/useAuth'
import { supabase, ODRequest } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'
import { exportToPDF, exportToCSV } from '@/utils/exportUtils'

export default function FacultyDashboard() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<ODRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<ODRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    year: '',
    class: '',
    section: ''
  })

  const fetchApprovedRequests = async () => {
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
        .eq('status', 'approved_by_hod')
        .order('created_at', { ascending: false })

      if (error) throw error
      setRequests(data || [])
      setFilteredRequests(data || [])
    } catch (error: any) {
      toast.error('Failed to fetch requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApprovedRequests()
  }, [])

  useEffect(() => {
    let filtered = requests

    if (filters.year) {
      filtered = filtered.filter(req => req.users?.year === filters.year)
    }
    if (filters.class) {
      filtered = filtered.filter(req => req.users?.class === filters.class)
    }
    if (filters.section) {
      filtered = filtered.filter(req => req.users?.section === filters.section)
    }

    setFilteredRequests(filtered)
  }, [requests, filters])

  const handleRefresh = () => {
    fetchApprovedRequests()
    toast.success('Data refreshed')
  }

  const handleExportPDF = () => {
    exportToPDF(filteredRequests, 'Faculty_OD_Report')
    toast.success('PDF exported successfully')
  }

  const handleExportCSV = () => {
    exportToCSV(filteredRequests, 'Faculty_OD_Report')
    toast.success('CSV exported successfully')
  }

  const getFilteredCounts = () => {
    const years = Array.from(new Set(requests.map(req => req.users?.year).filter(Boolean))) as string[]
    const classes = Array.from(new Set(requests.map(req => req.users?.class).filter(Boolean))) as string[]
    const sections = Array.from(new Set(requests.map(req => req.users?.section).filter(Boolean))) as string[]

    return { years, classes, sections }
  }

  const { years, classes, sections } = getFilteredCounts()

  return (
    <AuthGuard requiredRole="class_incharge">
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Faculty Dashboard</h1>
                <p className="mt-2 text-gray-600">
                  View and manage approved on-duty activities
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <button
                  onClick={handleRefresh}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh Data</span>
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

          {/* Filter Bar */}
          <FilterBar
            filters={filters}
            onFiltersChange={setFilters}
            years={years}
            classes={classes}
            sections={sections}
            label="Filter students on OD"
          />

          {/* Results Summary */}
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Total Approved Requests
                    </p>
                    <p className="text-2xl font-bold text-srm-green">
                      {filteredRequests.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Students on OD
                    </p>
                    <p className="text-2xl font-bold text-srm-blue">
                      {new Set(filteredRequests.map(req => req.student_id)).size}
                    </p>
                  </div>
                </div>
                {(filters.year || filters.class || filters.section) && (
                  <button
                    onClick={() => setFilters({ year: '', class: '', section: '' })}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Requests Table */}
          <div className="bg-white shadow rounded-lg">
            <RequestTable
              requests={filteredRequests}
              loading={loading}
              showActions={false}
              role="class_incharge"
            />
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}