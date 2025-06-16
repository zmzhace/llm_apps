from typing import List, Dict, Any
import numpy as np
from sentence_transformers import SentenceTransformer
from .models import Document, SearchResult

class VectorStore:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)
        self.documents: List[Document] = []
        self.embeddings: List[np.ndarray] = []

    def add_documents(self, documents: List[Document]) -> None:
        """添加文档到向量存储"""
        # 获取文档内容
        contents = [doc.content for doc in documents]
        
        # 生成嵌入向量
        new_embeddings = self.model.encode(contents)
        
        # 添加到存储
        self.documents.extend(documents)
        self.embeddings.extend(new_embeddings)

    def search(self, query: str, top_k: int = 3) -> List[SearchResult]:
        """搜索最相关的文档"""
        if not self.documents:
            return []
            
        # 生成查询向量
        query_embedding = self.model.encode(query)
        
        # 计算相似度
        similarities = np.dot(self.embeddings, query_embedding) / (
            np.linalg.norm(self.embeddings, axis=1) * np.linalg.norm(query_embedding)
        )
        
        # 获取最相似的文档
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        
        return [
            SearchResult(
                content=self.documents[i].content,
                metadata=self.documents[i].metadata,
                score=float(similarities[i])
            )
            for i in top_indices
        ] 