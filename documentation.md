# Azure Cost Dashboard Documentation

## Architecture Overview

The Azure Cost Dashboard is a web application that provides visualization and analysis of Azure cost data. It uses a Flask backend for data processing and a Vue.js frontend for interactive visualizations.

## Class Diagram

```mermaid
classDiagram
    class CostDashboard {
        -costData: List
        -filteredData: List
        +loadData()
        +processData()
        +calculateTop5Subscriptions()
        +calculateTop5Applications()
        +calculateTop5Services()
        +calculateTop5Resources()
        +createCostByMonthChart()
    }
    
    class DataProcessor {
        +parse_date(date_str: str)
        +parse_float(value: str)
        +load_data()
    }
    
    class APIEndpoints {
        +get_top5_subscriptions()
        +get_top5_applications()
        +get_top5_services()
        +get_top5_resources()
        +get_sum_of_cost()
    }
    
    CostDashboard --> DataProcessor
    CostDashboard --> APIEndpoints
```

## Sequential Diagram

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant DataProcessor
    
    User->>Frontend: Access Dashboard
    Frontend->>Backend: Request Initial Data
    Backend->>DataProcessor: Load CSV Data
    DataProcessor-->>Backend: Return Processed Data
    Backend-->>Frontend: Return Dashboard Data
    Frontend->>Frontend: Render Visualizations
    
    User->>Frontend: Apply Filters
    Frontend->>Frontend: Process Filter
    Frontend->>Frontend: Update Visualizations
    
    User->>Frontend: Select Different View
    Frontend->>Backend: Request Specific Data
    Backend-->>Frontend: Return View Data
    Frontend->>Frontend: Update View
```

## User Flow Diagram

```mermaid
graph TD
    A[User Access] --> B[Dashboard Overview]
    B --> C{User Action}
    C -->|View Costs| D[Cost Analysis]
    C -->|Apply Filters| E[Filtered View]
    C -->|Select Time Period| F[Time-based Analysis]
    
    D --> G[Top 5 Subscriptions]
    D --> H[Top 5 Applications]
    D --> I[Top 5 Services]
    D --> J[Top 5 Resources]
    
    E --> K[Update Charts]
    E --> L[Update Tables]
    
    F --> M[Monthly Cost Chart]
    F --> N[Cost Trends]
```

## Technical Stack

- **Backend**:
  - Python 3.x
  - Flask Framework
  - CSV Data Processing
  
- **Frontend**:
  - Vue.js (via CDN)
  - Chart.js for visualizations
  - Tailwind CSS for styling
  
- **Data Format**:
  - CSV with fields:
    - SubscriptionId
    - ServiceName
    - ResourceGroupName
    - Cost
    - APPLICATION
    - SUBSCRIPTIONNAME
    - Other metadata fields

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/cost-data` | GET | Retrieve all cost data |
| `/api/top5Subscriptions` | GET | Get top 5 subscriptions by cost |
| `/api/top5Applications` | GET | Get top 5 applications by cost |
| `/api/top5ServiceNames` | GET | Get top 5 services by cost |
| `/api/top5Resources` | GET | Get top 5 resources by cost |
| `/api/sumOfCost` | GET | Get cost summary by month |

## Data Flow

1. CSV data is loaded and processed by the Flask backend
2. Frontend requests data through API endpoints
3. Data is processed and filtered based on user selections
4. Visualizations are updated using Chart.js
5. User interactions trigger real-time updates

## Security Considerations

- Input validation on all API endpoints
- Data sanitization for CSV imports
- Error handling for malformed requests
- No sensitive data exposure in frontend
