# CharacterWorks HTTP Client (`@streamdeckcw/characterworks-client`)

TypeScript HTTP client for controlling [CharacterWorks](https://chrworks.com/) from Node.js and related tools.

This library is extracted from the Stream Deck plugin so it can be reused by other tools (Companion modules, CLIs, bespoke automation, etc.).

## Installation

```bash
npm install @streamdeckcw/characterworks-client
```

## Quick start

```ts
import {
	sendCommand,
	createTriggerCommand,
	type CharacterWorksConfig,
} from '@streamdeckcw/characterworks-client'

const config: CharacterWorksConfig = {
	host: '127.0.0.1',
	port: 7000,
}

const command = createTriggerCommand('play_motions', 'motion_1,motion_2', 'preview')

await sendCommand(command, config)
```

## API surface

From `@streamdeckcw/characterworks-client` you can import:

- Types:
  - `CharacterWorksConfig`
  - `CharacterWorksChannel`
  - `TriggerAction`
  - `TriggerCommand`
  - `SetTextCommand`
  - `ActivateGridCommand`
  - `CharacterWorksCommand`
- Command helpers:
  - `createTriggerCommand(action, motionNames, channel)`
  - `createSetTextCommand(motionName, textLayer, value, channel)`
  - `createActivateGridCommand(gridName, row, column)`
- Transport:
  - `sendCommand(command, config)` – POSTs JSON to `http://host:port/` with a 10s timeout.

## Runtime support

- Node.js `>= 20` with global `fetch` available.
- The package ships ESM (`dist/index.mjs`) and CommonJS (`dist/index.cjs`) bundles, plus TypeScript declarations.

## Usage in Stream Deck plugins

This library is designed to work seamlessly with Stream Deck plugins built with `@elgato/streamdeck`:

```ts
import { action, KeyDownEvent, SingletonAction } from '@elgato/streamdeck'
import streamDeck from '@elgato/streamdeck'
import {
	sendCommand,
	createTriggerCommand,
	type CharacterWorksConfig,
	type CharacterWorksChannel,
	type TriggerAction,
} from '@streamdeckcw/characterworks-client'

@action({ UUID: 'your-action-uuid' })
export class YourAction extends SingletonAction<{ host: string; port: number }> {
	override async onKeyDown(ev: KeyDownEvent<{ host: string; port: number }>): Promise<void> {
		const { host, port } = ev.payload.settings

		try {
			const command = createTriggerCommand('play_motions', 'motion_1', 'preview')
			const response = await sendCommand(command, { host, port })

			streamDeck.logger.debug(`Status: ${response.status}`)
		} catch (error) {
			streamDeck.logger.error(`Error: ${(error as Error).message}`)
		}
	}
}
```

### Bundling considerations

When using Rollup or similar bundlers in your Stream Deck plugin:

- The library is already bundled as ESM/CJS, so you can mark it as external in your bundler config.
- TypeScript types are included, so you get full type safety.
- No additional runtime dependencies are required (uses Node.js built-in `fetch`).

## Development

```bash
npm install
npm run lint
npm test
npm run build
```

## Releasing

Releases are intended to be automated from Git tags via GitHub Actions:

1. Bump the version in `package.json` (for example using `npm version patch`).
2. Push the commit and tag: `git push && git push --tags`.
3. A GitHub Actions workflow (see `.github/workflows/release.yml`) will build and publish to npm when a tag like `v0.1.0` is pushed.

Make sure to configure the `NPM_TOKEN` secret in the GitHub repository settings before tagging a release.

