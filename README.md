# Vapor Friends List Plugin

[Vapor](https://github.com/scholtzm/vapor) plugin to manage friends list automatically.

### Features

- Accepts friend requests.
- Removes the oldest active friend if the friends list becomes full.
- Sends welcome message.

### Installation

1. Go to your Vapor folder.
2. Run `npm install git+https://github.com/scholtzm/vapor-friendslist.git`.
3. Open your config file and update `pluginOptions` to include settings for this plugin. It should look something like this:

```json
"pluginOptions": {
  "vapor-friendslist": {
    "limit": 100,
    "welcomeMessage": "Hello! Thanks for adding me."
  }
}
```

### Settings

#### `limit`

Friends list limit. Default value 100.

#### `welcomeMessage`

Welcome message text. This message is only sent if the message is a non-empty string.

### License

MIT. See `LICENSE`.
