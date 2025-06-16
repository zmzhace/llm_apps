from typing import Dict, List, Optional
import json
import os
from datetime import datetime
import pandas as pd
from .models import ExtractionResponse

class HistoryManager:
    def __init__(self, history_dir: str = "history"):
        self.history_dir = history_dir
        self._ensure_history_dir()
        self._load_history()

    def _ensure_history_dir(self):
        """确保历史记录目录存在"""
        if not os.path.exists(self.history_dir):
            os.makedirs(self.history_dir)

    def _load_history(self):
        """加载历史记录"""
        self.history: Dict[str, List[ExtractionResponse]] = {}
        if os.path.exists(os.path.join(self.history_dir, "history.json")):
            with open(os.path.join(self.history_dir, "history.json"), "r", encoding="utf-8") as f:
                data = json.load(f)
                for batch_id, records in data.items():
                    self.history[batch_id] = [
                        ExtractionResponse(**record) for record in records
                    ]

    def _save_history(self):
        """保存历史记录"""
        data = {
            batch_id: [
                {
                    "extracted_data": record.extracted_data,
                    "confidence_scores": record.confidence_scores,
                    "processing_time": record.processing_time,
                    "timestamp": record.timestamp.isoformat(),
                    "batch_id": record.batch_id
                }
                for record in records
            ]
            for batch_id, records in self.history.items()
        }
        with open(os.path.join(self.history_dir, "history.json"), "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    def add_record(self, record: ExtractionResponse):
        """添加新的提取记录"""
        batch_id = record.batch_id or datetime.now().strftime("%Y%m%d_%H%M%S")
        if batch_id not in self.history:
            self.history[batch_id] = []
        self.history[batch_id].append(record)
        self._save_history()

    def get_batch_history(self, batch_id: str) -> List[ExtractionResponse]:
        """获取指定批次的历史记录"""
        return self.history.get(batch_id, [])

    def get_all_history(self) -> Dict[str, List[ExtractionResponse]]:
        """获取所有历史记录"""
        return self.history

    def export_batch(self, batch_id: str, format: str = "json") -> str:
        """导出指定批次的数据"""
        if batch_id not in self.history:
            raise ValueError(f"Batch {batch_id} not found")

        records = self.history[batch_id]
        export_path = os.path.join(self.history_dir, f"export_{batch_id}")

        if format == "json":
            data = [
                {
                    "extracted_data": record.extracted_data,
                    "confidence_scores": record.confidence_scores,
                    "processing_time": record.processing_time,
                    "timestamp": record.timestamp.isoformat()
                }
                for record in records
            ]
            with open(f"{export_path}.json", "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            return f"{export_path}.json"

        elif format in ["csv", "excel"]:
            # 将数据转换为DataFrame
            data = []
            for record in records:
                row = {
                    "timestamp": record.timestamp,
                    "processing_time": record.processing_time,
                    **record.extracted_data,
                    **{f"confidence_{k}": v for k, v in record.confidence_scores.items()}
                }
                data.append(row)
            
            df = pd.DataFrame(data)
            
            if format == "csv":
                df.to_csv(f"{export_path}.csv", index=False, encoding="utf-8")
                return f"{export_path}.csv"
            else:  # excel
                df.to_excel(f"{export_path}.xlsx", index=False)
                return f"{export_path}.xlsx"

        else:
            raise ValueError(f"Unsupported export format: {format}") 