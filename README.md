# MedSync

**MedSync** is a secure, blockchain‑backed platform for storing and managing medical records and health information. Designed as a final‑year college project, it integrates distributed ledger technology with AI-powered healthcare assistance to ensure **privacy, security, and accessibility** for patients and healthcare providers alike.

---

## Project Highlights

-  **Blockchain Security**  
  Immutable, tamper-proof medical record storage via decentralized networks.

- **Medical AI Assistant**  
  Natural language chatbot interface for answering health-related queries.

- **Hospital Finder**  
  Geolocation-based search to locate nearby hospitals and clinics.

- **Prescription & Medication Tracker**  
  Manage prescriptions, track dosage schedules, and set reminders.

- **Privacy & Compliance**  
  Role-based access control, end-to-end encryption, and secure audit logs.

---

## Features Overview

| Feature                  | Description                                                 |
|--------------------------|-------------------------------------------------------------|
| **Record Storage**       | Store and retrieve patient data using smart contracts.      |
| **Medical AI**           | NLP-based assistant for medical-related queries.            |
| **Hospital Finder**      | Maps integration to find medical facilities nearby.         |
| **Medication Tracker**   | Log prescriptions, Monitor adherence and intake patterns.   |

---

## Tech Stack

| Layer         | Technologies                              |
|---------------|-------------------------------------------|
| **Frontend**  | React, Vite, Bootstrap                    |
| **Backend**   | Node.js, Express                          |
| **AI Module** | TensorFlow / PyTorch (NLP model)          |
| **Blockchain**| Ethereum, Solidity, Pinata                |
| **Storage**   | IPFS (off‑chain), MongoDB                 |


---

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/sszxt/MedSync.git
   cd MedSync
   ```

2. **Install frontend dependencies**

   ```bash
   npm install
   ```


3. **Run the project**

   ```bash
   npm run dev
   ```

---

## Usage Instructions

1. Register as a patient or provider.
2. Upload or view encrypted medical records stored on the blockchain.
3. Chat with the AI Assistant to ask medical questions.
4. Locate hospitals nearby using the map-based finder.
5. Manage medication by tracking schedules and prescriptions..

---


## Project Structure

```bash

├── backend/                 # Node.js backend (Express)
│   ├── config/              # Configuration files (DB, app settings)
│   ├── controllers/         # Route logic (auth, file, health, meds, users)
│   ├── middleware/          # Custom Express middleware
│   ├── models/              # Mongoose models (MongoDB)
│   ├── routes/              # API route definitions
│   ├── services/            # Email and IPFS services
│   ├── utils/               # Helpers, validators, error handling
│   └── server.js            # Entry point of the backend server
│
├── blockchain/              # React component for Pinata uploads
│   └── PinataUploader.jsx
│
├── public/                  # Static assets
│   └── *.jpeg, *.svg
│
├── server/                  # Secondary backend (possibly chatbot or legacy)
│   ├── models/              # Additional models
│   └── index.js             # Entry for this server
│
├── src/                     # React frontend source code
│   ├── components/          # Reusable UI components
│   ├── pages/               # Page-level components (Dashboard, Login, etc.)
│   ├── context/             # React context (AuthContext)
│   ├── route/               # Route protection
│   └── main.jsx             # React app entry
│
├── index.html               # Main HTML file
├── vite.config.js           # Vite configuration
├── eslint.config.js         # ESLint configuration
├── package.json             # Root dependencies
├── push.bat / pull.bat      # Git helpers for Windows
└── README.md                # You're reading it now!
```

---


## Contributing

This project was developed as part of a final year college curriculum. Contributions from peers, mentors, and educators are highly encouraged. If you'd like to suggest improvements or report issues, feel free to open an issue or submit a pull request.

Developed by Mohamed Sameer and Muhammed Aakif.