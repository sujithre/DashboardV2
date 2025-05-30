# Azure Cost Dashboard - Frontend Documentation

## Project Overview

The Azure Cost Dashboard is a Flask-based web application that provides comprehensive visualization and analysis of Azure cloud costs. This dashboard was originally built as a "Novartis Dashboard" but has been rebranded to "Azure Cost Dashboard" to make it more universally applicable.

## Problem Solved

This project addresses the critical challenge of **Jinja2 and Vue.js template syntax conflicts** in Flask applications. The dashboard successfully combines server-side Flask templating with client-side Vue.js reactivity while avoiding parsing errors.

## Key Features

### 🎯 Core Functionality
- **Real-time Cost Visualization**: Interactive charts and tables showing Azure cost data
- **Multi-view Dashboard**: Overview, Subscriptions, Services, Applications, and Resources views
- **Advanced Filtering**: Date range, subscription, application, resource, and service name filters
- **Responsive Design**: Mobile-friendly layout with Tailwind CSS
- **Data Aggregation**: Top 5 lists for various cost categories

### 🔧 Technical Improvements
- **Template Syntax Compatibility**: All Vue.js expressions wrapped in `{% raw %}{% endraw %}` tags
- **Error Handling**: Enhanced Vue.js methods with try-catch blocks and safe value handling
- **Modern UI/UX**: Sidebar navigation with filters, improved color scheme
- **Rebranding**: Complete transformation from Novartis to Azure branding

## Architecture

### Technology Stack
- **Backend**: Flask (Python)
- **Frontend**: Vue.js 3, Tailwind CSS, Chart.js
- **Data**: CSV file processing with Pandas
- **Icons**: Font Awesome
- **Styling**: Custom CSS with Tailwind utility classes

### File Structure
```
c:\Projects\EX5Travel-V2\
├── app.py                          # Flask application with API endpoints
├── templates/
│   ├── index.html                  # Main dashboard template (fixed Jinja2/Vue.js conflicts)
│   └── index_backup_fixed_vue_jinja2.html  # Backup with all fixes applied
├── static/
│   ├── js/
│   │   └── main.js                 # Vue.js application logic
│   └── css/                        # Custom CSS (if needed)
├── src/
│   └── main.js                     # Source Vue.js file
├── Cosrdetails-Feb.csv            # Cost data source
├── requirements.txt                # Python dependencies
├── Frontend.md                     # This documentation
└── .gitignore                      # Git ignore rules
```

## Template Syntax Conflict Resolution

### The Problem
Flask uses Jinja2 templating which conflicts with Vue.js template syntax. Both use double curly braces `{{ }}` for variable interpolation, causing Jinja2 to attempt parsing Vue.js expressions on the server-side.

### The Solution
All Vue.js expressions are wrapped with Jinja2's `{% raw %}{% endraw %}` tags:

```html
<!-- Before (Causes Jinja2 parsing errors) -->
<span>{{ subscriptionsCount }}</span>

<!-- After (Safe from Jinja2 parsing) -->
{% raw %}
<span>{{ subscriptionsCount }}</span>
{% endraw %}
```

### Vue.js Method Enhancements
Added robust error handling and safe value methods:

```javascript
// Enhanced safeValue method
safeValue(value, defaultValue = 'N/A') {
    if (value === null || value === undefined || value === '') {
        return defaultValue;
    }
    return value;
}

// Enhanced formatNumber method with error handling
formatNumber(value) {
    try {
        if (value === null || value === undefined || isNaN(value)) {
            return '$0';
        }
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(value);
    } catch (error) {
        console.error('Error formatting number:', error);
        return '$0';
    }
}
```

## UI/UX Improvements

### Layout Restructure
- **Sidebar Navigation**: 300px fixed-width sidebar with dark theme
- **Filter Integration**: Moved all filters from main content to sidebar for better UX
- **Responsive Design**: Flexbox layout that adapts to different screen sizes

### Rebranding Changes
1. **Title**: "Novartis Dashboard" → "Azure Cost Dashboard"
2. **Logo**: Novartis corporate logo → Font Awesome cloud icon
3. **Color Scheme**: Corporate blue theme for Azure branding
4. **Favicon**: Updated to Azure-themed icon

### Enhanced Sidebar Features
- **Navigation Menu**: Clean icons with labels for each view
- **Integrated Filters**: All filtering options in sidebar with proper spacing
- **Visual States**: Active navigation highlighting
- **Brand Header**: Azure cloud icon with dashboard title

## API Endpoints

### GET /
- **Purpose**: Serves the main dashboard HTML template
- **Returns**: Rendered `index.html` template

### GET /api/cost-data
- **Purpose**: Returns cost data from CSV file
- **Response Format**:
  ```json
  {
    "success": true,
    "data": [...],
    "total_records": 1234
  }
  ```

### GET /api/summary
- **Purpose**: Returns cost summary statistics
- **Response Format**:
  ```json
  {
    "success": true,
    "summary": {
      "total_cost": 12345.67,
      "total_services": 45,
      "total_subscriptions": 12,
      "date_range": {
        "start": "2024-01-01",
        "end": "2024-12-31"
      }
    }
  }
  ```

## Data Processing

### Cost Aggregation
The dashboard processes CSV data to calculate:
- **Top 5 Subscriptions**: By total cost
- **Top 5 Applications**: By total cost  
- **Top 5 Services**: By total cost
- **Top 5 Resources**: By total cost
- **Monthly Trends**: Cost over time visualization

### Filtering Logic
Multi-criteria filtering supports:
- **Date Range**: Start and end date filtering
- **Subscription ID**: Specific subscription filtering
- **Application**: Application-based filtering
- **Resource**: Resource group filtering
- **Service Name**: Service-specific filtering

## Troubleshooting Guide

### Common Issues and Solutions

#### 1. Jinja2 Template Syntax Errors
**Symptoms**: 
- `TemplateSyntaxError` when loading the page
- Server-side errors related to undefined variables
- Vue.js expressions not rendering properly

**Solution**:
```html
<!-- Wrap ALL Vue.js expressions with raw tags -->
{% raw %}
<div v-if="currentView === 'overview'">
    <span>{{ subscriptionsCount }}</span>
</div>
{% endraw %}
```

#### 2. Vue.js Data Not Loading
**Symptoms**:
- Dashboard shows empty or undefined values
- API calls failing
- Console errors about missing data

**Solution**:
1. Check Flask API endpoints are working: `curl http://localhost:5000/api/cost-data`
2. Verify CSV file exists and has correct format
3. Use browser developer tools to check network requests
4. Check console for JavaScript errors

#### 3. Chart Not Rendering
**Symptoms**:
- Empty chart area
- Chart.js errors in console
- Canvas element not found

**Solution**:
1. Ensure Chart.js is loaded: Check `<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>`
2. Verify canvas element exists: `<canvas id="costByMonthChart"></canvas>`
3. Check Vue.js lifecycle: Use `this.$nextTick()` for DOM-dependent operations

#### 4. Filters Not Working
**Symptoms**:
- Filter selections don't affect displayed data
- No filtering response when applying filters

**Solution**:
1. Check Vue.js data binding: Verify `v-model` directives
2. Ensure `applyFilters()` method is properly bound to button click
3. Verify filter options are populated from data

#### 5. Styling Issues
**Symptoms**:
- Layout broken or misaligned
- Missing styles or icons
- Responsive design not working

**Solution**:
1. Verify Tailwind CSS is loaded: `<script src="https://cdn.tailwindcss.com"></script>`
2. Check Font Awesome: `<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">`
3. Review custom CSS classes in `<style>` section

## Development Workflow

### Running the Application
```bash
# Install dependencies
pip install -r requirements.txt

# Run Flask development server
python app.py

# Access dashboard
http://localhost:5000
```

### Making Changes

#### Template Changes
1. Edit `templates/index.html`
2. Ensure all Vue.js expressions are wrapped in `{% raw %}{% endraw %}`
3. Test in browser
4. Create backup if working version: `cp index.html index_backup_working.html`

#### Vue.js Logic Changes
1. Edit `static/js/main.js` or `src/main.js`
2. Test all interactive features
3. Check browser console for errors
4. Verify data processing and filtering

#### API Changes
1. Edit `app.py`
2. Test endpoints with curl or Postman
3. Update frontend to match any API changes
4. Restart Flask development server

### Git Workflow
```bash
# Check status
git status

# Add files
git add .

# Commit changes
git commit -m "Description of changes"

# Switch to DEV branch
git checkout DEV

# Push to remote
git push origin DEV
```

## Performance Considerations

### Optimization Tips
1. **Data Loading**: Implement pagination for large datasets
2. **Chart Performance**: Limit data points in charts for better rendering
3. **Filter Efficiency**: Debounce filter applications to avoid excessive processing
4. **Memory Management**: Destroy and recreate Chart.js instances when data changes

### Monitoring
- Monitor Flask application logs for errors
- Use browser developer tools to track network requests
- Check memory usage for large datasets
- Monitor CSV file size and loading times

## Future Enhancements

### Planned Features
1. **Real-time Data**: Connect to Azure Cost Management APIs
2. **User Authentication**: Add login/logout functionality
3. **Data Export**: CSV/PDF export capabilities
4. **Advanced Analytics**: Trend analysis and forecasting
5. **Customizable Dashboards**: User-configurable widgets

### Technical Improvements
1. **TypeScript**: Migrate Vue.js to TypeScript for better type safety
2. **Component Architecture**: Break down monolithic Vue app into components
3. **State Management**: Implement Vuex or Pinia for complex state management
4. **Testing**: Add unit tests for Vue.js components and Flask endpoints
5. **Docker**: Containerize application for easier deployment

## Deployment

### Production Considerations
1. **Environment Variables**: Use environment variables for configuration
2. **Database**: Consider migrating from CSV to proper database
3. **Caching**: Implement Redis or similar for data caching
4. **Security**: Add HTTPS, CSRF protection, and input validation
5. **Monitoring**: Implement logging and application monitoring

### Azure Deployment
1. **Azure App Service**: Deploy Flask application
2. **Azure Storage**: Store CSV files in blob storage
3. **Azure Monitor**: Set up application insights
4. **Azure Cost Management**: Connect to real Azure cost APIs

## Prompt for Future LLM Assistance

When working with this Azure Cost Dashboard project, please note:

1. **Template Syntax**: All Vue.js expressions MUST be wrapped in `{% raw %}{% endraw %}` tags to prevent Jinja2 parsing conflicts
2. **Error Handling**: Use the `safeValue()` and enhanced `formatNumber()` methods for robust data handling
3. **Layout Structure**: The sidebar contains navigation and filters; main content area shows dashboard views
4. **Branding**: This is the "Azure Cost Dashboard" with blue theme and cloud icons, not "Novartis Dashboard"
5. **File Structure**: Templates in `/templates/`, Vue.js in `/static/js/main.js`, Flask app in `app.py`
6. **Data Source**: Currently uses `Cosrdetails-Feb.csv` file processed by Pandas
7. **Dependencies**: Vue.js 3, Chart.js, Tailwind CSS, Font Awesome all loaded via CDN

Key files to focus on:
- `templates/index.html`: Main template with all Vue.js/Jinja2 fixes
- `static/js/main.js`: Vue.js application logic with enhanced methods
- `app.py`: Flask backend with API endpoints

Always test template syntax changes carefully and maintain the `{% raw %}{% endraw %}` wrapping for Vue.js expressions.
