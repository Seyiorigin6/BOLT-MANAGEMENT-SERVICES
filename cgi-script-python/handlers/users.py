import sys
import os
import mysql.connector

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from utils.db import get_db_connection, hash_password
from utils.validators import validate_email, validate_phone, validate_password, validate_name

def register_rider(name, phone, email, password):
    """Register a new rider"""
    
    # Validate inputs
    name_valid, name_msg = validate_name(name)
    if not name_valid:
        return {"status": "error", "message": name_msg}
    
    phone_valid = validate_phone(phone)
    if not phone_valid:
        return {"status": "error", "message": "Invalid phone format"}
    
    email_valid = validate_email(email)
    if not email_valid:
        return {"status": "error", "message": "Invalid email format"}
    
    pwd_valid, pwd_msg = validate_password(password)
    if not pwd_valid:
        return {"status": "error", "message": pwd_msg}
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Hash the password
        password_hash = hash_password(password)
        
        # Insert into riders table
        query = "INSERT INTO riders (name, phone, email, password_hash) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (name, phone, email, password_hash))
        conn.commit()
        
        rider_id = cursor.lastrowid
        cursor.close()
        conn.close()
        
        return {
            "status": "success",
            "message": "Rider registered successfully",
            "rider_id": rider_id
        }
    
    except mysql.connector.errors.IntegrityError as e:
        if "phone" in str(e):
            return {"status": "error", "message": "Phone number already exists"}
        elif "email" in str(e):
            return {"status": "error", "message": "Email already exists"}
        return {"status": "error", "message": "Registration failed"}
    
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    # Test registration
    result = register_rider("John Doe", "+1234567890", "john@example.com", "SecurePass123")
    print(result)