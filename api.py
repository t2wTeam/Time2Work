from logging import getLogger
from fastapi import APIRouter, Body, HTTPException, status
from pydantic import BaseModel
import json
import os

log = getLogger(__name__)
app = APIRouter()

class AddTimeModel(BaseModel):
    available: bool
    days: list[bool]
    startIndex: int
    endIndex: int



def new_overlap(A_matx,B_matx):
    container = [[] for i in range(7)]
    for index, list_zip in enumerate(zip(A_matx, B_matx)):
        # print("current list_zip is ", list_zip)
        for i,j in zip(list_zip[0],list_zip[1]):
            # print("current i,j is", i,j)
            container[index].append( (not i ^ j) and i != 0)
    return container

@app.get("/api/{organization}")
async def login(organization: str):
    if os.path.exists(f'./data/{organization}.json'):
        with open(f'./data/{organization}.json', 'r') as f:
            content = json.load(f)
    else:
        if not organization.isalnum():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Organization name invalid."
                )
        else:
            with open(f'./data/{organization}.json', 'w') as f:
                content = {}
                json.dump(content, f)
    return content


@app.put("/api/{organization}/{name}")
async def add_member(organization: str, name: str):
    if os.path.exists(f'./data/{organization}.json'):
        with open(f'./data/{organization}.json', mode = 'r+') as f:
            content = json.load(f)
            if name in content.keys():
                raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Name exists."
                        )
            else:
                PersonAva = []
                for i in range(7*4*12):
                    PersonAva.append(False)
                content[name] = PersonAva
                f.seek(0)
                json.dump(content, f)
    else:
        raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Organization doesn't exist."
                        )

    

@app.get("/api/{organization}/{name}")
async def get_member(organization: str, name: str):
    if os.path.exists(f'./data/{organization}.json'):
        with open(f'./data/{organization}.json', 'r') as f:
            content = json.load(f)      
            if name not in content.keys():
                raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Name not found."
                        )
            else:
                return content[name]
    else:
        raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Organization doesn't exist."
                        )


@app.post("/api/{organization}/{name}")
async def add_time(organization: str, name: str, time: AddTimeModel):
    if os.path.exists(f'{organization}.json'):
        with open(f'{organization}.json', 'r') as f:
            content = json.load(f)
            inputTime = [False] * 12 * 4
            inputTime[time.startIndex:(time.endIndex + 1)] = [True]*((time.endIndex+1)-time.startIndex)
            for i in range(7):
                if time.days[i] == True:
                    if time.available == True:
                        content[name][i] =  content[name][i] or inputTime
                    else:
                        content[name][i] =  content[name][i] and inputTime
    else:
        raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Organization doesn't exist."
                        )

