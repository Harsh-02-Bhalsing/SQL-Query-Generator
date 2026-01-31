from fastapi import Header, HTTPException
from firebase_admin import auth

def get_current_user_id(authorization: str = Header(...)):
    """
    Extracts and verifies Firebase ID token.
    Returns authenticated user's UID.
    """

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header format",
        )

    token = authorization.split("Bearer ")[1]

    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token["uid"]

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired authentication token",
        )
