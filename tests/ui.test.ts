import { test, expect } from '@playwright/test';
import { DashboardPage } from './page_objects/dashboard.page';

test.describe('Dashboard UI', () => {
    let dashboardPage: DashboardPage;

    test.beforeEach(async ({ page }) => {
        dashboardPage = new DashboardPage(page);
        await dashboardPage.goto();
        await dashboardPage.waitForDataLoad();
    });

    test('should display all main components', async ({ page }) => {
        await expect(dashboardPage.top5SubscriptionsTable).toBeVisible();
        await expect(dashboardPage.top5ApplicationsTable).toBeVisible();
        await expect(dashboardPage.top5ServicesTable).toBeVisible();
        await expect(dashboardPage.top5ResourcesTable).toBeVisible();
        await expect(dashboardPage.costByMonthChart).toBeVisible();
        await expect(dashboardPage.subscriptionsCount).toBeVisible();
        await expect(dashboardPage.overallCost).toBeVisible();
        await expect(dashboardPage.filterPanel).toBeVisible();
    });

    test('should filter data by date range', async ({ page }) => {
        const startDate = '2024-01-01';
        const endDate = '2024-12-31';
        await dashboardPage.applyDateFilter(startDate, endDate);
        
        // Wait for data to update
        await page.waitForTimeout(1000);
        
        // Verify filtered data
        const subscriptionsData = await dashboardPage.getTop5SubscriptionsData();
        expect(subscriptionsData.length).toBeGreaterThan(0);
    });

    test('should update visualizations when applying filters', async ({ page }) => {
        // Get initial values
        const initialCount = await dashboardPage.subscriptionsCount.textContent();
        
        // Apply a filter
        await dashboardPage.applySubscriptionFilter('test-subscription-id');
        
        // Wait for data to update
        await page.waitForTimeout(1000);
        
        // Get updated values
        const updatedCount = await dashboardPage.subscriptionsCount.textContent();
        
        // Verify that the values changed
        expect(updatedCount).not.toBe(initialCount);
    });

    test('should display error message for invalid date range', async ({ page }) => {
        const invalidStartDate = '2025-01-01';
        const invalidEndDate = '2024-01-01';
        
        await dashboardPage.applyDateFilter(invalidStartDate, invalidEndDate);
        
        // Check for error message
        const errorMessage = await page.locator('.error-message').textContent();
        expect(errorMessage).toBeTruthy();
    });

    test('should properly format currency values', async ({ page }) => {
        const costValues = await page.$$eval('.dashboard-table td:nth-child(2)', 
            elements => elements.map(el => el.textContent));
        
        // Verify currency format
        const currencyRegex = /^\$\d{1,3}(,\d{3})*\.\d{2}$/;
        costValues.forEach(value => {
            expect(value).toMatch(currencyRegex);
        });
    });
});
