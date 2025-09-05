'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { AppIcon } from '@/components/app-icons'


interface InvoiceHistoryFiltersProps {
  onFilterChange?: (filters: {
    search: string
    startDate: Date | undefined
    endDate: Date | undefined
    isOrder: boolean | undefined
  }) => void
  isLoading?: boolean
}


export function InvoiceHistoryFilters({ onFilterChange, isLoading = false }: InvoiceHistoryFiltersProps = {}) {
  const [search, setSearch] = useState('')
  const [isOrder, setIsOrder] = useState<boolean | undefined>(undefined)
  const [isFilterOpen, setIsFilterOpen] = useState(false)




  /*   const handleReset = () => {
      setSearch('')
      setIsOrder(undefined)
  
      if (onFilterChange) {
        onFilterChange({ search: '', startDate: undefined, endDate: undefined, isOrder: undefined })
      }
    } */

  return (
    <div className=" space-y-6 rounded-lg">

      {/* Search Input */}
      <div className="max-w-7xl flex flex-col sm:flex-row gap-4 sm:gap-2 justify-between items-stretch sm:items-center mb-4">
        <Label htmlFor="search" className="sr-only">ရှာဖွေရန်</Label>
        <div className="relative rounded-md shadow-sm flex-grow">
          <AppIcon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
          />
          <Input
            id="search"
            placeholder="ဘောက်ချာနံပါတ်၊ ဝယ်သူအမည်၊ ဖုန်းနံပါတ်"
            className="pl-10 w-full text-sm"
            value={search}

            onChange={(e) => {
              setSearch(e.target.value)
              onFilterChange?.({ search: e.target.value, startDate: undefined, endDate: undefined, isOrder })
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto relative"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            disabled={isLoading}
          >
            <AppIcon name="filter" className="mr-2 h-4 w-4" />
            <span>Filter</span>

          </Button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="mb-4 flex flex-wrap items-center gap-4 bg-muted/50 p-4 rounded-lg">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-order-true"
                checked={isOrder === true}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setIsOrder(true)
                    onFilterChange?.({ search, startDate: undefined, endDate: undefined, isOrder: true })
                  } else if (isOrder === true) {
                    setIsOrder(undefined)
                    onFilterChange?.({ search, startDate: undefined, endDate: undefined, isOrder: undefined })
                  }
                }}
                disabled={isLoading}
              />
              <Label htmlFor="is-order-true" className={`text-sm ${isOrder === true ? 'font-medium text-primary' : ''}`}>အော်ဒါပစ္စည်းများ</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-order-false"
                checked={isOrder === false}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setIsOrder(false)
                    onFilterChange?.({ search, startDate: undefined, endDate: undefined, isOrder: false })
                  } else if (isOrder === false) {
                    setIsOrder(undefined)
                    onFilterChange?.({ search, startDate: undefined, endDate: undefined, isOrder: undefined })
                  }
                }}
                disabled={isLoading}
              />
              <Label htmlFor="is-order-false" className={`text-sm ${isOrder === false ? 'font-medium text-primary' : ''}`}>အရောင်းပစ္စည်းများ</Label>
            </div>
          </div>

          {/* Reset Button */}
          {/*           <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isLoading || (activeFilterCount === 0)}
            className={activeFilterCount > 0 ? 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200' : ''}
          >
            <AppIcon name="reset" className="h-4 w-4" />
            <span className="ml-2">Reset</span>
          </Button> */}
        </div>
      )}
    </div>
  )
}