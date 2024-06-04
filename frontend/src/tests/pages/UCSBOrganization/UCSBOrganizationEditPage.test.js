import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";
import UCSBOrganizationEditPage from "main/pages/UCSBOrganization/UCSBOrganizationEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: "DS"
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("UCSBOrganizationPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/UCSBOrganization", { params: { orgCode: "DS" } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Your UCSBOrganization");
            expect(screen.queryByTestId("UCSBOrganization-name")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/UCSBOrganization", { params: { orgCode: "DS" } }).reply(200, {
                orgCode: "DS",
                orgTranslationShort: "Delta Sig",
                orgTranslation: "Delta Sigma Pi",
                inactive: "false"
            });
            axiosMock.onPut('/api/UCSBOrganization').reply(200, {
                orgCode: "DS",
                orgTranslationShort: "Delta Sigm",
                orgTranslation: "Delta Sigma Pii",
                inactive: "false"
            });
        });

        const queryClient = new QueryClient();

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBOrganizationForm-orgCode");

            const orgField = screen.getByTestId("UCSBOrganizationForm-orgCode");
            const orgTranslationShortField = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
            const orgTranslationField = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
            const inactiveField = screen.getByTestId("UCSBOrganizationForm-inactive");
            const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

            expect(orgField).toBeInTheDocument();
            expect(orgField).toHaveValue("DS");
            expect(orgTranslationShortField).toBeInTheDocument();
            expect(orgTranslationShortField).toHaveValue("Delta Sig");
            expect(orgTranslationField).toBeInTheDocument();
            expect(orgTranslationField).toHaveValue("Delta Sigma Pi");
            expect(inactiveField).toBeInTheDocument();
            expect(inactiveField).toHaveValue("false");

            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(orgTranslationShortField, { target: { value: 'Delta Sigm' } });
            fireEvent.change(orgTranslationField, { target: { value: 'Delta Sigma Pii' } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("UCSBOrganization Updated - orgCode: DS orgTranslationShort: Delta Sigm");

            expect(mockNavigate).toBeCalledWith({ "to": "/UCSBOrganization" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ orgCode: "DS" });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                orgCode: "DS",
                orgTranslationShort: "Delta Sigm",
                orgTranslation: "Delta Sigma Pii",
                inactive: "false"
            })); // posted object
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBOrganizationForm-orgCode");

            const orgField = screen.getByTestId("UCSBOrganizationForm-orgCode");
            const orgTranslationShortField = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
            const orgTranslationField = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
            const inactiveField = screen.getByTestId("UCSBOrganizationForm-inactive");
            const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

            expect(orgField).toBeInTheDocument();
            expect(orgField).toHaveValue("DS");
            expect(orgTranslationShortField).toBeInTheDocument();
            expect(orgTranslationShortField).toHaveValue("Delta Sig");
            expect(orgTranslationField).toBeInTheDocument();
            expect(orgTranslationField).toHaveValue("Delta Sigma Pi");
            expect(inactiveField).toBeInTheDocument();
            expect(inactiveField).toHaveValue("false");

            fireEvent.change(orgTranslationShortField, { target: { value: 'Delta Sigm' } });
            fireEvent.change(orgTranslationField, { target: { value: 'Delta Sigma Pii' } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("UCSBOrganization Updated - orgCode: DS orgTranslationShort: Delta Sigm");
            expect(mockNavigate).toBeCalledWith({ "to": "/UCSBOrganization" });
        });
    });
});