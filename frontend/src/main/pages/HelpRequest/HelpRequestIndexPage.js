import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import HelpRequestTable from 'main/components/HelpRequest/HelpRequestTable';
import { Button } from 'react-bootstrap';
import { useCurrentUser , hasRole} from 'main/utils/currentUser';

export default function HelpRequestIndexPage() {

  const currentUser = useCurrentUser();

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
        return (
            <Button
                variant="primary"
                href="/helprequest/create"
                style={{ float: "right" }}
            >
                Create Help Request 
            </Button>
        )
    } 
  }
  
  const { data: requests, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/HelpRequest/all"],
      { method: "GET", url: "/api/HelpRequest/all" },
      []
    );

  // hack: otherwise solved as a boolean is not going to show in table
  for (const req of requests) {
    req.solved = (req.solved === true || req.solved === "true")? "true" : "false";
  }
  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>Help Requests</h1>
        <HelpRequestTable requests={requests} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}