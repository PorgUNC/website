import type { SelectField } from '@payloadcms/plugin-form-builder/types'
import type { Control, FieldErrorsImpl } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import {
  Select as SelectComponent,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown } from 'lucide-react'
import React, { useState } from 'react'
import { Controller } from 'react-hook-form'

import { Error } from '../Error'
import { Width } from '../Width'

export const Select: React.FC<
  SelectField & {
    control: Control
    errors: Partial<FieldErrorsImpl>
    allowMultiple?: boolean
    allowSearching?: boolean
  }
> = ({ name, control, errors, label, options, required, width, defaultValue, allowMultiple, allowSearching }) => {
  const [searchQuery, setSearchQuery] = useState('')

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
        defaultValue={allowMultiple ? (defaultValue ? [defaultValue] : []) : defaultValue}
        name={name}
        render={({ field: { onChange, value } }) => {
          if (allowMultiple) {
            // Multi-select mode
            const selectedValues = Array.isArray(value) ? value : []
            const selectedLabels = selectedValues
              .map((val) => options.find((opt) => opt.value === val)?.label)
              .filter(Boolean)

            const filteredOptions = allowSearching
              ? options.filter((option) =>
                  option.label.toLowerCase().includes(searchQuery.toLowerCase())
                )
              : options

            return (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-start font-normal min-h-10 h-auto"
                    id={name}
                  >
                    <div className="flex flex-wrap gap-1 flex-1 items-center">
                      {selectedLabels.length > 0 ? (
                        selectedLabels.map((label, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium"
                          >
                            {label}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground">{label}</span>
                      )}
                    </div>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 flex flex-col" align="start">
                  <div className="max-h-64 overflow-y-auto p-2 flex-1">
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
                        No options found
                      </div>
                    )}
                  </div>
                  {allowSearching && (
                    <div className="p-2 border-t sticky bottom-0 bg-background">
                      <Input
                        placeholder="Search options..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-9"
                      />
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            )
          } else {
            // Single-select mode
            const controlledValue = options.find((t) => t.value === value)

            return (
              <SelectComponent onValueChange={(val) => onChange(val)} value={controlledValue?.value}>
                <SelectTrigger className="w-full" id={name}>
                  <SelectValue placeholder={label} />
                </SelectTrigger>
                <SelectContent>
                  {options.map(({ label, value }) => {
                    return (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </SelectComponent>
            )
          }
        }}
        rules={{ required }}
      />
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
