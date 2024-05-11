import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

export default function UCSBDiningCommonsMenuItemCreatePage() {


    const objectToAxiosParams = (UCSBDiningCommonsMenuItem) => ({
        url: "/api/ucsbdiningcommonsmenuitem/post",
        method: "POST",
        params: {
         diningCommonsCode: UCSBDiningCommonsMenuItem.diningCommonsCode,
         name: UCSBDiningCommonsMenuItem.name,
         station: UCSBDiningCommonsMenuItem.station
        }
      });
    
      const onSuccess = (UCSBDiningCommonsMenuItem) => {
        toast(`New UCSB Dining Commons Menu Item Created - id: ${UCSBDiningCommonsMenuItem.id} diningCommonsCode: ${UCSBDiningCommonsMenuItem.diningCommonsCode} name: ${UCSBDiningCommonsMenuItem.name} station: ${UCSBDiningCommonsMenuItem.station}`);
      }
    
      const mutation = useBackendMutation(
        objectToAxiosParams,
         { onSuccess }, 
         // Stryker disable next-line all : hard to set up test for caching
         ["/api/ucsbdiningcommonsmenuitem/all"] // mutation makes this key stale so that pages relying on it reload
         );
    
      const { isSuccess } = mutation
    
      const onSubmit = async (data) => {
        mutation.mutate(data);
      }
    
      if (isSuccess && !storybook) {
        return <Navigate to="/ucsbdiningcommonsmenuitem" />
      }
    
      return (
        <BasicLayout>
          <div className="pt-2">
            <h1>Create New Menu Item</h1>
            <UCSBDiningCommonsMenuItemForm submitAction={onSubmit} />
          </div>
        </BasicLayout>
      )

}
