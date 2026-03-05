from fastapi import APIRouter
import random

router = APIRouter()

@router.post("/")
async def run_simulation():
    # Mock data structure to return
    risk_level = random.choice(["Low", "Medium", "High", "Critical"])
    return {
        "overall_risk_score": random.randint(10, 95),
        "risk_category": risk_level,
        "simulated_scenarios": [
            {"name": "Adversarial Attack", "impact": "High Risk"},
            {"name": "Data Drift", "impact": "Medium Risk"},
            {"name": "Edge Case Input", "impact": "Low Risk"}
        ],
        "explanation": "Simulated 10,000 edge cases. Discovered model instability under adversarial conditions."
    }
