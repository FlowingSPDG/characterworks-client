import type {
	ActivateGridCommand,
	CharacterWorksChannel,
	EjectMotionsCommand,
	FinishAndRestartMotionsCommand,
	ListGridCellsCommand,
	ListGridNamesCommand,
	ListLayersCommand,
	ListMotionsCommand,
	ListMotionsWithIdsCommand,
	ResumeMotionsCommand,
	RestartMotionsCommand,
	SetTextCommand,
	TriggerAction,
	TriggerCommand,
} from './types'

export function createTriggerCommand(
	action: TriggerAction,
	motionNames: string,
	channel: CharacterWorksChannel,
	motionIds?: string[]
): TriggerCommand {
	const motions = motionNames
		.split(',')
		.map((m) => m.trim())
		.filter((m) => m.length > 0)

	const command: TriggerCommand = {
		action,
		motions,
		channel,
	}

	if (motionIds && motionIds.length > 0) {
		command.motion_ids = motionIds
	}

	return command
}

export function createEjectMotionsCommand(
	motionNames: string,
	channel: CharacterWorksChannel,
	motionIds?: string[]
): EjectMotionsCommand {
	return createTriggerCommand('eject_motions', motionNames, channel, motionIds) as EjectMotionsCommand
}

export function createResumeMotionsCommand(
	motionNames: string,
	channel: CharacterWorksChannel,
	motionIds?: string[]
): ResumeMotionsCommand {
	return createTriggerCommand('resume_motions', motionNames, channel, motionIds) as ResumeMotionsCommand
}

export function createRestartMotionsCommand(
	motionNames: string,
	channel: CharacterWorksChannel,
	motionIds?: string[]
): RestartMotionsCommand {
	return createTriggerCommand('restart_motions', motionNames, channel, motionIds) as RestartMotionsCommand
}

export function createFinishAndRestartMotionsCommand(
	motionNames: string,
	channel: CharacterWorksChannel,
	motionIds?: string[]
): FinishAndRestartMotionsCommand {
	return createTriggerCommand('finish_and_restart_motions', motionNames, channel, motionIds) as FinishAndRestartMotionsCommand
}

// Overload for old signature: (motionName, textLayer, value, channel)
export function createSetTextCommand(
	motionName: string,
	textLayer: string,
	value: string,
	channel: CharacterWorksChannel
): SetTextCommand
// Overload for new signature with layer path: (layer, value, channel, layerId?)
export function createSetTextCommand(
	layer: string,
	value: string,
	channel: CharacterWorksChannel,
	layerId?: string[]
): SetTextCommand
// Implementation
export function createSetTextCommand(
	motionNameOrLayer: string,
	textLayerOrValue: string,
	valueOrChannel: string | CharacterWorksChannel,
	channelOrLayerId?: CharacterWorksChannel | string[]
): SetTextCommand {
	let layer: string | undefined
	let value: string
	let channel: CharacterWorksChannel
	let layerId: string[] | undefined

	if (
		typeof valueOrChannel === 'string' &&
		channelOrLayerId &&
		typeof channelOrLayerId === 'string'
	) {
		// Old signature: (motionName, textLayer, value, channel)
		const motion = motionNameOrLayer.trim()
		const textLayer = textLayerOrValue.trim()
		layer = `${motion}\\${textLayer}`
		value = valueOrChannel
		channel = channelOrLayerId
	} else {
		// New signature: (layer, value, channel, layerId?)
		layer = motionNameOrLayer.trim() || undefined
		value = textLayerOrValue
		channel = valueOrChannel as CharacterWorksChannel
		if (Array.isArray(channelOrLayerId) && channelOrLayerId.length > 0) {
			layerId = channelOrLayerId
		}
	}

	const command: SetTextCommand = {
		action: 'set_text',
		value,
		channel,
	}

	if (layer) {
		command.layer = layer
	}

	if (layerId && layerId.length > 0) {
		command.layer_id = layerId
	}

	return command
}

export function createActivateGridCommand(
	gridName: string,
	row: number,
	column: number,
	channel?: CharacterWorksChannel
): ActivateGridCommand {
	const command: ActivateGridCommand = {
		action: 'activate_grid_cell',
		grid: gridName,
		cell: [row, column],
	}

	if (channel) {
		command.channel = channel
	}

	return command
}

export function createListMotionsCommand(): ListMotionsCommand {
	return {
		action: 'list_motions',
	}
}

export function createListMotionsWithIdsCommand(): ListMotionsWithIdsCommand {
	return {
		action: 'list_motions_with_ids',
	}
}

export function createListLayersCommand(
	options?: {
		parent?: string
		parent_id?: string[]
		channel?: CharacterWorksChannel
	}
): ListLayersCommand {
	const command: ListLayersCommand = {
		action: 'list_layers',
	}

	if (options) {
		if (options.parent) {
			command.parent = options.parent
		}
		if (options.parent_id && options.parent_id.length > 0) {
			command.parent_id = options.parent_id
		}
		if (options.channel) {
			command.channel = options.channel
		}
	}

	return command
}

export function createListGridNamesCommand(): ListGridNamesCommand {
	return {
		action: 'list_grid_names',
	}
}

export function createListGridCellsCommand(gridName: string): ListGridCellsCommand {
	return {
		action: 'list_grid_cells',
		grid: gridName,
	}
}

