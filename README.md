# Vapor Friends List Plugin

[Vapor](https://github.com/scholtzm/vapor) plugin to manage friends list automatically.

### Features

- Accepts friend requests.
- Removes the oldest active friend if the friends list becomes full.
- Sends welcome message.

### Settings

See "sample.config.json" for these options.

#### `limit`

Friends list limit. Default value 100.

#### `welcomeMessage`

Welcome message text. This message is only sent if the message is a non-empty string.

### Installation

1. Go to plugins folder in Vapor.
2. Run `https://github.com/scholtzm/vapor-friendslist.git`.
3. Copy "sample.config.json" and rename it to "config.json".
4. Edit "config.json" you just created.

### License

MIT. See `LICENSE`.
