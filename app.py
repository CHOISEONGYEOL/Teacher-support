"""
Teacher Support - 통합 랜딩 페이지
FastAPI + Gradio 앱들 통합
"""

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pathlib import Path
import gradio as gr
from apps.exam_blueprint import create_blueprint_app
from apps.counter_12345 import create_counter_app

# FastAPI 앱 생성
app = FastAPI(title="Teacher Support")

# 정적 파일 마운트
static_path = Path(__file__).parent / "static"
app.mount("/static", StaticFiles(directory=str(static_path)), name="static")

# Gradio 앱들 생성 및 마운트
blueprint_app = create_blueprint_app()
counter_app = create_counter_app()

app = gr.mount_gradio_app(app, blueprint_app, path="/blueprint")
app = gr.mount_gradio_app(app, counter_app, path="/counter")

# 랜딩 페이지 HTML 직접 제공
@app.get("/", response_class=HTMLResponse)
async def index():
    template_path = Path(__file__).parent / "templates" / "index.html"
    html_content = template_path.read_text(encoding="utf-8")
    # Jinja2 템플릿 문법을 실제 경로로 치환
    html_content = html_content.replace("{{ url_for('static', filename='css/style.css') }}", "/static/css/style.css")
    html_content = html_content.replace("{{ url_for('static', filename='js/main.js') }}", "/static/js/main.js")
    return html_content

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
