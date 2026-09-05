"""
Generic Server-Sent Events (SSE) Streaming Infrastructure.
"""
import json
from typing import AsyncGenerator, Any, Optional
from fastapi.responses import StreamingResponse


def format_sse(data: Any, event: Optional[str] = None, retry: Optional[int] = None) -> str:
    """Format payload according to standard W3C Server-Sent Events specification."""
    buffer = []
    if retry is not None:
        buffer.append(f"retry: {retry}\n")
    if event:
        buffer.append(f"event: {event}\n")

    if isinstance(data, (dict, list)):
        payload = json.dumps(data)
    else:
        payload = str(data)

    for line in payload.splitlines():
        buffer.append(f"data: {line}\n")

    buffer.append("\n")
    return "".join(buffer)


async def sse_event_generator(
    source_generator: AsyncGenerator[Any, None],
    event_name: Optional[str] = None
) -> AsyncGenerator[str, None]:
    """Wraps an async generator into formatted SSE chunks."""
    async for chunk in source_generator:
        yield format_sse(chunk, event=event_name)


def create_sse_response(
    generator: AsyncGenerator[str, None],
    headers: Optional[dict] = None
) -> StreamingResponse:
    """Creates a StreamingResponse configured for real-time SSE streaming."""
    default_headers = {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
    }
    if headers:
        default_headers.update(headers)

    return StreamingResponse(
        generator,
        media_type="text/event-stream",
        headers=default_headers,
    )
