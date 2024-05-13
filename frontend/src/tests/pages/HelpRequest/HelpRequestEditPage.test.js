import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import HelpRequestEditPage from "main/pages/HelpRequest/HelpRequestEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";

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
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("HelpRequestEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/HelpRequest", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Help Request");
            expect(screen.queryByTestId("HelpRequestForm-requesterEmail")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/HelpRequest", { params: { id: 17 } }).reply(200, {
                id: 17,
                requesterEmail: "achiang@ucsb.edu",
                teamId: "team 0",
                tableOrBreakoutRoom: "room",
                requestTime: "2022-03-14T15:00",
                explanation: "dokku config",
                solved: 'false'
            });
            axiosMock.onPut('/api/HelpRequest').reply(200, {
                id: "17",
                requesterEmail: "bob@ucsb.edu",
                teamId: "team 1",
                tableOrBreakoutRoom: "table",
                requestTime: "2022-12-25T08:00",
                explanation: "oauth",
                solved: 'true'
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("HelpRequestForm-requesterEmail");

            const idField = screen.getByTestId("HelpRequestForm-id");
            const emailField = screen.getByTestId("HelpRequestForm-requesterEmail");
            const teamField = screen.getByTestId("HelpRequestForm-teamId");
            const tableOrRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
            const timeField = screen.getByTestId("HelpRequestForm-requestTime");
            const explanationField = screen.getByTestId("HelpRequestForm-explanation");
            const solvedField = screen.getByTestId("HelpRequestForm-solved");
            const submitButton = screen.getByTestId("HelpRequestForm-submit");

            expect(idField).toHaveValue("17");
            expect(emailField).toHaveValue("achiang@ucsb.edu");
            expect(teamField).toHaveValue("team 0");
            expect(tableOrRoomField).toHaveValue("room");
            expect(timeField).toHaveValue("2022-03-14T15:00");
            expect(explanationField).toHaveValue("dokku config");
            expect(solvedField).toHaveValue('false');
            
            expect(submitButton).toBeInTheDocument();
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("HelpRequestForm-requesterEmail");

            const idField = screen.getByTestId("HelpRequestForm-id");
            const emailField = screen.getByTestId("HelpRequestForm-requesterEmail");
            const teamField = screen.getByTestId("HelpRequestForm-teamId");
            const tableOrRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
            const timeField = screen.getByTestId("HelpRequestForm-requestTime");
            const explanationField = screen.getByTestId("HelpRequestForm-explanation");
            const solvedField = screen.getByTestId("HelpRequestForm-solved");
            const submitButton = screen.getByTestId("HelpRequestForm-submit");

            expect(idField).toHaveValue("17");
            expect(emailField).toHaveValue("achiang@ucsb.edu");
            expect(teamField).toHaveValue("team 0");
            expect(tableOrRoomField).toHaveValue("room");
            expect(timeField).toHaveValue("2022-03-14T15:00");
            expect(explanationField).toHaveValue("dokku config");
            expect(solvedField).toHaveValue('false'); 

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(emailField, { target: { value: 'bob@ucsb.edu' } })
            fireEvent.change(teamField, { target: { value: 'team 1' } })
            fireEvent.change(tableOrRoomField, { target: { value: 'table' } })
            fireEvent.change(timeField, { target: { value: "2022-12-25T08:00" } })
            fireEvent.change(explanationField, { target: { value: 'oauth' } })
            fireEvent.change(solvedField, { target: { value: 'true' } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("HelpRequest Updated - id: 17 email: bob@ucsb.edu");
            expect(mockNavigate).toBeCalledWith({ "to": "/helprequest" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                requesterEmail: "bob@ucsb.edu",
                teamId: "team 1",
                tableOrBreakoutRoom: "table",
                requestTime: "2022-12-25T08:00",
                explanation: "oauth",
                solved: 'true'
            })); // posted object

        });

       
    });
});


