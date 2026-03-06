import os
import json
from typing import List, Dict, Any
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_ollama import OllamaLLM
from langchain_core.documents import Document
from langchain_core.prompts import PromptTemplate

class RAGEngine:
    def __init__(self, model_name="llama3.1:latest", persist_directory="./chroma_db"):
        self.model_name = model_name
        self.persist_directory = persist_directory
        # Use a lightweight embedding model
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.llm = OllamaLLM(model=self.model_name, base_url="http://localhost:11434")
        self.vectorstore = None
        self._initialize_vectorstore()

    def _initialize_vectorstore(self):
        """Initializes or loads the vector store from the local knowledge base."""
        kb_path = os.path.join(os.path.dirname(__file__), "..", "data", "knowledge_base.json")
        if not os.path.exists(kb_path):
            print(f"Knowledge base not found at {kb_path}")
            return

        with open(kb_path, "r") as f:
            kb_data = json.load(f)

        documents = []
        for entry in kb_data:
            content = (
                f"Topic: {entry['topic']}\n"
                f"Explanation: {entry['explanation']}\n"
                f"Risk: {entry['risk']}\n"
                f"Detection Method: {entry['detection_method']}\n"
                f"Suggested Fix: {entry['suggested_fix']}\n"
                f"Example Scenario: {entry['example_scenario']}"
            )
            documents.append(Document(page_content=content, metadata={"topic": entry['topic']}))

        # Create or load the Chroma vectorstore
        self.vectorstore = Chroma.from_documents(
            documents=documents,
            embedding=self.embeddings,
            persist_directory=self.persist_directory
        )

    def query(self, user_query: str, dataset_context: str = "") -> str:
        """Retrieves relevant knowledge and generates an AI response."""
        if not self.vectorstore:
            return "Knowledge base not initialized."

        # Search for top-2 relevant snippets from the knowledge base
        docs = self.vectorstore.similarity_search(user_query, k=2)
        kb_context = "\n\n".join([doc.page_content for doc in docs])

        template = """
        You are a Senior AI Architect and Data Scientist for 'Trustiq', an AI Data Governance Platform.
        Your goal is to help users understand their dataset risks and provide technical guidance.

        ### KNOWLEDGE BASE CONTEXT:
        {kb_context}

        ### DATASET METRICS & FINDINGS:
        {dataset_context}

        ### USER QUESTION:
        {user_query}

        ### RESPONSE:
        (Provide a detailed, professional, and actionable response based on the context above. If the dataset metrics are provided, use them to customize your advice.)
        """
        
        prompt = template.format(
            kb_context=kb_context,
            dataset_context=dataset_context,
            user_query=user_query
        )

        try:
            return self.llm.invoke(prompt)
        except Exception as e:
            return f"Error generating response: {str(e)}"

# Singleton instance
rag_engine = RAGEngine()
