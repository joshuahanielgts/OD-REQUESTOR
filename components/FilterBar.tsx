'use client'

import { ChevronDown } from 'lucide-react'

interface FilterBarProps {
  filters: {
    year: string
    class: string
    section: string
  }
  onFiltersChange: (filters: { year: string; class: string; section: string }) => void
  years: string[]
  classes: string[]
  sections: string[]
  label?: string
}

export default function FilterBar({
  filters,
  onFiltersChange,
  years,
  classes,
  sections,
  label = 'Filter'
}: FilterBarProps) {
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  return (
    <div className="mb-6">
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-4">{label}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <div className="relative">
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="input-field appearance-none pr-10"
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <ChevronDown className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <div className="relative">
              <select
                value={filters.class}
                onChange={(e) => handleFilterChange('class', e.target.value)}
                className="input-field appearance-none pr-10"
              >
                <option value="">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
              <ChevronDown className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section
            </label>
            <div className="relative">
              <select
                value={filters.section}
                onChange={(e) => handleFilterChange('section', e.target.value)}
                className="input-field appearance-none pr-10"
              >
                <option value="">All Sections</option>
                {sections.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
              <ChevronDown className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}