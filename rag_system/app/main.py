from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import Document, Query, QueryResponse
from .services import RAGService
from .vector_store import VectorStore
from .llm_service import LLMService

app = FastAPI(title="RAG System API")

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 初始化服务
vector_store = VectorStore()
llm_service = LLMService()
rag_service = RAGService(vector_store, llm_service)

@app.post("/documents", response_model=dict)
async def add_documents(documents: list[Document]):
    """添加文档到系统"""
    try:
        rag_service.add_documents(documents)
        return {"message": f"成功添加 {len(documents)} 个文档"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query", response_model=QueryResponse)
async def query(query: Query):
    """处理查询请求"""
    try:
        return rag_service.query(query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """健康检查"""
    return {"status": "healthy"} 