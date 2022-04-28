import {expect} from 'detox';

beforeAll(async () => {
  await device.launchApp();
});

describe('fresh install', () => {
  describe('Bills Screen', () => {
    it('should show header', async () => {
      await expect(element(by.text('Upcoming Bills'))).toBeVisible();
      await expect(element(by.text('Add Bill'))).toBeVisible();
    });

    it('should show bottom navigation', async () => {
      await expect(element(by.text('Bills'))).toBeVisible();
      await expect(element(by.text('Settings'))).toBeVisible();
    });

    it('should show placeholder text if no bills found', async () => {
      await expect(element(by.text('No bills found 👀'))).toBeVisible();
    });
    it('should show not synced yet', async () => {
      await expect(element(by.text('Not synced yet'))).toBeVisible();
    });
  });

  describe('Settings Screen', () => {
    beforeAll(async () => {
      await element(by.text('Settings')).tap();
    });
    it('should see login button', async () => {
      await expect(element(by.text('Sign up / Log in'))).toBeVisible();
    });
  });
});
