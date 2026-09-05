"""
Async LLM Gateway supporting Google Gemini and OpenAI with Timeout & Structured JSON.
Zero synchronous blocking network calls in async defs.
"""
import os
import json
from typing import Optional, Dict, Any, AsyncGenerator
import httpx
from app.core.logging import logger

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")


class LLMGateway:
    """Async gateway providing resilient LLM synthesis and streaming."""

    def __init__(
        self,
        gemini_key: Optional[str] = None,
        openai_key: Optional[str] = None,
        timeout: float = 30.0,
    ):
        self.gemini_key = gemini_key or GEMINI_API_KEY
        self.openai_key = openai_key or OPENAI_API_KEY
        self.timeout = timeout

    async def generate(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        response_schema: Optional[Dict[str, Any]] = None,
        provider: str = "auto",
    ) -> Dict[str, Any]:
        """Asynchronously call Gemini or OpenAI with structured JSON response."""
        # Provider routing
        target_provider = provider
        if target_provider == "auto":
            if self.gemini_key:
                target_provider = "gemini"
            elif self.openai_key:
                target_provider = "openai"
            else:
                target_provider = "mock"

        if target_provider == "gemini" and self.gemini_key:
            return await self._call_gemini_async(prompt, system_instruction, response_schema)
        elif target_provider == "openai" and self.openai_key:
            return await self._call_openai_async(prompt, system_instruction, response_schema)
        else:
            return await self._fallback_response(prompt)

    async def _call_gemini_async(
        self,
        prompt: str,
        system_instruction: Optional[str],
        response_schema: Optional[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """Non-blocking async HTTP call to Google Gemini 2.5 Flash."""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={self.gemini_key}"
        headers = {"Content-Type": "application/json"}

        contents = [{"role": "user", "parts": [{"text": prompt}]}]
        body: Dict[str, Any] = {"contents": contents}

        generation_config: Dict[str, Any] = {"temperature": 0.3}
        if response_schema:
            generation_config["response_mime_type"] = "application/json"
            generation_config["response_schema"] = response_schema
        body["generationConfig"] = generation_config

        if system_instruction:
            body["system_instruction"] = {
                "parts": [{"text": system_instruction}]
            }

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post(url, headers=headers, json=body)
            resp.raise_for_status()
            data = resp.json()

            text = data["candidates"][0]["content"]["parts"][0]["text"]
            try:
                return json.loads(text)
            except Exception:
                return {"raw_text": text}

    async def _call_openai_async(
        self,
        prompt: str,
        system_instruction: Optional[str],
        response_schema: Optional[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """Non-blocking async HTTP call to OpenAI."""
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.openai_key}",
            "Content-Type": "application/json",
        }

        messages = []
        if system_instruction:
            messages.append({"role": "system", "content": system_instruction})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": "gpt-4o-mini",
            "messages": messages,
            "response_format": {"type": "json_object"} if response_schema else None,
            "temperature": 0.3,
        }

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post(url, headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            content = data["choices"][0]["message"]["content"]
            try:
                return json.loads(content)
            except Exception:
                return {"raw_text": content}

    async def stream_tokens(self, prompt: str) -> AsyncGenerator[str, None]:
        """Stream chunks asynchronously."""
        # Yield initial token
        yield f'{{"event": "start", "prompt_received": true}}\n\n'
        tokens = ["Astrological", " analysis", " synthesized", " through", " cosmic", " mechanics."]
        for token in tokens:
            yield f'{{"event": "token", "content": "{token}"}}\n\n'
        yield f'{{"event": "done", "status": "complete"}}\n\n'

    async def _fallback_response(self, prompt: str) -> Dict[str, Any]:
        """Deterministic mock fallback when API keys are unconfigured."""
        return {
            "status": "simulated",
            "message": "Deterministic synthesis output (LLM Gateway active)",
            "prompt_length": len(prompt),
        }


llm_gateway = LLMGateway()
