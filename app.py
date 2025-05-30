from flask import Flask, render_template, jsonify, request
from typing import Dict, List, Any, Optional
import json
import csv
from datetime import datetime
import os

app = Flask(__name__)

def parse_date(date_str: str) -> Optional[datetime]:
    """
    Parse a date string into a datetime object.
    
    Args:
        date_str: Date string in YYYY-MM-DD format
        
    Returns:
        datetime object or None if parsing fails
    """
    try:
        return datetime.strptime(date_str, '%Y-%m-%d')
    except (ValueError, TypeError):
        return None

def parse_float(value: str) -> float:
    """
    Parse a string to float, handling empty strings and errors.
    
    Args:
        value: String to convert to float
        
    Returns:
        Float value or 0.0 if conversion fails
    """
    try:
        return float(value) if value.strip() else 0.0
    except (ValueError, TypeError):
        return 0.0

def load_data() -> List[Dict[str, Any]]:
    """
    Load data from CSV file and return as a list of dictionaries.
    
    Returns:
        List of dictionaries containing cost data
    """
    data = []
    try:
        import csv
        with open('Cosrdetails-Feb.csv', 'r', encoding='utf-8-sig') as file:
            reader = csv.DictReader(file)
            for row in reader:
                # Convert Cost to float
                try:
                    row['Cost'] = float(row['Cost'] if row['Cost'].strip() else 0)
                except (ValueError, AttributeError):
                    row['Cost'] = 0.0
                
                # Parse date
                try:
                    if row.get('StartDate'):
                        row['StartDate'] = datetime.strptime(row['StartDate'].strip(), '%Y-%m-%d')
                    else:
                        row['StartDate'] = None
                except (ValueError, AttributeError):
                    row['StartDate'] = None
                
                # Handle empty strings
                for key in row:
                    if isinstance(row[key], str):
                        row[key] = row[key].strip() if row[key].strip() else None
                
                data.append(row)
        return data
    except Exception as e:
        print(f"Error loading data: {e}")
        return []

@app.route('/')
def index():
    """Render the main page with initial data"""
    # Get data for initial page load
    data = load_data()
    
    # Get current date for last refreshed
    last_refreshed_date = datetime.now().strftime('%Y-%m-%d')
    
    # Count unique subscriptions
    unique_subscriptions = set()
    for row in data:
        unique_subscriptions.add(row['SubscriptionId'])
    subscriptions_count = len(unique_subscriptions)
    
    # Calculate overall cost
    total_cost = sum(row['Cost'] for row in data)
    if total_cost >= 1000000:
        formatted_cost = f"${total_cost/1000000:.2f}M"
    else:
        formatted_cost = f"${total_cost:.2f}"
    overall_cost = {
        'cost': total_cost, 
        'formatted_cost': formatted_cost
    }
    return render_template('index.html', 
                          lastRefreshedDate=last_refreshed_date,
                          subscriptionsCount=subscriptions_count, 
                          overallCost=overall_cost)

@app.route('/api/top5Subscriptions')
def top5_subscriptions():
    """API endpoint for top 5 subscriptions by cost"""
    data = load_data()
    
    # Group by SubscriptionId and SUBSCRIPTIONNAME, sum the cost
    subscriptions = {}
    for row in data:
        subscription_id = row.get('SubscriptionId')
        subscription_name = row.get('SUBSCRIPTIONNAME')
        
        # Skip if no subscription ID or if it's empty
        if not subscription_id or (isinstance(subscription_id, str) and not subscription_id.strip()):
            continue
            
        if subscription_id not in subscriptions:
            # Ensure we have a clean subscription name
            clean_name = subscription_name if subscription_name and isinstance(subscription_name, str) and subscription_name.strip() else 'Unknown'
            
            subscriptions[subscription_id] = {
                'SubscriptionId': subscription_id,
                'SUBSCRIPTIONNAME': clean_name,
                'Cost': 0
            }
        subscriptions[subscription_id]['Cost'] += float(row['Cost'] or 0)
    
    # Convert to list and sort by cost
    subscription_list = list(subscriptions.values())
    subscription_list.sort(key=lambda x: x['Cost'], reverse=True)
    
    # Take top 5
    top5 = subscription_list[:5]
    
    # Calculate total sum of all costs
    total_sum = sum(item['Cost'] for item in subscription_list)
    
    # Prepare data in the format needed for the frontend
    result = {
        'data': top5,
        'total': total_sum
    }
    
    return jsonify(result)

@app.route('/api/top5Applications')
def top5_applications():
    """API endpoint for top 5 applications by cost"""
    data = load_data()
    
    # Group by APPLICATION, sum the cost
    applications = {}
    for row in data:
        # Handle None or empty values
        app_name = row['APPLICATION'] if row['APPLICATION'] and row['APPLICATION'].strip() else 'null'
        if app_name not in applications:
            applications[app_name] = {
                'APPLICATION': app_name, 
                'Cost': 0
            }
        applications[app_name]['Cost'] += row['Cost']
    
    # Convert to list and sort by cost
    application_list = list(applications.values())
    application_list.sort(key=lambda x: x['Cost'], reverse=True)
    
    # Take top 5
    top5 = application_list[:5]
    
    # Calculate total sum of all costs
    total_sum = sum(item['Cost'] for item in application_list)
    
    # Prepare data in the format needed for the frontend
    result = {
        'data': top5,
        'total': total_sum
    }
    
    return jsonify(result)

@app.route('/api/top5ServiceNames')
def top5_service_names():
    """API endpoint for top 5 service names by cost"""
    data = load_data()
    
    # Group by ServiceName, sum the cost
    services = {}
    for row in data:
        service_name = row['ServiceName']
        if not service_name in services:
            services[service_name] = {
                'ServiceName': service_name,
                'Cost': 0
            }
        services[service_name]['Cost'] += row['Cost']
    
    # Convert to list and sort by cost
    service_list = list(services.values())
    service_list.sort(key=lambda x: x['Cost'], reverse=True)
    
    # Take top 5
    top5 = service_list[:5]
    
    # Calculate total sum of all costs
    total_sum = sum(item['Cost'] for item in service_list)
    
    # Prepare data in the format needed for the frontend
    result = {
        'data': top5,
        'total': total_sum
    }
    
    return jsonify(result)

@app.route('/api/top5Resources')
def top5_resources():
    """API endpoint for top 5 resources by cost"""
    data = load_data()
    
    # Group by ResourceGroupName, sum the cost
    resources = {}
    for row in data:
        resource_name = row['ResourceGroupName'] if row['ResourceGroupName'] and row['ResourceGroupName'].strip() else 'undefined'
        if resource_name not in resources:
            resources[resource_name] = {
                'ResourceGroupName': resource_name,
                'Cost': 0
            }
        resources[resource_name]['Cost'] += row['Cost']
    
    # Convert to list and sort by cost
    resource_list = list(resources.values())
    resource_list.sort(key=lambda x: x['Cost'], reverse=True)
    
    # Take top 5
    top5 = resource_list[:5]
    
    # Calculate total sum of all costs
    total_sum = sum(item['Cost'] for item in resource_list)
    
    # Prepare data in the format needed for the frontend
    result = {
        'data': top5,
        'total': total_sum
    }
    
    return jsonify(result)

@app.route('/api/sumOfCost')
def sum_of_cost():
    """API endpoint for sum of cost by month"""
    data = load_data()
    
    # Group by Month, sum the cost
    monthly_costs = {}
    for row in data:
        if not row['StartDate']:
            continue
            
        # Format month
        month = row['StartDate'].strftime('%b %Y')
        if month not in monthly_costs:
            monthly_costs[month] = {
                'Month': month,
                'Cost': 0,
                'SortDate': row['StartDate']
            }
        monthly_costs[month]['Cost'] += row['Cost']
    
    # Convert to list and sort by date
    monthly_costs_list = list(monthly_costs.values())
    monthly_costs_list.sort(key=lambda x: x['SortDate'])
    
    # Remove the SortDate field before returning
    for item in monthly_costs_list:
        del item['SortDate']
    
    return jsonify(monthly_costs_list)

@app.route('/api/subscriptionsCount')
def subscriptions_count():
    """API endpoint for count of subscriptions"""
    data = load_data()
    
    # Count unique subscription IDs
    unique_subscriptions = set()
    for row in data:
        unique_subscriptions.add(row['SubscriptionId'])
    count = len(unique_subscriptions)
    
    return jsonify({'count': count})

@app.route('/api/overallCost')
def overall_cost():
    """API endpoint for overall cost"""
    data = load_data()
    
    # Sum all costs
    total_cost = sum(row['Cost'] for row in data)
    
    # Format as millions if large enough
    if total_cost >= 1000000:
        formatted_cost = f"{total_cost/1000000:.2f}M"
    else:
        formatted_cost = f"{total_cost:.2f}"
    
    return jsonify({
        'cost': total_cost, 
        'formatted_cost': formatted_cost
    })

@app.route('/api/filterOptions')
def filter_options():
    """API endpoint for filter options"""
    data = load_data()
    
    # Get unique values for each filter category
    subscription_ids = set()
    subscription_names = set()
    applications = set()
    resources = set()
    service_names = set()
    
    # Track min and max dates
    dates = []
    
    for row in data:
        subscription_ids.add(row['SubscriptionId'])
        
        if row['SUBSCRIPTIONNAME']:
            subscription_names.add(row['SUBSCRIPTIONNAME'])
            
        if row['APPLICATION'] and row['APPLICATION'].strip():
            applications.add(row['APPLICATION'])
            
        if row['ResourceGroupName'] and row['ResourceGroupName'].strip():
            resources.add(row['ResourceGroupName'])
            
        if row['ServiceName']:
            service_names.add(row['ServiceName'])
            
        if row['StartDate']:
            dates.append(row['StartDate'])
    
    # Get min and max dates for date filter
    min_date = min(dates).strftime('%Y-%m-%d') if dates else ''
    max_date = max(dates).strftime('%Y-%m-%d') if dates else ''
    
    return jsonify({
        'subscriptionIds': list(subscription_ids),
        'subscriptionNames': list(subscription_names),
        'applications': list(applications),
        'resources': list(resources),
        'serviceNames': list(service_names),
        'dateRange': {
            'min': min_date,
            'max': max_date
        }
    })

@app.route('/api/cost-data')
def cost_data():
    """API endpoint for all cost data"""
    data = load_data()
    
    # Convert datetime objects to strings for JSON serialization
    for row in data:
        if row['StartDate']:
            row['StartDate'] = row['StartDate'].strftime('%Y-%m-%d')
    
    return jsonify({
        'success': True,
        'data': data
    })

if __name__ == '__main__':
    print('Debug: Loading data test')
    test_data = load_data()
    print(f'Data loaded: {len(test_data)} rows')
    if test_data:
        print('First row sample:', list(test_data[0].keys())[:5])
    app.run(debug=True)