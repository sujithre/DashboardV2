const { createApp } = Vue;

createApp({
    data() {
        return {
            costData: [],
            filteredData: [],
            currentView: 'overview',
            filters: {
                startDate: '',
                endDate: '',
                subscriptionId: '',
                application: '',
                resource: '',
                serviceName: ''
            },
            filterOptions: {
                subscriptionIds: [],
                applications: [],
                resources: [],
                serviceNames: []
            },
            subscriptionsCount: 0,
            overallCost: { formatted_cost: '$0' },
            lastRefreshedDate: new Date().toLocaleDateString(),
            top5Subscriptions: { data: [], total: 0 },
            top5Applications: { data: [], total: 0 },
            top5Services: { data: [], total: 0 },
            top5Resources: { data: [], total: 0 },
            costByMonthChart: null
        };
    },
    mounted() {
        this.loadData();
    },
    methods: {
        safeValue(value, defaultValue = 'N/A') {
            if (value === null || value === undefined || value === '') {
                return defaultValue;
            }
            return value;
        },
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
        },
        async loadData() {
            try {
                // First get the cost data
                const response = await fetch('/api/cost-data');
                const costResult = await response.json();
                if (costResult.success) {
                    this.costData = costResult.data;
                    this.filteredData = [...this.costData];
                    console.log('Cost data loaded:', this.costData.length, 'records');
                }

                // Get filter options
                const filterOptionsResponse = await fetch('/api/filterOptions');
                const filterOptions = await filterOptionsResponse.json();
                this.filterOptions = filterOptions;
                console.log('Filter options loaded:', filterOptions);

                // Get subscriptions count
                const countResponse = await fetch('/api/subscriptionsCount');
                const countData = await countResponse.json();
                this.subscriptionsCount = countData.count;
                console.log('Subscriptions count:', this.subscriptionsCount);

                // Get overall cost
                const overallCostResponse = await fetch('/api/overallCost');
                const overallCostData = await overallCostResponse.json();
                this.overallCost = overallCostData;
                console.log('Overall cost:', this.overallCost);

                // Calculate top 5 data directly from loaded data
                this.calculateTop5Subscriptions();
                this.calculateTop5Applications();
                this.calculateTop5Services();
                this.calculateTop5Resources();

                // Create cost by month chart
                this.$nextTick(() => {
                    this.createCostByMonthChart();
                });
            } catch (error) {
                console.error('Error loading data:', error);
            }
        },
        processData() {
            // Calculate subscriptions count
            const uniqueSubscriptions = new Set(this.filteredData.map(item => item.SubscriptionId));
            this.subscriptionsCount = uniqueSubscriptions.size;

            // Calculate overall cost
            const totalCost = this.filteredData.reduce((sum, item) => sum + (parseFloat(item.Cost) || 0), 0);
            this.overallCost.formatted_cost = this.formatNumber(totalCost);

            // Calculate top 5 subscriptions
            this.calculateTop5Subscriptions();
            
            // Calculate top 5 applications
            this.calculateTop5Applications();
            
            // Calculate top 5 services
            this.calculateTop5Services();
            
            // Calculate top 5 resources
            this.calculateTop5Resources();

            // Create cost by month chart
            this.$nextTick(() => {
                this.createCostByMonthChart();
            });
        },        calculateTop5Subscriptions() {
            const subscriptionCosts = {};
            this.filteredData.forEach(item => {
                if (!item.SubscriptionId) return;
                
                const key = item.SubscriptionId;
                const name = item.SUBSCRIPTIONNAME || 'Unknown';
                
                if (!subscriptionCosts[key]) {
                    subscriptionCosts[key] = {
                        SUBSCRIPTIONNAME: name,
                        SubscriptionId: item.SubscriptionId,
                        CLARITYID: item.CLARITYID || 'N/A',
                        BILLINGCONTACT: item.BILLINGCONTACT || 'N/A',
                        COSTCENTER: item.COSTCENTER || 'N/A',
                        ENVIRONMENT: item.ENVIRONMENT || 'N/A',
                        Cost: 0
                    };
                }
                subscriptionCosts[key].Cost += parseFloat(item.Cost) || 0;
            });

            const sorted = Object.values(subscriptionCosts)
                .sort((a, b) => b.Cost - a.Cost)
                .slice(0, 5);

            this.top5Subscriptions = {
                data: sorted,
                total: sorted.reduce((sum, item) => sum + item.Cost, 0)
            };
        },
        calculateTop5Applications() {
            const applicationCosts = {};
            this.filteredData.forEach(item => {
                const key = item.APPLICATION || 'Unknown';
                if (!applicationCosts[key]) {
                    applicationCosts[key] = { APPLICATION: key, Cost: 0 };
                }
                applicationCosts[key].Cost += parseFloat(item.Cost) || 0;
            });

            const sorted = Object.values(applicationCosts)
                .sort((a, b) => b.Cost - a.Cost)
                .slice(0, 5);

            this.top5Applications = {
                data: sorted,
                total: sorted.reduce((sum, item) => sum + item.Cost, 0)
            };
        },
        calculateTop5Services() {
            const serviceCosts = {};
            this.filteredData.forEach(item => {
                const key = item.ServiceName || 'Unknown';
                if (!serviceCosts[key]) {
                    serviceCosts[key] = { ServiceName: key, Cost: 0 };
                }
                serviceCosts[key].Cost += parseFloat(item.Cost) || 0;
            });

            const sorted = Object.values(serviceCosts)
                .sort((a, b) => b.Cost - a.Cost)
                .slice(0, 5);

            this.top5Services = {
                data: sorted,
                total: sorted.reduce((sum, item) => sum + item.Cost, 0)
            };
        },
        calculateTop5Resources() {
            const resourceCosts = {};
            this.filteredData.forEach(item => {
                const key = item.ResourceGroupName || item.Resource || 'Unknown';
                if (!resourceCosts[key]) {
                    resourceCosts[key] = { ResourceGroupName: key, Cost: 0 };
                }
                resourceCosts[key].Cost += parseFloat(item.Cost) || 0;
            });

            const sorted = Object.values(resourceCosts)
                .sort((a, b) => b.Cost - a.Cost)
                .slice(0, 5);

            this.top5Resources = {
                data: sorted,
                total: sorted.reduce((sum, item) => sum + item.Cost, 0)
            };
        },
        setupFilterOptions() {
            // Extract unique values for filter options
            this.filterOptions.subscriptionIds = [...new Set(this.costData.map(item => item.SubscriptionId).filter(Boolean))];
            this.filterOptions.applications = [...new Set(this.costData.map(item => item.APPLICATION).filter(Boolean))];
            this.filterOptions.resources = [...new Set(this.costData.map(item => item.ResourceGroupName || item.Resource).filter(Boolean))];
            this.filterOptions.serviceNames = [...new Set(this.costData.map(item => item.ServiceName).filter(Boolean))];
        },
        applyFilters() {
            this.filteredData = this.costData.filter(item => {
                let matches = true;

                if (this.filters.startDate) {
                    const itemDate = new Date(item.Date || item.StartDate);
                    const filterDate = new Date(this.filters.startDate);
                    if (itemDate < filterDate) matches = false;
                }

                if (this.filters.endDate) {
                    const itemDate = new Date(item.Date || item.StartDate);
                    const filterDate = new Date(this.filters.endDate);
                    if (itemDate > filterDate) matches = false;
                }

                if (this.filters.subscriptionId && item.SubscriptionId !== this.filters.subscriptionId) {
                    matches = false;
                }

                if (this.filters.application && item.APPLICATION !== this.filters.application) {
                    matches = false;
                }

                if (this.filters.resource) {
                    const resourceName = item.ResourceGroupName || item.Resource;
                    if (resourceName !== this.filters.resource) {
                        matches = false;
                    }
                }

                if (this.filters.serviceName && item.ServiceName !== this.filters.serviceName) {
                    matches = false;
                }

                return matches;
            });

            this.processData();
        },
        createCostByMonthChart() {
            const canvas = document.getElementById('costByMonthChart');
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            
            // Destroy existing chart if it exists
            if (this.costByMonthChart) {
                this.costByMonthChart.destroy();
            }            // Group data by month
            const monthlyData = {};
            this.filteredData.forEach(item => {
                if (!item.StartDate) return;
                
                const date = new Date(item.StartDate);
                if (isNaN(date.getTime())) return; // Skip invalid dates
                
                const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
                const cost = parseFloat(item.Cost) || 0;
                
                if (!monthlyData[monthKey]) {
                    monthlyData[monthKey] = 0;
                }
                monthlyData[monthKey] += cost;
                console.log(`Adding cost ${cost} for ${monthKey}`); // Debug logging
            });

            const sortedMonths = Object.keys(monthlyData).sort((a, b) => new Date(a) - new Date(b));
            const chartData = sortedMonths.map(month => monthlyData[month]);            this.costByMonthChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: sortedMonths,
                    datasets: [{
                        label: 'Cost',
                        data: chartData,
                        backgroundColor: 'rgba(75, 192, 192, 0.7)',
                        borderColor: 'rgb(75, 192, 192)',
                        borderWidth: 1
                    }]
                },                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    if (value >= 1000000) {
                                        return '$' + (value / 1000000).toFixed(1) + 'M';
                                    } else if (value >= 1000) {
                                        return '$' + (value / 1000).toFixed(1) + 'K';
                                    }
                                    return '$' + value.toFixed(2);
                                }
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                maxRotation: 45,
                                minRotation: 45
                            }
                        }
                    },
                    barThickness: 'flex',
                    maxBarThickness: 50,
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const value = context.parsed.y;
                                    if (value >= 1000000) {
                                        return 'Cost: $' + (value / 1000000).toFixed(2) + 'M';
                                    } else if (value >= 1000) {
                                        return 'Cost: $' + (value / 1000).toFixed(2) + 'K';
                                    }
                                    return 'Cost: $' + value.toFixed(2);
                                }
                            }
                        },
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    }
                }
            });
        }
    }
}).mount('#app');