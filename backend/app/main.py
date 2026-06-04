from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from .api.v1 import reports, stats, health, export, sms, intelligence
from .config import settings
from .core.ws import manager

app = FastAPI(
    title="SentinelOps API",
    description="API pour le système de veille stratégique",
    version="1.0.0"
)

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


# Configuration CORS pour production
base_origins = settings.ALLOWED_ORIGINS.split(",")
origins = [
    *base_origins,
    "https://sentinelops.vercel.app",
    "https://sentinel-ops.vercel.app",
    "https://sentinel-ops-nu.vercel.app",
    "https://sentinelops.netlify.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://sentinel-ops-.*\.vercel\.app", # Support Vercel Previews
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Routes
app.include_router(health.router, prefix="/api/v1/health", tags=["health"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["reports"])
app.include_router(stats.router, prefix="/api/v1/stats", tags=["stats"])
app.include_router(export.router, prefix="/api/v1/export", tags=["export"])
app.include_router(sms.router, prefix="/api/v1/gateway", tags=["Gateway"])
app.include_router(intelligence.router, prefix="/api/v1/intelligence", tags=["Intelligence"])

# Schema endpoint
@app.get("/api/v1/schema")
def get_form_schema():
    return settings.FORM_SCHEMA

@app.get("/")
async def root():
    return {"message": "SentinelOps API", "version": "1.0.0", "status": "operational"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
