
import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Capture console logs
        page.on("console", lambda msg: print(f"CONSOLE: {msg.type}: {msg.text}"))
        page.on("pageerror", lambda exc: print(f"PAGEERROR: {exc}"))

        try:
            await page.goto("http://localhost:3000", wait_until="networkidle")
            # Wait a bit for any delayed errors
            await asyncio.sleep(2)
        except Exception as e:
            print(f"Script Error: {e}")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
