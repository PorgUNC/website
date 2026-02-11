import type { Control, FieldErrorsImpl } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown, X } from 'lucide-react'
import React, { useState } from 'react'
import { Controller } from 'react-hook-form'

import { Error } from '../Error'
import { Width } from '../Width'
import { programOptions } from './options'

export interface ProgramsField {
  blockName?: string
  blockType: 'programs'
  defaultValue?: string
  label?: string
  name: string
  required?: boolean
  width?: number
}

export const Programs: React.FC<
  ProgramsField & {
    control: Control
    errors: Partial<FieldErrorsImpl>
  }
> = ({ name, control, errors, label, required, width, defaultValue }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
        if (window.innerWidth < 768) {
          searchInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
      }, 100)
    }
  }, [isOpen, name])

  return (
    <Width width={width}>
      <Label htmlFor={name}>
        {label}
        {required && (
          <span className="required">
            * <span className="sr-only">(required)</span>
          </span>
        )}
      </Label>
      <Controller
        control={control}
        defaultValue={defaultValue ? [defaultValue] : []}
        name={name}
        render={({ field: { onChange, value } }) => {
          const selectedValues = Array.isArray(value) ? value : []
          const selectedLabels = selectedValues
            .map((val) => programOptions.find((opt) => opt.value === val)?.label)
            .filter(Boolean)

          const filteredOptions = programOptions.filter((option) =>
            option.label.toLowerCase().includes(searchQuery.toLowerCase())
          )

          return (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-start font-normal min-h-10 h-auto"
                  id={name}
                >
                  <div className="flex flex-wrap gap-1 flex-1 items-center overflow-hidden">
                    {selectedLabels.length > 0 ? (
                      selectedLabels.map((label, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium max-w-full"
                        >
                          <span className="truncate">{label}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              const newValues = selectedValues.filter((_, i) => i !== index)
                              onChange(newValues)
                            }}
                            className="shrink-0 hover:bg-secondary-foreground/20 rounded-sm"
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove {label}</span>
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-muted-foreground truncate">{label}</span>
                    )}
                  </div>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] p-0 flex flex-col h-[70vh] md:h-64"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <div className="overflow-y-auto p-2 flex-1">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => {
                      const isSelected = selectedValues.includes(option.value)
                      return (
                        <div
                          key={option.value}
                          className="flex items-center space-x-2 rounded px-2 py-1.5 cursor-pointer hover:bg-accent"
                          onClick={() => {
                            const newValues = isSelected
                              ? selectedValues.filter((val) => val !== option.value)
                              : [...selectedValues, option.value]
                            onChange(newValues)
                          }}
                        >
                          <Checkbox checked={isSelected} />
                          <label className="flex-1 cursor-pointer text-sm">{option.label}</label>
                        </div>
                      )
                    })
                  ) : (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      No programs found
                    </div>
                  )}
                </div>
                <div className="p-2 border-t sticky bottom-0 bg-background z-10">
                  <Input
                    ref={searchInputRef}
                    placeholder="Search programs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9"
                  />
                </div>
              </PopoverContent>
            </Popover>
          )
        }}
        rules={{ required }}
      />
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
