# Tables

All fields (currently) are text, you may add more for statistics if needed (e.g. account creation date).

## Player table spec
- Username (indexed, unique)
- Password (hashed + salt)
- ProfileID (uuid v4, generated on player creation)

## Token table spec
- Client Token (indexed, unique)
- Access Token (indexed, unique)
- Username (indexed)

# API Implementation

## getPlayerFromLogin(username, password)
Returns: Promise

Search the player database by the username given. If the username exists and the password is correct (please use secure hashes!) resolve with the record details. If not, reject.

## getPlayerFromToken(accessToken)
Returns: Promise

Search the token database by the accessToken given. If the accessToken is correct, search the player database by the username in the record. Then resolve with the player details. If not, reject.

## getAccessToken(clientToken)
Returns: String or null

Search the token database by the clientToken given. If the clientToken is correct, resolve with the accessToken. If not, return null.

## setAccessToken(clientToken, accessToken, username)
Returns: Promise

Create or modify the token database with the data given. If it was successful, resolve, if not, reject.