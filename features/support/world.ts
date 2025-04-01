// features/support/world.ts
import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from 'playwright';
import { DashboardPage } from '../../pages/DashboardPage';

export class CustomWorld extends World {
    static browser: Browser; // optional if you're doing a single shared browser
    context!: BrowserContext;
    page!: Page;
    dashboardPage!: DashboardPage; // <-- Add a property for the dashboard page

    constructor(options: IWorldOptions) {
        super(options);
    }
}

// Finally, register the world with Cucumber
setWorldConstructor(CustomWorld);
