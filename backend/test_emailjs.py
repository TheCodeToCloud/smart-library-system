import urllib.request
import json

payload = {
    "service_id": "service_qhi38c2",
    "template_id": "template_qs49rdd",
    "user_id": "loow2YPEiKxZ_qIR-",
    "template_params": {
        "to_name": "Yogesh Rai",
        "to_email": "yrai0054@gmail.com",
        "subject": "Test EmailJS Script",
        "message": "If you see this, EmailJS API is perfectly working."
    }
}

req = urllib.request.Request("https://api.emailjs.com/api/v1.0/email/send")
req.add_header('Content-Type', 'application/json')
req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
req.add_header('Origin', 'https://smart-library-system-six.vercel.app')

try:
    response = urllib.request.urlopen(req, json.dumps(payload).encode('utf-8'))
    print("Success:", response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("Failed:", e.code, e.read().decode('utf-8'))
except Exception as e:
    print("Error:", str(e))
