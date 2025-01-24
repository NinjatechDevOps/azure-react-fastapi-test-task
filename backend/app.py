from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
import requests
import datetime

# Initialize the FastAPI app
app = FastAPI(
    title="Azure B2C Authentication API",
    description="FastAPI application with Azure B2C token validation and production readiness.",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend's domain
    allow_credentials=True,
    allow_methods=["*"],  # You can restrict specific HTTP methods if needed
    allow_headers=["*"],  # You can restrict specific headers if needed
)

# Azure AD B2C Configuration
TENANT = "ninjatech.onmicrosoft.com"
USER_FLOW = "B2C_1_signin_signup"
AUDIENCE = "9089723f-106a-4e66-b0b1-eee0a00b3d74"  # Replace with your Azure AD B2C Application (Client) ID
ISSUER = "https://ninjatech.b2clogin.com/e4e34390-b422-4bc1-a65e-f6bd0af3d79d/v2.0/"
JWKS_URL = "https://ninjatech.b2clogin.com/ninjatech.onmicrosoft.com/B2C_1_signin_signup/discovery/v2.0/keys"

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Fetch Azure AD B2C JWKS
def get_public_key(kid: str):
    response = requests.get(JWKS_URL)
    response.raise_for_status()
    jwks = response.json()
    for key in jwks["keys"]:
        if key["kid"] == kid:
            key["alg"] = "RS256"
            from jose import jwk
            return jwk.construct(key)
    raise HTTPException(status_code=401, detail="Public key not found.")

# Token validation
def validate_token(token: str = Depends(oauth2_scheme)):
    try:
        headers = jwt.get_unverified_header(token)
        kid = headers.get("kid")
        if not kid:
            raise HTTPException(status_code=401, detail="Token header missing 'kid'.")
        public_key = get_public_key(kid)
        payload = jwt.decode(
            token,
            key=public_key,
            algorithms=["RS256"],
            audience=AUDIENCE,
            issuer=ISSUER,
        )
        return payload
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

@app.get("/healthcheck")
def healthcheck(payload: dict = Depends(validate_token)):
    """
    Healthcheck endpoint.
    Returns a status message with the current timestamp.
    """
    return {
        "status": "ok",
        "timestamp": datetime.datetime.utcnow().isoformat(),
    }
    
@app.get('/ping')
def main(request: Request):
    return {
        "Pong"   
    }


@app.exception_handler(HTTPException)
def custom_http_exception_handler(request: Request, exc: HTTPException):
    """
    Custom error handler for HTTP exceptions.
    """
    return JSONResponse(
        content={
            "error": "Request failed",
            "detail": exc.detail,
            "status_code": exc.status_code,
        },
        status_code=exc.status_code,
    )