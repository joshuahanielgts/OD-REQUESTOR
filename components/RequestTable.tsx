'use client'

import { useState } from 'react'
import { Eye, Download, FileText, Check, X, Clock, User, Calendar } from 'lucide-react'
import { ODRequest } from '@/lib/supabaseClient'
import ProofViewer from './ProofViewer'

interface RequestTableProps {
  requests: ODRequest[]
  loading: boolean
  showActions?: boolean
  role: 'student' | 'class_incharge' | 'hod'
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

export default function RequestTable({ 
  requests, 
  loading, 
  showActions = false, 
  role,
  onApprove,
  onReject 
}: RequestTableProps) {
  const [selectedProof, setSelectedProof] = useState<string | null>(null)

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case 'approved_by_class_incharge':
        return `${baseClasses} bg-blue-100 text-blue-800`
      case 'approved_by_hod':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 mr-1" />
      case 'approved_by_class_incharge':
        return <Check className="h-4 w-4 mr-1" />
      case 'approved_by_hod':
        return <Check className="h-4 w-4 mr-1" />
      case 'rejected':
        return <X className="h-4 w-4 mr-1" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending Review'
      case 'approved_by_class_incharge':
        return 'Approved by Class In-charge'
      case 'approved_by_hod':
        return 'Final Approval'
      case 'rejected':
        return 'Rejected'
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getDuration = (fromDate: string, toDate: string) => {
    const from = new Date(fromDate)
    const to = new Date(toDate)
    const diffTime = Math.abs(to.getTime() - from.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays === 1 ? '1 day' : `${diffDays} days`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-srm-blue"></div>
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <FileText className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
        <p className="text-gray-500">
          {role === 'student' 
            ? "You haven't submitted any OD requests yet."
            : role === 'class_incharge'
              ? "No requests pending your review at the moment."
              : "No requests available for final approval."
          }
        </p>
      </div>
    )
  }

  const canApprove = (request: ODRequest) => {
    if (role === 'class_incharge') {
      return request.status === 'pending'
    } else if (role === 'hod') {
      return request.status === 'approved_by_class_incharge'
    }
    return false
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Event Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duration
            </th>
            {role !== 'student' && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Proof
            </th>
            {showActions && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {requests.map((request) => (
            <tr key={request.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {request.reason}
                  </div>
                  {request.description && (
                    <div className="text-sm text-gray-500 truncate max-w-xs mt-1">
                      {request.description}
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mt-1">
                    Submitted on {formatDate(request.created_at)}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    {formatDate(request.from_date)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    to {formatDate(request.to_date)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1 font-medium">
                    {getDuration(request.from_date, request.to_date)}
                  </div>
                </div>
              </td>
              {role !== 'student' && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 flex items-center">
                      <User className="h-4 w-4 mr-1 text-gray-400" />
                      {request.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {request.roll_no}
                    </div>
                    <div className="text-xs text-gray-500">
                      {request.class} {request.year}-{request.section}
                    </div>
                  </div>
                </td>
              )}
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={getStatusBadge(request.status)}>
                  {getStatusIcon(request.status)}
                  {getStatusLabel(request.status)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {request.proof_url ? (
                  <button
                    onClick={() => setSelectedProof(request.proof_url!)}
                    className="flex items-center space-x-1 text-srm-blue hover:text-blue-700"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Proof</span>
                  </button>
                ) : (
                  <span className="text-gray-400">No proof</span>
                )}
              </td>
              {showActions && canApprove(request) && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onApprove?.(request.id)}
                      className="btn-success px-3 py-1 text-xs"
                    >
                      {role === 'class_incharge' ? 'Approve' : 'Final Approval'}
                    </button>
                    <button
                      onClick={() => onReject?.(request.id)}
                      className="btn-danger px-3 py-1 text-xs"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              )}
              {showActions && !canApprove(request) && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  {request.status === 'approved_by_hod' ? 'Approved' : 
                   request.status.startsWith('rejected') ? 'Rejected' : 
                   role === 'hod' && request.status === 'pending' ? 'Awaiting Class In-charge' :
                   'No action needed'}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {selectedProof && (
        <ProofViewer
          url={selectedProof}
          onClose={() => setSelectedProof(null)}
        />
      )}
    </div>
  )
}