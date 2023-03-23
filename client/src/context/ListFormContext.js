import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

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

  const currentUrl = window.location.pathname
  const n = currentUrl.lastIndexOf('/')
  const result = currentUrl.substring(n + 1)

  useEffect(() => {
    setPage(urlTitle[result]);
  }, [urlTitle, result]);

  //to get current page (uses bit after last backslash in url)
  /*
  useEffect(() => {
    const currentUrl = window.location.pathname
    const n = currentUrl.lastIndexOf('/')
    const result = currentUrl.substring(n + 1)

    setPage(urlTitle[result]);
  }, [page]);
  */

  //get current logged in user
  const { user: currentUser} = useContext(AuthContext);
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

  useEffect(()=>{
    localStorage.setItem("listId", JSON.stringify(data._id))
  },[data._id])

  const handleChange = (e) => {
    const type = e.target.type;
    const name = e.target.name;

    const value = type === "checkbox" ? e.target.checked : e.target.value;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    console.log(data)
  };

  const { ...requiredInputs } = data;

  const canSubmit =
    [...Object.values(requiredInputs)].every(Boolean) &&
    page === Object.keys(urlTitle).length - 1;

  return (
    <ListFormContext.Provider
      value={{ urlTitle, urlTitleReverse, page, setPage, data, setData, canSubmit, handleChange, currentUserId }}
    >
      {children}
    </ListFormContext.Provider>
  );
};

export default ListFormContext;
