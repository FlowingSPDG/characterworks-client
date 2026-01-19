/**
 * All command types example
 * 
 * This example demonstrates all available command types:
 * - Trigger commands (play, stop, finish, pause motions)
 * - Set text commands
 * - Activate grid commands
 */

import {
	sendCommand,
	createTriggerCommand,
	createSetTextCommand,
	createActivateGridCommand,
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

	// 2. Set Text Command
	await sendAndLog(
		'Set Text',
		createSetTextCommand('motion_name', 'text_layer', 'Hello World', 'preview'),
		config
	)

	// 3. Activate Grid Command
	await sendAndLog(
		'Activate Grid',
		createActivateGridCommand('grid_name', 0, 1),
		config
	)

	console.log('\n--- All commands sent ---')
}

main().catch((error) => {
	console.error('Fatal error:', error)
	process.exit(1)
})
