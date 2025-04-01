// features/support/hooks.ts
import { BeforeAll, AfterAll, Before, After } from '@cucumber/cucumber';
import { CustomWorld } from './world'; // <-- Make sure the path is correct
import { chromium } from 'playwright';
import { DashboardPage } from '../../pages/DashboardPage';

BeforeAll(async function () {
    CustomWorld.browser = await chromium.launch();
});

Before(async function (this: CustomWorld) {
    this.context = await CustomWorld.browser.newContext();
    this.page = await this.context.newPage();
    this.dashboardPage = new DashboardPage(this.page);
});

After(async function (this: CustomWorld) {
    await this.context?.close();
});

AfterAll(async function () {
    await CustomWorld.browser.close();
});
