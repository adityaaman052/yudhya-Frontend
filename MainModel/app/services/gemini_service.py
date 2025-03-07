import google.generativeai as genai
from app.config import Config
import logging
import json
from datetime import datetime

class GeminiService:
    def __init__(self):
        self.model = self._initialize_model()
        
    def _initialize_model(self):
        try:
            genai.configure(api_key=Config.AIzaSyDOF9luP3qyguwBhHIqwsbZeHdsNR1tKVY)
            # Change to 'gemini-1.0-pro' for free tier
            return genai.GenerativeModel('gemini-1.0-pro')
        except Exception as e:
            logging.error(f"Failed to initialize Gemini model: {str(e)}")
            raise

    def analyze_dental_scan(self, scan_description):
        try:
            # Simplified prompt for free tier
            prompt = f"""
            Analyze this dental scan description as a dental expert:
            {scan_description}

            Provide a detailed analysis covering:
            1. Main issues found
            2. Location and severity
            3. Treatment recommendations
            4. Preventive measures

            Return the analysis in this JSON format:
            {{
                "findings": [
                    {{
                        "issue": "string",
                        "location": "string",
                        "severity": "mild|moderate|severe",
                        "details": "string"
                    }}
                ],
                "diagnosis": {{
                    "primary_condition": "string",
                    "secondary_conditions": ["string"],
                    "risk_level": "low|medium|high"
                }},
                "treatment": {{
                    "recommended_procedures": ["string"],
                    "urgency": "routine|prompt|immediate",
                    "estimated_timeline": "string"
                }},
                "prevention": {{
                    "recommendations": ["string"],
                    "follow_up": "string"
                }}
            }}
            """
            
            response = self.model.generate_content(prompt)
            
            try:
                # Extract JSON from response
                json_str = response.text
                if '```json' in json_str:
                    json_str = json_str.split('```json')[1].split('```')[0]
                elif '```' in json_str:
                    json_str = json_str.split('```')[1].split('```')[0]
                
                analysis = json.loads(json_str.strip())
                
                result = {
                    "analysis": analysis,
                    "metadata": {
                        "timestamp": datetime.now().isoformat(),
                        "version": "1.0"
                    }
                }
                
                return json.dumps(result, indent=2)
                
            except json.JSONDecodeError as e:
                logging.error(f"Error parsing JSON response: {str(e)}")
                raise Exception("Invalid response format from AI model")
            
        except Exception as e:
            logging.error(f"Error in Gemini API call: {str(e)}")
            raise

    def get_treatment_suggestions(self, conditions):
        try:
            # Simplified prompt for free tier
            prompt = f"""
            Provide treatment suggestions for these dental conditions:
            {conditions}

            Return the suggestions in this JSON format:
            {{
                "treatment_plan": {{
                    "immediate_steps": ["string"],
                    "long_term_steps": ["string"],
                    "estimated_duration": "string"
                }},
                "care_instructions": {{
                    "daily_care": ["string"],
                    "diet_recommendations": ["string"],
                    "restrictions": ["string"]
                }},
                "follow_up": {{
                    "next_visit": "string",
                    "monitoring_needs": ["string"]
                }},
                "cost_estimate": {{
                    "range": "string",
                    "payment_options": ["string"]
                }}
            }}
            """
            
            response = self.model.generate_content(prompt)
            
            try:
                json_str = response.text
                if '```json' in json_str:
                    json_str = json_str.split('```json')[1].split('```')[0]
                elif '```' in json_str:
                    json_str = json_str.split('```')[1].split('```')[0]
                
                treatment_plan = json.loads(json_str.strip())
                
                result = {
                    "treatment": treatment_plan,
                    "metadata": {
                        "timestamp": datetime.now().isoformat(),
                        "version": "1.0"
                    }
                }
                
                return json.dumps(result, indent=2)
                
            except json.JSONDecodeError as e:
                logging.error(f"Error parsing JSON response: {str(e)}")
                raise Exception("Invalid response format from AI model")
            
        except Exception as e:
            logging.error(f"Error in Gemini API call: {str(e)}")
            raise 