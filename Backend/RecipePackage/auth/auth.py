from flask import Blueprint, jsonify, request,url_for
import random
from flask_jwt_extended import create_access_token
import os
import json
import datetime
from RecipePackage.Mail.mailsender import send_email
from RecipePackage.Models.models import User,db
from werkzeug.security import generate_password_hash,check_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity
import base64
from RecipePackage.oauth import oauth





authp = Blueprint('auth', __name__)

otp_store = {}



def otpgen():
    otp = random.randint(100000, 999999)
    return otp


 




@authp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'success': False, 'message': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

    # ✅ JWT Token valid for 30 days
    access_token = create_access_token(identity=str(user.id))


    return jsonify({'success': True, 'token': access_token, 'message': 'Login successful'}), 200
    
    
    
    
    
    
    
    
    
    

@authp.route('/send-email-otp-register', methods=['Post'])
def getotp():
    data={}
    data=request.get_json()
    print(data)
    print(data.get('email'))
    email= data.get('email')
    if not email:
        return jsonify({
            'success':False,
            'message':'Email is required',
        }),400
    if User.query.filter_by(email=email).first():
        return jsonify({
            'success':False,
            'message':'Email already exists',
        }),400
    otp= otpgen()
    otp_store[data.get('email')] = otp
    print ("Stored Otp")
    print(otp_store)
    send_email(
        subject="Your Registration Otp",
        recipient=data.get('email'),
        body=f"Your OTP is {otp}"
    )
    print(f'Your OTP is {otp}')
    return jsonify({
        'success': True,
        'message': 'Otp sent to your email',
    }), 200
    
@authp.route('/register',methods=['post'])
def register():
    
    
    data=request.get_json()
    name=data.get('name')
    email=data.get('email')
    password=data.get('password')
    otp=int(data.get('otp'))
    print(name,email,password,otp)
    if not all([name, email, password, otp]):
        return jsonify({
            'success':False,
            'message':'All fields are required',
        }),400
    print("Entered1")
    if User.query.filter_by(email=email).first():
        return jsonify({
            'success':False,
            'message':'Email already exists',
        }),400
    print("Entered2")
    print(otp_store)
    if email not in otp_store or otp_store[email] != otp:
        return jsonify({
            'success':False,
            'message':'Invalid OTP',
        }),400
    print("Entered3")
    hashed_password = generate_password_hash(password)
    new_user = User(
        name=name,
        email=email,
        password=hashed_password,
    )
    db.session.add(new_user)
    db.session.commit()
    del otp_store[email]
    return jsonify({
        'success':True,
        'message':'registratiion Successful',
    }),200
    
    






   
@authp.route('/send-email-otp-forgotpassword', methods=['POST'])
def send_email_otp():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'success': False, 'message': 'Email is required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'success': False, 'message': 'Email not registered'}), 400

    otp = otpgen()
    otp_store[email] = otp
    print(f"Generated OTP for {email}: {otp}")
    send_email(
        subject="Your forgot password Otp",
        recipient=data.get('email'),
        body=f"Your OTP is {otp}"
    )
    
    return jsonify({
        'success': True,
        'message': 'Otp sent to your email',
    }), 200
    
    
@authp.route('/forgot-password/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    email = data.get('identifier')
    otp = int(data.get('otp', 0))

    if not email or otp == 0:
        return jsonify({'success': False, 'message': 'Invalid request'}), 400

    if otp_store.get(email) != otp:
        return jsonify({'success': False, 'message': 'Invalid OTP'}), 400

    return jsonify({'success': True, 'message': 'OTP verified'}), 200



@authp.route('/forgot-password/reset', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('identifier')
    new_password = data.get('newPassword')

    if not email or not new_password:
        return jsonify({'success': False, 'message': 'Missing fields'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404

    hashed = generate_password_hash(new_password)
    user.password = hashed
    db.session.commit()

    otp_store.pop(email, None)

    return jsonify({'success': True, 'message': 'Password reset successful'}), 200

    
    
    
    
    
@authp.route('/', methods=['GET'])
def index():
    return f'{otp_store}', 200









#Testing Point


@authp.route('/whoami', methods=['GET'])
@jwt_required()
def whoami():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404

    # Convert image BLOB to base64 string
    image_base64 = base64.b64encode(user.image).decode('utf-8') if user.image else None

    return jsonify({
        'success': True,
        'user': {
            'name': user.name,
            'email': user.email,
            'phone': user.phone,
            'age': user.age,
            'bio': user.bio,
            'image': f"data:image/png;base64,{image_base64}" if image_base64 else None
        }
    }), 200
    
@authp.route('/update-profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    user.name = request.form.get('name')
    user.email = request.form.get('email')
    user.phone = request.form.get('phone')
    user.age = request.form.get('age')
    user.bio = request.form.get('bio')

    if 'image' in request.files:
        image_file = request.files['image']
        user.image = image_file.read()
        # user.image_mimetype = image_file.mimetype  # Optional but useful

    db.session.commit()
    return jsonify({'success':True}), 200




@authp.route('/google-login',methods=['Get'])
def google_login():
    google = oauth.create_client('google')
    redirect_uri = url_for('auth.google_callback', _external=True)
    return google.authorize_redirect(redirect_uri)

@authp.route('/google/callback')
def google_callback():
    google = oauth.create_client('google')
    token = google.authorize_access_token()
    resp = google.get('userinfo')
    user_info = resp.json()

    # Optional: store user if new
    email = user_info.get('email')
    name = user_info.get('name')
    print(email,name)

    if not email:
        return jsonify({'success': False, 'message': 'Google account did not return email'}), 400

    user = User.query.filter_by(email=email).first()
    dummy_password = generate_password_hash('oauth-google-account')
    if not user:
        user = User(name=name, email=email, password=dummy_password)  # No password
        db.session.add(user)
        db.session.commit()

    access_token = create_access_token(identity=str(user.id))
    return f"""
<script>
  window.opener.postMessage({{
    token: "{access_token}",
    message: "Login with Google successful"
  }}, "http://localhost:5173");
  window.close();
</script>
"""