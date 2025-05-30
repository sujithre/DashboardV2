import { test, expect } from '@playwright/test';

test.describe('API Endpoints', () => {
    test('should get top 5 subscriptions', async ({ request }) => {
        const response = await request.get('/api/top5Subscriptions');
        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(data).toHaveProperty('data');
        expect(data).toHaveProperty('total');
        expect(Array.isArray(data.data)).toBeTruthy();
        expect(data.data.length).toBeLessThanOrEqual(5);
    });

    test('should get top 5 applications', async ({ request }) => {
        const response = await request.get('/api/top5Applications');
        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(data).toHaveProperty('data');
        expect(data).toHaveProperty('total');
        expect(Array.isArray(data.data)).toBeTruthy();
        expect(data.data.length).toBeLessThanOrEqual(5);
    });

    test('should get top 5 service names', async ({ request }) => {
        const response = await request.get('/api/top5ServiceNames');
        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(data).toHaveProperty('data');
        expect(data).toHaveProperty('total');
        expect(Array.isArray(data.data)).toBeTruthy();
        expect(data.data.length).toBeLessThanOrEqual(5);
    });

    test('should get top 5 resources', async ({ request }) => {
        const response = await request.get('/api/top5Resources');
        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(data).toHaveProperty('data');
        expect(data).toHaveProperty('total');
        expect(Array.isArray(data.data)).toBeTruthy();
        expect(data.data.length).toBeLessThanOrEqual(5);
    });

    test('should get subscriptions count', async ({ request }) => {
        const response = await request.get('/api/subscriptionsCount');
        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(data).toHaveProperty('count');
        expect(typeof data.count).toBe('number');
    });

    test('should get overall cost', async ({ request }) => {
        const response = await request.get('/api/overallCost');
        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(data).toHaveProperty('cost');
        expect(data).toHaveProperty('formatted_cost');
        expect(typeof data.cost).toBe('number');
        expect(typeof data.formatted_cost).toBe('string');
    });

    test('should get filter options', async ({ request }) => {
        const response = await request.get('/api/filterOptions');
        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(data).toHaveProperty('subscriptionIds');
        expect(data).toHaveProperty('applications');
        expect(data).toHaveProperty('resources');
        expect(data).toHaveProperty('serviceNames');
        expect(data).toHaveProperty('dateRange');
    });

    test('should get cost data', async ({ request }) => {
        const response = await request.get('/api/cost-data');
        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(data).toHaveProperty('success');
        expect(data).toHaveProperty('data');
        expect(Array.isArray(data.data)).toBeTruthy();
    });
});
