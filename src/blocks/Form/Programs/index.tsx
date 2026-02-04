import type { Control, FieldErrorsImpl } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown } from 'lucide-react'
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
          const [searchQuery, setSearchQuery] = useState('')
          const selectedValues = Array.isArray(value) ? value : []
          const selectedLabels = selectedValues
            .map((val) => programOptions.find((opt) => opt.value === val)?.label)
            .filter(Boolean)

          const filteredOptions = programOptions.filter((option) =>
            option.label.toLowerCase().includes(searchQuery.toLowerCase())
          )

          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between font-normal"
                  id={name}
                >
                  {selectedLabels.length > 0 ? (
                    <span className="truncate">{selectedLabels.join(', ')}</span>
                  ) : (
                    <span className="text-muted-foreground">{label}</span>
                  )}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <div className="p-2 border-b">
                  <Input
                    placeholder="Search programs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div className="max-h-64 overflow-y-auto p-2">
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
