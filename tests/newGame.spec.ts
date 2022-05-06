import { test, expect, Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000');
});

const TEAM = 'Mooris';
const MEMBER_1 = 'Chris';
const MEMBER_2 = 'Fred';

test.describe('New game', () => {
  test('should create a new game with 2 members and two selected cards', async ({
    page,
  }) => {
    // Click cookie consent
    await page.locator('#rcc-confirm-button').click();

    // Open create modal
    await page.locator('data-testid=new-game-button').click();

    // Create team and user
    await page.locator('data-testid=team-name-input').fill(TEAM);
    await page.locator('data-testid=member-name-input').fill(MEMBER_1);
    await page.locator('data-testid=start-game-button').click();

    // Make sure team is created with the right name
    await expect(page.locator('data-testid=title')).toHaveText(TEAM);

    // Random card position number for fibonacci
    const randomCard = Math.floor(Math.random() * 14 + 0);

    // Read the value of that random card and click on it
    const card = page.locator(`data-testid=card >> nth=${randomCard}`);
    const member1CardValue = await card.locator('p').innerText();
    await card.click();

    // INVITE OTHERS

    // Get the share link
    const shareLink = await page
      .locator('data-testid=share-link >> visible=true')
      .innerText();

    // Log the current user out
    await page.locator('data-testid=user-context-menu-button').click();
    await page.locator('data-testid=logout-button').click();

    // Navigate to the team via the share link
    await page.goto(shareLink);

    // Join the game with a new member
    await page.locator('data-testid=member-name-input').fill(MEMBER_2);
    await page.locator('data-testid=join-button').click();

    // Check again if we are in the right team
    await expect(page.locator('data-testid=title')).toHaveText(TEAM);

    const randomCard2 = Math.floor(Math.random() * 14 + 0);

    // Read the value of that random card and click on it
    const card2 = page.locator(`data-testid=card >> nth=${randomCard2}`);
    const cardValue2 = await card2.locator('p').innerText();
    await card2.click();

    // Show all the cards
    await page.locator('data-testid=show-cards-button').click();

    // Get the value of the opened card
    const selectedCard = await page
      .locator(`data-testid=team-card-${MEMBER_1} >> data-testid=card-value`)
      .innerText();

    // Those cards should match
    expect(selectedCard).toBe(member1CardValue);

    const selectedCard2 = await page
      .locator(`data-testid=team-card-${MEMBER_2} >> data-testid=card-value`)
      .innerText();

    expect(selectedCard2).toBe(cardValue2);
  });
});
