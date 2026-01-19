/**
 * CharacterWorks HTTP Client Library
 *
 * This module provides a pure client library for communicating with CharacterWorks
 * over HTTP. It is designed to be platform-agnostic and can be used by Stream Deck
 * plugins, Companion modules, or any other Node.js application.
 *
 * @module characterworks-client
 */

// Re-export all types
export type {
	CharacterWorksConfig,
	CharacterWorksChannel,
	TriggerAction,
	TriggerCommand,
	SetTextCommand,
	ActivateGridCommand,
	ListMotionsCommand,
	ListMotionsWithIdsCommand,
	ListLayersCommand,
	ListGridNamesCommand,
	ListGridCellsCommand,
	CharacterWorksCommand,
	// Response types
	ListMotionsResponse,
	MotionWithId,
	ListMotionsWithIdsResponse,
	LayerInfo,
	ListLayersResponse,
	ListGridNamesResponse,
	GridCell,
	ListGridCellsResponse,
	CharacterWorksResponse,
} from './types'

// Re-export all command creation functions
export {
	createTriggerCommand,
	createEjectMotionsCommand,
	createResumeMotionsCommand,
	createRestartMotionsCommand,
	createFinishAndRestartMotionsCommand,
	createSetTextCommand,
	createActivateGridCommand,
	createListMotionsCommand,
	createListMotionsWithIdsCommand,
	createListLayersCommand,
	createListGridNamesCommand,
	createListGridCellsCommand,
} from './commands'

// Re-export the HTTP client functions
export {
	sendCommand,
	parseResponse,
	sendCommandAndParse,
	sendListMotionsCommand,
	sendListMotionsWithIdsCommand,
	sendListLayersCommand,
	sendListGridNamesCommand,
	sendListGridCellsCommand,
	sendBatchCommands,
	sendBatchCommandsWithResponses,
} from './client'

