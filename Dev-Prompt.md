# Travel Reservations App

This project is a simple web application for managing Dashboard. It is built using Flask for the backend and VueJS for the frontend. The application uses local JSON data to simulate a database. VueJS and Tailwind CSS are loaded via CDN, eliminating the need for a frontend build step.

You have a csv named Costdetails-Feb.csv which has cost of all Subscriptions by month and it has all the belowd etails

SubscriptionId","ServiceName","ResourceGroupName","Cost","APPLICATION","SUBSCRIPTIONNAME","CLARITYID","BILLINGCONTACT","COSTCENTER","ENVIRONMENT","DISPLAYNAME","EMAIL","StartDate"


## Features

- View Sum of Cost by Month.
- Top 5 SubscriptionIDs.
- Top 5 Applications.
- Top 5 Service Nmaes.

## Technologies Used

- **Backend**: Flask (Python)
- **Frontend**: VueJS (loaded via CDN), Tailwind CSS (via CDN)
- **Data Storage**: Local Csv files



## Project Structure

```
project-root/
|-- static/          # Contains static files served directly
|   |-- js/          # Copied JavaScript application code
|       |-- main.js
|-- src/             # Frontend source file (not directly served)
|   |-- main.js      # Contains all Vue component logic and templates
|-- templates/       # Contains HTML templates for Flask
|   |-- index.html   # Loads Vue/Tailwind CDN and static/js/main.js
|-- app.py           # Main Flask application
|-- Cosrdetails.json        # Local JSON file for storing hotel and reservation data
|-- requirements.txt # Python dependencies
|-- README.md        # Project documentation
|-- LICENSE          # Project License
|-- Changelog.md     # Change history
```

## Setup Instructions

1.  **Go to FOlder**:
    cd project-root
    ```

2.  **Set up Python Virtual Environment & Install Backend Dependencies**:
    ```bash
    # Set up Python virtual environment (recommended)
    python3 -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`

    # Install Python dependencies
    pip install -r requirements.txt

    # Add a requirements.txt file
    pip freeze > requirements.txt
    ```

3.  **Prepare Frontend JavaScript**:
    The frontend JavaScript (`src/main.js`) needs to be copied to the static directory to be served by Flask.
    ```bash
    # On macOS/Linux
    cp src/main.js static/js/main.js

    # On Windows
    copy src\main.js static\js\main.js
    ```
    *(Note: You need to repeat this copy step whenever you modify `src/main.js`)*

4.  **Run the Application**:
    ```bash
    # Ensure your virtual environment is active
    python3 app.py
    ```
    *(Alternatively, for development mode with auto-reload for backend changes):*
    ```bash
    export FLASK_DEBUG=1 # On Windows use `set FLASK_DEBUG=1`
    python3 -m flask run
    ```

5.  **Access the application**:
    Open your browser and navigate to `http://127.0.0.1:5000`.

## Development

Development involves running the Flask backend and manually copying the frontend JavaScript file after making changes.

1.  **Run the Flask Backend (Development Mode)**:
    ```bash
    # Ensure your virtual environment is active
    export FLASK_DEBUG=1 # On Windows use `set FLASK_DEBUG=1`
    python3 -m flask run
    ```
    The backend will run on `http://127.0.0.1:5000` and automatically reload when backend Python files change.

2.  **Modify Frontend JavaScript**:
    Edit the `src/main.js` file.

3.  **Copy Updated Frontend JavaScript**:
    After saving changes to `src/main.js`, copy it to the static folder:
    ```bash
    # On macOS/Linux
    cp src/main.js static/js/main.js

    # On Windows
    copy src\main.js static\js\main.js
    ```

4.  **Refresh Browser**: Refresh your browser page (`http://127.0.0.1:5000`) to see the frontend changes.

## Usage

- The homepage displays Subtabs Overview it has a haeading like Novartis Dashbaord, Graphs like Sum of COst by StartDate, Top 5 Subscription IDs in table wiht Subscription name and Sum of COst , Simlarly Top5 Applications Application SUm of COst,Top 5 Servcie NAMes  Servcienmae, SUm of Cost, Top 5 Rresources Reource and SUm of Cost


- Fileters on the side of the page would look like below Start Date,Subscription ID,Applciation,Resource,ServiceName etc
- Side tabl will have Overview, Subscription ,Service NAmes, Resources

## API Endpoints (Example)

The Vue frontend interacts with the Flask backend via the following API endpoints:

-   `GET /api/top5Subscriptions`: Retrieves a list of top 5 subscriptions with cost.
-   `GET /api/top5 Applications`: Retrieves a list of top 5 Applciations with cost.
-   `GET /api/top5 ServcieNames`: Retrieves a list of top 5 ServcienMaes with cost.
-   `GET /api/top5 Resources`:    Retrieves a list of top 5 Resources with cost.
-   `GET /api/Sumof Cost`: Retrieves a COst of all SUbscriptions by Month.

*(Note: Update these endpoints based on your actual implementation in `app.py`)*

## Data Management

The application uses a `Cosrdetails-Feb.csv` file to read information about Costs,Subscription and other details like below

**you have  the blelow `data.json` structure:**

```json
SubscriptionId","ServiceName","ResourceGroupName","Cost","APPLICATION","SUBSCRIPTIONNAME","CLARITYID","BILLINGCONTACT","COSTCENTER","ENVIRONMENT","DISPLAYNAME","EMAIL","StartDate"
"3091c0d5-20cc-4a4f-8ada-13fed3f042ae","Microsoft Defender for Cloud","","0.09",,"Access to Azure Active Directory(Converted to EA)",,,,,,,"2024-01-01"
"3091c0d5-20cc-4a4f-8ada-13fed3f042ae","Microsoft Defender for Cloud","cloud-shell-storage-westeurope","7.64","","Access to Azure Active Directory(Converted to EA)","53360","","null","null","","","2024-01-01"
"3091c0d5-20cc-4a4f-8ada-13fed3f042ae","Storage","cloud-shell-storage-westeurope","0.49","","Access to Azure Active Directory(Converted to EA)","53360","","null","null","","","2024-01-01"
"1c328b00-84ce-465b-8734-6080c74a8e76","Azure Applied AI Services","rg-alviss-dev-westeurope-01","5291.92","ALVISS","NBS-DEV-ALVISS-001","null","neha-4.sharma","null","DEV","neha-4.sharma","neha-4.sharma@novartis.com","2024-01-01"
"1c328b00-84ce-465b-8734-6080c74a8e76","Azure Cognitive Search","rg-alviss-dev-westeurope-01","1625.61","ALVISS",

Make sure you use this strucutre in Index.html,Main.js files
```

