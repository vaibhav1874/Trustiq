from fastapi import APIRouter

router = APIRouter()

@router.post("/")
async def run_bias_detection():
    # Mock data structure to return
    return {
        "bias_score": 72.0,
        "demographic_parity": 0.85,
        "equal_opportunity": 0.90,
        "disparate_impact": 0.78,
        "issues": [
            "Gender bias detected: Male samples represent 82% of the dataset."
        ]
    }
