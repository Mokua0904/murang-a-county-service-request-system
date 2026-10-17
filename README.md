Murang'a County Public Service Request System

A mini eCitizen-style web application designed for Murang'a County residents to report municipal issues (such as broken streetlights, water leaks, and uncollected garbage) and track their resolution.

Features

Citizen Portal: Secure registration and login for residents. Citizens can submit requests with a category, description, exact map location, and an optional photo.

Admin Dashboard: A dedicated console for county staff to view all incoming
requests and track analytics.

Status Tracking: Requests move through a clear workflow: Pending → In Progress → Resolved.

Analytics: Real-time dashboard showing the number of open vs. resolved cases.

Bonus Features: Automated agent assignment (based on Zone, Skill, and Shift) and SLA (Service Level Agreement) time monitoring.

Tech Stack

Frontend: React (Vite), CSS

Backend: Python (FastAPI)

Database: MongoDB
Local Setup Instructions

1. Database Setup

Ensure MongoDB is running locally on your machine (mongodb://localhost:27017).

2. Backend Setup

Open a terminal and navigate to the backend folder:
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
The backend will run on http://127.0.0.1:8000.

3. Frontend Setup

Open a new terminal and navigate to the frontend folder:
cd frontend
npm install
npm run dev
The application will be available at http://localhost:5173.

Usage

Open http://localhost:5173 in your browser.

Click Submit a Request to create a citizen account and report an issue.

Click Admin Dashboard to log in as staff and manage the request status.
