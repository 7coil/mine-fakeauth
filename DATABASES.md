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

## getPlayerFromToken(accessToken, clientToken)
Returns: Promise

Search the token database by the accessToken given. If the accessToken is correct, check (if it is provided) the clientToken with the token from the database. Then search the player database by the username in the record. Then resolve with the player details. If not, reject.

## getAccessToken(clientToken)
Returns: String or null

Search the token database by the clientToken given. If the clientToken is correct, return with the accessToken. If not, return null.

## setAccessToken(clientToken, accessToken, username)
Returns: Promise

Create or modify the token database with the data given. If it was successful, resolve, if not, reject.

## deleteTokensFromUser(username)
Returns: Promise

Search the token database for all records with the username. Delete them. Do not reject if there are no records.

## deleteTokenFromToken(accessToken)
Returns: Promise

Search the token database for the accessToken given. Delete the record. Reject if the record doesn't exist.