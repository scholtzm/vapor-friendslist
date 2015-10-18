[![NPM version](http://img.shields.io/npm/v/vapor-friendslist.svg?style=flat)](https://www.npmjs.org/package/vapor-friendslist)

# Vapor Friends List Plugin

[Vapor](https://github.com/scholtzm/vapor) plugin to manage friends list automatically.

### Features

- Accepts friend requests.
- Removes the oldest friend if the friends list becomes full.
- Sends welcome message.
- Provides custom events for other plugins to listen to.
- Admins are protected from being auto-removed

### Installation

```sh
npm install vapor-friendslist
```

### Usage

```js
var friendslist = require('vapor-friendslist');

// Instantiate Vapor etc.

vapor.use(friendslist);
// or
vapor.use(friendslist, {
    limit: 100,
    welcomeMessage: 'Hello! Thanks for adding me.',
    welcomeMessageDelay: 3000
});
```

### Configuration

#### `limit` (optional)

Friends list limit. Default value: `100`

#### `welcomeMessage` (optional)

Welcome message text. Default value: `undefined`

#### `welcomeMessageDelay` (optional)

Welcome message delay in milliseconds. Default value: `3000` (3 seconds).

### Events

#### `message:*`

* `message` - A message string.

Standard [Vapor message events](https://github.com/scholtzm/vapor/blob/master/docs/EVENTS.md#message) to be used with logger.

#### `readFile` / `writeFile`

Standard Vapor file events - [`readFile`](https://github.com/scholtzm/vapor/blob/master/docs/EVENTS.md#readfile) / [`writeFile`](https://github.com/scholtzm/vapor/blob/master/docs/EVENTS.md#writefile).

#### `friendAccepted`

* steamID - user's SteamID64 as string

Friend request has been accepted.

#### `friendRemoved`

* steamID - user's SteamID64 as string

Friend has been removed from friends list because the limit has been reached.

### License

MIT. See `LICENSE`.
