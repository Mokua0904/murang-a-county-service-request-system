# Murang'a County Public Service Request System

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

A mini eCitizen-style web application designed for Murang'a County residents to report municipal issues (such as broken streetlights, water leaks, and uncollected garbage) and track their resolution.

This platform bridges the gap between citizens and county administration by providing a transparent, modern portal for civic reporting and a powerful administrative dashboard for county staff.






## ✨ Features

### 👤 Citizen Portal
*   **Secure Authentication:** Resident registration and login.
*   **Issue Reporting:** Submit requests with category, description, exact map location, and optional photo evidence.
*   **Status Tracking:** Real-time workflow monitoring (`Pending` → `In Progress` → `Resolved`).

### 🛡️ Admin Dashboard
*   **Management Console:** Centralized view for county staff to manage all incoming requests.
*   **Analytics:** Real-time metrics showing open vs. resolved cases.
*   **Automated Assignment (Bonus):** Intelligent agent routing based on Zone, Skill, and Shift.
*   **SLA Monitoring (Bonus):** Service Level Agreement time tracking to ensure timely resolution.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) | SPA for fast, responsive citizen and admin interfaces. |
| **Backend** | Python (FastAPI) | High-performance async API handling business logic. |
| **Database** | MongoDB | NoSQL document store for flexible request data and geo-location. |

---

## 📋 Prerequisites

Ensure you have the following installed before proceeding:

*   **Node.js** (v18 or higher) & **npm** ([Download](https://nodejs.org/))
*   **Python** (v3.10 or higher) ([Download](https://www.python.org/))
*   **MongoDB** (v6.0 or higher) ([Download](https://www.mongodb.com/try/download/community))
*   **Git** ([Download](https://git-scm.com/))

---

## 🚀 Local Setup

### 1. Database Setup
Ensure your MongoDB instance is running locally on the default port. The application expects the connection string:
`mongodb://localhost:27017`

### 2. Backend Setup
Open a terminal and navigate to the backend directory:

    cd backend
    python -m venv venv

Activate the virtual environment:
*   **Windows:**
        .\venv\Scripts\activate
*   **Mac/Linux:**
        source venv/bin/activate

Install dependencies and run the server:

    pip install -r requirements.txt
    uvicorn app.main:app --reload

*The backend API will be available at `http://127.0.0.1:8000`.*

### 3. Frontend Setup
Open a **new** terminal and navigate to the frontend directory:

    cd frontend
    npm install
    npm run dev

*The frontend application will be available at `http://localhost:5173`.*

---

## ⚙️ Configuration

*(If your project uses environment variables, create a `.env` file in the backend directory. Below is an example of what you might include.)*

| Variable | Description | Required | Default |
| :--- | :--- | :--- | :--- |
| `MONGO_URI` | MongoDB connection string | Yes | `mongodb://localhost:27017` |
| `DB_NAME` | Name of the MongoDB database | Yes | `muranga_service_db` |
| `SECRET_KEY` | Key for JWT token generation | Yes | *(generate a random string)* |

---

## 📖 Usage

1.  Open `http://localhost:5173` in your browser.
2.  Click **Submit a Request** to create a citizen account and report an issue.
3.  Click **Admin Dashboard** to log in as staff and manage the request status.

---

## 📁 Project Structure

    murang-a-county-service-request-system/
    │
    ├── backend/                # FastAPI Application
    │   ├── app/                # Core application logic
    │   │   ├── main.py         # Entry point
    │   │   ├── models/         # MongoDB schemas
    │   │   └── routes/         # API endpoints
    │   ├── requirements.txt    # Python dependencies
    │   └── venv/               # Virtual environment (ignored in git)
    │
    ├── frontend/               # React Application
    │   ├── src/                # Source files
    │   │   ├── components/     # Reusable UI components
    │   │   ├── pages/          # View pages (Citizen/Admin)
    │   │   └── App.jsx         # Main app component
    │   ├── package.json        # Node dependencies
    │   └── vite.config.js      # Vite configuration
    │
    ├── .gitignore              # Git ignore rules
    └── README.md               # Project documentation

---
