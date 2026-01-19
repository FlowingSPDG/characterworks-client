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
 * Parse a Response object to extract JSON data with type safety.
 *
 * @throws {Error} If the response is not OK or if JSON parsing fails
 */
export async function parseResponse<T>(response: Response): Promise<T> {
	if (!response.ok) {
		const text = await response.text()
		throw new Error(`HTTP ${response.status} ${response.statusText}: ${text}`)
	}

	try {
		return (await response.json()) as T
	} catch (error) {
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
 * Send a list_motions command and return the parsed response.
 */
export async function sendListMotionsCommand(
	config: CharacterWorksConfig
): Promise<ListMotionsResponse> {
	const command: ListMotionsCommand = { action: 'list_motions' }
	return sendCommandAndParse<ListMotionsResponse>(command, config)
}

/**
 * Send a list_motions_with_ids command and return the parsed response.
 */
export async function sendListMotionsWithIdsCommand(
	config: CharacterWorksConfig
): Promise<ListMotionsWithIdsResponse> {
	const command: ListMotionsWithIdsCommand = { action: 'list_motions_with_ids' }
	return sendCommandAndParse<ListMotionsWithIdsResponse>(command, config)
}

/**
 * Send a list_layers command and return the parsed response.
 */
export async function sendListLayersCommand(
	command: ListLayersCommand,
	config: CharacterWorksConfig
): Promise<ListLayersResponse> {
	return sendCommandAndParse<ListLayersResponse>(command, config)
}

/**
 * Send a list_grid_names command and return the parsed response.
 */
export async function sendListGridNamesCommand(
	config: CharacterWorksConfig
): Promise<ListGridNamesResponse> {
	const command: ListGridNamesCommand = { action: 'list_grid_names' }
	return sendCommandAndParse<ListGridNamesResponse>(command, config)
}

/**
 * Send a list_grid_cells command and return the parsed response.
 */
export async function sendListGridCellsCommand(
	command: ListGridCellsCommand,
	config: CharacterWorksConfig
): Promise<ListGridCellsResponse> {
	return sendCommandAndParse<ListGridCellsResponse>(command, config)
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

