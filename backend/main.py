import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from starlette import status
from fastapi import status, Response
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import RequestValidationError
import json
import time
from typing import Optional
from datetime import datetime, date
from starlette.exceptions import HTTPException
from starlette.middleware import Middleware
from storage.models import *
from dotenv import load_dotenv
import preprocessor
import tweepy
import arrow
import re
load_dotenv()

origins = [
    "https://twittrng.herokuapp.com",
    "http://twittrng.herokuapp.com",
    "http://localhost:8000",
]
api_app = FastAPI(title="my existing api")


app = FastAPI(title="my app root")
app.mount('/twitter', api_app)
app.mount(
    "/",
    StaticFiles(directory="../twittr/build", html=True, check_dir=False),
    name="static",
)

app.add_middleware(CORSMiddleware,
allow_origins=origins,
allow_credentials=True,
allow_methods=["*"],
allow_headers=["*"],)

@api_app.post(
    "/api/v1/get_jobs",
    tags=["Joblist"],
    summary="Get Joblist",
    status_code=200,
)
async def get_jobs(request: Request, joblist: JobList):
    keyword=jsonable_encoder(joblist)["jobs"]
    client = tweepy.Client(os.getenv("key"),wait_on_rate_limit=True)
    tweets=[]
    urls=[]
    date=[]
    spam_list=["MIDDLEMEN","#MachineLearning","#DataAnalytics","MIDDLEMAN","Free","#AI","#100DaysOfCode","#DataScience","Retweet","Follow","meme"]
    for tweet in tweepy.Paginator(client.search_recent_tweets, f"{keyword} -is:retweet", max_results=100,tweet_fields=["entities","created_at","text"]).flatten(limit=200):
        p=tweet.data
        try:
            get_urls=p["entities"]["urls"][0]["expanded_url"]
        except KeyError:
            get_urls=None
        urls.append(get_urls)
        tweets.append(tweet.text)
        date.append(tweet.data["created_at"])

    results = [] #links
    processed = [] #jobs
    created=[]

    #Checks for duplicates and spam
    for url,tweets,dates in zip(urls, tweets,date):
        if tweets not in processed and not any(spam in tweets for spam in spam_list):
                
                #Checks for links
                if re.search("(?P<url>https?://[^\s]+)", tweets): 
                    processed.append(tweets)
                    results.append(url)
                    created.append(dates)

    cleaned_tweets=[]
    for text in processed:

        """Cleaning the tweets with Preprocessor"""

        cleaned_tweets.append(preprocessor.clean(text))
        
    new_date=[]
    for i in created:
        """Humanize the dates"""
        a = arrow.get(i)
        
        new_date.append(a.humanize())
  
    id=list(range(1,len(cleaned_tweets)+1))
    d={"id":id,"tweets":cleaned_tweets,"date":new_date,"urls":results}
    recordset = [{k: v[i] for k, v in d.items() if i < len(v)} for i in range(max([len(l) for l in d.values()]))]


    return JSONResponse(
        {"success":True,
        "data":{
       "joblist":recordset,
    },
        "message":"successfully fetched"}, status.HTTP_200_OK
    )

