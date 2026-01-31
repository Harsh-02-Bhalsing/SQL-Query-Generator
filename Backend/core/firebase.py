import os
import json
import firebase_admin
from firebase_admin import credentials

def initialize_firebase():
    if firebase_admin._apps:
        return

    service_account_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")

    if not service_account_json:
        raise RuntimeError("Firebase service account not configured")

    cred_dict = json.loads(service_account_json)
    cred = credentials.Certificate(cred_dict)

    firebase_admin.initialize_app(cred)
