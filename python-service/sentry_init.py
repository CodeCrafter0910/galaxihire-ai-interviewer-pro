import os
import sentry_sdk

SENTRY_DSN = os.getenv("SENTRY_DSN", None)
if SENTRY_DSN:
    sentry_sdk.init(dsn=SENTRY_DSN, environment=os.getenv("ENV", "production"))
