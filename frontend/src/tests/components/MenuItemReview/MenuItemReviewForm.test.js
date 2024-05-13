import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("MenuItemReviewForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByText(/Item Id/);
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a MenuItemReview", async () => {

        render(
            <Router  >
                <MenuItemReviewForm initialContents={menuItemReviewFixtures.oneReview} />
            </Router>
        );
        await screen.findByTestId(/MenuItemReviewForm-id/);
        expect(screen.getByText("Id")).toBeInTheDocument();
        expect(screen.getByTestId(/MenuItemReviewForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-itemId");
        const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
        const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
        const starsField = screen.getByTestId("MenuItemReviewForm-stars");
        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.change(itemIdField, { target: { value: 'bad-input' } });
        fireEvent.change(dateReviewedField, { target: { value: 'bad-input' } });
        fireEvent.change(starsField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await screen.findByText(/Item Id must be valid./);
        expect(screen.getByText(/Stars must be a number from 1 to 5./)).toBeInTheDocument();

        fireEvent.change(starsField, { target: { value: '0' } });
        await screen.findByText(/Min star rating is 1/);

        fireEvent.change(starsField, { target: { value: '6' } });
        await screen.findByText(/Max star rating is 5/);
        
    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-submit");
        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Item Id is required./);
        expect(screen.getByText(/Reviewer Email is required./)).toBeInTheDocument();
        expect(screen.getByText(/Date Reviewed is required./)).toBeInTheDocument();
        expect(screen.getByText(/Stars is required./)).toBeInTheDocument();
        expect(screen.getByText(/Comments is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <MenuItemReviewForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-itemId");

        const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
        const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
        const starsField = screen.getByTestId("MenuItemReviewForm-stars");
        const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
        const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.change(itemIdField, { target: { value: '1' } });
        fireEvent.change(reviewerEmailField, { target: { value: 'test@gmail.com' } });
        fireEvent.change(starsField, { target: { value: '3' } });
        fireEvent.change(dateReviewedField, { target: { value: '2022-01-02T12:00' } });
        fireEvent.change(commentsField, { target: { value: 'This is a test review' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Item Id is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Reviewer Email is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Stars is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Stars must be a number from 1 to 5./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Date Reviewed is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Comments is required./)).not.toBeInTheDocument();


    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-cancel");
        const cancelButton = screen.getByTestId("MenuItemReviewForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


