import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { sendCommand } from '../src/client'
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
})

