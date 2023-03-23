import { useContext } from "react";
import ListFormContext from "../context/ListFormContext";

const useListFormContext = () => {
  return useContext(ListFormContext)
}

export default useListFormContext