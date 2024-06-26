# Startup Guide

## Frontend

open a terminal on the frontend folder and do:

```shell
npm install
npm start
```

## Backend

for the backend, you would need these environment variables:

```plaintext
DB_CONNECTION_STRING=mongodb+srv://<cosmosdb-url>/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000

AOAI_API_ENDPOINT=<azure-openai-api-endpoint>

AOAI_API_KEY=<azure-openai-api-key>

AOAI_API_VERSION=2024-02-01

AOAI_API_COMPLETIONS_DEPLOYMENT_NAME=<completions>

AOAI_API_EMBEDDINGS_DEPLOYMENT_NAME=<embeddings>
```

You need to install a virtual environment and start it.

```shell
python -m venv .venv
./.venv/Scripts/activate
```

You can do `deactivate` to stop the virtual environment.

After starting the environment, you need to install the libraries from `requirements.txt`

```shell
pip install -r requirements.txt
```

After installing all the libraries, you can start the server:

```shell
uvicorn --host "0.0.0.0" --port 8000 app:app --reload
```
