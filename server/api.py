from logging import getLogger
from fastapi import APIRouter, Body, HTTPException, status
from pydantic import BaseModel

log = getLogger(__name__)
app = APIRouter()

@app.get("/api/{organization}")
async def login(organization: str):
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Your login information is invalid. Please try again!",
    )