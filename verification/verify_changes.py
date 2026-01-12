import time
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        # Wait for server
        try:
            page.goto("http://localhost:3000", timeout=30000)
            print("Successfully loaded homepage")

            # 1. Search for a location
            page.fill('input[placeholder="Find a destination..."]', "Cape Coast")
            time.sleep(1) # Wait for debounce and filter

            # Click the result in the list (assuming it appears)
            # The list items are clickable divs in AttractionList > AttractionCard
            # We can select by text "Cape Coast Castle"
            page.click('text=Cape Coast Castle')
            time.sleep(2) # Wait for map flyTo and modal

            # Check if modal is open
            if page.is_visible('text=Cape Coast, Central Region'):
                print("Modal opened with correct location")
            else:
                print("Modal did not show correct location")

            # Take screenshot of the details modal
            page.screenshot(path="verification/verification.png")
            print("Screenshot saved to verification/verification.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
