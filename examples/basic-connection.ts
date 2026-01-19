/**
 * Basic connection test example
 * 
 * This example demonstrates how to send a simple command to CharacterWorks
 * and verify the connection is working.
 */

import {
	sendCommand,
	createTriggerCommand,
	type CharacterWorksConfig,
} from '../src/index'

async function main() {
	// Configure CharacterWorks server
	const config: CharacterWorksConfig = {
		host: '127.0.0.1',
		port: 7000,
	}

	console.log('Testing connection to CharacterWorks...')
	console.log(`Target: http://${config.host}:${config.port}/`)

	try {
		// Create a simple trigger command
		const command = createTriggerCommand(
			'play_motions',
			'test_motion',
			'preview'
		)

		console.log('\nSending command:', JSON.stringify(command, null, 2))

		// Send the command
		const response = await sendCommand(command, config)

		console.log(`\nResponse status: ${response.status} ${response.statusText}`)
		
		if (response.ok) {
			console.log('✅ Connection successful!')
		} else {
			console.log('⚠️  Server responded with an error status')
			const text = await response.text()
			console.log('Response body:', text)
		}
	} catch (error) {
		if (error instanceof Error) {
			if (error.name === 'AbortError') {
				console.error('❌ Connection timeout (10s)')
				console.error('Make sure CharacterWorks is running and accessible')
			} else {
				console.error('❌ Connection failed:', error.message)
			}
		} else {
			console.error('❌ Unexpected error:', error)
		}
		process.exit(1)
	}
}

main()
