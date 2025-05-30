# Azure Cost Dashboard

A comprehensive web application for visualizing and analyzing Azure cost data. This dashboard provides detailed insights into subscription costs, resource utilization, and spending patterns across your Azure infrastructure.

## Features

- **Cost Visualization**
  - Interactive monthly cost bar charts
  - Top 5 cost analysis by:
    - Subscriptions
    - Applications
    - Service Names
    - Resources

- **Advanced Filtering**
  - Date range selection
  - Subscription filtering
  - Application filtering
  - Resource filtering
  - Service name filtering

- **Real-time Updates**
  - Dynamic data processing
  - Instant visualization updates
  - Responsive UI

## Technical Stack

- **Backend**: Flask (Python)
- **Frontend**: Vue.js, Chart.js
- **Styling**: Tailwind CSS
- **Data**: CSV Processing

## Quick Start

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Place your Azure cost data CSV file as `Costdetails-Feb.csv` in the root directory

4. Run the application:
   ```bash
   python -m flask run
   ```

5. Access the dashboard at `http://localhost:5000`

## Documentation

For detailed information about the application's architecture, class diagrams, and API endpoints, please see the [Documentation](documentation.md).

## Data Format

The application expects a CSV file with the following columns:
- SubscriptionId
- ServiceName
- ResourceGroupName
- Cost
- APPLICATION
- SUBSCRIPTIONNAME
- CLARITYID
- BILLINGCONTACT
- COSTCENTER
- ENVIRONMENT
- DISPLAYNAME
- EMAIL
- StartDate

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.