AG PROMPT 14 — SHARED ONBOARDING PRIMITIVES
CONTEXT: Prevent invalid dates (Feb 31) and client-side Nominatim/timezone bugs.
OBJECTIVE: Build validated inputs in packages/ui-kit backed by backend proxy.
ACTIONS:
1. Build BirthDateTimeInput enforcing calendar limits dynamically (leap years, month days).
2. Build LocationSearchInput calling POST /api/v1/geocode/search exclusively, emitting { lat, lon, locationName } only.
3. Ensure no component uses timezones[0] or sets coordinates to 0,0 on failure.
4. Add unit tests for leap years (Feb 29/28) and backend-only proxy requests.
ACCEPTANCE CRITERIA: Leap year tests pass, zero external geocode calls from client, zero timezones[0] references.
