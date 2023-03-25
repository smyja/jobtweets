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
from starlette.exceptions import HTTPException
from starlette.middleware import Middleware
from storage.models import *
from dotenv import load_dotenv
import preprocessor
import tweepy
import hashlib
import arrow
import re
load_dotenv()

origins = [
    "https://jobtweets.xyz",
    "http://jobtweets.xyz",
    "https://www.jobtweets.xyz"
    "http://localhost:8000",
]
api_app = FastAPI(title="Job tweets api Doc")


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
    processed = set() # use a set to store tweet hashes instead of a list
    created=[]

    #Checks for duplicates and spam
    for url, tweet, date in zip(urls, tweets, date):
        # generate a hash of the tweet content (text + URL)
        tweet_hash = hashlib.sha256((tweet + url).encode('utf-8')).hexdigest()
        
        if tweet_hash not in processed and not any(spam in tweet for spam in spam_list):
            # add the tweet hash to the set of processed hashes
            processed.add(tweet_hash)
            
            # add the tweet details to the results
            results.append(url)
            tweets.append(tweet)
            date.append(date)

    cleaned_tweets=[]
    for text in processed:

        """Cleaning the tweets with Preprocessor"""

        cleaned_tweets.append(preprocessor.clean(text))
        
    new_date=[]
    for i in created:
        """Humanize the dates"""
        a = arrow.get(i)
        
        new_date.append(a.humanize())
    tweets_data=[]
    id=list(range(1,len(cleaned_tweets)+1))
    d={"id":id,"tweets":cleaned_tweets,"date":new_date,"urls":results}
    for i in range(len(cleaned_tweets)):
        tweets_dict={
            "id": id[i],
            "tweets": cleaned_tweets[i],
            "date": new_date[i],
            "urls": results[i]
        }
        tweets_data.append(tweets_dict)


    return JSONResponse(
        {"success":True,
        "data":{
       "joblist":tweets_data
    },
        "message":"successfully fetched"}, status.HTTP_200_OK
    )

