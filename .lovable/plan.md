# Redesign Job Details

## Implementation
- Move the Draft, Close Listing, and Active status actions into the page header beside Edit.
- Disable all header status actions while a listing update is pending.
- Replace the current two-column details layout with a project-style listing details card.
- Present description and requirements as matching side-by-side cards with the requested labels and empty states.

## Verification
- Run `bun run tsgo` and resolve any type errors caused by the update.
