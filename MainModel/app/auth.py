from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_user, logout_user, login_required, UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

auth = Blueprint('auth', __name__)

# Temporary user storage (replace with database in production)
class User(UserMixin):
    def __init__(self, id, email, username, password_hash):
        self.id = id
        self.email = email
        self.username = username
        self.password_hash = password_hash

users = {}

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        user = next((u for u in users.values() if u.email == email), None)
        
        if user and check_password_hash(user.password_hash, password):
            login_user(user)
            return redirect(url_for('main.dashboard'))
            
        flash('Please check your login details and try again.')
        return redirect(url_for('auth.login'))
    
    return render_template('login.html')

@auth.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form.get('email')
        username = request.form.get('username')
        password = request.form.get('password')
        
        if any(u.email == email for u in users.values()):
            flash('Email address already exists')
            return redirect(url_for('auth.register'))
        
        user_id = len(users) + 1
        user = User(
            id=user_id,
            email=email,
            username=username,
            password_hash=generate_password_hash(password)
        )
        users[user_id] = user
        
        return redirect(url_for('auth.login'))
    
    return render_template('register.html')

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.index'))

# User loader for Flask-Login
from app import login_manager

@login_manager.user_loader
def load_user(user_id):
    return users.get(int(user_id)) 