from flask import Blueprint, jsonify, request
import random

authp = Blueprint('auth', __name__)

otp_store = {}
print(otp_store)
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
    return jsonify({
        'message': 'Login successful',
        'data': data
    }), 200
    
    

@authp.route('/register', methods=['Post'])
def register():
    data={}
    data=request.get_json()
    print(data)
    print(data.get('email'))
    otp= otpgen()
    otp_store[data.get('email')] = otp
    print(f'Your OTP is {otp}')
    return jsonify({
        'message': 'Registration successful',
        'data': data
    }), 200
   
@authp.route('/forgotpassword', methods=['Post']) 
def forgot_password():
    data = request.get_json()
    print(data)
    print(data.get('email'))
    return jsonify({
        'message': 'Password reset link sent',
        'data': data
    }), 200
    
    
@authp.route('/', methods=['GET'])
def index():
    return f'{otp_store}', 200