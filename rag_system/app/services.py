from typing import List
import time
from .models import Document, Query, QueryResponse, SearchResult
from .vector_store import VectorStore
from .llm_service import LLMService

class RAGService:
    def __init__(self, vector_store: VectorStore, llm_service: LLMService):
        self.vector_store = vector_store
        self.llm_service = llm_service

    def add_documents(self, documents: List[Document]) -> None:
        """添加文档到向量存储"""
        self.vector_store.add_documents(documents)

    def query(self, query: Query) -> QueryResponse:
        """处理查询请求"""
        start_time = time.time()
        
        # 1. 检索相关文档
        results = self.vector_store.search(query.text, top_k=query.top_k)
        
        # 2. 构建提示
        context = "\n\n".join([r.content for r in results])
        prompt = f"""基于以下上下文回答问题。如果上下文中没有相关信息，请说明无法回答。

上下文:
{context}

问题: {query.text}

回答:"""
        
        # 3. 生成回答
        answer = self.llm_service.generate(prompt)
        
        # 4. 计算处理时间
        processing_time = time.time() - start_time
        
        return QueryResponse(
            answer=answer,
            sources=[SearchResult(
                content=r.content,
                metadata=r.metadata,
                score=r.score
            ) for r in results],
            processing_time=processing_time
        ) 