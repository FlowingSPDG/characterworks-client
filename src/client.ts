import type { CharacterWorksCommand, CharacterWorksConfig } from './types'

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

