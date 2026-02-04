import type { RadioField } from '@payloadcms/plugin-form-builder/types'
import type { Control, FieldErrorsImpl } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import React from 'react'
import { Controller } from 'react-hook-form'

import { Error } from '../Error'
import { Width } from '../Width'

export const Radio: React.FC<
  RadioField & {
    control: Control
    errors: Partial<FieldErrorsImpl>
  }
> = ({ name, control, errors, label, options, required, width, defaultValue }) => {
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
            <RadioGroup onValueChange={(val) => onChange(val)} value={value}>
              {options.map(({ label, value }) => {
                return (
                  <div key={value} className="flex items-center space-x-2">
                    <RadioGroupItem value={value} id={`${name}-${value}`} />
                    <Label htmlFor={`${name}-${value}`} className="font-normal cursor-pointer">
                      {label}
                    </Label>
                  </div>
                )
              })}
            </RadioGroup>
          )
        }}
        rules={{ required }}
      />
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
