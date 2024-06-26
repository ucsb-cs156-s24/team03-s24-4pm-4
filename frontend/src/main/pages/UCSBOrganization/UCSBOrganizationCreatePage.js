import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";


export default function UCSBOrganizationCreatePage({storybook=false}) {



  const objectToAxiosParams = (org) => ({
    url: "/api/UCSBOrganization/post",
    method: "POST",
    params: {
     orgCode: org.orgCode,
     orgTranslationShort: org.orgTranslationShort,
     orgTranslation: org.orgTranslation,
     inactive: org.inactive
    }
  });

  const onSuccess = (org) => {
    toast(`New organization Created - orgCode: ${org.orgCode} orgTranslationShort: ${org.orgTranslationShort} orgTranslation: ${org.orgTranslation} inactive: ${org.inactive}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/UCSBOrganization/all"] // mutation makes this key stale so that pages relying on it reload
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/UCSBOrganization" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Organization</h1>
        <UCSBOrganizationForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}