'use client'

import { TaskParam, TaskParamType } from '@/types/task'
import React, { useCallback } from 'react'
import StringParam from './param/stringParam'
import { useReactFlow } from '@xyflow/react'
import { AppNode } from '@/types/appNode'
import BrowserInstanceParam from './param/browserInstanceParam'

function NodeParamField({ param, nodeId, disabled }: { param: TaskParam, nodeId: string, disabled?: boolean }) {
    const { updateNodeData, getNode } = useReactFlow()
    const node = getNode(nodeId) as AppNode
    const value = node?.data?.inputs?.[param.name]
    const updateNodeParamValue = useCallback((newValue: string) => {
        updateNodeData(nodeId, {
            inputs: {
                ...node?.data.inputs,
                [param.name]: newValue
            }
        })
    }, [
        nodeId,
        param.name,
        node?.data.inputs,
        updateNodeData
    ])
    switch (param.type) {
        case TaskParamType.STRING:
            return (
                <StringParam
                    param={param}
                    value={value}
                    updateNodeParamValue={updateNodeParamValue}
                    disabled={disabled}
                />
            )
        case TaskParamType.BROWSER_INSTANCE:
            return (
                <BrowserInstanceParam
                    param={param}
                    value={''}
                    updateNodeParamValue={updateNodeParamValue}
                />
            )
        default:
            return (
                <div className="w-full">
                    <p className="text-xs text-muted-foreground">Not implemented</p>
                </div>
            )
    }
}

export default NodeParamField