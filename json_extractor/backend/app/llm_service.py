import json
import time
import requests
from .config import settings

class LLMService:
    def __init__(self):
        self.api_key = settings.API_KEY
        self.api_url = settings.API_URL
        self.model = settings.MODEL_NAME

    def generate_extraction_prompt(self, json_data: dict, extraction_rules: list, custom_prompt: str = None) -> str:
        """生成提取提示"""
        base_prompt = f"""你是一个专业的数据提取助手。请根据以下规则从JSON数据中提取信息：

JSON数据：
{json.dumps(json_data, ensure_ascii=False, indent=2)}

提取规则：
{chr(10).join(f"{i+1}. {rule}" for i, rule in enumerate(extraction_rules))}

请以JSON格式返回提取结果，格式如下：
{{
    "extracted_data": {{
        "field1": "value1",
        "field2": "value2"
    }},
    "confidence_scores": {{
        "field1": 0.95,
        "field2": 0.85
    }}
}}

注意：
1. 只返回JSON格式的结果
2. 如果无法提取某个字段，将其值设为null
3. 置信度分数范围在0-1之间
4. 确保返回的是有效的JSON格式"""

        if custom_prompt:
            return f"{base_prompt}\n\n额外要求：\n{custom_prompt}"
        return base_prompt

    def extract_data(self, json_data: dict, extraction_rules: list, custom_prompt: str = None) -> dict:
        """从JSON数据中提取信息"""
        start_time = time.time()
        
        prompt = self.generate_extraction_prompt(json_data, extraction_rules, custom_prompt)
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": "你是一个专业的数据提取助手，只返回JSON格式的结果。"},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.3
        }
        
        try:
            response = requests.post(self.api_url, headers=headers, json=data)
            response.raise_for_status()
            
            result = response.json()["choices"][0]["message"]["content"]
            extracted_data = json.loads(result)
            
            processing_time = time.time() - start_time
            extracted_data["processing_time"] = processing_time
            
            return extracted_data
            
        except Exception as e:
            raise Exception(f"提取数据时出错: {str(e)}") 