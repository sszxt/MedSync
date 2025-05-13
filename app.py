import os
import re
import shutil
import subprocess
import logging
import uuid
import pandas as pd
from flask import Flask, request, render_template, Response, stream_with_context, session, jsonify
from flask_session import Session

# ---------------------------
# Configuration
# ---------------------------
class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'replace-this-with-a-secure-key')
    SESSION_TYPE = 'filesystem'
    DEBUG = os.environ.get('DEBUG', 'False') == 'True'
    
    # Ollama settings (Qwen Model)
    OLLAMA_PATH = shutil.which("ollama") or "/usr/local/bin/ollama"
    DEFAULT_MODEL = "qwen2.5:0.5b"
    
    # Available models
    AVAILABLE_MODELS = ["qwen2.5:0.5b"]

    # Server configuration
    HOST = "0.0.0.0"
    PORT = 5000

# ---------------------------
# Initialize Flask Application
# ---------------------------
app = Flask(__name__)
app.config.from_object(Config)
Session(app)

# Configure logging
logging.basicConfig(
    level=logging.DEBUG if app.config['DEBUG'] else logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ---------------------------
# Load CSV Data
# ---------------------------
df = None  # Initialize globally
CSV_FILE_PATH = "data.csv"  # Change this to your actual CSV file name

try:
    if os.path.exists(CSV_FILE_PATH):
        df = pd.read_csv(CSV_FILE_PATH)
        logger.info(f"CSV file '{CSV_FILE_PATH}' loaded successfully.")
    else:
        logger.error(f"CSV file '{CSV_FILE_PATH}' not found!")
except Exception as e:
    logger.error(f"Failed to load CSV file: {str(e)}")

# ---------------------------
# Helper Functions
# ---------------------------
def search_csv(query):
    """Search for relevant information in the CSV file."""
    if df is None:
        logger.error("CSV file is not loaded.")
        return None

    query = query.lower()
    matched_rows = df[df.apply(lambda row: any(query in str(cell).lower() for cell in row), axis=1)]

    if not matched_rows.empty:
        response = "\n".join(matched_rows.iloc[0].astype(str))  # Return first matching row
        logger.info(f"CSV Response: {response}")
        return response
    else:
        return None  # No relevant data found

def generate_chat_id() -> str:
    """Generate a unique chat identifier using UUID4."""
    return str(uuid.uuid4())

def initialize_chat_history(chat_id: str):
    """Initialize chat history for a new chat."""
    if 'chat_histories' not in session:
        session['chat_histories'] = {}
    session['chat_histories'][chat_id] = []
    logger.debug(f"Initialized chat history for chat_id {chat_id}.")

def append_message(chat_id: str, role: str, content: str):
    """Append a message to the chat history."""
    if 'chat_histories' not in session:
        session['chat_histories'] = {}
    if chat_id not in session['chat_histories']:
        initialize_chat_history(chat_id)
    session['chat_histories'][chat_id].append({"role": role, "content": content})
    logger.debug(f"Appended {role} message to chat_id {chat_id}: {content}")

def build_full_prompt(chat_id: str) -> str:
    """Build the full prompt including chat history."""
    full_prompt = ""
    for message in session['chat_histories'].get(chat_id, []):
        role = "Human" if message["role"] == "user" else "Assistant"
        full_prompt += f"{role}: {message['content']}\n"
    return full_prompt

# ---------------------------
# Routes
# ---------------------------
@app.route("/", methods=["GET"])
def index():
    """Render main chat interface."""
    return render_template('index.html', models=Config.AVAILABLE_MODELS)

@app.route("/stream_chat", methods=["POST"])
def stream_chat():
    """Handle chat requests, prioritizing CSV data before using the Qwen model."""
    data = request.get_json(silent=True) or {}
    prompt = data.get("prompt", "").strip()
    chat_id = data.get("chat_id", "").strip()

    if not chat_id:
        return jsonify({"error": "Missing chat_id."}), 400
    if not prompt:
        return jsonify({"error": "Missing prompt."}), 400

    logger.info(f"Received query: {prompt}")

    # 1️⃣ Try fetching answer from CSV
    csv_response = search_csv(prompt)
    if csv_response:
        logger.info("Returning response from CSV.")
        return jsonify({"response": csv_response})

    # 2️⃣ If CSV fails, call Qwen 2.5 model
    logger.info("No relevant info in CSV, using Qwen model.")
    append_message(chat_id, "user", prompt)
    full_prompt = build_full_prompt(chat_id)

    def sse_generator():
        try:
            with subprocess.Popen(
                [Config.OLLAMA_PATH, "run", Config.DEFAULT_MODEL],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                universal_newlines=True,
                bufsize=1
            ) as proc:
                if proc.stdin:
                    proc.stdin.write(full_prompt)
                    proc.stdin.close()
                
                assistant_response = ""
                for line in proc.stdout:
                    assistant_response += line
                    yield f"data: {line}\n\n"

                append_message(chat_id, "assistant", assistant_response.strip())

                return_code = proc.wait()
                if return_code != 0:
                    err_output = proc.stderr.read()
                    yield f"data: Error in model execution: {err_output}\n\n"
                
                yield "data: [DONE]\n\n"
        except Exception as e:
            logger.error(f"Stream error: {str(e)}")
            yield f"data: Exception: {str(e)}\n\n"
            yield "data: [DONE]\n\n"

    return Response(stream_with_context(sse_generator()), mimetype='text/event-stream')

@app.route("/reset_chat", methods=["POST"])
def reset_chat():
    """Reset chat history."""
    data = request.get_json(silent=True) or {}
    chat_id = data.get("chat_id", "").strip()

    if not chat_id:
        return jsonify({"error": "Missing chat_id."}), 400

    if 'chat_histories' in session and chat_id in session['chat_histories']:
        del session['chat_histories'][chat_id]
        return jsonify({"status": f"Chat history for {chat_id} reset."}), 200
    else:
        return jsonify({"error": f"No chat history found for chat_id {chat_id}."}), 404

# ---------------------------
# Main Entry Point
# ---------------------------
if __name__ == "__main__":
    logger.info(f"Starting server on {Config.HOST}:{Config.PORT}")
    app.run(
        host=Config.HOST,
        port=Config.PORT,
        debug=Config.DEBUG,
        threaded=True
    )
