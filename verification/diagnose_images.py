import time
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        print("Navigating to http://localhost:3000")
        try:
            page.goto("http://localhost:3000", timeout=60000)
            page.wait_for_load_state("networkidle")
        except Exception as e:
            print(f"Failed to load page: {e}")
            browser.close()
            return

        print("Page loaded.")

        # Check for accessibility: Images without alt
        images = page.locator("img").all()
        missing_alt = 0
        print("\n--- Images Missing Alt Text ---")
        for img in images:
            alt = img.get_attribute("alt")
            src = img.get_attribute("src")
            if alt is None or alt.strip() == "":
                # Check if it's a leaflet tile (usually contains 'cartocdn' or 'openstreetmap')
                if src and ('cartocdn' in src or 'openstreetmap' in src):
                    # These are map tiles, usually acceptable to be empty, but should ideally have alt=""
                    # If alt is None, it's an issue. If alt="", it's fine.
                    # get_attribute("alt") returns None if attribute is missing, or empty string if alt=""
                    if alt is None:
                        print(f"Map Tile (Missing Attribute): {src[:50]}...")
                        missing_alt += 1
                    # If alt is "", it is decorative, which is fine for tiles.
                else:
                    print(f"Content Image: {src}")
                    missing_alt += 1

        if missing_alt > 0:
            print(f"\nTotal images missing alt attribute: {missing_alt}")
        else:
            print("\nSUCCESS: All images have alt text.")

        browser.close()

if __name__ == "__main__":
    run()
