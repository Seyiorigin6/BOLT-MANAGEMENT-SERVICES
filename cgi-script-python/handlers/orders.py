import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from utils.db import get_db_connection


def test_db_connection():
    """Test MySQL connection and query"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # simple query to verify connection
        cursor.execute("SELECT VERSION()")
        version = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        return {
            "status": "success",
            "message": "Connected to MySQL",
            "mysql_version": version[0]
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

def get_all_orders():
    """Retrieve all orders"""
    return {"status": "success", "message": "All orders retrieved"}

if __name__ == "__main__":
    result = test_db_connection()
    print(result)
# ...existing code...