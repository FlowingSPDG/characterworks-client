import { z } from 'zod'
import type {
	CharacterWorksCommand,
	CharacterWorksConfig,
	ListGridCellsCommand,
	ListGridCellsResponse,
	ListGridNamesCommand,
	ListGridNamesResponse,
	ListLayersCommand,
	ListLayersResponse,
	ListMotionsCommand,
	ListMotionsResponse,
	ListMotionsWithIdsCommand,
	ListMotionsWithIdsResponse,
} from './types'
import {
	ListMotionsResponseSchema,
	ListMotionsWithIdsResponseSchema,
	ListLayersResponseSchema,
	ListGridNamesResponseSchema,
	ListGridCellsResponseSchema,
} from './schemas'

/**
 * Send a command to CharacterWorks over HTTP using the global fetch API.
 *
 * By default this assumes a Node.js 20+ runtime where `fetch` is available
 * globally. In other environments, ensure a compatible `fetch` implementation
 * is provided (for example via a polyfill).
 */
export async function sendCommand(
	command: CharacterWorksCommand,
	config: CharacterWorksConfig
): Promise<Response> {
	const url = `http://${config.host}:${config.port}/`

	const controller = new AbortController()
	const timeoutId = setTimeout(() => controller.abort(), 10_000) // 10s timeout

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(command),
			signal: controller.signal,
		})

		clearTimeout(timeoutId)
		return response
	} catch (error) {
		clearTimeout(timeoutId)
		throw error
	}
}

/**
 * Parse a Response object to extract JSON data with type safety and runtime validation.
 *
 * @throws {Error} If the response is not OK, if JSON parsing fails, or if validation fails
 */
export async function parseResponse<T>(response: Response): Promise<T> {
	if (!response.ok) {
		const text = await response.text()
		throw new Error(`HTTP ${response.status} ${response.statusText}: ${text}`)
	}

	try {
		const data = await response.json()
		return data as T
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Failed to parse JSON response: ${error.message}`)
		}
		throw error
	}
}

/**
 * Parse and validate a Response object using a Zod schema.
 * This provides runtime type safety by validating the response structure.
 *
 * @param response - The Response object to parse
 * @param schema - The Zod schema to validate against
 * @returns The validated and typed data
 * @throws {Error} If the response is not OK, if JSON parsing fails, or if validation fails
 */
export async function parseResponseWithSchema<T>(
	response: Response,
	schema: z.ZodSchema<T>
): Promise<T> {
	if (!response.ok) {
		const text = await response.text()
		throw new Error(`HTTP ${response.status} ${response.statusText}: ${text}`)
	}

	try {
		const data = await response.json()
		return schema.parse(data)
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error(
				`Response validation failed: ${error.errors.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`).join(', ')}`
			)
		}
		if (error instanceof Error) {
			throw new Error(`Failed to parse JSON response: ${error.message}`)
		}
		throw error
	}
}

/**
 * Send a command and parse the response as JSON with type safety.
 */
export async function sendCommandAndParse<T>(
	command: CharacterWorksCommand,
	config: CharacterWorksConfig
): Promise<T> {
	const response = await sendCommand(command, config)
	return parseResponse<T>(response)
}

/**
 * Send a command and parse the response with Zod schema validation.
 * This provides runtime type safety by validating the response structure.
 */
export async function sendCommandAndParseWithSchema<T>(
	command: CharacterWorksCommand,
	config: CharacterWorksConfig,
	schema: z.ZodSchema<T>
): Promise<T> {
	const response = await sendCommand(command, config)
	return parseResponseWithSchema(response, schema)
}

/**
 * Send a list_motions command and return the parsed and validated response.
 */
export async function sendListMotionsCommand(
	config: CharacterWorksConfig
): Promise<ListMotionsResponse> {
	const command: ListMotionsCommand = { action: 'list_motions' }
	return sendCommandAndParseWithSchema(command, config, ListMotionsResponseSchema)
}

/**
 * Send a list_motions_with_ids command and return the parsed and validated response.
 */
export async function sendListMotionsWithIdsCommand(
	config: CharacterWorksConfig
): Promise<ListMotionsWithIdsResponse> {
	const command: ListMotionsWithIdsCommand = { action: 'list_motions_with_ids' }
	return sendCommandAndParseWithSchema(command, config, ListMotionsWithIdsResponseSchema)
}

/**
 * Send a list_layers command and return the parsed and validated response.
 */
export async function sendListLayersCommand(
	command: ListLayersCommand,
	config: CharacterWorksConfig
): Promise<ListLayersResponse> {
	return sendCommandAndParseWithSchema(command, config, ListLayersResponseSchema)
}

/**
 * Send a list_grid_names command and return the parsed and validated response.
 */
export async function sendListGridNamesCommand(
	config: CharacterWorksConfig
): Promise<ListGridNamesResponse> {
	const command: ListGridNamesCommand = { action: 'list_grid_names' }
	return sendCommandAndParseWithSchema(command, config, ListGridNamesResponseSchema)
}

/**
 * Send a list_grid_cells command and return the parsed and validated response.
 */
export async function sendListGridCellsCommand(
	command: ListGridCellsCommand,
	config: CharacterWorksConfig
): Promise<ListGridCellsResponse> {
	return sendCommandAndParseWithSchema(command, config, ListGridCellsResponseSchema)
}

/**
 * Send multiple commands in a batch as a JSON array.
 *
 * CharacterWorks supports sending an array of commands in a single request.
 */
export async function sendBatchCommands(
	commands: CharacterWorksCommand[],
	config: CharacterWorksConfig
): Promise<Response> {
	const url = `http://${config.host}:${config.port}/`

	const controller = new AbortController()
	const timeoutId = setTimeout(() => controller.abort(), 10_000) // 10s timeout

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(commands),
			signal: controller.signal,
		})

		clearTimeout(timeoutId)
		return response
	} catch (error) {
		clearTimeout(timeoutId)
		throw error
	}
}

/**
 * Send multiple commands in a batch and parse the response.
 *
 * Note: The response format may vary depending on the commands sent.
 * This function returns the raw parsed JSON response.
 */
export async function sendBatchCommandsWithResponses<T = unknown>(
	commands: CharacterWorksCommand[],
	config: CharacterWorksConfig
): Promise<T> {
	const response = await sendBatchCommands(commands, config)
	return parseResponse<T>(response)
}

