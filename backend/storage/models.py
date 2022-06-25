from pydantic import BaseModel

class JobList(BaseModel):
    jobs: str
