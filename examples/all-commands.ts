/**
 * All command types example
 * 
 * This example demonstrates all available command types:
 * - Trigger commands (play, stop, finish, pause, eject, resume, restart, finish_and_restart motions)
 * - Set text commands
 * - Activate grid commands
 * - Query commands (list_motions, list_layers, list_grid_names, list_grid_cells)
 * - Batch commands
 */

import {
	sendCommand,
	sendCommandAndParse,
	sendListMotionsCommand,
	sendListMotionsWithIdsCommand,
	sendListLayersCommand,
	sendListGridNamesCommand,
	sendListGridCellsCommand,
	sendBatchCommandsWithResponses,
	createTriggerCommand,
	createEjectMotionsCommand,
	createResumeMotionsCommand,
	createRestartMotionsCommand,
	createFinishAndRestartMotionsCommand,
	createSetTextCommand,
	createActivateGridCommand,
	createListLayersCommand,
	createListGridCellsCommand,
	type CharacterWorksConfig,
} from '../src/index'

async function sendAndLog(
	commandName: string,
	command: any,
	config: CharacterWorksConfig
) {
	console.log(`\n--- ${commandName} ---`)
	console.log('Command:', JSON.stringify(command, null, 2))

	try {
		const response = await sendCommand(command, config)
		console.log(`Status: ${response.status} ${response.statusText}`)
		
		if (response.ok) {
			console.log('✅ Success')
		} else {
			const text = await response.text()
			console.log('⚠️  Error response:', text)
		}
	} catch (error) {
		if (error instanceof Error) {
			console.error('❌ Failed:', error.message)
		} else {
			console.error('❌ Unexpected error:', error)
		}
	}
}

async function main() {
	const config: CharacterWorksConfig = {
		host: '127.0.0.1',
		port: 7000,
	}

	console.log('CharacterWorks Client - All Commands Example')
	console.log(`Target: http://${config.host}:${config.port}/`)

	// 1. Trigger Commands
	await sendAndLog(
		'Play Motions',
		createTriggerCommand('play_motions', 'motion_1,motion_2', 'preview'),
		config
	)

	await sendAndLog(
		'Stop Motions',
		createTriggerCommand('stop_motions', 'motion_1', 'live1'),
		config
	)

	await sendAndLog(
		'Finish Motions',
		createTriggerCommand('finish_motions', 'motion_1', 'live2'),
		config
	)

	await sendAndLog(
		'Pause Motions',
		createTriggerCommand('pause_motions', 'motion_1', 'preview'),
		config
	)

	await sendAndLog(
		'Eject Motions',
		createEjectMotionsCommand('motion_1', 'preview'),
		config
	)

	await sendAndLog(
		'Resume Motions',
		createResumeMotionsCommand('motion_1', 'preview'),
		config
	)

	await sendAndLog(
		'Restart Motions',
		createRestartMotionsCommand('motion_1', 'preview'),
		config
	)

	await sendAndLog(
		'Finish and Restart Motions',
		createFinishAndRestartMotionsCommand('motion_1', 'preview'),
		config
	)

	// Trigger command with motion_ids
	await sendAndLog(
		'Play Motions with IDs',
		createTriggerCommand('play_motions', 'motion_1', 'preview', ['id1', 'id2']),
		config
	)

	// 2. Set Text Command
	await sendAndLog(
		'Set Text (old signature)',
		createSetTextCommand('motion_name', 'text_layer', 'Hello World', 'preview'),
		config
	)

	await sendAndLog(
		'Set Text (new signature with layer path)',
		createSetTextCommand('motion_name\\text_layer', 'Hello World', 'preview'),
		config
	)

	await sendAndLog(
		'Set Text with layer_id',
		createSetTextCommand('layer', 'Hello World', 'preview', ['id1', 'id2']),
		config
	)

	// 3. Activate Grid Command
	await sendAndLog(
		'Activate Grid',
		createActivateGridCommand('grid_name', 0, 1),
		config
	)

	await sendAndLog(
		'Activate Grid with channel',
		createActivateGridCommand('grid_name', 0, 1, 'preview'),
		config
	)

	// 4. Query Commands (with parsed responses)
	console.log('\n--- Query Commands (with parsed responses) ---')

	try {
		console.log('\n--- List Motions ---')
		const motionsResponse = await sendListMotionsCommand(config)
		console.log('Motions:', JSON.stringify(motionsResponse.motions, null, 2))
	} catch (error) {
		if (error instanceof Error) {
			console.error('❌ Failed:', error.message)
		}
	}

	try {
		console.log('\n--- List Motions with IDs ---')
		const motionsWithIdsResponse = await sendListMotionsWithIdsCommand(config)
		console.log('Motions with IDs:', JSON.stringify(motionsWithIdsResponse.motions, null, 2))
	} catch (error) {
		if (error instanceof Error) {
			console.error('❌ Failed:', error.message)
		}
	}

	try {
		console.log('\n--- List Layers ---')
		const layersCommand = createListLayersCommand()
		const layersResponse = await sendListLayersCommand(layersCommand, config)
		console.log('Layers:', JSON.stringify(layersResponse, null, 2))
	} catch (error) {
		if (error instanceof Error) {
			console.error('❌ Failed:', error.message)
		}
	}

	try {
		console.log('\n--- List Layers (with parent) ---')
		const layersCommandWithParent = createListLayersCommand({
			parent: 'parent\\path',
			channel: 'preview',
		})
		const layersResponseWithParent = await sendListLayersCommand(layersCommandWithParent, config)
		console.log('Layers:', JSON.stringify(layersResponseWithParent, null, 2))
	} catch (error) {
		if (error instanceof Error) {
			console.error('❌ Failed:', error.message)
		}
	}

	try {
		console.log('\n--- List Grid Names ---')
		const gridNamesResponse = await sendListGridNamesCommand(config)
		console.log('Grid Names:', JSON.stringify(gridNamesResponse.grids, null, 2))
	} catch (error) {
		if (error instanceof Error) {
			console.error('❌ Failed:', error.message)
		}
	}

	try {
		console.log('\n--- List Grid Cells ---')
		const gridCellsCommand = createListGridCellsCommand('Grid1')
		const gridCellsResponse = await sendListGridCellsCommand(gridCellsCommand, config)
		console.log('Grid Cells:', JSON.stringify(gridCellsResponse, null, 2))
	} catch (error) {
		if (error instanceof Error) {
			console.error('❌ Failed:', error.message)
		}
	}

	// 5. Batch Commands
	console.log('\n--- Batch Commands ---')
	try {
		const batchResponse = await sendBatchCommandsWithResponses(
			[
				createTriggerCommand('play_motions', 'motion_1', 'preview'),
				createSetTextCommand('motion\\layer', 'Batch Test', 'preview'),
			],
			config
		)
		console.log('Batch Response:', JSON.stringify(batchResponse, null, 2))
	} catch (error) {
		if (error instanceof Error) {
			console.error('❌ Failed:', error.message)
		}
	}

	console.log('\n--- All commands sent ---')
}

main().catch((error) => {
	console.error('Fatal error:', error)
	process.exit(1)
})
