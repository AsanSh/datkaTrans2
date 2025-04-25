import hmac
import hashlib
import json
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

def validate_telegram_webapp_data(init_data: str) -> Optional[dict]:
    """
    Validate Telegram Web App init data
    """
    try:
        # Parse the init data
        init_data_dict = dict(param.split('=') for param in init_data.split('&'))
        
        # Get the hash from the init data
        received_hash = init_data_dict.pop('hash')
        
        # Sort the parameters alphabetically
        data_check_string = '\n'.join(
            f'{k}={v}' for k, v in sorted(init_data_dict.items())
        )
        
        # Create a secret key using the bot token
        secret_key = hmac.new(
            key=b'WebAppData',
            msg=os.getenv('BOT_TOKEN').encode(),
            digestmod=hashlib.sha256
        ).digest()
        
        # Calculate the hash
        calculated_hash = hmac.new(
            key=secret_key,
            msg=data_check_string.encode(),
            digestmod=hashlib.sha256
        ).hexdigest()
        
        # Compare the hashes
        if calculated_hash != received_hash:
            return None
            
        # Parse and return the user data
        return json.loads(init_data_dict.get('user', '{}'))
    except Exception:
        return None 