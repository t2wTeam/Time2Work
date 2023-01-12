#build server
FROM --platform=arm64 python:3.10
WORKDIR /code/
COPY ./client/build/ build/
COPY ./server/requirements.txt /code/
RUN pip3 install -r requirements.txt
COPY ./server/ /code/

CMD python main.py
