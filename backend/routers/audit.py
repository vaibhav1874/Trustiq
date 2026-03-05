from fastapi import APIRouter, HTTPException
import pandas as pd
import numpy as np
import os

router = APIRouter()

FILE_PATH = "uploads/data.csv"

@router.post("/")
async def run_audit():
    if not os.path.exists(FILE_PATH):
        raise HTTPException(status_code=400, detail="No dataset uploaded yet.")
    
    try:
        df = pd.read_csv(FILE_PATH)
        
        # 1. Missing Values
        missing_values = int(df.isnull().sum().sum())
        
        # 2. Duplicates
        duplicates = int(df.duplicated().sum())
        
        # 3. Outliers (using Z-score method for numeric columns)
        outliers = 0
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        if len(numeric_cols) > 0:
            # Drop NaN for zscore calculation
            z_scores = np.abs((df[numeric_cols] - df[numeric_cols].mean()) / df[numeric_cols].std(ddof=0))
            # Any value with z_score > 3 is an outlier
            outliers = int((z_scores > 3).sum().sum())

        total_rows = len(df)
        total_issues = missing_values + duplicates + outliers
        
        # Simple quality score heuristic out of 100
        # For small datasets every issue hurts more, for bigger ones we use ratios
        error_ratio = total_issues / (total_rows * len(df.columns)) if total_rows > 0 else 1
        score = max(0.0, min(100.0, 100.0 - (error_ratio * 500))) # Multiply by 500 to penalize quickly
        
        status = "Low Risk" if score >= 90 else "Medium Risk" if score >= 70 else "High Risk"
        
        return {
            "score": round(score, 1),
            "missing_values": missing_values,
            "duplicates": duplicates,
            "outliers": outliers,
            "status": status,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
