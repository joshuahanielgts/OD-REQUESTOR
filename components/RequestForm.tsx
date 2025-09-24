'use client'

import { useState } from 'react'
import { X, Upload, FileText, Calendar, Clock } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'

interface RequestFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function RequestForm({ isOpen, onClose, onSuccess }: RequestFormProps) {
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fromDate: '',
    toDate: '',
    name: user?.name || '',
    class: user?.class || '',
    year: user?.year || '',
    section: user?.section || '',
    rollNo: user?.roll_no || '',
    reason: '',
    description: '',
    proofDoc: null as File | null,
  })
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      setFormData(prev => ({ ...prev, proofDoc: file }))
    }
  }

  const uploadFile = async (file: File, fileName: string) => {
    const fileExt = file.name.split('.').pop()
    const filePath = `${Date.now()}-${fileName}.${fileExt}`
    
    const { error } = await supabase.storage
      .from('od-proofs')
      .upload(filePath, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('od-proofs')
      .getPublicUrl(filePath)

    return { url: publicUrl, filename: file.name }
  }

  const validateDates = () => {
    const fromDate = new Date(formData.fromDate)
    const toDate = new Date(formData.toDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (fromDate < today) {
      toast.error('From date cannot be in the past')
      return false
    }

    if (toDate < fromDate) {
      toast.error('To date cannot be before from date')
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!user) return

    if (!validateDates()) return

    setLoading(true)
    try {
      let proofUrl = ''
      let proofFilename = ''
      
      if (formData.proofDoc) {
        const uploadResult = await uploadFile(formData.proofDoc, `proof-${formData.rollNo}-${formData.reason.replace(/[^a-zA-Z0-9]/g, '-')}`)
        proofUrl = uploadResult.url
        proofFilename = uploadResult.filename
      }

      const { error } = await supabase
        .from('od_requests')
        .insert({
          student_id: user.id,
          from_date: formData.fromDate,
          to_date: formData.toDate,
          name: formData.name,
          class: formData.class,
          year: formData.year,
          section: formData.section,
          roll_no: formData.rollNo,
          reason: formData.reason,
          description: formData.description,
          proof_url: proofUrl,
          proof_filename: proofFilename,
        })

      if (error) throw error

      toast.success('OD Request submitted successfully! It will be reviewed by your class in-charge.')
      onSuccess()
      onClose()
      resetForm()
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit request')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setFormData({
      fromDate: '',
      toDate: '',
      name: user?.name || '',
      class: user?.class || '',
      year: user?.year || '',
      section: user?.section || '',
      rollNo: user?.roll_no || '',
      reason: '',
      description: '',
      proofDoc: null,
    })
  }

  const isStepValid = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return formData.fromDate && formData.toDate
      case 2:
        return formData.name && formData.class && formData.year && formData.section && formData.rollNo
      case 3:
        return formData.reason && formData.description
      case 4:
        return formData.proofDoc
      default:
        return true
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Submit OD Request</h2>
          <button
            onClick={() => {
              onClose()
              resetForm()
            }}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= i
                      ? 'bg-srm-blue text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {i}
                </div>
                {i < 4 && (
                  <div
                    className={`w-16 h-1 ${
                      step > i ? 'bg-srm-blue' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500 text-center">
              {step === 1 && 'Select the dates for your OD'}
              {step === 2 && 'Confirm your personal details'}
              {step === 3 && 'Provide event details and reason'}
              {step === 4 && 'Upload proof document'}
            </p>
          </div>

          {/* Step 1: Date Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Select Dates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                  <input
                    type="date"
                    value={formData.fromDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, fromDate: e.target.value }))}
                    className="input-field"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                  <input
                    type="date"
                    value={formData.toDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, toDate: e.target.value }))}
                    className="input-field"
                    min={formData.fromDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              {formData.fromDate && formData.toDate && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Duration:</strong> {
                      Math.ceil((new Date(formData.toDate).getTime() - new Date(formData.fromDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
                    } day(s)
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Student Information */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="input-field"
                    placeholder="Full name as in records"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                  <input
                    type="text"
                    value={formData.rollNo}
                    onChange={(e) => setFormData(prev => ({ ...prev, rollNo: e.target.value }))}
                    className="input-field"
                    placeholder="e.g., RA2311003040056"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <input
                    type="text"
                    value={formData.class}
                    onChange={(e) => setFormData(prev => ({ ...prev, class: e.target.value }))}
                    className="input-field"
                    placeholder="e.g., CSE, ECE, IT"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                    className="input-field"
                  >
                    <option value="">Select Year</option>
                    <option value="I">I</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                    <option value="IV">IV</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value }))}
                    className="input-field"
                  >
                    <option value="">Select Section</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Event Details */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for OD</label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  className="input-field"
                  placeholder="e.g., IEEE Conference, Industry Visit, Competition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Detailed Description
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="input-field resize-none"
                  rows={4}
                  placeholder="Provide detailed information about the event, your role, location, organizer, expected learning outcomes, etc."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Be specific about the event details to help reviewers make informed decisions.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: File Upload */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Proof Document</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proof of Event/Invitation <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload invitation letter, registration confirmation, or event brochure
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    Accepted formats: PDF, JPG, PNG • Max size: 5MB
                  </p>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    id="proof-doc"
                  />
                  <label
                    htmlFor="proof-doc"
                    className="btn-secondary cursor-pointer"
                  >
                    Choose File
                  </label>
                  {formData.proofDoc && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800 flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        ✓ {formData.proofDoc.name}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        File size: {(formData.proofDoc.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="btn-secondary"
              >
                Previous
              </button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!isStepValid(step)}
                className="btn-primary disabled:opacity-50"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !isStepValid(4)}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}