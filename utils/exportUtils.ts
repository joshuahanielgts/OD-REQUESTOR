import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { ODRequest } from '@/lib/supabaseClient'

// Extend jsPDF interface to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

export const exportToPDF = (requests: ODRequest[], fileName: string = 'OD_Report') => {
  const doc = new jsPDF()
  
  // Add title
  doc.setFontSize(20)
  doc.text('SRM University - On Duty Report', 20, 20)
  
  doc.setFontSize(12)
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 20, 35)
  doc.text(`Total Records: ${requests.length}`, 20, 45)

  // Prepare table data
  const tableData = requests.map(req => [
    req.roll_no || 'N/A',
    req.name || 'N/A',
    `${req.class || ''} ${req.year || ''}-${req.section || ''}`,
    req.reason,
    `${new Date(req.from_date).toLocaleDateString('en-IN')} - ${new Date(req.to_date).toLocaleDateString('en-IN')}`,
    req.description || 'N/A',
    req.status.toUpperCase().replace(/_/g, ' ')
  ])

  // Add table
  doc.autoTable({
    head: [['Roll No', 'Name', 'Class', 'Reason', 'Duration', 'Description', 'Status']],
    body: tableData,
    startY: 55,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [30, 64, 175] },
    alternateRowStyles: { fillColor: [245, 247, 250] },
  })

  // Save the PDF
  doc.save(`${fileName}_${new Date().toISOString().split('T')[0]}.pdf`)
}

export const exportToCSV = (requests: ODRequest[], fileName: string = 'OD_Report') => {
  const headers = [
    'Roll Number',
    'Student Name',
    'Class',
    'Year',
    'Section',
    'Reason',
    'Description',
    'From Date',
    'To Date',
    'Status',
    'Created At'
  ]

  const csvData = requests.map(req => [
    req.roll_no || '',
    req.name || '',
    req.class || '',
    req.year || '',
    req.section || '',
    req.reason,
    req.description || '',
    new Date(req.from_date).toLocaleDateString('en-IN'),
    new Date(req.to_date).toLocaleDateString('en-IN'),
    req.status.replace(/_/g, ' ').toUpperCase(),
    new Date(req.created_at).toLocaleString('en-IN')
  ])

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => 
      row.map(field => 
        typeof field === 'string' && field.includes(',') 
          ? `"${field}"` 
          : field
      ).join(',')
    )
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}