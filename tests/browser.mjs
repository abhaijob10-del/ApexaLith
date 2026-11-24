import sharp from "sharp";
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { once } from "node:events";
import { randomBytes } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";
import { createServer } from "node:net";
import { chromium } from "playwright-core";
import { database } from "../db/connection.mjs";

test("production UI, persistence and responsive layout", async (t) => {
  assert.equal(
    process.env.APEXALITH_ISOLATED_QA,
    "1",
    "Use scripts/test-postgres.ps1",
  );
  const probe = createServer().listen(0, "127.0.0.1");
  await once(probe, "listening");
  const port = probe.address().port;
  await new Promise((ok) => probe.close(ok));
  const origin = "http://127.0.0.1:" + port;
  let child;
  async function start() {
    child = spawn(process.execPath, ["dist/server.mjs", "--serve-built"], {
      stdio: "ignore",
      env: {
        ...process.env,
        NODE_ENV: "production",
        HOST: "127.0.0.1",
        PORT: String(port),
        APP_ORIGIN: origin,
      },
    });
    for (let i = 0; i < 100; i++) {
      try {
        const r = await fetch(origin + "/api/health");
        if (r.ok) return;
      } catch {}
      await delay(75);
    }
    throw Error("Built server did not start");
  }
  async function stop() {
    if (child && child.exitCode === null && child.signalCode === null) {
      const end = once(child, "exit");
      child.kill();
      await end;
    }
  }
  t.after(async () => {
    await stop();
    await database().end();
  });
  const email = "manager@example.invalid",
    password = randomBytes(24).toString("hex");
  const cli = (op, pw) =>
    spawnSync(process.execPath, ["scripts/admin.mjs", op, email], {
      input: pw,
      stdio: ["pipe", "ignore", "ignore"],
    }).status;
  assert.equal(cli("create", password), 0);
  await start();
  const browser = await chromium.launch({
    channel: process.env.QA_BROWSER_CHANNEL || "msedge",
    headless: true,
  });
  t.after(() => browser.close());
  const page = await browser.newPage();
  page.setDefaultTimeout(8000);
  await page.route("https://**/*", (route) => route.abort());
  await page.setViewportSize({ width: 375, height: 850 });
  await page.goto(origin);
  const menu = page.getByRole("button", { name: "Menu", exact: true });
  const navigation = page.getByRole("navigation", { name: "Main navigation" });
  assert.equal(await navigation.isVisible(), false);
  await menu.click();
  await navigation
    .getByRole("link", { name: "Apartments", exact: true })
    .focus();
  await page.keyboard.press("Escape");
  assert.equal(await menu.getAttribute("aria-expanded"), "false");
  assert.equal(
    await menu.evaluate((element) => element === document.activeElement),
    true,
  );
  await menu.click();
  await navigation
    .getByRole("link", { name: "Apartments", exact: true })
    .click();
  await page
    .getByRole("heading", { name: "Apartments", exact: true })
    .waitFor();
  await page.setViewportSize({ width: 1366, height: 850 });
  await page.goto(origin + "/admin/login");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page
    .getByRole("heading", { name: "Administration", exact: true })
    .waitFor();
  await page.getByRole("button", { name: "Apartments", exact: true }).click();
  await page
    .getByRole("button", { name: "Add apartment", exact: true })
    .click();
  await page.getByLabel("Title", { exact: true }).fill("Browser QA home");
  await page.getByLabel("URL slug").fill("browser-qa-home");
  await page.getByLabel("Location", { exact: true }).fill("Bengaluru");
  const pixel = await sharp({
    create: { width: 50, height: 40, channels: 3, background: "#aabbbb" },
  })
    .png()
    .toBuffer();
  await page
    .getByLabel("Upload images")
    .setInputFiles({ name: "qa.png", mimeType: "image/png", buffer: pixel });
  await page.getByText("Upload complete.", { exact: true }).waitFor();
  await page
    .getByLabel("Upload images")
    .setInputFiles({
      name: "qa-second.png",
      mimeType: "image/png",
      buffer: pixel,
    });
  await page.getByText("Upload complete.", { exact: true }).waitFor();
  await page.getByLabel("Publication").selectOption("published");
  await page.getByRole("button", { name: "Preview listing" }).click();
  await page.getByRole("heading", { name: "Browser QA home" }).waitFor();
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await page.getByRole("button", { name: "Add apartment" }).waitFor();
  await stop();
  await start();
  const sitemap = await (await fetch(origin + "/sitemap.xml")).text();
  assert.ok(sitemap.includes("/apartments/browser-qa-home"));
  assert.ok(!sitemap.includes("/admin"));
  assert.equal((await fetch(origin + "/readyz")).status, 200);
  assert.equal(
    (await fetch(origin + "/admin/dashboard")).headers.get("x-robots-tag"),
    "noindex",
  );
  assert.equal((await fetch(origin + "/server.mjs")).status, 404);
  assert.ok(
    (
      await (await fetch(origin + "/apartments/browser-qa-home")).text()
    ).includes('property="og:title" content="Browser QA home'),
  );
  for (const width of [375, 768, 1366]) {
    await page.setViewportSize({ width, height: 850 });
    await page.goto(origin + "/apartments/browser-qa-home");
    await page.getByRole("heading", { name: "Browser QA home" }).waitFor();
    await page.waitForFunction(
      () => document.querySelector(".cover img")?.naturalWidth > 0,
    );
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      "Width " + width,
    );
  }
  await page.goto(origin + "/apartments");
  await page.getByLabel("Search name or location").fill("Browser QA");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await page.getByRole("heading", { name: "Browser QA home" }).waitFor();
  await page
    .getByLabel("Search name or location")
    .fill("No listing matches this search");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await page.getByRole("heading", { name: "No matching listings" }).waitFor();
  await page.getByRole("button", { name: "Show all listings" }).click();
  await page.getByRole("heading", { name: "Browser QA home" }).click();
  await page.getByRole("button", { name: "Show photo 2" }).click();
  assert.equal(
    await page
      .getByRole("button", { name: "Show photo 2" })
      .getAttribute("aria-pressed"),
    "true",
  );
  await page.getByRole("img", { name: "Browser QA home – photo 2" }).waitFor();
  await page.goto(origin + "/admin/dashboard");
  await page.getByRole("button", { name: "Overview", exact: true }).waitFor();
  assert.equal(cli("reset", randomBytes(24).toString("hex")), 0);
  await page.reload();
  await page.getByRole("heading", { name: "Administrator sign in" }).waitFor();
});
