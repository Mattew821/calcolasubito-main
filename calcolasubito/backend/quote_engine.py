from __future__ import annotations

import json
from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP
from enum import Enum
from typing import Any
from uuid import uuid4

from pydantic import BaseModel, ConfigDict, Field, field_validator

SANITY_FLOOR = Decimal("90.00")
QUOTE_CONTRACT_VERSION = "quote-contract-v1"


class RiskFactor(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class QuoteSchema(BaseModel):
    base_value: float = Field(gt=0)
    multiplier: Decimal = Field(gt=Decimal("0"))
    risk_factor: RiskFactor

    @field_validator("multiplier", mode="before")
    @classmethod
    def parse_multiplier(cls, value: object) -> Decimal:
        return Decimal(str(value))


class QuoteTelemetry(BaseModel):
    calculation_id: str
    complexity: str
    request_signature: str
    sanity_floor: Decimal
    sanity_check_passed: bool
    created_at: str

    model_config = ConfigDict(use_enum_values=True)


class QuoteResult(BaseModel):
    contract_version: str
    input_echo: QuoteSchema
    risk_adjustment: Decimal
    final_quote: Decimal
    sanity_floor: Decimal
    sanity_check_passed: bool
    telemetry: QuoteTelemetry

    model_config = ConfigDict(use_enum_values=True)


RISK_ADJUSTMENTS: dict[RiskFactor, Decimal] = {
    RiskFactor.low: Decimal("0.95"),
    RiskFactor.medium: Decimal("1.00"),
    RiskFactor.high: Decimal("1.15"),
}


def _round_to_cents(value: Decimal) -> Decimal:
    return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def _request_signature(request: QuoteSchema) -> str:
    return f"{request.base_value}:{request.multiplier}:{request.risk_factor.value}"


def calculate_quote(request: QuoteSchema) -> QuoteResult:
    risk_adjustment = RISK_ADJUSTMENTS[request.risk_factor]
    final_quote = _round_to_cents(Decimal(str(request.base_value)) * request.multiplier * risk_adjustment)

    sanity_check_passed = final_quote >= SANITY_FLOOR
    if not sanity_check_passed:
        raise ValueError(f"Quote sanity check failed: {final_quote} < {SANITY_FLOOR}")

    telemetry = QuoteTelemetry(
        calculation_id=f"quote-{uuid4().hex}",
        complexity="O(1)",
        request_signature=_request_signature(request),
        sanity_floor=SANITY_FLOOR,
        sanity_check_passed=sanity_check_passed,
        created_at=datetime.now(timezone.utc).isoformat(),
    )

    return QuoteResult(
        contract_version=QUOTE_CONTRACT_VERSION,
        input_echo=request,
        risk_adjustment=risk_adjustment,
        final_quote=final_quote,
        sanity_floor=SANITY_FLOOR,
        sanity_check_passed=sanity_check_passed,
        telemetry=telemetry,
    )


def build_telemetry_log(result: QuoteResult) -> str:
    payload: dict[str, Any] = {
        "contract_version": result.contract_version,
        "telemetry": result.telemetry.model_dump(mode="json"),
        "final_quote": str(result.final_quote),
        "sanity_check_passed": result.sanity_check_passed,
    }
    return json.dumps(payload, ensure_ascii=False)
