from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from services.service import OSINTService
from models.schemas import SearchRequest, SearchResponse
import traceback

app = FastAPI(title="Digital Footprint Collector API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OSINT service
osint_service = OSINTService()

@app.post("/api/osint/search", response_model=SearchResponse)
async def search_osint(request: SearchRequest):
    """
    Search for digital footprint based on username, email, or name
    """
    try:
        if request.type == "username":
            if not request.query:
                raise HTTPException(status_code=400, detail="Query is required for username search")
            results = await osint_service.search_username(request.query)
            query = request.query
            
        elif request.type == "email":
            if not request.query:
                raise HTTPException(status_code=400, detail="Query is required for email search")
            results = await osint_service.search_email(request.query)
            query = request.query
            
        elif request.type == "name":
            if not request.first_name or not request.last_name:
                raise HTTPException(status_code=400, detail="First name and last name are required for name search")
            results = await osint_service.search_name(request.first_name, request.last_name)
            query = f"{request.first_name} {request.last_name}"
            
        else:
            raise HTTPException(status_code=400, detail="Invalid search type")
        
        return SearchResponse(
            query=query,
            type=request.type,
            results=results,
            timestamp=datetime.now().isoformat()
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Digital Footprint Collector API"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}