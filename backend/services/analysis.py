import pandas as pd
import numpy as np
import os
from fairlearn.metrics import demographic_parity_difference

FILE_PATH = "uploads/data.csv"

def get_dataset_metrics():
    if not os.path.exists(FILE_PATH):
        return None
    
    df = pd.read_csv(FILE_PATH)
    
    # 1. Basic Info
    total_rows = len(df)
    total_cols = len(df.columns)
    
    # 2. Quality Metrics
    missing_values = int(df.isnull().sum().sum())
    duplicates = int(df.duplicated().sum())
    
    outliers = 0
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    if len(numeric_cols) > 0:
        z_scores = np.abs((df[numeric_cols] - df[numeric_cols].mean()) / df[numeric_cols].std(ddof=0))
        outliers = int((z_scores > 3).sum().sum())
    
    total_issues = missing_values + duplicates + outliers
    error_ratio = total_issues / (total_rows * total_cols) if total_rows > 0 else 1
    quality_score = max(0.0, min(100.0, 100.0 - (error_ratio * 500)))
    
    # 3. Bias Metrics
    sensitive_cols = [c for c in df.columns if str(c).lower() in ['gender', 'sex', 'race', 'ethnicity', 'age']]
    target_cols = [c for c in df.columns if df[c].nunique() == 2]
    
    bias_score = 100.0
    dp_diff = 0.0
    sensitive_col = "None"
    
    if sensitive_cols and target_cols:
        sensitive_col = sensitive_cols[0]
        target_col = target_cols[-1]
        y_true = pd.to_numeric(df[target_col], errors='coerce').fillna(0).astype(int)
        sensitive_features = df[sensitive_col].fillna("Unknown")
        dp_diff = demographic_parity_difference(y_true, y_true, sensitive_features=sensitive_features)
        bias_score = max(0.0, 100.0 - (dp_diff * 100.0))

    return {
        "overview": {
            "rows": total_rows,
            "columns": total_cols,
            "column_names": list(df.columns)
        },
        "quality": {
            "score": round(quality_score, 1),
            "missing_values": missing_values,
            "duplicates": duplicates,
            "outliers": outliers,
            "status": "Low Risk" if quality_score >= 90 else "Medium Risk" if quality_score >= 70 else "High Risk"
        },
        "bias": {
            "score": round(bias_score, 1),
            "dp_difference": round(dp_diff, 3),
            "sensitive_column": sensitive_col
        }
    }
