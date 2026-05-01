from database import SessionLocal
from models.user import User
from utils.hash import hash_password   # adjust your import

db = SessionLocal()

admin = User(
    email="admin@gmail.com",
    password=hash_password("1234"),
    role="admin"
)

db.add(admin)
db.commit()
db.close()

print("Admin created")