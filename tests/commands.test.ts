import { describe, it, expect } from 'vitest'

import {
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

	it('includes motion_ids when provided', () => {
		const cmd = createTriggerCommand(
			'play_motions',
			' a , b ',
			'preview',
			['id1', 'id2']
		)

		expect(cmd).toEqual({
			action: 'play_motions',
			motions: ['a', 'b'],
			motion_ids: ['id1', 'id2'],
			channel: 'preview',
		})
	})

	it('does not include motion_ids when empty', () => {
		const cmd = createTriggerCommand('play_motions', ' a , b ', 'preview', [])

		expect(cmd).not.toHaveProperty('motion_ids')
	})
})

describe('createEjectMotionsCommand', () => {
	it('creates eject_motions command', () => {
		const cmd = createEjectMotionsCommand('motion1,motion2', 'live1')

		expect(cmd).toEqual({
			action: 'eject_motions',
			motions: ['motion1', 'motion2'],
			channel: 'live1',
		})
	})
})

describe('createResumeMotionsCommand', () => {
	it('creates resume_motions command', () => {
		const cmd = createResumeMotionsCommand('motion1', 'live2')

		expect(cmd).toEqual({
			action: 'resume_motions',
			motions: ['motion1'],
			channel: 'live2',
		})
	})
})

describe('createRestartMotionsCommand', () => {
	it('creates restart_motions command', () => {
		const cmd = createRestartMotionsCommand('motion1', 'preview')

		expect(cmd).toEqual({
			action: 'restart_motions',
			motions: ['motion1'],
			channel: 'preview',
		})
	})
})

describe('createFinishAndRestartMotionsCommand', () => {
	it('creates finish_and_restart_motions command', () => {
		const cmd = createFinishAndRestartMotionsCommand('motion1', 'live1')

		expect(cmd).toEqual({
			action: 'finish_and_restart_motions',
			motions: ['motion1'],
			channel: 'live1',
		})
	})
})

describe('createSetTextCommand', () => {
	it('builds CW layer path from motion and layer (old signature)', () => {
		const cmd = createSetTextCommand(' motion ', ' layer ', 'value', 'live1')

		expect(cmd).toEqual({
			action: 'set_text',
			layer: 'motion\\layer',
			value: 'value',
			channel: 'live1',
		})
	})

	it('uses direct layer path (new signature)', () => {
		const cmd = createSetTextCommand('motion\\layer', 'value', 'live1')

		expect(cmd).toEqual({
			action: 'set_text',
			layer: 'motion\\layer',
			value: 'value',
			channel: 'live1',
		})
	})

	it('includes layer_id when provided', () => {
		const cmd = createSetTextCommand('layer', 'value', 'live1', ['id1', 'id2'])

		expect(cmd).toEqual({
			action: 'set_text',
			layer: 'layer',
			layer_id: ['id1', 'id2'],
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

	it('includes channel when provided', () => {
		const cmd = createActivateGridCommand('gridA', 1, 2, 'preview')

		expect(cmd).toEqual({
			action: 'activate_grid_cell',
			grid: 'gridA',
			cell: [1, 2],
			channel: 'preview',
		})
	})
})

describe('createListMotionsCommand', () => {
	it('creates list_motions command', () => {
		const cmd = createListMotionsCommand()

		expect(cmd).toEqual({
			action: 'list_motions',
		})
	})
})

describe('createListMotionsWithIdsCommand', () => {
	it('creates list_motions_with_ids command', () => {
		const cmd = createListMotionsWithIdsCommand()

		expect(cmd).toEqual({
			action: 'list_motions_with_ids',
		})
	})
})

describe('createListLayersCommand', () => {
	it('creates list_layers command without options', () => {
		const cmd = createListLayersCommand()

		expect(cmd).toEqual({
			action: 'list_layers',
		})
	})

	it('creates list_layers command with options', () => {
		const cmd = createListLayersCommand({
			parent: 'parent\\path',
			parent_id: ['id1', 'id2'],
			channel: 'preview',
		})

		expect(cmd).toEqual({
			action: 'list_layers',
			parent: 'parent\\path',
			parent_id: ['id1', 'id2'],
			channel: 'preview',
		})
	})
})

describe('createListGridNamesCommand', () => {
	it('creates list_grid_names command', () => {
		const cmd = createListGridNamesCommand()

		expect(cmd).toEqual({
			action: 'list_grid_names',
		})
	})
})

describe('createListGridCellsCommand', () => {
	it('creates list_grid_cells command', () => {
		const cmd = createListGridCellsCommand('Grid1')

		expect(cmd).toEqual({
			action: 'list_grid_cells',
			grid: 'Grid1',
		})
	})
})

