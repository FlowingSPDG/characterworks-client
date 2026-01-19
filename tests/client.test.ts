import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import {
	sendCommand,
	parseResponse,
	sendCommandAndParse,
	sendBatchCommands,
	sendBatchCommandsWithResponses,
} from '../src/client'
import type { CharacterWorksCommand, CharacterWorksConfig } from '../src/types'

const config: CharacterWorksConfig = {
	host: '127.0.0.1',
	port: 7000,
}

const command: CharacterWorksCommand = {
	action: 'play_motions',
	motions: ['motion_1'],
	channel: 'preview',
}

describe('sendCommand', () => {
	const originalFetch = globalThis.fetch

	beforeEach(() => {
		const fetchMock = vi.fn(async () => {
			return {
				status: 200,
				statusText: 'OK',
			} as any
		})

		// @ts-expect-error - test-time monkey patch
		globalThis.fetch = fetchMock
	})

	afterEach(() => {
		globalThis.fetch = originalFetch
	})

	it('sends HTTP POST to CharacterWorks endpoint', async () => {
		const response = await sendCommand(command, config)

		expect(response.status).toBe(200)
	})

	it('sends correct URL', async () => {
		const fetchMock = vi.fn(async () => ({
			status: 200,
			statusText: 'OK',
		}))
		// @ts-expect-error - test-time monkey patch
		globalThis.fetch = fetchMock

		await sendCommand(command, config)

		expect(fetchMock).toHaveBeenCalledWith(
			`http://${config.host}:${config.port}/`,
			expect.objectContaining({
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(command),
			})
		)
	})
})

describe('parseResponse', () => {
	it('parses JSON response', async () => {
		const mockResponse = {
			ok: true,
			json: vi.fn(async () => ({ motions: ['motion1', 'motion2'] })),
		} as any

		const result = await parseResponse<{ motions: string[] }>(mockResponse)

		expect(result).toEqual({ motions: ['motion1', 'motion2'] })
		expect(mockResponse.json).toHaveBeenCalled()
	})

	it('throws error for non-OK response', async () => {
		const mockResponse = {
			ok: false,
			status: 404,
			statusText: 'Not Found',
			text: vi.fn(async () => 'Not found'),
		} as any

		await expect(parseResponse(mockResponse)).rejects.toThrow(
			'HTTP 404 Not Found: Not found'
		)
	})

	it('throws error for invalid JSON', async () => {
		const mockResponse = {
			ok: true,
			json: vi.fn(async () => {
				throw new Error('Invalid JSON')
			}),
		} as any

		await expect(parseResponse(mockResponse)).rejects.toThrow(
			'Failed to parse JSON response: Invalid JSON'
		)
	})
})

describe('sendCommandAndParse', () => {
	const originalFetch = globalThis.fetch

	beforeEach(() => {
		const fetchMock = vi.fn(async () => {
			return {
				ok: true,
				json: vi.fn(async () => ({ motions: ['motion1'] })),
			} as any
		})

		// @ts-expect-error - test-time monkey patch
		globalThis.fetch = fetchMock
	})

	afterEach(() => {
		globalThis.fetch = originalFetch
	})

	it('sends command and parses response', async () => {
		const result = await sendCommandAndParse<{ motions: string[] }>(
			command,
			config
		)

		expect(result).toEqual({ motions: ['motion1'] })
	})
})

describe('sendBatchCommands', () => {
	const originalFetch = globalThis.fetch

	beforeEach(() => {
		const fetchMock = vi.fn(async () => ({
			status: 200,
			statusText: 'OK',
		}))
		// @ts-expect-error - test-time monkey patch
		globalThis.fetch = fetchMock
	})

	afterEach(() => {
		globalThis.fetch = originalFetch
	})

	it('sends array of commands', async () => {
		const commands: CharacterWorksCommand[] = [
			{ action: 'list_motions' },
			{ action: 'list_grid_names' },
		]

		const response = await sendBatchCommands(commands, config)

		expect(response.status).toBe(200)
		expect(globalThis.fetch).toHaveBeenCalledWith(
			`http://${config.host}:${config.port}/`,
			expect.objectContaining({
				method: 'POST',
				body: JSON.stringify(commands),
			})
		)
	})
})

describe('sendBatchCommandsWithResponses', () => {
	const originalFetch = globalThis.fetch

	beforeEach(() => {
		const fetchMock = vi.fn(async () => ({
			ok: true,
			json: vi.fn(async () => [{ motions: ['motion1'] }]),
		}))
		// @ts-expect-error - test-time monkey patch
		globalThis.fetch = fetchMock
	})

	afterEach(() => {
		globalThis.fetch = originalFetch
	})

	it('sends batch commands and parses response', async () => {
		const commands: CharacterWorksCommand[] = [
			{ action: 'list_motions' },
		]

		const result = await sendBatchCommandsWithResponses<Array<{ motions: string[] }>>(
			commands,
			config
		)

		expect(result).toEqual([{ motions: ['motion1'] }])
	})
})

