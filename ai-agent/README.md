# AI 聊天助手

这是一个基于智谱AI的聊天助手应用，包含前端和后端两个部分。

## 项目结构

```
ai-agent/
├── backend/          # Flask 后端
│   ├── .env         # 后端环境变量（不提交到Git）
│   ├── app.py       # 主应用文件
│   └── requirements.txt  # Python依赖
└── frontend/        # React 前端
    ├── .env         # 前端环境变量（不提交到Git）
    └── src/         # 源代码目录
```

## 环境要求

- Python 3.9+
- Node.js 16+
- npm 8+

## 后端设置

1. 进入后端目录：
```bash
cd backend
```

2. 创建虚拟环境：
```bash
python -m venv venv
```

3. 激活虚拟环境：
- Windows:
```bash
venv\Scripts\activate
```
- macOS/Linux:
```bash
source venv/bin/activate
```

4. 安装依赖：
```bash
pip install -r requirements.txt
```

5. 配置环境变量：
- 复制 `.env.example` 为 `.env`
- 在 `.env` 中填入您的 API 密钥

6. 运行服务器：
```bash
python app.py
```

## 前端设置

1. 进入前端目录：
```bash
cd frontend
```

2. 安装依赖：
```bash
npm install
```

3. 配置环境变量：
- 复制 `.env.example` 为 `.env`
- 确保 API URL 配置正确

4. 运行开发服务器：
```bash
npm start
```

## 使用说明

1. 确保后端服务器正在运行（默认端口：5000）
2. 打开浏览器访问前端应用（默认地址：http://localhost:3000）
3. 在输入框中输入您的问题
4. 点击发送按钮或按回车键发送消息

## 注意事项

- 请确保您的 API 密钥是有效的
- 不要将包含实际 API 密钥的 `.env` 文件提交到 Git
- 如果遇到跨域问题，请确保后端 CORS 设置正确

## 许可证

MIT 