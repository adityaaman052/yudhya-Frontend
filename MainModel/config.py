import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-here'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'dental_ai.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # AI Model settings
    MODEL_PATH = os.path.join(basedir, 'app', 'models', 'ai_models')
    UPLOAD_FOLDER = os.path.join(basedir, 'app', 'static', 'uploads')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'dcm'} 