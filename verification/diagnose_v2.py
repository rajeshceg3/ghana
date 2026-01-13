import time
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        console_logs = []
        page.on("console", lambda msg: console_logs.append(f"{msg.type}: {msg.text}"))

        page_errors = []
        page.on("pageerror", lambda exc: page_errors.append(str(exc)))

        print("Navigating to http://localhost:3000")
        try:
            page.goto("http://localhost:3000", timeout=60000)
            page.wait_for_load_state("networkidle")
        except Exception as e:
            print(f"Failed to load page: {e}")
            browser.close()
            return

        print("Page loaded.")

        # Check title
        print(f"Page Title: {page.title()}")

        # Check for map container
        map_container = page.locator(".custom-map-container")
        if map_container.count() > 0:
            print("SUCCESS: Map container found.")
        else:
            print("FAILURE: Map container NOT found.")

        # Check for search input
        search_input = page.locator("input[placeholder='Find a destination...']")
        if search_input.count() > 0:
            print("SUCCESS: Search input found.")
            search_input.fill("Cape Coast")
            time.sleep(1) # wait for debounce/react
            # Check results - assuming list filters
            # We need to see if the list reduced.
            # This is hard to verify without knowing initial count, but let's check for specific text.
            if page.get_by_text("Cape Coast Castle").is_visible():
                print("SUCCESS: Search result 'Cape Coast Castle' visible.")
            else:
                print("FAILURE: Search result 'Cape Coast Castle' NOT visible after search.")
        else:
            print("FAILURE: Search input NOT found.")

        # Check for accessibility: Images without alt
        images = page.locator("img").all()
        missing_alt = 0
        for img in images:
            alt = img.get_attribute("alt")
            if not alt:
                missing_alt += 1
                # print(f"Image missing alt: {img.evaluate('el => el.src')}")

        if missing_alt > 0:
            print(f"WARNING: {missing_alt} images missing alt text.")
        else:
            print("SUCCESS: All images have alt text.")

        # Check for button accessibility (aria-label)
        buttons = page.locator("button").all()
        missing_label = 0
        for btn in buttons:
            text = btn.inner_text()
            label = btn.get_attribute("aria-label")
            if not text and not label:
                 missing_label += 1
                 # print(f"Button missing label: {btn.evaluate('el => el.outerHTML')}")

        if missing_label > 0:
            print(f"WARNING: {missing_label} buttons missing accessible name.")
        else:
            print("SUCCESS: All buttons have accessible names.")

        # Report Console Logs
        if console_logs:
            print("\n--- Console Logs ---")
            for log in console_logs:
                print(log)

        if page_errors:
            print("\n--- Page Errors ---")
            for err in page_errors:
                print(err)

        page.screenshot(path="verification/diagnosis.png")
        print("Screenshot saved to verification/diagnosis.png")

        browser.close()

if __name__ == "__main__":
    run()
