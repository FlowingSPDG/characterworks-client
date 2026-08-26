import { z } from 'zod'

/**
 * Zod schemas for validating CharacterWorks API responses.
 * These schemas ensure type safety at runtime by validating the structure
 * of data received from the CharacterWorks server.
 */

export const MotionWithIdSchema = z.object({
	name: z.string(),
	id: z.string(),
})

export const ListMotionsResponseSchema = z.object({
	motions: z.array(z.string()),
})

export const ListMotionsWithIdsResponseSchema = z.object({
	motions: z.array(MotionWithIdSchema),
})

export const LayerInfoSchema: z.ZodType<{
	name: string
	path: string
	id: string
	type: string
	children?: Array<{
		name: string
		path: string
		id: string
		type: string
		children?: any[]
	}>
}> = z.lazy(() =>
	z.object({
		name: z.string(),
		path: z.string(),
		id: z.string(),
		type: z.string(),
		children: z.array(LayerInfoSchema).optional(),
	})
)

export const ListLayersResponseSchema = z.object({
	children: z.array(LayerInfoSchema).optional(),
})

export const ListGridNamesResponseSchema = z.object({
	grids: z.array(z.string()),
})

export const GridCellSchema = z.object({
	position: z.tuple([z.number(), z.number()]),
	text: z.string().optional(),
	color: z.string().optional(),
})

export const ListGridCellsResponseSchema = z.object({
	cells: z.array(GridCellSchema).optional(),
})

/**
 * Type inference from schemas
 */
export type ValidatedListMotionsResponse = z.infer<typeof ListMotionsResponseSchema>
export type ValidatedListMotionsWithIdsResponse = z.infer<typeof ListMotionsWithIdsResponseSchema>
export type ValidatedListLayersResponse = z.infer<typeof ListLayersResponseSchema>
export type ValidatedListGridNamesResponse = z.infer<typeof ListGridNamesResponseSchema>
export type ValidatedListGridCellsResponse = z.infer<typeof ListGridCellsResponseSchema>
export type ValidatedMotionWithId = z.infer<typeof MotionWithIdSchema>
export type ValidatedLayerInfo = z.infer<typeof LayerInfoSchema>
export type ValidatedGridCell = z.infer<typeof GridCellSchema>
