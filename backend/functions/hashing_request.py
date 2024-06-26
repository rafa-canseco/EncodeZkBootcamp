import hashlib

# Function to generate a 14-digit hash from a string
def get_14_digit_hash_from_string(input_str: str) -> str:
    hash_string = hashlib.sha256(input_str.encode()).hexdigest()
    substring = hash_string[:14]
    num = int(substring, 16)
    result = num % 10**14
    return str(result).zfill(14)