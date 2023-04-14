import { Outlet } from "react-router-dom";
import { ListFormProvider } from "./context/ListFormContext";

const ListFormContextLayout = () => {
  return (
    <ListFormProvider>
        <Outlet />
    </ListFormProvider>
  );
};

export default ListFormContextLayout;
