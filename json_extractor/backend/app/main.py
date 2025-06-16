from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from .models import (
    ExtractionRequest,
    ExtractionResponse,
    BatchExtractionRequest,
    BatchExtractionResponse,
    ExportRequest
)
from .llm_service import LLMService
from .history import HistoryManager
import time
import uuid

app = FastAPI(title="JSON数据提取API")

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 初始化服务
llm_service = LLMService()
history_manager = HistoryManager()

@app.post("/extract", response_model=ExtractionResponse)
async def extract_data(request: ExtractionRequest):
    """从JSON数据中提取信息"""
    try:
        start_time = time.time()
        result = llm_service.extract_data(
            request.json_data,
            request.extraction_rules,
            request.custom_prompt
        )
        
        response = ExtractionResponse(
            extracted_data=result["extracted_data"],
            confidence_scores=result["confidence_scores"],
            processing_time=result["processing_time"],
            batch_id=request.batch_id
        )
        
        # 保存到历史记录
        history_manager.add_record(response)
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/batch-extract", response_model=BatchExtractionResponse)
async def batch_extract(request: BatchExtractionRequest):
    """批量提取数据"""
    try:
        batch_id = str(uuid.uuid4())
        results = []
        total_start_time = time.time()
        
        for json_data in request.json_data_list:
            result = llm_service.extract_data(
                json_data,
                request.extraction_rules,
                request.custom_prompt
            )
            
            response = ExtractionResponse(
                extracted_data=result["extracted_data"],
                confidence_scores=result["confidence_scores"],
                processing_time=result["processing_time"],
                batch_id=batch_id
            )
            
            results.append(response)
            history_manager.add_record(response)
        
        total_time = time.time() - total_start_time
        
        return BatchExtractionResponse(
            results=results,
            total_time=total_time,
            batch_id=batch_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history/{batch_id}")
async def get_history(batch_id: str):
    """获取指定批次的历史记录"""
    try:
        records = history_manager.get_batch_history(batch_id)
        return {"records": records}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history")
async def get_all_history():
    """获取所有历史记录"""
    try:
        return history_manager.get_all_history()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/export")
async def export_data(request: ExportRequest):
    """导出数据"""
    try:
        export_path = history_manager.export_batch(request.batch_id, request.format)
        return FileResponse(
            export_path,
            media_type="application/octet-stream",
            filename=f"export_{request.batch_id}.{request.format}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """健康检查"""
    return {"status": "healthy"} 