'use client'

import React, { useEffect, useState } from 'react'
import CountUp from 'react-countup'

function ReactCountupWrapper({ value }: { value: number }) {
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])
    if(mounted) {
        return '-'
    }
    return (
        <CountUp duration={0.5} end={value} preserveValue decimals={0} />
    )
}

export default ReactCountupWrapper