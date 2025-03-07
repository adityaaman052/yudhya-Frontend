# AI-Powered Dental Treatment Suggestion System

An intelligent system that assists dental professionals in diagnosis and treatment planning using artificial intelligence.

## Features

- Patient data analysis using AI
- Treatment suggestions based on digital X-rays and scans
- Integration with existing dental record systems
- Continuous learning from professional feedback
- Secure patient data handling
- User-friendly web interface

## Technical Stack

- Python 3.8+
- TensorFlow/Keras for AI models
- Flask for web framework
- SQLAlchemy for database management
- OpenCV and PIL for image processing
- PyDICOM for medical imaging

## Setup Instructions

1. Clone the repository
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the variables as needed

5. Initialize the database:
   ```bash
   flask db init
   flask db migrate
   flask db upgrade
   ```

6. Run the application:
   ```bash
   python run.py
   ```

## Project Structure

```
dental_ai/
├── app/
│   ├── models/          # AI models and database models
│   ├── static/         # Static files (CSS, JS, images)
│   ├── templates/      # HTML templates
│   ├── utils/          # Utility functions
│   └── routes.py       # Application routes
├── config.py           # Configuration settings
├── run.py             # Application entry point
└── requirements.txt    # Project dependencies
```

## Security Note

This system is designed to assist dental professionals and should be used as a supporting tool, not as a replacement for professional judgment. All patient data is handled securely and in compliance with healthcare data protection regulations. 