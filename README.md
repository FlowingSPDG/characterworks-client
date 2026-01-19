# CharacterWorks HTTP Client (`characterworks-client`)

[![npm version](https://img.shields.io/npm/v/characterworks-client.svg)](https://www.npmjs.com/package/characterworks-client)

TypeScript HTTP client for controlling [CharacterWorks](https://chrworks.com/) from Node.js and related tools.

This library is extracted from the Stream Deck plugin so it can be reused by other tools (Companion modules, CLIs, bespoke automation, etc.).

## Installation

```bash
npm install characterworks-client
```

📦 [npm package](https://www.npmjs.com/package/characterworks-client)

## Quick start

```ts
import {
	sendCommand,
	createTriggerCommand,
	type CharacterWorksConfig,
} from 'characterworks-client'

const config: CharacterWorksConfig = {
	host: '127.0.0.1',
	port: 7000,
}

const command = createTriggerCommand('play_motions', 'motion_1,motion_2', 'preview')

await sendCommand(command, config)
```

## API surface

From `characterworks-client` you can import:

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


## Development

```bash
npm install
npm run lint
npm test
npm run build
```
