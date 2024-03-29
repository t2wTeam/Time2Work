#build server
FROM --platform=arm64 python:3.10
WORKDIR /code/
COPY ./server/requirements.txt /code/
RUN pip3 install -r requirements.txt
COPY ./server/ /code/
RUN rm -rf build/
COPY ./client/build/ build/

CMD python main.py
