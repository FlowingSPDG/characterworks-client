import { describe, it, expect } from 'vitest'

import {
	createTriggerCommand,
	createSetTextCommand,
	createActivateGridCommand,
} from '../src/commands'

describe('createTriggerCommand', () => {
	it('splits and trims motion names', () => {
		const cmd = createTriggerCommand('play_motions', ' a , b , , c ', 'preview')

		expect(cmd).toEqual({
			action: 'play_motions',
			motions: ['a', 'b', 'c'],
			channel: 'preview',
		})
	})
})

describe('createSetTextCommand', () => {
	it('builds CW layer path from motion and layer', () => {
		const cmd = createSetTextCommand(' motion ', ' layer ', 'value', 'live1')

		expect(cmd).toEqual({
			action: 'set_text',
			layer: 'motion\\layer',
			value: 'value',
			channel: 'live1',
		})
	})
})

describe('createActivateGridCommand', () => {
	it('creates grid cell command', () => {
		const cmd = createActivateGridCommand('gridA', 1, 2)

		expect(cmd).toEqual({
			action: 'activate_grid_cell',
			grid: 'gridA',
			cell: [1, 2],
		})
	})
})

