
# Vital Skill Indicator - Full Stack Project: Setup & Run Guide

Welcome! This is your complete guide to setting up and running the **Vital Skill Indicator**, a full-stack AI-powered career intelligence platform. Follow these instructions carefully to get the entire application working on your local machine for your project demonstration.

## Project Architecture Overview

This application has two main parts that must be run at the same time:

1.  **Python Backend (in the `backend` folder):** A Flask server that performs live web scraping (BeautifulSoup), Natural Language Processing (NLP), and communicates with the Gemini API. It powers the "Analyze the Market" feature.
2.  **React Frontend (in the main folder):** A modern, interactive user interface that displays the data from the backend and handles the advanced AI coaching features (like the Career Timeline and Growth Plan) by communicating directly with the Gemini API.

---

## Part 1: Prerequisites (Check this first!)

Before you begin, make sure you have the following installed on your computer:

1.  **Python (version 3.8 or newer):** Open your terminal and run `python --version` to check.
2.  **Node.js and npm (version 18 or newer):** Open your terminal and run `node -v` and `npm -v` to check.
3.  **A Gemini API Key:** You must have your secret API key from Google AI Studio.

---

## Part 2: One-Time Setup

You only need to do these steps once.

### Step A: Setup the Python Backend

1.  **Navigate to the Backend Folder:**
    Open your terminal (Command Prompt, PowerShell, or Terminal on Mac) and navigate into the `backend` folder.
    ```bash
    cd path/to/your-project/backend
    ```

2.  **Create a Python Virtual Environment:** This is a critical step to keep your project's libraries organized.
    ```bash
    python -m venv venv
    ```

3.  **Activate the Virtual Environment:**
    -   **On Windows:** `venv\Scripts\activate`
    -   **On macOS/Linux:** `source venv/bin/activate`
    *(Your terminal prompt should now start with `(venv)`)*

4.  **Install All Python Libraries:** This command reads the `requirements.txt` file and installs Flask, BeautifulSoup, NLTK, etc.
    ```bash
    pip install -r requirements.txt
    ```

5.  **Create the Backend `.env` File:** This file will securely hold your API key for the backend.
    -   Inside the `backend` folder, create a new file named exactly `.env`
    -   Open the file and add your Gemini API key. **Replace `YOUR_GEMINI_API_KEY_HERE` with your actual key.**
        ```
        API_KEY=YOUR_GEMINI_API_KEY_HERE
        ```

### Step B: Setup the React Frontend

1.  **Navigate to the Main Project Folder:**
    In your terminal, go back to the main project folder (the one containing `index.html`).
    ```bash
    cd .. 
    ```

2.  **Install All Node.js Packages:** This command reads the `package.json` file (implicitly) and installs React and other necessary libraries.
    ```bash
    npm install
    ```

3.  **Create the Frontend `.env` File:** The frontend also needs the API key for its advanced AI features.
    -   Inside the **main project folder**, create a new file named exactly `.env`
    -   Open it and add the same line as before:
        ```
        API_KEY=YOUR_GEMINI_API_KEY_HERE
        ```

**Setup is complete!** You are now ready to run the application.

---

## Part 3: Running the Application (For Your Demonstration)

You will need **two separate terminals** open and running at the same time.

### Terminal 1: START THE BACKEND

1.  Open a terminal and navigate to the `backend` folder.
2.  Activate the virtual environment: `source venv/bin/activate` (or `venv\Scripts\activate` on Windows).
3.  Run this command to start your Python server:
    ```bash
    flask run
    ```
4.  The server is now running! You will see log messages, including `Running on http://127.0.0.1:5000`. **Leave this terminal open and running.**

### Terminal 2: START THE FRONTEND

1.  Open a **brand new** terminal window.
2.  Navigate to the **main project folder**.
3.  Run this command to start the frontend development server:
    ```bash
    npm run dev
    ```
4.  Your terminal will give you a local URL, usually `http://localhost:5173` or similar. **Open this URL in your web browser.**

### You are Live!

The "Vital Skill Indicator" application should now be running in your browser.

-   You can demonstrate the **AI Career Coach** features first.
-   When you demonstrate the **"Analyze the Market"** feature, point your professor to your **first terminal window (the Flask server)**. They will see live log messages as your Python backend scrapes the web in real-time. This is the proof that your full-stack application is working perfectly.
