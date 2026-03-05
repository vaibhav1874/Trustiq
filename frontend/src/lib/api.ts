export const API_BASE_URL = 'http://localhost:8000/api';

export interface AuditResult {
    score: number;
    missing_values: number;
    duplicates: number;
    outliers: number;
    status: string;
}

export interface BiasResult {
    bias_score: number;
    demographic_parity: number;
    equal_opportunity: number;
    disparate_impact: number;
    issues: string[];
}

export interface SimulationResult {
    overall_risk_score: number;
    risk_category: string;
    simulated_scenarios: Array<{ name: string; impact: string }>;
    explanation: string;
}

export const api = {
    uploadFile: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        // Simulate network delay for effect
        await new Promise(resolve => setTimeout(resolve, 1500));

        const response = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            body: formData,
        });
        return response.json();
    },

    runAudit: async (): Promise<AuditResult> => {
        // Simulate network delay for effect
        await new Promise(resolve => setTimeout(resolve, 2000));
        const response = await fetch(`${API_BASE_URL}/audit`, { method: 'POST' });
        return response.json();
    },

    runBiasDetection: async (): Promise<BiasResult> => {
        // Simulate network delay for effect
        await new Promise(resolve => setTimeout(resolve, 2500));
        const response = await fetch(`${API_BASE_URL}/bias`, { method: 'POST' });
        return response.json();
    },

    runSimulation: async (): Promise<SimulationResult> => {
        // Simulate network delay for effect
        await new Promise(resolve => setTimeout(resolve, 3000));
        const response = await fetch(`${API_BASE_URL}/simulate`, { method: 'POST' });
        return response.json();
    }
};
