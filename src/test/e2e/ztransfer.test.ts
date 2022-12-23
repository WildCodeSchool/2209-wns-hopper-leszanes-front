/* eslint-disable @typescript-eslint/no-unused-vars */
import { afterAll, beforeAll, describe, test } from "vitest";
import { preview } from "vite";
import type { PreviewServer } from "vite";
import { chromium } from "playwright";
import type { Browser, Page } from "playwright";
import { expect } from "@playwright/test";

describe("Router", () => {
  // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error, @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let server: PreviewServer;
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    server = await preview({
      preview: {
        port: 3000,
      },
    });

    browser = await chromium.launch();
  });
  afterAll(async () => {
    await browser.close();
  });
  beforeEach(async () => {
    page = await browser.newPage();
  });
  afterEach(async () => {
    await page.close();
  });

  test("go to the contact page when user click on the contact link", async () => {
    await page.goto("http://localhost:3000");
    await page.getByTestId("contacts").click();
    await expect(page).toHaveURL("http://localhost:3000/contacts");
  });
  test("go to the files page when user click on the files link", async () => {
    await page.goto("http://localhost:3000");
    await page.getByTestId("files").click();
    await expect(page).toHaveURL("http://localhost:3000/files");
  });
  test("go to the upload page when user click on the upload link", async () => {
    await page.goto("http://localhost:3000");
    await page.getByTestId("upload").click();
    await expect(page).toHaveURL("http://localhost:3000/upload");
  });

  test("go to the home page when user click on the home link", async () => {
    await page.goto("http://localhost:3000");
    await page.getByTestId("contacts").click();
    await page.getByTestId("home").click();
    await expect(page).toHaveURL("http://localhost:3000");
  });
});
