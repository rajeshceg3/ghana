
import time
from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a larger viewport to ensure desktop view
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        print("Navigating to app...")
        try:
            page.goto("http://localhost:3000", timeout=60000)
        except Exception as e:
            print(f"Error navigating: {e}")
            browser.close()
            return

        print("Checking page title...")
        try:
            # wait for title
            page.wait_for_load_state("networkidle")
            title = page.title()
            print(f"Page title: {title}")

            # Verify map loaded
            page.wait_for_selector(".leaflet-container")
            print("Map container found.")
        except Exception as e:
            print(f"Error getting title or map: {e}")

        # Check for console errors
        page.on("console", lambda msg: print(f"Console {msg.type}: {msg.text}"))
        page.on("pageerror", lambda err: print(f"Page Error: {err}"))

        print("Taking final screenshot...")
        page.screenshot(path="verification/verification_final.png")

        # Test Search with explicit text wait
        print("Testing search...")
        try:
            search_input = page.locator("input[placeholder='Find a destination...']")
            if search_input.is_visible():
                search_input.fill("Cape Coast")
                # Wait for the item to be visible. Text is the best locator here.
                cape_coast_item = page.get_by_text("Cape Coast Castle", exact=False).first
                cape_coast_item.wait_for(state="visible", timeout=5000)

                print("Search success: found 'Cape Coast Castle'")
                page.screenshot(path="verification/search_result_final.png")
            else:
                print("Search input not found")
        except Exception as e:
            print(f"Search test failed: {e}")

        browser.close()

if __name__ == "__main__":
    run_verification()
