import json
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from handlers.users import register_rider

print("Content-Type: application/json")
print("Access-Control-Allow-Origin: *")
print("Access-Control-Allow-Methods: POST, GET, OPTIONS")
print("Access-Control-Allow-Headers: Content-Type")
print()

try:
    content_length = int(os.environ.get('CONTENT_LENGTH', 0))
    body = sys.stdin.read(content_length)
    
    if not body:
        result = {"status": "error", "message": "Empty request body"}
    else:
        data = json.loads(body)
        
        name = data.get("name", "").strip()
        phone = data.get("phone", "").strip()
        email = data.get("email", "").strip()
        password = data.get("password", "")
        
        result = register_rider(name, phone, email, password)
        
except json.JSONDecodeError as e:
    result = {"status": "error", "message": f"Invalid JSON: {str(e)}"}
except Exception as e:
    result = {"status": "error", "message": str(e)}

print(json.dumps(result))