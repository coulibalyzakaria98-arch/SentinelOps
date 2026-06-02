import hmac
import hashlib
import json
from ..config import settings

# In a production environment, this secret would be stored in an HSM or env var
SECRET_KEY = settings.SECRET_KEY.encode() if hasattr(settings, 'SECRET_KEY') else b"sentinelops-humanitarian-integrity-2026-vault"

def sign_report(data: dict) -> str:
    """
    Cryptographic Signature: Generates an HMAC-SHA256 hash for report integrity.
    Ensures that intelligence collected in the field is not altered during transmission.
    """
    # Normalize data for consistent hashing (sort keys)
    serialized = json.dumps(data, sort_keys=True, default=str).encode()
    return hmac.new(SECRET_KEY, serialized, hashlib.sha256).hexdigest()

def verify_integrity(data: dict, signature: str) -> bool:
    """
    Integrity Verification: Confirms that the report matches its cryptographic signature.
    """
    if not signature:
        return False
    expected = sign_report(data)
    return hmac.compare_digest(expected, signature)
