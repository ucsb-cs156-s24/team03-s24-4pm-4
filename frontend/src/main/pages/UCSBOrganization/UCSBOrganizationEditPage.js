import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import UCSBOrganizationForm from 'main/components/UCSBOrganization/UCSBOrganizationForm';
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";


export default function UCSBOrganizationEditPage({storybook=false}) {
    let { id } = useParams();

    const { data: organization, _error, _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/UCSBOrganization?orgCode=${id}`],
            {  // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
                method: "GET",
                url: `/api/UCSBOrganization`,
                params: {
                    orgCode: id
                }
            }
        );


    const objectToAxiosPutParams = (organization) => ({
        url: "/api/UCSBOrganization",
        method: "PUT",
        params: {
            orgCode: organization.orgCode,
        },
        data: {
            orgCode: organization.orgCode,
            orgTranslationShort: organization.orgTranslationShort,
            orgTranslation: organization.orgTranslation,
            inactive: organization.inactive
        }
    });


    const onSuccess = (organization) => {
        toast(`UCSBOrganization Updated - orgCode: ${organization.orgCode} orgTranslationShort: ${organization.orgTranslationShort}`);
    }


    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/UCSBOrganization?orgCode=${id}`]
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
                <h1>Edit Your UCSBOrganization</h1>
                {
                    organization && <UCSBOrganizationForm initialContents={organization} submitAction={onSubmit} buttonLabel="Update" />
                }
            </div>
        </BasicLayout>
    )

}