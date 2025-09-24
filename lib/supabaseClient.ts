import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types matching the enhanced workflow
export interface User {
  id: string
  name: string
  email: string
  roll_no?: string
  class?: string
  year?: string
  section?: string
  role: 'student' | 'class_incharge' | 'hod' | 'faculty'
  department?: string
  is_class_incharge_for?: string // Format: 'CSE-II-A'
  created_at: string
  updated_at: string
}

export interface ODRequest {
  id: string
  student_id: string
  
  // Request Details
  from_date: string
  to_date: string
  name: string
  class: string
  year: string
  section: string
  roll_no: string
  reason: string
  description?: string
  
  // File Storage
  proof_url?: string
  proof_filename?: string
  
  // Multi-level Approval Status
  status: 'pending' | 'approved_by_class_incharge' | 'approved_by_hod' | 'rejected_by_class_incharge' | 'rejected_by_hod'
  
  // Approval Details
  class_incharge_id?: string
  class_incharge_approved_at?: string
  class_incharge_comments?: string
  
  hod_id?: string
  hod_approved_at?: string
  hod_comments?: string
  
  // Timestamps
  created_at: string
  updated_at: string
  
  // Joined data
  users?: User
  class_incharge?: User
  hod?: User
}

export interface Notification {
  id: string
  user_id: string
  od_request_id: string
  type: 'class_incharge_approved' | 'class_incharge_rejected' | 'hod_approved' | 'hod_rejected' | 'new_request'
  title: string
  message: string
  is_read: boolean
  created_at: string
  od_requests?: ODRequest
}

// Helper functions for status management
export const getStatusDisplayText = (status: ODRequest['status']) => {
  switch (status) {
    case 'pending':
      return 'Pending Class In-Charge Approval'
    case 'approved_by_class_incharge':
      return 'Approved by Class In-Charge, Pending HOD Approval'
    case 'approved_by_hod':
      return 'Finally Approved'
    case 'rejected_by_class_incharge':
      return 'Rejected by Class In-Charge'
    case 'rejected_by_hod':
      return 'Rejected by HOD'
    default:
      return status
  }
}

export const getStatusColor = (status: ODRequest['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'approved_by_class_incharge':
      return 'bg-blue-100 text-blue-800'
    case 'approved_by_hod':
      return 'bg-green-100 text-green-800'
    case 'rejected_by_class_incharge':
    case 'rejected_by_hod':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export const canStudentEdit = (status: ODRequest['status']) => {
  return status === 'pending'
}

export const isRequestActive = (request: ODRequest) => {
  const today = new Date()
  const fromDate = new Date(request.from_date)
  const toDate = new Date(request.to_date)
  
  return request.status === 'approved_by_hod' && 
         today >= fromDate && 
         today <= toDate
}