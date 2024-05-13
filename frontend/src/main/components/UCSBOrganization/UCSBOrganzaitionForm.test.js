import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { BrowserRouter as Router } from "react-router-dom";

import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";

import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("UCSBOrganizationForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Organization Code (orgCode)", "Organization Full Name", "Shorter Organization Translation", "Currently Inactive"];
    const testId = "UCSBOrganizationForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm initialContents={ucsbOrganizationFixtures.oneOrganization} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-orgCode`)).toBeInTheDocument();
        expect(screen.getByText(`Organization Code (orgCode)`)).toBeInTheDocument();

        const orgTranslationShortInput = await screen.findByTestId(`${testId}-orgTranslationShort`);
        expect(orgTranslationShortInput).toBeInTheDocument();

        const orgTranslationInput = await screen.findByTestId(`${testId}-orgTranslation`);
        expect(orgTranslationInput).toBeInTheDocument();

        const inactiveInput = await screen.findByTestId(`${testId}-inactive`);
        expect(inactiveInput).toBeInTheDocument();

        const submitInput = await screen.findByTestId(`${testId}-submit`);
        expect(submitInput).toBeInTheDocument();
    });
    


    test("Cancel is working", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("button label changes based on the 'buttonLabel' prop", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm buttonLabel="Update Organization" />
                </Router>
            </QueryClientProvider>
        );
    
        expect(await screen.findByText(/Update Organization/)).toBeInTheDocument();
    });


    test("required fields trigger validation errors on empty submission", async () => {
        const mockSubmitAction = jest.fn();
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm submitAction={mockSubmitAction} />
                </Router>
            </QueryClientProvider>
        );
    
        const submitButton = screen.getByTestId(`${testId}-submit`);
        fireEvent.click(submitButton);
    
        await waitFor(() => {
            expect(screen.getByText(/orgCode is required/)).toBeInTheDocument();
            expect(screen.getByText(/orgTranslationShort is required/)).toBeInTheDocument();
            expect(screen.getByText(/orgTranslation is required/)).toBeInTheDocument();
            expect(screen.getByText(/inactive is required/)).toBeInTheDocument();
        });
    
        // Verify that the submit action was not called due to validation errors
        expect(mockSubmitAction).not.toHaveBeenCalled();
    });
    
    

    test("Correct validations are being performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm/>
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/orgCode is required/);
        expect(screen.getByText(/orgTranslationShort is required/)).toBeInTheDocument();
        expect(screen.getByText(/orgTranslation is required/)).toBeInTheDocument();
        expect(screen.getByText(/inactive is required/)).toBeInTheDocument();

        const nameInput = screen.getByTestId(`${testId}-orgCode`);
        fireEvent.change(nameInput, { target: { value: "a".repeat(31) } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Max length is 30 characters/)).toBeInTheDocument();
        });
    });

});