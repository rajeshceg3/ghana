import time
from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1280, 'height': 800})

        print("Navigating to home page...")
        try:
            page.goto("http://localhost:3000", timeout=30000)
            page.wait_for_load_state("networkidle")
        except Exception as e:
            print(f"Page load warning (might be ok): {e}")

        # 1. Verify Map Marker Tabindex
        print("Verifying map marker tabindex...")
        try:
            # Wait for marker-1 to be attached
            # Note: Leaflet markers are sometimes slow to render
            marker = page.wait_for_selector("#marker-1", state="attached", timeout=10000)
            if marker:
                tabindex = marker.get_attribute("tabindex")
                print(f"Marker-1 tabindex: {tabindex}")
                if tabindex == "-1":
                    print("SUCCESS: Marker has tabindex='-1'")
                else:
                    print(f"FAILURE: Marker has tabindex='{tabindex}'")
            else:
                print("FAILURE: Marker-1 not found")
        except Exception as e:
            print(f"Error finding marker: {e}")

        # 2. Verify Attraction Details Contrast & Image
        print("Opening Details Modal...")
        try:
            # Open via sidebar list item
            page.get_by_text("Cape Coast Castle", exact=False).first.click()

            # Wait for modal
            modal = page.locator("div[role='dialog']")
            modal.wait_for(state="visible", timeout=5000)
            time.sleep(1.5) # Animation wait

            # Screenshot for visual contrast check
            page.screenshot(path="verification/fixed_modal.png")
            print("Screenshot saved to verification/fixed_modal.png")

            # Verify Image sizes prop
            print("Verifying sizes prop...")
            # The modal image is the one visible
            img = modal.locator("img").first

            sizes = img.get_attribute("sizes")
            print(f"Image sizes attribute: {sizes}")

            if sizes == "(max-width: 768px) 100vw, 700px":
                 print("SUCCESS: sizes prop is correct.")
            else:
                 print(f"FAILURE: sizes prop is '{sizes}'")

        except Exception as e:
            print(f"Error checking modal: {e}")
            page.screenshot(path="verification/error_modal.png")

        browser.close()

if __name__ == "__main__":
    run()
