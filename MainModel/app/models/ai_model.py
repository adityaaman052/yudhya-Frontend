import cv2
import numpy as np
import os
import logging
from datetime import datetime, timedelta

class DentalAIModel:
    def __init__(self):
        self.image_size = (224, 224)
        self.supported_formats = {'.png', '.jpg', '.jpeg'}
        self.setup_logging()
        self.conditions_db = {
            "Cavity": {
                "description": "Decay in tooth structure forming a hole",
                "risk_factors": [
                    "Poor oral hygiene",
                    "High sugar diet",
                    "Irregular dental checkups"
                ],
                "prevention": [
                    "Regular brushing and flossing",
                    "Limited sugar intake",
                    "Regular dental checkups",
                    "Fluoride treatment"
                ],
                "early_signs": [
                    "Tooth sensitivity",
                    "Visible holes or pits",
                    "Dark spots on teeth"
                ]
            },
            "Periodontal Disease": {
                "description": "Infection of the gums and supporting tooth structures",
                "risk_factors": [
                    "Poor oral hygiene",
                    "Smoking",
                    "Diabetes",
                    "Genetic predisposition"
                ],
                "prevention": [
                    "Regular professional cleaning",
                    "Proper brushing technique",
                    "Daily flossing",
                    "Smoking cessation"
                ],
                "early_signs": [
                    "Bleeding gums",
                    "Gum recession",
                    "Bad breath"
                ]
            },
            "Root Canal Required": {
                "description": "Infection or damage to tooth pulp requiring endodontic treatment",
                "risk_factors": [
                    "Deep cavities",
                    "Cracked teeth",
                    "Repeated dental procedures",
                    "Trauma"
                ],
                "prevention": [
                    "Regular dental checkups",
                    "Prompt treatment of cavities",
                    "Wearing mouthguard during sports",
                    "Avoiding hard foods"
                ],
                "early_signs": [
                    "Severe tooth pain",
                    "Sensitivity to hot/cold",
                    "Darkening of tooth"
                ]
            }
        }

    def setup_logging(self):
        """Setup logging for debugging"""
        logging.basicConfig(level=logging.DEBUG)
        self.logger = logging.getLogger(__name__)

    def preprocess_image(self, image_path):
        """Enhanced image preprocessing using only OpenCV"""
        try:
            # Check if file exists
            if not os.path.exists(image_path):
                raise FileNotFoundError(f"Image file not found: {image_path}")

            # Get file extension
            file_ext = os.path.splitext(image_path)[1].lower()
            if file_ext not in self.supported_formats:
                raise ValueError(f"Unsupported file format: {file_ext}")

            # Read image using OpenCV
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError("Failed to read image file")

            # Convert BGR to RGB
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

            # Resize image
            image = cv2.resize(image, self.image_size, interpolation=cv2.INTER_AREA)

            # Normalize pixel values
            image = image.astype(np.float32) / 255.0

            self.logger.info(f"Successfully preprocessed image: {image_path}")
            return image

        except Exception as e:
            self.logger.error(f"Error preprocessing image: {str(e)}")
            raise

    def analyze_scan(self, image_path):
        try:
            # Read and validate image
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError("Failed to load image")

            # Basic image preprocessing
            image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            image = cv2.resize(image, (800, 600))  # Standardize size
            
            # Image quality assessment
            image_quality = self._assess_image_quality(image)
            
            # Mock findings for demonstration
            findings = self._generate_mock_findings()
            
            # Generate health assessment
            health_assessment = self._generate_health_assessment(findings)
            
            # Generate treatment plan
            treatment_plan = self._generate_treatment_plan(findings)
            
            return {
                'findings': findings,
                'health_assessment': health_assessment,
                'treatment_plan': treatment_plan,
                'image_quality': image_quality
            }

        except Exception as e:
            self.logger.error(f"Error in analyze_scan: {str(e)}")
            raise Exception(f"Image analysis failed: {str(e)}")

    def _assess_image_quality(self, image):
        try:
            # Calculate brightness
            brightness = np.mean(image)
            brightness_score = min(100, (brightness / 255) * 100)

            # Calculate contrast
            contrast = np.std(image)
            contrast_score = min(100, (contrast / 128) * 100)

            # Calculate blur level
            laplacian_var = cv2.Laplacian(image, cv2.CV_64F).var()
            blur_level = max(0, min(100, 100 - (laplacian_var / 500) * 100))

            # Overall quality score
            quality_score = int((brightness_score + contrast_score + (100 - blur_level)) / 3)

            recommendations = []
            if brightness_score < 40:
                recommendations.append("Image is too dark. Consider better lighting conditions.")
            elif brightness_score > 80:
                recommendations.append("Image is too bright. Reduce exposure.")
            if contrast_score < 40:
                recommendations.append("Low contrast. Adjust imaging settings.")
            if blur_level > 60:
                recommendations.append("Image is blurry. Ensure steady positioning and proper focus.")

            return {
                'score': quality_score,
                'brightness': int(brightness_score),
                'contrast': int(contrast_score),
                'blur_level': int(blur_level),
                'recommendations': recommendations
            }

        except Exception as e:
            self.logger.error(f"Error in image quality assessment: {str(e)}")
            raise Exception("Failed to assess image quality")

    def _generate_mock_findings(self):
        return [
            {
                'condition': 'Dental Caries',
                'location': 'Upper Right Molar (UR6)',
                'severity': 'Medium',
                'confidence': 0.89,
                'progression': 'Early stage',
                'immediate_attention': False
            },
            {
                'condition': 'Gingivitis',
                'location': 'Lower Front Teeth',
                'severity': 'Low',
                'confidence': 0.75,
                'progression': 'Mild inflammation',
                'immediate_attention': False
            }
        ]

    def _generate_health_assessment(self, findings):
        # Calculate overall health score based on findings
        severity_scores = {'Low': 1, 'Medium': 2, 'High': 3}
        total_severity = sum(severity_scores.get(f['severity'], 0) for f in findings)
        max_possible_severity = len(findings) * 3
        health_score = 100 - (total_severity / max_possible_severity * 100) if findings else 100

        urgent_issues = [f['condition'] for f in findings if f['immediate_attention']]

        # Determine health status
        if health_score >= 90:
            status = 'Excellent'
            next_checkup = (datetime.now() + timedelta(months=6)).strftime('%B %Y')
        elif health_score >= 70:
            status = 'Good'
            next_checkup = (datetime.now() + timedelta(months=3)).strftime('%B %Y')
        elif health_score >= 50:
            status = 'Fair'
            next_checkup = (datetime.now() + timedelta(weeks=6)).strftime('%B %Y')
        else:
            status = 'Poor'
            next_checkup = 'As soon as possible'

        return {
            'health_status': status,
            'overall_score': int(health_score),
            'next_checkup': next_checkup,
            'urgent_issues': urgent_issues
        }

    def _generate_treatment_plan(self, findings):
        immediate_actions = []
        preventive_measures = [
            "Regular brushing twice daily",
            "Daily flossing",
            "Use fluoride toothpaste",
            "Regular dental check-ups"
        ]
        lifestyle_recommendations = [
            "Reduce sugar intake",
            "Avoid smoking and tobacco products",
            "Stay hydrated",
            "Maintain a balanced diet"
        ]

        for finding in findings:
            if finding['severity'] in ['Medium', 'High'] or finding['immediate_attention']:
                action = {
                    'condition': finding['condition'],
                    'description': f"Treatment needed for {finding['condition']} at {finding['location']}",
                    'treatments': [
                        "Professional cleaning",
                        "Cavity filling" if 'Caries' in finding['condition'] else "Gum treatment"
                    ],
                    'estimated_recovery': "2-3 weeks",
                    'follow_up': "Schedule follow-up in 1 month"
                }
                immediate_actions.append(action)

        return {
            'immediate_actions': immediate_actions,
            'preventive_measures': preventive_measures,
            'lifestyle_recommendations': lifestyle_recommendations
        }

    def suggest_treatment(self, analysis_results):
        """Generate comprehensive treatment suggestions."""
        findings = analysis_results['findings']
        health_assessment = analysis_results['health_assessment']
        
        treatment_plan = {
            'immediate_actions': [],
            'long_term_plan': [],
            'preventive_measures': [],
            'lifestyle_recommendations': []
        }

        for finding in findings:
            condition = finding['condition']
            condition_info = self.conditions_db.get(condition, {})
            
            treatment = {
                'condition': condition,
                'urgency': 'High' if finding['immediate_attention'] else 'Medium',
                'confidence': finding['confidence'],
                'description': condition_info.get('description', ''),
                'treatments': self._get_treatment_options(condition),
                'prevention': condition_info.get('prevention', []),
                'risk_factors': condition_info.get('risk_factors', []),
                'early_signs': condition_info.get('early_signs', []),
                'estimated_recovery': self._estimate_recovery_time(finding),
                'follow_up': self._recommend_follow_up(finding)
            }

            if finding['immediate_attention']:
                treatment_plan['immediate_actions'].append(treatment)
            else:
                treatment_plan['long_term_plan'].append(treatment)

        # Add general preventive measures
        treatment_plan['preventive_measures'] = [
            "Regular brushing twice daily with fluoride toothpaste",
            "Daily flossing",
            "Regular dental checkups every 6 months",
            "Balanced diet low in sugary foods",
            "Use of antiseptic mouthwash"
        ]

        # Add lifestyle recommendations
        treatment_plan['lifestyle_recommendations'] = [
            "Maintain proper oral hygiene routine",
            "Avoid smoking and limit alcohol consumption",
            "Stay hydrated by drinking plenty of water",
            "Consider using an electric toothbrush",
            "Replace toothbrush every 3-4 months"
        ]

        return treatment_plan

    def _estimate_recovery_time(self, finding):
        """Estimate recovery time based on condition and severity."""
        if finding['severity'] == 'High':
            return "4-6 weeks with immediate treatment"
        elif finding['severity'] == 'Medium':
            return "2-4 weeks with proper care"
        else:
            return "1-2 weeks with recommended treatment"

    def _recommend_follow_up(self, finding):
        """Recommend follow-up timeline based on condition."""
        if finding['immediate_attention']:
            return "Schedule follow-up within 1 week of treatment"
        elif finding['severity'] == 'Medium':
            return "Follow-up in 2-3 weeks"
        else:
            return "Regular checkup in 6 months"

    def _get_treatment_options(self, condition):
        """Map conditions to possible treatment options."""
        treatment_map = {
            "Cavity": [
                "Dental filling",
                "Composite restoration",
                "Regular cleaning and fluoride treatment"
            ],
            "Healthy Tooth": [
                "Regular cleaning",
                "Preventive care",
                "Regular check-ups"
            ]
        }
        
        return treatment_map.get(condition, ["Consultation required"]) 