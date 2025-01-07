import { z } from 'zod'

export const CreateWorkflowSchema = z.object({
    name: z.string().max(50),
    description: z.string().max(80).optional(),
})

export type createWorkflowSchemaType = z.infer<typeof CreateWorkflowSchema>

export const DuplicateWorkflowSchema = CreateWorkflowSchema.extend({
    workflowId: z.string(),
})

export type duplicateWorkflowSchemaType = z.infer<typeof DuplicateWorkflowSchema>