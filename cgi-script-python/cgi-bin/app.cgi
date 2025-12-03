#!/usr/bin/env python3
import os, sys, json
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from handlers import orders
def main():
    print("Content-Type: application/json")
    print()
    try:
        data = orders.get_all_orders()
    except Exception as e:
        data = {"status":"error","message":str(e)}
    print(json.dumps(data))
if __name__ == "__main__":
    main()
