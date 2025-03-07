import os
from dotenv import load_dotenv
import pathlib

# Get the base directory of your project
BASE_DIR = pathlib.Path(__file__).parent.parent

# Load .env file explicitly from the base directory
env_file = BASE_DIR / '.env'
if not env_file.exists():
    raise FileNotFoundError(f".env file not found at {env_file}")

load_dotenv(env_file)

# Get API key
GOOGLE_API_KEY = os.getenv('AIzaSyDOF9luP3qyguwBhHIqwsbZeHdsNR1tKVY')

# Debug prints
print("Current directory:", os.getcwd())
print("Base directory:", BASE_DIR)
print("Env file exists:", env_file.exists())
print("Env file path:", env_file)
print("API Key (first 10 chars):", GOOGLE_API_KEY[:10] if GOOGLE_API_KEY else "None")

class Config:
    GOOGLE_API_KEY = os.getenv('AIzaSyDOF9luP3qyguwBhHIqwsbZeHdsNR1tKVY')
    if not GOOGLE_API_KEY:
        raise ValueError("No GOOGLE_API_KEY set in environment variables. Please check your .env file.") 