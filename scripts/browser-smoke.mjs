import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";

const base = "http://127.0.0.1:4173";
const output = "output/browser-smoke";
await mkdir(output, { recursive: true });
const server = spawn(
  process.execPath,
  [
    "node_modules/astro/bin/astro.mjs",
    "preview",
    "--host",
    "127.0.0.1",
    "--port",
    "4173",
  ],
  {
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  },
);
let logs = "";
server.stdout.on("data", (data) => {
  logs = (logs + data).slice(-40000);
});
server.stderr.on("data", (data) => {
  logs = (logs + data).slice(-40000);
});
let browser;
const results = [],
  errors = [];
async function verifyImages(page) {
  // Full-page captures do not scroll, so off-screen lazy images need an
  // explicit load before checking the real artwork rather than blank slots.
  await page.locator("img").evaluateAll((images) => {
    for (const image of images) image.loading = "eager";
  });
  await page.waitForFunction(() =>
    [...document.images].every((image) => image.complete && image.naturalWidth > 0),
  );
  await page.evaluate(async () => {
    await Promise.all([...document.images].map((image) => image.decode()));
    const painted = () => new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
    for (let top = 0; top < document.documentElement.scrollHeight; top += innerHeight) {
      scrollTo(0, top);
      await painted();
    }
    scrollTo(0, 0);
    await painted();
  });
}
try {
  let ready = false;
  for (let i = 0; i < 60; i++) {
    if (
      await fetch(base)
        .then((response) => response.ok)
        .catch(() => false)
    ) {
      ready = true;
      break;
    }
    if (server.exitCode !== null) throw new Error(`Preview exited: ${logs}`);
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  assert.ok(ready, "Local preview starts");
  browser = await chromium.launch({
    headless: true,
    chromiumSandbox: true,
    executablePath: process.env.E2E_CHROME ?? "/usr/bin/google-chrome",
  });
  for (const width of [360, 1280]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    await context.route("**/*", (route) =>
      new URL(route.request().url()).origin === base
        ? route.continue()
        : route.abort("blockedbyclient"),
    );
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(String(error)));
    await page.goto(base, { waitUntil: "networkidle" });
    const web = page.getByRole("button", { name: "Web Development" });
    await web.waitFor();
    await web.click();
    assert.equal(await web.getAttribute("aria-expanded"), "true");
    await page.getByRole("button", { name: "Mobile Development" }).click();
    assert.equal(await web.getAttribute("aria-expanded"), "false");
    await page.getByRole("button", { name: "Mobile Development" }).click();
    assert.equal(
      await page
        .getByRole("button", { name: "Mobile Development" })
        .getAttribute("aria-expanded"),
      "false",
    );
    assert.ok(await page.locator("canvas").count());
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    );
    await verifyImages(page);
    await page.screenshot({
      path: `${output}/home-${width}.png`,
      fullPage: true,
      animations: "disabled",
    });
    await page.getByRole("link", { name: "О команде", exact: true }).click();
    await page.waitForURL("**/team**");
    await page.locator("h1").waitFor();
    await page.goBack();
    await page.getByRole("button", { name: "Web Development" }).waitFor();
    await page.goto(`${base}/apps/`, { waitUntil: "networkidle" });
    await page
      .getByRole("heading", { name: "VK Mini Apps", exact: true })
      .waitFor();
    assert.ok(
      (await page.locator('a[href^="https://vk.com/app"]').count()) > 0,
    );
    await verifyImages(page);
    await page.screenshot({
      path: `${output}/apps-${width}.png`,
      fullPage: true,
      animations: "disabled",
    });
    await page.goto(`${base}/blog/`, { waitUntil: "networkidle" });
    const article = page.locator(
      'a[href^="/blog/vk-mini-apps-signature-check-in-nodejs"]',
    );
    await article.first().click();
    await page.waitForURL(/\/blog\/vk-mini-apps-signature-check-in-nodejs\/?$/);
    await page.locator("article").waitFor();
    results.push(
      `${width}px: hydrated accordion, animation canvas, team/Back, app catalog and article`,
    );
    await context.close();
  }
  const rss = await fetch(`${base}/rss.xml`).then((response) =>
    response.text(),
  );
  assert.ok(rss.includes("/blog/vk-mini-apps-signature-check-in-nodejs"));
  assert.deepEqual(errors, []);
  await writeFile(
    `${output}/report.json`,
    JSON.stringify({ results, errors }, null, 2),
  );
  console.log(results.join("\n"));
} finally {
  await browser?.close();
  server.kill("SIGTERM");
  await writeFile(`${output}/preview.log`, logs);
}
