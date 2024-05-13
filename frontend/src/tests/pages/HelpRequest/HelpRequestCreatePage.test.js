import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestCreatePage from "main/pages/HelpRequest/HelpRequestCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("HelpRequestCreatePage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();

        const helpRequest = {
            id: 1,
            requesterEmail: "achiang@ucsb.edu",
            teamId: "team01",
            tableOrBreakoutRoom: "room",
            requestTime: "2022-02-02T00:00",
            explanation: "dokku help",
            solved: true
        }

        axiosMock.onPost("/api/HelpRequest/post").reply( 202, helpRequest );

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("HelpRequestForm-requesterEmail")).toBeInTheDocument();
        });


        const requesterEmail = screen.getByTestId("HelpRequestForm-requesterEmail");
        const teamId = screen.getByTestId("HelpRequestForm-teamId");
        const tableOrBreakoutRoom = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
        const requestTime = screen.getByTestId("HelpRequestForm-requestTime");
        const explanation = screen.getByTestId("HelpRequestForm-explanation");
        const solved = screen.getByTestId("HelpRequestForm-solved");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.change(requesterEmail, { target: { value: 'achiang@ucsb.edu' } });
        fireEvent.change(teamId, { target: { value: 'team01' } });
        fireEvent.change(tableOrBreakoutRoom, { target: { value: 'room' } });
        fireEvent.change(requestTime, { target: { value: '2022-02-02T00:00' } });
        fireEvent.change(explanation, { target: { value: 'dokku help' } });
        fireEvent.change(solved, { target: { value: true }});

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
            "requesterEmail": "achiang@ucsb.edu",
            "teamId": "team01",
            "tableOrBreakoutRoom": "room",
            "requestTime": "2022-02-02T00:00",
            "explanation": "dokku help",
            "solved": "true"
            });

        expect(mockToast).toBeCalledWith("New help request Created - id: 1 email: achiang@ucsb.edu");
        expect(mockNavigate).toBeCalledWith({ "to": "/helprequest" });
    });


});


