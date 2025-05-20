# MedSync

**MedSync** is a secure, blockchain‑backed platform for storing and managing medical records and information. Designed as a final‑year college project, it combines distributed ledger technology with AI‑powered medical assistance to ensure safety, privacy, and convenience for patients and healthcare providers.

## 🏆 Project Highlights

* **Blockchain Security**: Immutable storage of patient records on a decentralized network.
* **Medical AI Assistant**: Natural language interface for answering medical questions.
* **Hospital Finder**: Geolocation‑based search to locate nearby hospitals and clinics.
* **Prescription & Medication Tracker**: Tools to manage prescriptions, track dosages, and schedule reminders.
* **Privacy & Compliance**: Role‑based access control, end‑to‑end encryption, and audit logs.

## Features

| Module                   | Description                                                 |
| ------------------------ | ----------------------------------------------------------- |
| **Record Storage**       | Store and retrieve patient data using smart contracts.      |
| **Medical AI**           | Ask medical‑related queries powered by a trained AI model.  |
| **Hospital Finder**      | Find and view details of nearby medical facilities.         |
| **Prescription Tracker** | Log prescriptions, set dosage reminders, and track history. |
| **Medication Tracker**   | Monitor medication intake and adherence.                    |

## Tech Stack

* **Backend**: Python, FastAPI, Web3.py
* **Blockchain**: Ethereum (Ganache for local development)
* **Smart Contracts**: Solidity, Truffle
* **AI Module**: TensorFlow / PyTorch NLP model
* **Frontend**: React, Bootstrap
* **Database**: IPFS (off‑chain file storage)

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

## Usage

1. Register as a patient or provider.
2. Upload or view medical records—securely stored on the blockchain.
3. Interact with the Medical AI Assistant via chat input.
4. Use the Hospital Finder map to search for facilities.
5. Add and manage prescriptions and medication schedules.

## Project Structure

````plaintext
medsync/
├── blockchain/          # Smart contracts, migrations, and artifacts
├── public/              # Static assets and index.html
├── server/              # FastAPI backend server (or Node/Express if applicable)
│   ├── main.py          # Entry point for API
│   └── ...              # Other server modules
├── src/                 # Frontend React/Vite application source code
│   ├── App.jsx          # Main React component
│   └── ...              # Other React components and pages
├── .env                 # Environment variables for dev and production
├── .gitignore           # Git ignore rules
├── README.md            # Project documentation
├── eslint.config.js     # Linting configuration
├── package.json         # Frontend & dev scripts dependencies
├── package-lock.json    # Locked dependency versions
├── pull.bat             # Windows script to fetch updates
├── push.bat             # Windows script to push changes
└── vite.config.js       # Vite build and dev server configuration
````

## Contributing

This is a college final‑year project. Contributions from peers, mentors, and educators are welcome—please submit issues or pull requests.


Developed by Mohamed Sameer & Muhammed Aakif