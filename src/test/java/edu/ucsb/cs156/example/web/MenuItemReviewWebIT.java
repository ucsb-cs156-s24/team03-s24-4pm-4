package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class MenuItemReviewWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_menuitemreview() throws Exception {
        setupUser(true);

        page.getByText("MenuItemReview").click();

        page.getByText("Create MenuItemReview").click();
        assertThat(page.getByText("Create New MenuItemReview")).isVisible();
        page.getByTestId("MenuItemReviewForm-itemId").fill("1");
        page.getByTestId("MenuItemReviewForm-reviewerEmail").fill("test@gmail.com");
        page.getByTestId("MenuItemReviewForm-stars").fill("5");
        page.getByTestId("MenuItemReviewForm-dateReviewed").fill("2023-06-01T00:00");
        page.getByTestId("MenuItemReviewForm-comments").fill("comment");
        page.getByTestId("MenuItemReviewForm-submit").click();

        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-reviewerEmail"))
                .hasText("test@gmail.com");

        page.getByTestId("MenuItemReviewTable-cell-row-0-col-Edit-button").click();

        assertThat(page.getByText("Edit MenuItemReview")).isVisible();
        page.getByTestId("MenuItemReviewForm-reviewerEmail").fill("test2@gmail.com");
        page.getByTestId("MenuItemReviewForm-stars").fill("1");
        page.getByTestId("MenuItemReviewForm-comments").fill("GREAT!");
        page.getByTestId("MenuItemReviewForm-dateReviewed").fill("2024-06-01T00:00");
        page.getByTestId("MenuItemReviewForm-submit").click();

        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-reviewerEmail")).hasText("test2@gmail.com");

        page.getByTestId("MenuItemReviewTable-cell-row-0-col-Delete-button").click();
        
        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-reviewerEmail")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_menuitemreview() throws Exception {
        setupUser(false);

        page.getByText("MenuItemReview").click();

        assertThat(page.getByText("Create MenuItemReview")).not().isVisible();
        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-reviewerEmail")).not().isVisible();
    }
}