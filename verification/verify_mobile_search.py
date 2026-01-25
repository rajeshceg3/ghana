from playwright.sync_api import sync_playwright, expect

def verify_mobile_search_and_accessibility():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use mobile viewport
        context = browser.new_context(viewport={"width": 390, "height": 844})
        page = context.new_page()

        try:
            print("Navigating to home...")
            page.goto("http://localhost:3000")

            # Wait for content to load
            print("Waiting for search input...")
            # Mobile search input is the one with aria-label="Search attractions mobile"
            mobile_input = page.get_by_label("Search attractions mobile")
            expect(mobile_input).to_be_visible()

            # Type something
            print("Typing 'Cape'...")
            mobile_input.fill("Cape")

            # Verify X button appears
            # The button has aria-label="Clear search". In mobile, it's inside the same container.
            # We need to distinguish from desktop one if present (but we are in mobile viewport, so desktop one might be hidden via CSS)
            # However, playwight sees the DOM. The desktop one is hidden with `md:block` (so hidden on mobile).
            # But let's be specific.
            clear_btn = page.get_by_label("Clear search")
            # There might be two clear buttons in DOM if desktop one is rendered but hidden.
            # But the desktop one is conditional on `searchQuery` too.
            # Since `searchQuery` is shared, both will appear.
            # But desktop one is in `hidden md:block`.
            # Let's filter by visibility.

            print("Checking clear button visibility...")
            # expect(clear_btn.first).to_be_visible() # This might be ambiguous

            # Let's take a screenshot with text
            page.screenshot(path="verification/mobile_search_with_text.png")

            # Click the clear button that is visible
            visible_clear_btn = clear_btn.filter(has_not=page.locator(".hidden")) # Rough filter, better to rely on playwright visibility
            # Actually, Playwright's click acts on visible elements.

            # We can just use the last one or first one that is visible.
            # Let's count visible ones.
            count = 0
            for i in range(clear_btn.count()):
                if clear_btn.nth(i).is_visible():
                    clear_btn.nth(i).click()
                    count += 1
                    break

            if count == 0:
                print("No visible clear button found!")
            else:
                print("Clicked clear button.")

            # Verify input is empty
            expect(mobile_input).to_have_value("")
            print("Input cleared.")

            page.screenshot(path="verification/mobile_search_cleared.png")

            # Verify AttractionList Accessibility
            # Desktop sidebar list has aria-label="Featured Places" on container.
            # Mobile sheet list.
            # But I added aria-label="List of attractions" to the UL itself.
            # Let's check if we can find it.
            # The desktop sidebar is hidden on mobile? No, `hidden md:flex`.
            # The mobile sheet is closed.
            # Let's open the mobile menu to see the list.

            print("Opening mobile menu...")
            page.get_by_label("Open menu").click()

            # Wait for sheet
            expect(page.get_by_text("Attractions", exact=True)).to_be_visible()

            # Check for UL with label
            list_ul = page.locator("ul[aria-label='List of attractions']")
            expect(list_ul).to_be_visible()
            print("Found accessible list.")

            page.screenshot(path="verification/mobile_menu_list.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    verify_mobile_search_and_accessibility()
