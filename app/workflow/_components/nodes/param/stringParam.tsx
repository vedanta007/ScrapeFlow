/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ParamProps } from '@/types/appNode'
import { useEffect, useId, useState } from 'react'

function StringParam({ param, value, updateNodeParamValue, disabled }: ParamProps) {
    const id = useId()
    const [internalValue, setInternalValue] = useState(value)

    let Component: any = Input
    if(param.variant === 'textarea') {
        Component = Textarea
    }

    useEffect(() => {
        setInternalValue(value)
    }, [value])
    
    return (
        <div className='space-y-1 p-1 w-full'>
            <Label htmlFor={id} className='text-xs flex'>
                {param.name}
                {param.required && (
                    <p className='text-red-400 px-2'>*</p>
                )}
            </Label>
            <Component
                id={id}
                value={internalValue}
                disabled={disabled}
                placeholder='Enter URL here'
                onChange={(e: any) => setInternalValue(e.target.value)}
                onBlur={(e: any) => updateNodeParamValue(e.target.value)}
                className='text-xs'
            />
            {param.helperText && (
                <p className='px-2 text-muted-foreground'>{param.helperText}</p>
            )}
        </div>
    )
}

export default StringParam