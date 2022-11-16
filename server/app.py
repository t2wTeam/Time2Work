from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from api import app as api_app
import logging

PUBLIC_DIRECTORY = "public"

app = FastAPI()
app.include_router(api_app)

logging.basicConfig(level=logging.DEBUG)
log = logging.getLogger(__name__)


@app.get("/")
async def root():
    return FileResponse(f"{PUBLIC_DIRECTORY}/index.html")


app.mount("/", StaticFiles(directory=PUBLIC_DIRECTORY), name="public")

