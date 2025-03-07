import os
from dotenv import load_dotenv
import pathlib

def test_env():
    # Get base directory
    base_dir = pathlib.Path(__file__).parent
    env_file = base_dir / '.env'
    
    print("1. Checking .env file:")
    print(f"   Path: {env_file}")
    print(f"   Exists: {env_file.exists()}")
    
    if env_file.exists():
        print("\n2. .env file contents:")
        with open(env_file, 'r') as f:
            print(f"   {f.read().strip()}")
    
    print("\n3. Loading environment variables:")
    load_dotenv(env_file)
    
    api_key = os.getenv('AIzaSyDOF9luP3qyguwBhHIqwsbZeHdsNR1tKVY')
    print(f"   GOOGLE_API_KEY: {'Found (first 10 chars: ' + api_key[:10] + '...)' if api_key else 'Not found'}")

if __name__ == "__main__":
    test_env() 