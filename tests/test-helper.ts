import { test as base, expect } from '@playwright/test';
import { DashboardPage } from './page_objects/dashboard.page';

// Extend basic test fixture with our page objects
export const test = base.extend<{
    dashboardPage: DashboardPage;
}>({
    dashboardPage: async ({ page }, use) => {
        const dashboardPage = new DashboardPage(page);
        await use(dashboardPage);
    },
});

export { expect };
