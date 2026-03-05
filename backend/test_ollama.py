import requests
import json

OLLAMA_API_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama3.1:latest"

prompt = """
Act as a Senior AI Risk Assessor.
Identify 3 critical real-world edge case scenarios.
Respond ONLY with a raw JSON object (no markdown formatting, no code blocks) matching this exact format:
{
    "overall_risk_score": 85,
    "risk_category": "HighRisk",
    "simulated_scenarios": [
        {"name": "Scenario 1 Name", "impact": "High Risk"}
    ],
    "explanation": "Brief explanation."
}
"""

try:
    print("Testing Ollama API...")
    response = requests.post(OLLAMA_API_URL, json={
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False,
        "format": "json"
    }, timeout=60)
    print("Status:", response.status_code)
    
    if response.status_code == 200:
        result = response.json()
        llama_response = result.get('response', '{}')
        print("Raw response:", llama_response)
        
        try:
            parsed_json = json.loads(llama_response)
            print("Successfully parsed JSON!", parsed_json)
        except Exception as json_e:
            print("JSON parsing failed:", json_e)
    else:
        print("API Error:", response.text)
except Exception as e:
    print("Request Error:", e)
