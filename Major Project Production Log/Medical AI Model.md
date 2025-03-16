
## Setup WSL (Windows)

### Install WSL and Ubuntu

`wsl --install`

### `Connect to a WSL Instance in a new window`

`wsl -d Ubuntu`

## `Install Ollama`

[https://ollama.com/download](https://ollama.com/download)

### `Add a model to Ollama`

`ollama pull llama2`

## "Watch" GPU Performance in Linux

`watch -n 0.5 nvidia-smi`

-----------
-----------

optional below:

## Install Docker`

`# Add Docker's official GPG key:`  
`sudo apt-get update`  
`sudo apt-get install ca-certificates curl`  
`sudo install -m 0755 -d /etc/apt/keyrings`  
`sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc`  
`sudo chmod a+r /etc/apt/keyrings/docker.asc`

`# Add the repository to Apt sources:`  
`echo \`  
`"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \`  
`$(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \`  
`sudo tee /etc/apt/sources.list.d/docker.list > /dev/null`  
`sudo apt-get update`

`#Install Docker``sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin`

## Run Open WebUi Docker Container`

`docker run -d --network=host -v open-webui:/app/backend/data -e OLLAMA_BASE_URL=http://127.0.0.1:11434 --name open-webui --restart always ghcr.io/open-webui/open-webui:main

-------------

-----------


To create a chatbot using **Ollama** and integrate it with your web application (a **MERN stack** or similar), follow these steps:

---

### **Overview**

1. **Backend Setup**:
    
    - Use the **Ollama API** to handle prompt responses.
    - Expose the locally running Ollama API via a custom backend or directly use it.
2. **Frontend Integration**:
    
    - Build a user interface for the chatbot in your web app.
    - Send user messages (prompts) to your backend and display responses.
3. **Deployment**:
    
    - If needed, expose your local Ollama API using tools like **ngrok** or deploy it to a server.

---

### **Step-by-Step Guide**

#### **1. Run Ollama Locally**

Ensure the Ollama model is running locally on your machine:

```bash
ollama serve
```

The default endpoint for Ollama's local API is:

- **`http://localhost:11434/api/generate`**

---

#### **2. Build the Backend**

Your backend will act as a bridge between the Ollama API and your frontend.

##### **Python Backend with Flask**

```python
from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

OLLAMA_URL = "http://localhost:11434/api/generate"

@app.route('/chat', methods=['POST'])
def chat():
    try:
        # Get the prompt from the frontend
        data = request.json
        prompt = data.get("prompt")
        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400

        # Send the prompt to the Ollama API
        response = requests.post(
            OLLAMA_URL,
            json={"model": "medllama2", "prompt": prompt},
            stream=True
        )

        # Collect the streamed response
        result = ""
        for line in response.iter_lines(decode_unicode=True):
            if line.strip():
                result += line

        return jsonify({"response": result}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(port=5000, debug=True)
```

1. Replace `"llama2"` with the name of your Ollama model. (Replaced)
2. Start the backend with:
    
    ```bash
    python app.py
    ```
    
    This exposes the API at **`http://localhost:5000/chat`**.

---

#### **3. Create the Frontend Chatbot Interface**

Build a simple chatbot interface using **HTML** and **JavaScript**.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chat with Ollama</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    #chatBox {
      border: 1px solid #ccc;
      padding: 10px;
      height: 400px;
      overflow-y: auto;
      margin-bottom: 10px;
    }
    #inputForm {
      display: flex;
    }
    #userInput {
      flex: 1;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    button {
      padding: 10px;
      margin-left: 10px;
      border: none;
      background-color: #007bff;
      color: white;
      cursor: pointer;
    }
    button:hover {
      background-color: #0056b3;
    }
    .user, .bot {
      margin: 5px 0;
      padding: 10px;
      border-radius: 10px;
    }
    .user {
      background-color: #e7f3ff;
      align-self: flex-end;
    }
    .bot {
      background-color: #f1f1f1;
    }
  </style>
</head>
<body>
  <h1>Chat with Ollama</h1>
  <div id="chatBox"></div>
  <form id="inputForm">
    <input type="text" id="userInput" placeholder="Type your message..." required />
    <button type="submit">Send</button>
  </form>

  <script>
    const chatBox = document.getElementById('chatBox');
    const inputForm = document.getElementById('inputForm');
    const userInput = document.getElementById('userInput');

    inputForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const prompt = userInput.value;
      if (!prompt) return;

      // Display user message in the chatbox
      const userMessage = document.createElement('div');
      userMessage.className = 'user';
      userMessage.textContent = prompt;
      chatBox.appendChild(userMessage);

      // Clear the input field
      userInput.value = '';

      // Fetch the bot's response
      try {
        const res = await fetch('http://localhost:5000/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });

        if (res.ok) {
          const data = await res.json();
          const botMessage = document.createElement('div');
          botMessage.className = 'bot';
          botMessage.textContent = data.response || 'No response from the model.';
          chatBox.appendChild(botMessage);
        } else {
          const error = await res.json();
          alert(`Error: ${error.error}`);
        }
      } catch (err) {
        alert(`Error: ${err.message}`);
      }
    });
  </script>
</body>
</html>
```

1. Save this as `index.html`.
2. Open it in a browser.
3. When you send a message, it will call the Flask API to get a response from the Ollama model.

---

#### **4. (Optional) Expose Locally Hosted Ollama**

If you want your chatbot to work over the internet:

- Use **ngrok** to expose your local Flask API:
    
    ```bash
    ngrok http 5000
    ```
    
    Replace `http://localhost:5000` in the frontend with the ngrok URL.

---

### **Deploying in Production**

1. **Backend**:
    
    - Deploy the Flask backend to **AWS**, **Google Cloud**, or **Heroku**.
    - Alternatively, use **Docker** to containerize the backend.
2. **Frontend**:
    
    - Integrate the chatbot into your existing **React.js** frontend by replacing the `fetch` URL.
3. **Ollama**:
    
    - If your server is powerful, run Ollama directly on it.
    - Use GPU for faster inference.

---

