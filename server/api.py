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


def new_overlap(A_matx,B_matx):
    container = [[] for i in range(7)]
    for index, list_zip in enumerate(zip(A_matx, B_matx)):
        # print("current list_zip is ", list_zip)
        for i,j in zip(list_zip[0],list_zip[1]):
            # print("current i,j is", i,j)
            container[index].append( (not i ^ j) and i != 0)
    return container





# if __name__ == '__main__':
#     A_matx = [[False,True,False],[False,True],[True,True]]
#     B_matx = [[False,False,True],[False,True],[True,False]]
#     c = new_overlap(A_matx,B_matx)
#     print(c)