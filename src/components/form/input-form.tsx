import { ComponentProps } from 'react'
import { FieldValues, Path, useFormContext } from 'react-hook-form'

import { Input } from '../ui/input'
import { Label } from '../ui/label'

interface InputFormProps<
  TFieldValues extends FieldValues,
> extends ComponentProps<typeof Input> {
  name: Path<TFieldValues>
  label: string
  description?: string
}

export function InputForm<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  type = 'text',
  ...props
}: InputFormProps<TFieldValues>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<TFieldValues>()

  const error = errors[name]?.message as string | undefined

  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>

      <Input id={name} type={type} {...register(name)} {...props} />

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  )
}
