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
import { ChevronDown, X } from 'lucide-react'
import React, { useState } from 'react'
import { Controller } from 'react-hook-form'

import { Error } from '../Error'
import { Width } from '../Width'

import shuffle from '@/lib/shuffleArray'

export const Select: React.FC<
  SelectField & {
    control: Control
    errors: Partial<FieldErrorsImpl>
    allowMultiple?: boolean
    allowSearching?: boolean
    randomChoiceOrder?: boolean
  }
> = ({
  name,
  control,
  errors,
  label,
  options,
  required,
  width,
  defaultValue,
  allowMultiple,
  allowSearching,
  randomChoiceOrder,
  placeholder,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [hasBeenRandomized, setRandomizedValue] = React.useState(0)
  if (randomChoiceOrder && hasBeenRandomized === 0) {
    shuffle(options)
    setRandomizedValue(1)
  }

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
      <div className="my-1 h-0.5 w-1/8 border-b-primary border-b-2" aria-hidden="true" />
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
                  option.label.toLowerCase().includes(searchQuery.toLowerCase()),
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
                            className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium max-w-full"
                          >
                            <span className="truncate">{label}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                onChange(selectedValues.filter((_, i) => i !== index))
                              }}
                              className="shrink-0 rounded-sm hover:bg-secondary-foreground/20"
                              aria-label={`Remove ${label}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground">{label}</span>
                      )}
                    </div>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-0 flex flex-col h-[70vh] max-h-[calc(100dvh-1rem)] md:h-64 overflow-hidden"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                  avoidCollisions={false}
                >
                  {allowSearching && (
                    <div className="shrink-0 p-2 border-b bg-background">
                      <div className="relative">
                        <Input
                          placeholder="Search options..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="h-9 pr-8"
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            aria-label="Clear search"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setSearchQuery('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="min-h-0 overflow-y-auto p-2 flex-1">
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
                </PopoverContent>
              </Popover>
            )
          } else {
            // Single-select mode
            const controlledValue = options.find((t) => t.value === value)

            if (allowSearching) {
              const filteredOptions = options.filter((option) =>
                option.label.toLowerCase().includes(searchQuery.toLowerCase()),
              )

              return (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-start font-normal"
                      id={name}
                    >
                      <span className="truncate">{controlledValue?.label || label}</span>
                      <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0 flex flex-col h-[70vh] max-h-[calc(100dvh-1rem)] md:h-64 overflow-hidden"
                    align="start"
                    side="bottom"
                    sideOffset={4}
                    avoidCollisions={false}
                  >
                    <div className="shrink-0 p-2 border-b bg-background">
                      <div className="relative">
                        <Input
                          placeholder="Search options..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="h-9 pr-8"
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            aria-label="Clear search"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setSearchQuery('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="min-h-0 overflow-y-auto p-2 flex-1">
                      {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                          <div
                            key={option.value}
                            className="rounded px-2 py-1.5 cursor-pointer hover:bg-accent text-sm"
                            onClick={() => onChange(option.value)}
                          >
                            {option.label}
                          </div>
                        ))
                      ) : (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                          No options found
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              )
            }

            return (
              <SelectComponent
                onValueChange={(val) => onChange(val)}
                value={controlledValue?.value}
              >
                <SelectTrigger className="w-full" id={name}>
                  <SelectValue
                    placeholder={
                      typeof placeholder === 'string' && placeholder.length > 0
                        ? placeholder
                        : label
                    }
                  />
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
