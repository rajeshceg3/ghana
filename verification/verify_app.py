from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # 1. Load the page
    print("Navigating to home page...")
    page.goto("http://localhost:3000")
    page.wait_for_load_state("networkidle")

    # 2. Verify Map Loads (MapComponent is async)
    print("Waiting for map...")
    # MapComponent uses dynamic import, so it might take a moment.
    # The container has class 'custom-map-container' or we look for leaflet
    try:
        page.wait_for_selector(".leaflet-container", timeout=10000)
    except:
        print("Leaflet container not found, taking screenshot for debug")
        page.screenshot(path="verification/debug_map_fail.png")
        raise

    # 3. Click on "Cape Coast Castle" in the list
    # The list is in the sidebar.
    print("Clicking attraction...")
    page.get_by_text("Cape Coast Castle").first.click()

    # 4. Wait for dialog
    print("Waiting for dialog...")
    page.wait_for_selector("div[role='dialog']")

    # 5. Take screenshot
    print("Taking screenshot...")
    page.screenshot(path="verification/app_verification.png")

    browser.close()

if __name__ == "__main__":
    with sync_playwright() as playwright:
        run(playwright)
