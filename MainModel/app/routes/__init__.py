from flask import Blueprint

# Initialize Blueprint
main = Blueprint("main", __name__)

# Import routes to register them
from . import routes
