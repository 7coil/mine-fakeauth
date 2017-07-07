# mine-fakeauth
A https server to fake Minecraft's authentication server.

## Errors not implemented

- *"Invalid credentials. Account migrated, use e-mail as username."*
  We don't check for this as we don't migrate accounts.
- *"Invalid credentials." (due to too many login attempts)*
  Ratelimiting not implemented yet, we haven't been attacked.
- *"Access token already has a profile assigned."*
  We don't deal with profiles, I don't think they're implemented in the reference implementation anyway.
- *"credentials is null "*
  To do: implement null checks?
- *"Unsupported Media Type"*
  To do: implement media type checks?