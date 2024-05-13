import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";
import HelpRequestForm from "main/components/HelpRequest/HelpRequestForm";

export default function HelpRequestCreatePage({storybook=false}) {

  const objectToAxiosParams = (request) => ({
    url: "/api/HelpRequest/post",
    method: "POST",
    params: {
      requesterEmail: request.requesterEmail,
      teamId: request.teamId,
      tableOrBreakoutRoom: request.tableOrBreakoutRoom,
      requestTime: request.requestTime,
      explanation: request.explanation,
      solved: request.solved
    }
  });

  const onSuccess = (request) => {
    toast(`New help request Created - id: ${request.id} email: ${request.requesterEmail}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/HelpRequest/all"]
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/helprequest" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Help Request</h1>

        <HelpRequestForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )
}

