export interface CharacterWorksConfig {
	host: string
	port: number
}

export type CharacterWorksChannel = 'live1' | 'live2' | 'preview'

export type TriggerAction =
	| 'play_motions'
	| 'stop_motions'
	| 'finish_motions'
	| 'pause_motions'
	| 'eject_motions'
	| 'resume_motions'
	| 'restart_motions'
	| 'finish_and_restart_motions'

export interface TriggerCommand {
	action: TriggerAction
	motions: string[]
	motion_ids?: string[]
	channel: CharacterWorksChannel
}

export type EjectMotionsCommand = TriggerCommand & { action: 'eject_motions' }
export type ResumeMotionsCommand = TriggerCommand & { action: 'resume_motions' }
export type RestartMotionsCommand = TriggerCommand & { action: 'restart_motions' }
export type FinishAndRestartMotionsCommand = TriggerCommand & { action: 'finish_and_restart_motions' }

export interface SetTextCommand {
	action: 'set_text'
	layer?: string
	layer_id?: string[]
	value: string
	channel: CharacterWorksChannel
}

export interface ActivateGridCommand {
	action: 'activate_grid_cell'
	grid: string
	cell: [number, number]
	channel?: CharacterWorksChannel
}

export interface ListMotionsCommand {
	action: 'list_motions'
}

export interface ListMotionsWithIdsCommand {
	action: 'list_motions_with_ids'
}

export interface ListLayersCommand {
	action: 'list_layers'
	parent?: string
	parent_id?: string[]
	channel?: CharacterWorksChannel
}

export interface ListGridNamesCommand {
	action: 'list_grid_names'
}

export interface ListGridCellsCommand {
	action: 'list_grid_cells'
	grid: string
}

export type CharacterWorksCommand =
	| TriggerCommand
	| SetTextCommand
	| ActivateGridCommand
	| ListMotionsCommand
	| ListMotionsWithIdsCommand
	| ListLayersCommand
	| ListGridNamesCommand
	| ListGridCellsCommand

// Response types
export interface ListMotionsResponse {
	motions: string[]
}

export interface MotionWithId {
	name: string
	id: string
}

export interface ListMotionsWithIdsResponse {
	motions: MotionWithId[]
}

export interface LayerInfo {
	name: string
	path: string
	id: string
	type: string
	children?: LayerInfo[]
}

export interface ListLayersResponse {
	children?: LayerInfo[]
}

export interface ListGridNamesResponse {
	grids: string[]
}

export interface GridCell {
	position: [number, number]
	text?: string
	color?: string
}

export interface ListGridCellsResponse {
	cells?: GridCell[]
}

export type CharacterWorksResponse<T = unknown> = T

