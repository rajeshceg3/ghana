
from playwright.sync_api import sync_playwright, expect

def verify(page):
    print("Navigating to home page...")
    page.goto("http://localhost:3000")

    # Wait for map to load (look for leaflet container)
    print("Waiting for map...")
    page.wait_for_selector(".leaflet-container")

    # Take initial screenshot
    page.screenshot(path="verification/1_home.png")

    # Search for "Castle"
    print("Searching for 'Castle'...")
    page.fill("input[placeholder='Find a destination...']", "Castle")

    # Wait for filter to apply (attraction list should update)
    # We can check if non-matching items are removed or matching items remain
    # Let's wait a bit for the debounce/memo
    page.wait_for_timeout(1000)
    page.screenshot(path="verification/2_search_results.png")

    # Click on the first attraction in the list
    print("Clicking first attraction...")
    # Using a selector that targets the first card in the list
    # The list is in the sidebar for desktop
    page.click("aside .group.relative.isolate:first-child")

    # Wait for details dialog
    print("Waiting for details dialog...")
    page.wait_for_selector("div[role='dialog']")
    page.wait_for_timeout(1000) # Wait for animation

    page.screenshot(path="verification/3_details.png")

    # Close dialog
    print("Closing dialog...")
    page.click("button[aria-label='Close details']")

    # Check mobile menu (resize viewport)
    print("Checking mobile view...")
    page.set_viewport_size({"width": 375, "height": 667})
    page.wait_for_timeout(500)
    page.screenshot(path="verification/4_mobile.png")

    # Open mobile menu
    page.click("button[aria-label='Open menu']")
    page.wait_for_timeout(500)
    page.screenshot(path="verification/5_mobile_menu.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1280, "height": 720})
        try:
            verify(page)
            print("Verification complete.")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
