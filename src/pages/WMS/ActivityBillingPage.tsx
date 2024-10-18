import { useState } from "react";
import { TUniversalDialogProps } from "types/types.UniversalDialog";
import UniversalDialog from "components/popup/UniversalDialog";
import { Button } from "@mui/material";
const ActivityBillingPage = () => {
    const [addActivityFormPopup, setActivityFormPopup] = useState<TUniversalDialogProps>({
        action: {
          open: false,
          fullWidth: true,
          maxWidth: 'sm'
        },
        title: 'Add ActivityBilling',
        data: { existingData: {}, isEditMode: false }
      });
      const toggleCountryPopup = () => {
        setActivityFormPopup((prev) => {
          return { ...prev, data: { isEditMode: false, existingData: {} }, action: { ...prev.action, open: !prev.action.open } };
        });
      };
    const handleAddActivityForm = () =>{
        setActivityFormPopup((prev) => {
            return { ...prev, data: { isEditMode: false, existingData: {} }, action: { ...prev.action, open: !prev.action.open } };
          });
    }
  return (
   <div className="w-full">
       <div className="w-full d-flex">
            <div className="ba_principal_search_div">
                Principal dropdown
            </div>
            <div className="ba_add_activity_and_populate_div">
            <div className="ba_add_activity_div">
                <Button variant="contained" onClick={handleAddActivityForm}>add new activity</Button>
            </div>
            <div className="ba_populate_activity">
                populate activities
            </div>
            </div>
       </div>
       {/* Add Activity Dialogue Box */}
       {!!addActivityFormPopup && addActivityFormPopup.action.open && (
        <UniversalDialog
        action={{ ...addActivityFormPopup.action }}
        onClose={toggleCountryPopup}
        title='Billing Activity Form'
        hasPrimaryButton={false}
        >
      <p>Hello</p>
        </UniversalDialog>
      )}
   </div>
  )
}

export default ActivityBillingPage;