"""
Core Service Interface for mbti-checker.
"""
from typing import Dict, Any


class MbtiCheckerService:
    """Plugin service scaffold for mbti-checker."""

    def __init__(self):
        self.module_name = "mbti-checker"
        self.implemented = False

    async def calculate(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculation stub returning 501 until domain logic implemented."""
        raise NotImplementedError(f"Computation for mbti-checker is not yet implemented.")


service = MbtiCheckerService()
