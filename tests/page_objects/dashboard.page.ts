import { Page, Locator } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;
    readonly top5SubscriptionsTable: Locator;
    readonly top5ApplicationsTable: Locator;
    readonly top5ServicesTable: Locator;
    readonly top5ResourcesTable: Locator;
    readonly costByMonthChart: Locator;
    readonly subscriptionsCount: Locator;
    readonly overallCost: Locator;
    readonly filterPanel: Locator;

    constructor(page: Page) {
        this.page = page;
        this.top5SubscriptionsTable = page.locator('h2:text("Top 5 Subscriptions")').locator('xpath=following-sibling::div//table');
        this.top5ApplicationsTable = page.locator('h2:text("Top 5 Applications")').locator('xpath=following-sibling::div//table');
        this.top5ServicesTable = page.locator('h2:text("Top 5 Service Names")').locator('xpath=following-sibling::div//table');
        this.top5ResourcesTable = page.locator('h2:text("Top 5 Resources")').locator('xpath=following-sibling::div//table');
        this.costByMonthChart = page.locator('#costByMonthChart');
        this.subscriptionsCount = page.locator('text=Count of Subscriptions').locator('xpath=following-sibling::div//span');
        this.overallCost = page.locator('text=Overall Cost').locator('xpath=following-sibling::div//span');
        this.filterPanel = page.locator('.filter-container');
    }

    async goto() {
        await this.page.goto('/');
    }

    async applyDateFilter(startDate: string, endDate: string) {
        await this.page.fill('input[v-model="filters.startDate"]', startDate);
        await this.page.fill('input[v-model="filters.endDate"]', endDate);
        await this.page.click('button:text("Apply Filters")');
    }

    async applySubscriptionFilter(subscriptionId: string) {
        await this.page.selectOption('select[v-model="filters.subscriptionId"]', subscriptionId);
        await this.page.click('button:text("Apply Filters")');
    }

    async getTop5SubscriptionsData() {
        return await this.page.$$eval('table tr', rows => {
            return Array.from(rows, row => {
                const columns = row.querySelectorAll('td');
                return Array.from(columns, column => column.textContent);
            });
        });
    }

    async waitForDataLoad() {
        await this.page.waitForSelector('.dashboard-card');
        await this.page.waitForSelector('#costByMonthChart');
    }
}
