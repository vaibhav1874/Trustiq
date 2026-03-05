from fastapi import APIRouter, UploadFile, File
import shutil
import os

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
FILE_PATH = os.path.join(UPLOAD_DIR, "data.csv")

@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    # Save the uploaded file to a known location so other endpoints can access it
    with open(FILE_PATH, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    file_size_mb = os.path.getsize(FILE_PATH) / (1024 * 1024)
    
    return {
        "filename": file.filename, 
        "status": "Uploaded successfully", 
        "size_mb": round(file_size_mb, 2)
    }
