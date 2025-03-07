from flask import Blueprint, request, jsonify
from app.services.gemini_service import GeminiService
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

main = Blueprint('main', __name__)
gemini_service = GeminiService()

@main.route('/api/analyze', methods=['POST'])
def analyze_scan():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        scan_description = data.get('scan_description')
        
        if not scan_description:
            return jsonify({'error': 'No scan description provided'}), 400
            
        logger.info(f"Analyzing scan description: {scan_description[:100]}...")
        analysis = gemini_service.analyze_dental_scan(scan_description)
        
        return jsonify({'analysis': analysis})
        
    except Exception as e:
        logger.error(f"Error in analyze endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500

@main.route('/api/treatment', methods=['POST'])
def get_treatment():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        conditions = data.get('conditions')
        
        if not conditions:
            return jsonify({'error': 'No conditions provided'}), 400
            
        logger.info(f"Getting treatment suggestions for conditions: {conditions[:100]}...")
        treatment = gemini_service.get_treatment_suggestions(conditions)
        
        return jsonify({'treatment': treatment})
        
    except Exception as e:
        logger.error(f"Error in treatment endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500

@main.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'Dental AI API',
        'version': '1.0.0'
    }) 