from datetime import datetime,  date
from typing import List, Optional
from pydantic import BaseModel, constr, AnyUrl,Field,ValidationError, validator

class JobList(BaseModel):
    jobs: str
