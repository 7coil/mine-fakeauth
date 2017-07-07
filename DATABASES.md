All fields (currently) are text, you may add more for statistics if needed (e.g. account creation date).

## Player table spec
- Username (indexed, unique)
- Password (hashed + salt)
- ProfileID (uuid v4, generated on player creation)

## Token table spec
- Client Token (indexed, unique)
- Access Token
- Username