import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

import api from "../api/axios";

const ListFormContext = createContext({});

export const ListFormProvider = ({ children }) => {
  //urlTitle hashmap
  const urlTitle = {
    aboutyourplace: 0,
    location: 1,
  };

  //urlTitle reverse hashmap (auto generated)
  const urlTitleReverse = {};
  for (const key in urlTitle) {
    const value = urlTitle[key];
    urlTitleReverse[value] = key;
  }

  //set initial current page
  const [page, setPage] = useState(0);

  //get current logged in user
  const { user: currentUser } = useContext(AuthContext);
  const currentUserId = currentUser._id;

  //form data that will be posted
  const [data, setData] = useState({
    _id: JSON.parse(localStorage.getItem("listId")) || "",
    userId: currentUserId,
    title: "",
    address: "",
    city: "",
    moveInDate: "",
    moveOutDate: "",
    expiryDate: "01-01-2050",
    price: "",
    propertyType: "",
    description: "",
  });

  console.log("listform rendered");

  //to put list id in local storage
  useEffect(() => {
    localStorage.setItem("listId", JSON.stringify(data._id));
  }, [data]);

  //for loading effects
  const [loading, setLoading] = useState(true);

  //to update above data object with values from DB instead of using local storage (IDK if this makes sense lmao but whatever)
  useEffect(() => {
    api
      .get("/listings/" + data._id)
      .then((response) => {
        console.log(response.data)
        setData((data) => ({
          ...data,
          title: response.data.title,
          address: response.data.address,
        }));
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, [data._id]);

  //to handle change of the inputs in all the forms
  const handleChange = (e) => {
    const type = e.target.type;
    const name = e.target.name;

    const value = type === "checkbox" ? e.target.checked : e.target.value;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const { ...requiredInputs } = data;

  const canSubmit =
    [...Object.values(requiredInputs)].every(Boolean) &&
    page === Object.keys(urlTitle).length - 1;

  return (
    <ListFormContext.Provider
      value={{
        urlTitle,
        urlTitleReverse,
        page,
        setPage,
        data,
        setData,
        canSubmit,
        handleChange,
        currentUserId,
        loading,
      }}
    >
      {children}
    </ListFormContext.Provider>
  );
};

export default ListFormContext;
