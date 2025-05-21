# Local LLM Integration for MedSync

This branch contains the **Local Large Language Model (LLM)** integration for the MedSync platform. It enables intelligent, privacy-conscious AI features such as medical Q&A, health recommendations, and contextual assistance—**without sending sensitive data to external APIs**.

---

## Overview

This module powers the **Medical AI Assistant** in MedSync using a **locally hosted LLM**, ensuring all natural language processing happens **offline** or **within secure boundaries**.

---

## Key Features

-  **Chatbot-style Medical Q&A**  
  Users can ask medical-related questions in plain English.

-  **Fully Local Execution**  
  No third-party API calls—ensures maximum data privacy and HIPAA-friendly compliance.

-  **Fast Inference**  
  Optimized for on-device inference using quantized models.

-  **Modular Design**  
  Easily switch between LLM models (e.g., Gemma, LLaMA, Mistral).

---

## Project Structure

``` structure
├── .vscode/ # VS Code specific settings
├── flask_session/ # Session data for Flask
├── static/ # Static files (CSS, JS, images, etc.)
├── templates/ # HTML templates for Flask
├── LICENSE # License file
├── README.md # Project documentation
├── app.py # Main Flask application
├── medquad.csv # CSV data file [ Medical related Question ]
```

