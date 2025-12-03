import re

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    """Validate phone number (basic check)"""
    pattern = r'^\+?1?\d{9,15}$'
    return re.match(pattern, phone) is not None

def validate_password(password):
    """Validate password strength (min 8 chars, 1 uppercase, 1 number)"""
    if len(password) < 6:
        return False, "Password must be at least 6 characters"
    return True, "Password valid"

def validate_name(name):
    """Validate name (no numbers, min 2 chars)"""
    if len(name) < 2:
        return False, "Name must be at least 2 characters"
    if re.search(r'\d', name):
        return False, "Name cannot contain numbers"
    return True, "Name valid"