import { afterAll, beforeAll, describe, test } from "vitest";
import { preview } from "vite";
import type { PreviewServer } from "vite";
import { chromium } from "playwright";
import type { Browser, Page } from "playwright";
import { expect } from "@playwright/test";

describe("Router", () => {
  let server: PreviewServer;
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    server = await preview({ preview: { port: 3000 } });
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    await new Promise<void>((resolve, reject) => {
      server.httpServer.close((error) => (error ? reject(error) : resolve()));
    });
  });
  test("go to the contact page when user click on the contact link", async () => {
    await page.goto("http://localhost:3000");
    await page.getByRole("link", { name: "Contacts" }).click();
    await expect(page).toHaveURL("http://localhost:3000/contacts");
  });
  test("go to the profile page when user click on the profile link", async () => {
    await page.goto("http://localhost:3000");
    await page.getByRole("link", { name: "Profile" }).click();
    await expect(page).toHaveURL("http://localhost:3000/profile");
  });
  test("go to the files page when user click on the files link", async () => {
    await page.goto("http://localhost:3000");
    await page.getByRole("link", { name: "Fichiers" }).click();
    await expect(page).toHaveURL("http://localhost:3000/files");
  });
});
