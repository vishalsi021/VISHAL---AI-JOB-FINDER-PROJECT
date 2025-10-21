
# Vital Skill Indicator - Python Backend: Setup & Run Guide

This folder contains the Python backend for the Vital Skill Indicator project. It's a Flask server that performs web scraping and NLP to analyze job market data, fulfilling the specific requirements of your project.

## Project Architecture

This project uses a modern, full-stack architecture:

1.  **React Frontend (Main Folder):** A dynamic user interface that provides a rich user experience. It handles all the AI Career Coaching features (like the timeline and growth plan) by calling the Gemini API directly.
2.  **Python Backend (This Folder):** A Flask server that powers the "Analyze the Market" feature. It uses:
    -   **Flask:** To create the web server.
    -   **BeautifulSoup:** To scrape live job data from the web.
    -   **NLTK:** To perform Natural Language Processing (NLP) and extract key skills.
    -   **Gemini API:** To summarize the scraped data into a clean, structured analysis.

The frontend communicates with this backend via a network request, demonstrating a complete full-stack loop.

---

## Part 1: Backend Setup (One-Time Setup)

Follow these steps carefully to get your backend server ready.

### Step 1: Prerequisites

-   Make sure you have **Python 3.8** or newer installed. Check by running `python --version` in your terminal.
-   Make sure you have `pip`, the Python package installer.

### Step 2: Create & Activate a Virtual Environment

This is a crucial best practice to keep project packages isolated.

```bash
# In your terminal, make sure you are inside this 'backend' directory
cd path/to/your/project/backend

# Create a virtual environment named 'venv'
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

> You will see `(venv)` at the beginning of your terminal prompt, which means the environment is active.

### Step 3: Install All Required Libraries

This command reads the `requirements.txt` file and installs everything you need.

```bash
pip install -r requirements.txt
```

### Step 4: Create your Environment File (`.env`)

This is where you'll securely store your secret Gemini API key.

1.  Create a new file named `.env` right inside this `backend` folder.
2.  Open the file and add your Google Gemini API key. **Replace `YOUR_API_KEY_HERE` with your actual key.**

    ```
    API_KEY=YOUR_API_KEY_HERE
    ```

**IMPORTANT:** Never share this `.env` file or commit it to a public GitHub repository.

---

## Part 2: Running the Full Application (For Demonstration)

You will need **two separate terminal windows** open.

### Terminal 1: Start the Python Backend

1.  Open a terminal and navigate to the `backend` folder.
2.  Activate the virtual environment if it's not already active (`source venv/bin/activate` or `venv\Scripts\activate`).
3.  Run this command to start the server:

    ```bash
    flask run
    ```

4.  The server is now running! You will see log messages, including `Running on http://127.0.0.1:5000`. **Leave this terminal open.**

### Terminal 2: Start the React Frontend

1.  Open a **new** terminal window.
2.  Navigate to the **main project folder** (the one above this `backend` folder, containing `index.html`).
3.  **Create a `.env` file here as well** for the frontend's AI features. It should contain the exact same content as the backend's `.env` file:
    ```
    API_KEY=YOUR_API_KEY_HERE
    ```
4.  You need a simple local server to run the frontend. If you don't have one, `Vite` is a great, fast option.
    ```bash
    # Install Vite (if you don't have it)
    npm install vite

    # Start the frontend development server
    npm run dev
    ```
5.  Your terminal will give you a local URL, usually `http://localhost:5173`. Open this URL in your web browser.

### You Are Now Ready to Demonstrate!

-   Use the web application in your browser.
-   When you use the **"Analyze the Market"** feature, point your professor to the **first terminal window (the Flask server)**. They will see live log messages showing the backend scraping data, performing NLP, and returning the results. This is the proof that your full-stack application is working as designed.
