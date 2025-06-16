from flask import Blueprint, jsonify, request
import random
from RecipePackage.Mail.mailsender import send_email
authp = Blueprint('auth', __name__)

otp_store = {}

def otpgen():
    otp = random.randint(100000, 999999)
    return otp


 



@authp.route('/login', methods=['Post'])
def login():
    # Logic for user login
    # data=request.get_json()
    data=request.get_json()
    print(data)
    print(data.get('email'))
    print(data.get('password'))
    return jsonify({
        'success':True,
        'message': 'Login successful',
        'data': data
    }), 200
    
    

@authp.route('/send-email-otp-register', methods=['Post'])
def getotp():
    data={}
    data=request.get_json()
    print(data)
    print(data.get('email'))
    otp= otpgen()
    otp_store[data.get('email')] = otp
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
    otp=data.get('otp')
    print(name,email,password,otp)
    return jsonify({
        'success':True,
        'message':'registratiion Successful',
    }),200
    
    

   
@authp.route('/send-email-otp-forgotpassword', methods=['Post']) 
def forgot_password():
    data = request.get_json()
    print(data)
    print(data.get('email'))
    otp=otpgen()
    otp_store[data.get('email')] = otp
    send_email(
        subject="Forgot Password Otp",
        recipient=data.get('email'),
        body=f"Your OTP is {otp}"
    )
    return jsonify({
        'success':True,
        'message': 'Password reset link sent',
        'data': data
    }), 200
    
    
@authp.route('/', methods=['GET'])
def index():
    return f'{otp_store}', 200