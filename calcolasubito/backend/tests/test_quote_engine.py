from decimal import Decimal

import pytest

from backend.quote_engine import QuoteSchema, RiskFactor, build_telemetry_log, calculate_quote


@pytest.mark.parametrize(
    ("base_value", "multiplier", "risk_factor", "expected"),
    [
        (120.0, "1.15", RiskFactor.medium, Decimal("138.00")),
        (180.0, "1.40", RiskFactor.high, Decimal("289.80")),
        (95.0, "1.05", RiskFactor.low, Decimal("94.76")),
    ],
)
def test_quote_scenarios_are_valid(base_value, multiplier, risk_factor, expected):
    result = calculate_quote(
        QuoteSchema(base_value=base_value, multiplier=multiplier, risk_factor=risk_factor)
    )

    assert result.final_quote == expected
    assert result.sanity_check_passed is True
    assert result.telemetry.request_signature.endswith(risk_factor.value)


def test_quote_rejects_values_below_sanity_floor():
    with pytest.raises(ValueError, match="Quote sanity check failed"):
        calculate_quote(QuoteSchema(base_value=20, multiplier="1.0", risk_factor=RiskFactor.low))


def test_telemetry_log_contains_contract_and_cmplike_payload():
    result = calculate_quote(
        QuoteSchema(base_value=120, multiplier="1.15", risk_factor=RiskFactor.medium)
    )

    log = build_telemetry_log(result)

    assert "quote-contract-v1" in log
    assert "\"sanity_check_passed\": true" in log
