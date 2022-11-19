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
    start: str
    end: str


def new_overlap(A_matx, B_matx):
    container = [[] for i in range(7)]
    for index, list_zip in enumerate(zip(A_matx, B_matx)):
        # print("current list_zip is ", list_zip)
        for i, j in zip(list_zip[0], list_zip[1]):
            # print("current i,j is", i,j)
            container[index].append((not i ^ j) and i != 0)
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
        with open(f'./data/{organization}.json', mode='r+') as f:
            content = json.load(f)
            if name in content.keys():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Name exists."
                )
            else:
                PersonAva = []
                for i in range(7 * 4 * 12):
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


@app.delete("/api/{organization}/{name}")
async def del_member(organization: str, name: str):
    if os.path.exists(f'./data/{organization}.json'):
        with open(f'./data/{organization}.json', mode='r+') as f:
            content = json.load(f)
            if name not in content.keys():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Name does exists."
                )
            else:
                del content[name]  # Is this correct?
                f.seek(0)
                json.dump(content, f)
                f.truncate()
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Organization doesn't exist."
        )



@app.post("/api/{organization}/{name}")
async def add_time(organization: str, name: str, data: AddTimeModel = Body(default=None, embed=True)):
    if os.path.exists(f'./data/{organization}.json'):
        with open(f'./data/{organization}.json', 'r+') as f:
            # Load file and store the paras as int
            # i.e. "8:15" --> 0,1
            content:dict = json.load(f)

            for i in range(7):
                if not data.days[i]:
                    continue
                start_hour, start_min = [int(i) for i in data.start.split(":")]
                end_hour, end_min = [int(i) for i in data.end.split(":")]
                start_hour -= 8
                end_hour -= 8
                start_min //= 15
                end_min //= 15


                start = i*48 + start_hour * 4 + start_min
                end = i*48 + end_hour * 4 + end_min
                if (end < start):
                    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                        detail="Start time should be no later than end time")
                # content[name] = [not data.available] * 12 * 4
                content[name][start : end] = [data.available]* (end-start)
                f.seek(0)
                json.dump(content, f)
                f.truncate()

    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Organization doesn't exist.")
