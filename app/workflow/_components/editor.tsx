'use client'

import { Workflow } from '@prisma/client'
import React from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import FlowEditor from './flowEditor'
import Topbar from './topbar/topbar'
import TaskMenu from './taskMenu'
import { FlowValidationProvider } from '@/context/flowValidationContext'

function Editor({ workflow }: { workflow: Workflow }) {
    return (
        <FlowValidationProvider>
            <ReactFlowProvider>
                <div className="flex flex-col h-full w-full overflow-hidden">
                    <Topbar title='Workflow editor' subTitle={workflow.name} workflowId={workflow.id} />
                    <section className="flex h-full overflow-auto">
                        <TaskMenu />
                        <FlowEditor workflow={workflow} />
                    </section>
                </div>
            </ReactFlowProvider>
        </FlowValidationProvider>
    )
}

export default Editor