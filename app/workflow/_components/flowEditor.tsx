'use client'

import { Workflow } from '@prisma/client'
import React, { useCallback, useEffect } from 'react'
import { addEdge, Background, BackgroundVariant, Connection, Controls, Edge, getOutgoers, ReactFlow, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import NodeComponent from './nodes/nodeComponent'
import { toast } from 'sonner'
import { CreateFlowNode } from '@/lib/workflow/createFlowNode'
import { TaskType } from '@/types/task'
import { AppNode } from '@/types/appNode'
import DeletableEdge from './edges/deletableEdge'
import { TaskRegistry } from '@/lib/workflow/task/registry'

const nodeTypes = {
    NetraNode: NodeComponent
}
const edgeTypes = {
    default: DeletableEdge
}

const snapGrid: [number, number] = [50, 50]
const fitViewOptions = { padding: 1 }

function FlowEditor({ workflow }: { workflow: Workflow }) {
    const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([])
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
    const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow()

    useEffect(() => {
        try {
            const flow = JSON.parse(workflow.definition)
            if(!flow) return
            setNodes(flow.nodes || [])
            setEdges(flow.edges || [])
            if(!flow.viewport) return
            const { x = 0, y = 0, zoom = 1 } = flow.viewport
            setViewport({ x, y, zoom })
        } catch {
            toast.error('Failed to load workflow', { id: 'workflow-load' })
        }
    }, [setEdges, setNodes, workflow.definition, setViewport])

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
    }, [])

    const onDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault()
        const taskType = event.dataTransfer.getData('application/reactflow')
        if(typeof taskType === undefined || !taskType) return
        const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY
        })
        const newNode = CreateFlowNode(taskType as TaskType, position)
        setNodes((nodes) => nodes.concat(newNode))
    }, [screenToFlowPosition, setNodes])

    const onConnect = useCallback((connection: Connection) => {
        setEdges((edges) => addEdge({...connection, animated: true}, edges))
        if(!connection.targetHandle) return
        const node = nodes.find((node) => node.id === connection.target)
        if(!node) return
        const nodesInput = node.data.inputs
        delete nodesInput[connection.targetHandle]
        updateNodeData(node.id, { inputs: nodesInput })
    }, [nodes, setEdges, updateNodeData])

    const isValidConnection = useCallback((connection: Edge | Connection) => {
        if(connection.source === connection.target) return false
        const sourceNode = nodes.find((node) => node.id === connection.source)
        const targetNode = nodes.find((node) => node.id === connection.target)
        if(!sourceNode || !targetNode) return false
        const sourceTask = TaskRegistry[sourceNode.data.type]
        const targetTask = TaskRegistry[targetNode.data.type]
        const sourceOutput = sourceTask.outputs.find((output) => output.name === connection.sourceHandle)
        const targetInput = targetTask.inputs.find((input) => input.name === connection.targetHandle)
        if(targetInput?.type !== sourceOutput?.type) return false
        const hasCycle = (node: AppNode, visited = new Set()) => {
            if(visited.has(node.id)) return false
            visited.add(node.id)
            for(const outgoer of getOutgoers(node, nodes, edges)) {
                if(outgoer.id === connection.source) return true
                if(hasCycle(outgoer, visited)) return true
            }
        }
        const detectedCycle = hasCycle(targetNode)
        return !detectedCycle
    }, [nodes, edges])

    return (
        <main className='h-full w-full'>
            <ReactFlow
                nodes={nodes} onNodesChange={onNodesChange}
                edges={edges} onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes} edgeTypes={edgeTypes}
                snapToGrid snapGrid={snapGrid}
                fitView fitViewOptions={fitViewOptions}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onConnect={onConnect}
                isValidConnection={isValidConnection}
            >
                <Controls position='top-left' fitViewOptions={fitViewOptions} />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
        </main>
    )
}

export default FlowEditor