from fastapi import FastAPI
from database import engine, Base
from models.user import User
from models.campaign import Campaign
from routes.auth import router as auth_router
from routes.campaign import router as campaign_router
from models.gifts import Gift
from routes.gifts import router as gift_router
from models.order import Order
from routes.order import router as order_router
from fastapi.middleware.cors import CORSMiddleware # connecting frontend to backend, allowing cross-origin requests (CORS)
from routes.users import router as users_router 
from routes.order import router as order_router
from routes import dashboard


app = FastAPI()


app.get("/")
def home():
    return {"message":"Backend running..."}


Base.metadata.create_all(bind=engine)

app.include_router(auth_router) # Connecting auth routes to main app

app.include_router(campaign_router) # Connecting campaign routes to main app

app.include_router(gift_router)

app.include_router(order_router)



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router)

app.include_router(users_router)   

app.include_router(order_router)

