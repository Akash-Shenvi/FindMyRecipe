import os
from firebase_functions import https_fn, options

# --- THIS IS THE NEW CODE ---
# Increase the memory from the default 256MiB to 512MiB.
options.set_global_options(memory=options.MemoryOption.MB_512, cpu=1)
# ----------------------------

# This line imports the Flask 'app' object from your existing Start_Server.py file.
from Start_Server import app

# This is the Cloud Function that Firebase will run.
# The name 'recipe_api' must match the function name in firebase.json.
@https_fn.on_request()
def recipe_api(req: https_fn.Request) -> https_fn.Response:
    """Wraps the existing Flask app for Firebase."""
    with app.request_context(req.environ):
        return app.full_dispatch_request()