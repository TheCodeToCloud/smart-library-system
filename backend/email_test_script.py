import os
import smtplib
from email.message import EmailMessage

EMAIL_HOST_USER = 'alokguptagupta82@gmail.com'
EMAIL_HOST_PASSWORD = 'pgpccbevwneindyp'
TO_EMAIL = 'yrai0054@gmail.com'

try:
    print("Testing email connection...")
    msg = EmailMessage()
    msg.set_content("This is a test email from your Library Management System to check if the credentials work.")
    msg['Subject'] = 'Test Email Connection'
    msg['From'] = EMAIL_HOST_USER
    msg['To'] = TO_EMAIL

    # Connect to Gmail SMTP
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(EMAIL_HOST_USER, EMAIL_HOST_PASSWORD)
    server.send_message(msg)
    server.quit()
    print("Email sent successfully!")
except Exception as e:
    print(f"Failed to send email. Error: {e}")
