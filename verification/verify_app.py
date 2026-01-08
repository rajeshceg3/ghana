import time
from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        print("Navigating to home page...")
        try:
            page.goto("http://localhost:3000", timeout=30000)
            page.wait_for_load_state("networkidle")
        except Exception as e:
            print(f"Error loading page: {e}")
            # Try to capture screenshot even if networkidle fails (sometimes long polling causes this)
            page.screenshot(path="verification/error_load.png")
            browser.close()
            return

        print("Page loaded. Taking initial screenshot...")
        page.screenshot(path="verification/homepage.png")

        # Check for console errors
        page.on("console", lambda msg: print(f"CONSOLE: {msg.type}: {msg.text}"))
        page.on("pageerror", lambda err: print(f"PAGE ERROR: {err}"))

        # Verify search
        print("Testing search...")
        search_input = page.get_by_placeholder("Find a destination...")
        if search_input.is_visible():
            search_input.fill("Cape")
            time.sleep(1) # Wait for debounce
            page.screenshot(path="verification/search_results.png")
            print("Search screenshot taken.")
        else:
            print("Search input not found (might be mobile view?)")

        # Click on a marker (simulated by finding the marker in DOM if possible, or list item)
        # Since markers are canvas/divs in Leaflet, clicking list item is easier
        print("Clicking on first list item...")
        try:
            # Assuming AttractionList renders items with text "Cape Coast Castle"
            # It might be in the sidebar
            item = page.get_by_text("Cape Coast Castle").first
            if item.is_visible():
                item.click()
                time.sleep(2) # Wait for modal animation
                page.screenshot(path="verification/details_modal.png")
                print("Details modal screenshot taken.")

                # Close modal
                close_btn = page.get_by_role("button", name="Close details")
                if close_btn.is_visible():
                    close_btn.click()
                    time.sleep(1)
            else:
                print("Cape Coast Castle item not found visible")
        except Exception as e:
            print(f"Error clicking item: {e}")

        # Mobile View Test
        print("Testing mobile view...")
        page.set_viewport_size({"width": 375, "height": 667})
        time.sleep(1)
        page.screenshot(path="verification/mobile_view.png")

        # Open mobile menu
        menu_btn = page.get_by_role("button", name="Open menu")
        if menu_btn.is_visible():
            menu_btn.click()
            time.sleep(1)
            page.screenshot(path="verification/mobile_menu.png")
            print("Mobile menu screenshot taken.")
        else:
            print("Mobile menu button not found")

        browser.close()

if __name__ == "__main__":
    run()
