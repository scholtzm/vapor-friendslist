# Vapor Friends List Plugin

[Vapor](https://github.com/scholtzm/vapor) plugin to manage friends list automatically.

### Features

- Accepts friend requests.
- Removes the oldest friend if the friends list becomes full.
- Sends welcome message.

### Installation

1. Go to your Vapor folder.
2. Run `npm install git+https://github.com/scholtzm/vapor-friendslist.git`.
3. Open your config file and update `plugins` to include settings for this plugin. It should look something like this...

```json
"plugins": {
  "vapor-friendslist": {}
}
```

... or like this ...


```json
"plugins": {
  "vapor-friendslist": {
    "limit": 100,
    "welcomeMessage": "Hello! Thanks for adding me.",
    "welcomeMessageDelay": 3000
  }
}
```

### Settings

#### `limit` (optional)

Friends list limit. Default value: `100`

#### `welcomeMessage` (optional)

Welcome message text. Default value: `undefined`

#### `welcomeMessageDelay` (optional)

Welcome message delay in milliseconds. Default value: `3000` (3 seconds).

### Events

#### `friendAccepted`

* steamID - user's SteamID64 as string

Friend request has been accepted.

#### `friendRemoved`

* steamID - user's SteamID64 as string

Friend has been removed from friends list because the limit has been reached.

### License

MIT. See `LICENSE`.
