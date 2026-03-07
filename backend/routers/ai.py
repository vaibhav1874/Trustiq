from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.rag_engine import rag_engine
from services.analysis import get_dataset_metrics
from fastapi.responses import JSONResponse, Response

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    dataset_context: str = ""

class ExplainRequest(BaseModel):
    metrics: dict

class SchemaRequest(BaseModel):
    prompt: str

@router.post("/chat")
async def chat_with_ai(request: ChatRequest):
    """Chat with the AI Dataset Assistant."""
    try:
        response = rag_engine.query(request.message, request.dataset_context)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate_schema")
async def generate_schema(request: SchemaRequest):
    """Generate a synthetic dataset JSON schema based on a prompt."""
    try:
        schema_str = rag_engine.generate_dataset_schema(request.prompt)
        # Parse and return as dict so FastAPI returns valid JSON automatically
        import json
        schema_dict = json.loads(schema_str)
        return schema_dict
    except json.JSONDecodeError:
         raise HTTPException(status_code=500, detail="AI produced invalid JSON output.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/explain")
async def explain_metrics(request: ExplainRequest):
    """Get AI explanations for specific dataset metrics."""
    try:
        # Convert metrics dict to a readable string context
        context = "Dataset Metrics Summary:\n"
        for key, value in request.metrics.items():
            context += f"- {key}: {value}\n"
        
        query = "Explain these dataset metrics and provide recommendations for improvement."
        explanation = rag_engine.query(query, context)
        return {"explanation": explanation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/report")
async def generate_report(format: str = "markdown"):
    """Generate a full AI Data Governance Report."""
    metrics = get_dataset_metrics()
    if not metrics:
        raise HTTPException(status_code=400, detail="No dataset found to report on.")

    # 1. Use metrics to build context
    context = f"Dataset Overview: {metrics['overview']['rows']} rows, {metrics['overview']['columns']} columns.\n"
    context += f"Quality: Score {metrics['quality']['score']}, {metrics['quality']['missing_values']} missing values, {metrics['quality']['outliers']} outliers.\n"
    context += f"Bias: Score {metrics['bias']['score']}, DP Diff {metrics['bias']['dp_difference']} on column '{metrics['bias']['sensitive_column']}'."

    # 2. Get AI Risk Assessment from RAG
    query = "Generate a comprehensive risk assessment summary for this dataset."
    ai_risk_assessment = rag_engine.query(query, context)

    # 3. Format as requested
    report_data = {
        "title": "Trustiq AI Data Governance Report",
        "metrics": metrics,
        "ai_assessment": ai_risk_assessment,
        "recommendations": "See AI assessment for specific fixes."
    }

    if format == "json":
        return JSONResponse(content=report_data)
    
    # Simple Markdown Generator
    md_content = f"# {report_data['title']}\n\n"
    md_content += "## 1. Dataset Overview\n"
    md_content += f"- **Rows:** {metrics['overview']['rows']}\n"
    md_content += f"- **Columns:** {metrics['overview']['columns']}\n"
    md_content += f"- **Features:** {', '.join(metrics['overview']['column_names'])}\n\n"
    
    md_content += "## 2. Data Quality Analysis\n"
    md_content += f"- **Quality Score:** {metrics['quality']['score']}/100\n"
    md_content += f"- **Missing Values:** {metrics['quality']['missing_values']}\n"
    md_content += f"- **Duplicates:** {metrics['quality']['duplicates']}\n"
    md_content += f"- **Outliers Detected:** {metrics['quality']['outliers']}\n"
    md_content += f"- **Risk Status:** {metrics['quality']['status']}\n\n"

    md_content += "## 3. Bias & Fairness Analysis\n"
    md_content += f"- **Bias Score:** {metrics['bias']['score']}/100\n"
    md_content += f"- **Sensitive Column:** {metrics['bias']['sensitive_column']}\n"
    md_content += f"- **Demographic Parity Difference:** {metrics['bias']['dp_difference']}\n\n"

    md_content += "## 4. AI Risk Assessment & Recommendations\n"
    md_content += ai_risk_assessment + "\n"

    if format == "markdown" or format == "md":
        return Response(content=md_content, media_type="text/markdown", headers={"Content-Disposition": "attachment; filename=trustiq_report.md"})
    
    return Response(content=f"Format {format} not yet implemented", status_code=501)
