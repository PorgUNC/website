import type { RadioField } from '@payloadcms/plugin-form-builder/types'
import type { Control, FieldErrorsImpl } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'
import { Controller } from 'react-hook-form'

import { Error } from '../Error'
import { Width } from '../Width'

export const Radio: React.FC<
  RadioField & {
    control: Control
    errors: Partial<FieldErrorsImpl>
    otherOption: boolean
  }
> = ({ name, control, errors, label, options, required, width, defaultValue, otherOption = false }) => {
  const [otherText, setOtherText] = React.useState('')
  const [selectedValue, setSelectedValue] = React.useState(defaultValue || '')

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
        defaultValue={defaultValue}
        name={name}
        render={({ field: { onChange, value } }) => {
          return (
            <>
              <RadioGroup
                onValueChange={(val) => {
                  setSelectedValue(val)
                  if (val === 'other') {
                    onChange(otherText)
                  } else {
                    onChange(val)
                  }
                }}
                value={value === otherText && otherOption ? 'other' : value}
              >
                {options.map(({ label, value }) => {
                  return (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem value={value} id={`${name}-${value}`} />
                      <Label htmlFor={`${name}-${value}`} className="text-base cursor-pointer">
                        {label}
                      </Label>
                    </div>
                  )
                })}
                {otherOption && (
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="other" id={`${name}-other`} className="mt-3" />
                    <div className="flex-1">
                      <Label htmlFor={`${name}-other-text`} className="text-base cursor-pointer">
                        Other:
                      </Label>
                      <Textarea
                        id={`${name}-other-text`}
                        value={selectedValue === 'other' ? otherText : ''}
                        onChange={(e) => {
                          setOtherText(e.target.value)
                          if (selectedValue === 'other') {
                            onChange(e.target.value)
                          }
                        }}
                        onFocus={() => {
                          setSelectedValue('other')
                          onChange(otherText)
                        }}
                        placeholder="Enter your response"
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                  </div>
                )}
              </RadioGroup>
            </>
          )
        }}
        rules={{
          required,
          validate: (value) => {
            if (required && otherOption && selectedValue === 'other') {
              return value && value.trim().length > 0 || 'This field is required'
            }
            return true
          }
        }}
      />
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
