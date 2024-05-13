import { fireEvent, render, waitFor, screen, cleanup } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBOrganizationTable from "main/components/UCSBOrganization/UCSBOrganizationTable";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import axios from 'axios';

jest.mock('axios');
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

describe("UCSBOrganizationTable tests", () => {
  const queryClient = new QueryClient();
  const testId = "UCSBOrganizationTable";

  beforeEach(() => {
    queryClient.clear();
    mockedNavigate.mockClear();
    axios.delete.mockClear();
    axios.delete.mockResolvedValue({ data: {} }); // Mock the delete call to resolve with an empty object
  });

  test("renders correctly with admin privileges", async () => {
    const currentUser = currentUserFixtures.adminUser;
  
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <UCSBOrganizationTable organizations={ucsbOrganizationFixtures.threeOrganizations} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    ucsbOrganizationFixtures.threeOrganizations.forEach((org, index) => {
      expect(screen.getByTestId(`${testId}-cell-row-${index}-col-orgCode`)).toHaveTextContent(org.orgCode);
      expect(screen.getByTestId(`${testId}-cell-row-${index}-col-orgTranslation`)).toHaveTextContent(org.orgTranslation);
      expect(screen.getByTestId(`${testId}-cell-row-${index}-col-orgTranslationShort`)).toHaveTextContent(org.orgTranslationShort);
      expect(screen.getByTestId(`${testId}-cell-row-${index}-col-Currently Inactive`)).toHaveTextContent(String(org.inactive));

      // Check for Edit and Delete buttons for admin user
      expect(screen.getByTestId(`${testId}-cell-row-${index}-col-Edit-button`)).toBeInTheDocument();
      expect(screen.getByTestId(`${testId}-cell-row-${index}-col-Delete-button`)).toBeInTheDocument();
    });
  });

  test("Edit button navigates to the correct edit page for the organization", async () => {
    const currentUser = currentUserFixtures.adminUser;
  
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <UCSBOrganizationTable organizations={ucsbOrganizationFixtures.threeOrganizations} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  
    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    fireEvent.click(editButton);
  
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(`/UCSBOrganization/edit/${ucsbOrganizationFixtures.threeOrganizations[0].orgCode}`));
  });
  test("renders correctly without admin privileges", () => {
    const currentUser = currentUserFixtures.userOnly;
  
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable organizations={ucsbOrganizationFixtures.threeOrganizations} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  
    // Assertions to check non-admin user does not see Edit and Delete buttons
    ucsbOrganizationFixtures.threeOrganizations.forEach((org, index) => {
      expect(screen.queryByTestId(`${testId}-cell-row-${index}-col-Edit-button`)).toBeNull();
      expect(screen.queryByTestId(`${testId}-cell-row-${index}-col-Delete-button`)).toBeNull();
    });
  });
  test("conditional rendering of Edit and Delete buttons based on user role", () => {
    // Render the table as a non-admin user first
    let currentUser = currentUserFixtures.userOnly;
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable organizations={ucsbOrganizationFixtures.threeOrganizations} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  
    // Expect that Edit and Delete buttons are not present for a non-admin user
    ucsbOrganizationFixtures.threeOrganizations.forEach((_, index) => {
      expect(screen.queryByTestId(`${testId}-cell-row-${index}-col-Edit-button`)).toBeNull();
      expect(screen.queryByTestId(`${testId}-cell-row-${index}-col-Delete-button`)).toBeNull();
    });
  
    // Cleanup the current render before next
    cleanup();
  
    // Render the table as an admin user now
    currentUser = currentUserFixtures.adminUser;
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable organizations={ucsbOrganizationFixtures.threeOrganizations} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  
    // Expect that Edit and Delete buttons are present for an admin user
    ucsbOrganizationFixtures.threeOrganizations.forEach((_, index) => {
      expect(screen.getByTestId(`${testId}-cell-row-${index}-col-Edit-button`)).toBeInTheDocument();
      expect(screen.getByTestId(`${testId}-cell-row-${index}-col-Delete-button`)).toBeInTheDocument();
    });
  });
  test("Column headers are correct", async () => {
    const currentUser = currentUserFixtures.adminUser;
  
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <UCSBOrganizationTable organizations={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  
    expect(screen.getByText("Organization Code (orgCode)")).toBeInTheDocument();
    expect(screen.getByText("Organization Full Name")).toBeInTheDocument();
    expect(screen.getByText("Shorter Organization Translation")).toBeInTheDocument();
    expect(screen.getByText("Currently Inactive")).toBeInTheDocument();
  });
  test("Edit and Delete buttons render with correct text", async () => {
    const currentUser = currentUserFixtures.adminUser;
  
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <UCSBOrganizationTable organizations={ucsbOrganizationFixtures.threeOrganizations} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  
    // Assuming you have only one set of buttons for simplicity
    expect(screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`).textContent).toBe("Edit");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`).textContent).toBe("Delete");
  });
  test("Edit and Delete buttons have correct classes", async () => {
    const currentUser = currentUserFixtures.adminUser;
  
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <UCSBOrganizationTable organizations={ucsbOrganizationFixtures.threeOrganizations} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  
    // Assuming that the buttons for the first row are representative
    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
  
    // Check if buttons have the correct classes
    expect(editButton).toHaveClass('btn-primary');
    expect(deleteButton).toHaveClass('btn-danger');
  });
  

})
  

