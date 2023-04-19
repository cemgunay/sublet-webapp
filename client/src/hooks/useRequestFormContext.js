import { useContext } from "react";
import RequestFormContext from "../context/RequestFormContext";

const useRequestFormContext = () => {
  return useContext(RequestFormContext)
}

export default useRequestFormContext