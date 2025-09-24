'use client'

import { X, Download } from 'lucide-react'

interface ProofViewerProps {
  url: string
  onClose: () => void
}

export default function ProofViewer({ url, onClose }: ProofViewerProps) {
  const isPDF = url.toLowerCase().includes('.pdf')
  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(url)

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = url
    link.download = url.split('/').pop() || 'proof-document'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Proof Document</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="btn-secondary flex items-center space-x-2 px-3 py-1.5"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-auto">
          {isPDF ? (
            <iframe
              src={url}
              className="w-full h-full min-h-[500px] border-0"
              title="PDF Viewer"
            />
          ) : isImage ? (
            <div className="flex items-center justify-center h-full">
              <img
                src={url}
                alt="Proof document"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-gray-400 mb-4">
                  <Download className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Preview not available
                </h3>
                <p className="text-gray-500 mb-4">
                  This file type cannot be previewed. Click download to view the file.
                </p>
                <button
                  onClick={handleDownload}
                  className="btn-primary"
                >
                  Download File
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}