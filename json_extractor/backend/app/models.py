from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from datetime import datetime

class ExtractionRequest(BaseModel):
    json_data: Dict[str, Any]
    extraction_rules: List[str]
    custom_prompt: Optional[str] = None
    batch_id: Optional[str] = None

class ExtractionResponse(BaseModel):
    extracted_data: Dict[str, Any]
    confidence_scores: Dict[str, float]
    processing_time: float
    timestamp: datetime = datetime.now()
    batch_id: Optional[str] = None

class BatchExtractionRequest(BaseModel):
    json_data_list: List[Dict[str, Any]]
    extraction_rules: List[str]
    custom_prompt: Optional[str] = None

class BatchExtractionResponse(BaseModel):
    results: List[ExtractionResponse]
    total_time: float
    batch_id: str

class ExportRequest(BaseModel):
    batch_id: str
    format: str = "json"  # 支持 json, csv, excel 