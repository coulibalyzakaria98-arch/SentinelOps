from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from .api.v1 import reports, stats, health, export, sms, intelligence
from .config import settings
from .core.ws import manager

app = FastAPI(title="SentinelOps Map API")

# Store manager in app state for access in routes
app.state.manager = manager

@app.websocket("/ws/intelligence")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text() # Keep connection alive
    except WebSocketDisconnect:
        manager.disconnect(websocket)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(health.router, prefix="/api/v1/health", tags=["Health"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["Reports"])
app.include_router(stats.router, prefix="/api/v1/stats", tags=["Stats"])
app.include_router(export.router, prefix="/api/v1/export", tags=["Export"])
app.include_router(sms.router, prefix="/api/v1/gateway", tags=["Gateway"])
app.include_router(intelligence.router, prefix="/api/v1/intelligence", tags=["Intelligence"])

# Schema endpoint
@app.get("/api/v1/schema")
def get_form_schema():
    return settings.FORM_SCHEMA

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
