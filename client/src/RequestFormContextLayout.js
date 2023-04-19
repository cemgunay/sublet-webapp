import { Outlet } from "react-router-dom";
import { RequestFormProvider } from "./context/RequestFormContext";

const RequestFormContextLayout = () => {
  return (
    <RequestFormProvider>
        <Outlet />
    </RequestFormProvider>
  );
};

export default RequestFormContextLayout;
