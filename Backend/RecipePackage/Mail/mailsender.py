import json
import os
from flask_mail import Mail, Message
from flask import current_app

mail = Mail()

# Load mail config directly
with open(os.path.join(os.path.dirname(__file__), '../../config.json')) as f:
    mail_config = json.load(f)["mail"]

def init_mail(app):
    """Initialize mail system with config.json values."""
    app.config['MAIL_SERVER'] = mail_config["smtp_server"]
    app.config['MAIL_PORT'] = mail_config["smtp_port"]
    app.config['MAIL_USERNAME'] = mail_config["sender_email"]
    app.config['MAIL_PASSWORD'] = mail_config["sender_password"]
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
    mail.init_app(app)

def send_email(subject, recipient, body,html=None):
    """Send an email using the initialized mail system."""
    msg = Message(
        subject=subject,
        sender=current_app.config['MAIL_USERNAME'],
        recipients=[recipient],
        body=body,
        html=html
    )
    mail.send(msg)
