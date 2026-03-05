from fastapi import APIRouter

router = APIRouter()

@router.post("/")
async def run_audit():
    # Mock data structure to return
    return {
        "score": 85.5,
        "missing_values": 12,
        "duplicates": 3,
        "outliers": 5,
        "status": "Medium Risk",
    }
