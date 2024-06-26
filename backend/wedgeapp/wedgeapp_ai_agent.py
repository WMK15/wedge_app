"""
The WedgeAppAIAgent class encapsulates a LangChain 
agent that can be used to answer questions about Wedge's tasks,
and also recommend tasks and habits to users.
"""
import os
import json
import time
from typing import List
import pymongo
from dotenv import load_dotenv
from langchain_community.chat_models import AzureChatOpenAI
from langchain_community.embeddings import AzureOpenAIEmbeddings
from langchain_community.vectorstores.azure_cosmos_db import AzureCosmosDBVectorSearch
from langchain.schema.document import Document
from langchain.agents import Tool
from langchain.agents.agent_toolkits import create_conversational_retrieval_agent
from langchain.tools import StructuredTool
from langchain_core.messages import SystemMessage

load_dotenv()
DB_CONNECTION_STRING = os.environ.get("DB_CONNECTION_STRING")
AOAI_ENDPOINT = os.environ.get("AOAI_API_ENDPOINT")
AOAI_KEY = os.environ.get("AOAI_API_KEY")
AOAI_API_VERSION = os.environ.get("AOAI_API_VERSION")
COMPLETIONS_DEPLOYMENT = os.environ.get("AOAI_API_COMPLETIONS_DEPLOYMENT_NAME")
EMBEDDINGS_DEPLOYMENT = "text-embedding-ada-002" #os.environ.get("AOAI_API_EMBEDDINGS_DEPLOYMENT_NAME")
db = pymongo.MongoClient(DB_CONNECTION_STRING).wedgeapp

class WedgeAppAIAgent:
    """
    The WedgeAppAIAgent class creates Wedge, an AI agent
    that can be used to answer questions about task management, habit
    management, etc.
    """
    def __init__(self, session_id: str):
        llm = AzureChatOpenAI(
            temperature = 0,
            openai_api_version = AOAI_API_VERSION,
            azure_endpoint = AOAI_ENDPOINT,
            openai_api_key = AOAI_KEY,
            azure_deployment = COMPLETIONS_DEPLOYMENT
        )
        self.embedding_model = AzureOpenAIEmbeddings(
            openai_api_version = AOAI_API_VERSION,
            azure_endpoint = AOAI_ENDPOINT,
            openai_api_key = AOAI_KEY,
            azure_deployment = EMBEDDINGS_DEPLOYMENT,
            chunk_size=10
        )
        system_message = SystemMessage(
            content = """
            You are Wedge, an advanced AI-driven productivity platform designed to enhance task management, optimize personal productivity, and engage users through gamification. Your primary functions include:
                - Task Management: Assist users in organizing and prioritizing their tasks efficiently.
                - Habit Tracking: Help users maintain and track their habits for better personal growth.
                - Pomodoro Timer: Implement a Pomodoro timer to boost users' productivity through focused work sessions.
                - AI Recommendations: Provide intelligent recommendations for task optimization and productivity improvement.
                - Natural Language Processing: Generate summaries, answer queries, and offer insights using advanced NLP capabilities.
                - Gamification: Engage users by allowing them to 'feed' Wedge through completing tasks, maintaining habits, and achieving productivity goals.

                Your goal is to make productivity more engaging, effective, and enjoyable by leveraging cutting-edge AI features and interactive elements.
            """
        )
        self.agent_executor = create_conversational_retrieval_agent(
                llm,
                self.__create_agent_tools(),
                system_message = system_message,
                memory_key=session_id,
                verbose=True,
                handle_parsing_errors=True
        )

    def run(self, prompt: str) -> str:
        """
        Run the AI agent.
        """
        result = self.agent_executor({"input": prompt})
        return result["output"]
    
    def __create_wedgeapp_vector_store_retriever(
            self,
            collection_name: str,
            top_k: int = 3
        ):
        """
        Returns a vector store retriever for the given collection.
        """
        vector_store =  AzureCosmosDBVectorSearch.from_connection_string(
            connection_string = DB_CONNECTION_STRING,
            namespace = f"wedgeapp.{collection_name}",
            embedding = self.embedding_model,
            index_name = "VectorSearchIndex",
            embedding_key = "contentVector",
            text_key = "taskId"
        )
        return vector_store.as_retriever(search_kwargs={"k": top_k})

    def __create_agent_tools(self) -> List[Tool]:
        """
        Returns a list of agent tools.
        """
        taks_retriever = self.__create_wedgeapp_vector_store_retriever("tasks")

        # create a chain on the retriever to format the documents as JSON
        tasks_retriever_chain = taks_retriever | format_docs

        tools = [
            Tool(
                name = "vector_search_products",
                func = tasks_retriever_chain.invoke,
                description = """
                    Searches Cosmic Works product information for similar products based 
                    on the question. Returns the product information in JSON format.
                    """
            ),
            
            StructuredTool.from_function(get_task_by_id),
        ]
        return tools
    
    def generate_embeddings(self, text:str) -> List[float]:
        """
        Generate embeddings from string of text using the deployed Azure OpenAI API embeddings model.
        This will be used to vectorize document data and incoming user messages for a similarity search with
        the vector index.
        """

        

        embeddings = self.embedding_model.embed_query(text)
        # embeddings = response.data[0].embedding
        time.sleep(0.5) # rest period to avoid rate limiting on AOAI
        return embeddings
    
    def add_content_vector_field(self, collection_name: str, db: any, doc: dict):
        '''
        Add a new field to the collection to hold the vectorized content of each document.
        '''
        # return print(doc)

        collection = db[collection_name]
        
        # remove any previous contentVector embeddings
        if "contentVector" in doc:
            del doc["contentVector"]

        # generate embeddings for the document string representation
        content = json.dumps(doc, default=str)
        content_vector = self.generate_embeddings(content)   

        collection.update_one(
            {"taskId": doc["taskId"]},
            {"$set": {"contentVector": content_vector}},
            upsert=True 
        )

    def get_task_recommendation(self, task_name: str) -> str:
        """
        Run the AI agent to generate subtasks for a given task name.
        Each subtask will have an id, name, and source.
        Returns the JSON representation of the subtasks.
        """
        # Example input to the agent_executor
        input_command = {
            "input": f"Generate an array of 5 subtasks for {task_name}, separated by newlines. only return bullet points."
        }
        
        # Assuming agent_executor returns a dictionary with an 'output' key containing the JSON string of subtasks
        result = self.agent_executor(input_command)
    
        subtasks = [task.strip("- ") for task in result["output"].split("\n")]
        return subtasks
        

def format_docs(docs:List[Document]) -> str:
    """
    Prepares the product list for the system prompt.
    """
    str_docs = []
    for doc in docs:
        # Build the product document without the contentVector
        doc_dict = {"taskId": doc.page_content}
        doc_dict.update(doc.metadata)
        if "contentVector" in doc_dict:
            del doc_dict["contentVector"]
        str_docs.append(json.dumps(doc_dict, default=str))
    # Return a single string containing each product JSON representation
    # separated by two newlines
    return "\n\n".join(str_docs)

from bson import ObjectId
import json

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

def get_task_by_id(taskId: str) -> str:
    """
    Retrieves a task by its ID.    
    """
    doc = db.tasks.find_one({"taskId": taskId})
    if doc is not None and "contentVector" in doc:
        del doc["contentVector"]
    else:
        doc = {"error": "Task not found"}
    return JSONEncoder().encode(doc)
  