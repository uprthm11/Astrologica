AG PROMPT 7 — BACKEND INFRASTRUCTURE SERVICES
CONTEXT: Permanently eliminate Fracture 1 (sync LLM blocking), Fracture 3 (timezone drift), and Fracture 5 (direct Nominatim calls/Null Island).
OBJECTIVE: Build async LLM gateway, geocode proxy, timezone resolver, and generic SSE streamer.
ACTIONS:
1. Implement services/api/app/infra/llm_gateway.py with async Gemini/OpenAI providers and timeout handling.
2. Implement services/api/app/infra/geocode_service.py: POST /api/v1/geocode/search with Redis caching, 1 req/sec limit, and no 0,0 fallbacks.
3. Implement services/api/app/infra/timezone_service.py using TimezoneFinder server-side from lat/lon only.
4. Implement services/api/app/infra/sse.py for streaming response chunks.
5. Write unit tests including Los Angeles regression test (America/Los_Angeles) and geocode error handling.
ACCEPTANCE CRITERIA: All tests pass, zero synchronous network calls in async defs, geocode failure never returns 0,0.
