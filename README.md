# Captain Sonar

This is a React + Node.js implementation of the board game
[Captain Sonar](https://boardgamegeek.com/boardgame/171131/captain-sonar).

## Rules

Captain Sonar official rules available [here](https://www.matagot.com/IMG/pdf/SONAR_RULES_EN_lr.pdf).

This web version follows the rules very closely but has small deviations aiming to:

 - Adapt the game to a web browser
 - Allow the game to be played online, with people not next to you

## Developer's Notes

This version was written in less than a week - it's not the cleanest code.

The networking code is __extremely__ chatty. Ideally, the Server would only send "updates" to each Client,
but the quickest and easiest way to get the game up and running was to send the entire game
structure to every client every time anything changes. `¯\_(ツ)_/¯`

## Running "locally"

Both the UI and server can be run locally via

    npm run dev

The address for the web server is (currently) hardcoded in `src/App.js`.
