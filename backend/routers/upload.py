from fastapi import APIRouter, UploadFile, File

router = APIRouter()

@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    # Mock upload behavior
    return {"filename": file.filename, "status": "Uploaded successfully", "size_mb": 1.2}
