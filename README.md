# Eventi #

A Discord bot which expands the built-in Event function for large communities.

To build, Eventi requires a Discord Application token from the Discord Developer Portal and a Google Calendar synth account added to the .env file. Also requires a MongoDB database.

Run with `npm run test`

## Features: ##
**Create events through slash command**
- Allows users to create events with slash command, removing the need for role assignment which can manage events

**Event organizers**
- Allows assignment of event organizers so that multiple people can manage the same event

**Event threads**
- Automatically links event threads for every event for easy concurrent planning of multiple events

**TODO: Mass DM**
- Allows event organizers to DM all participants of an event through Eventi

**TODO: Event timers**
- Alerts event participants at a set interval before the event like a calendar

**Calendar integration**
- Automatically syncs server events to a server Google calendar
