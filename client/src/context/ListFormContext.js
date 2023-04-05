import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

import api from "../api/axios";

const ListFormContext = createContext({});

export const ListFormProvider = ({ children }) => {
  //urlTitle hashmap
  const urlTitle = {
    aboutyourplace: 0,
    location: 1,
    basics: 2,
    amenities: 3,
    photos: 4,
    title: 5,
    description: 6,
    price: 7,
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
    location: {
      address1: "",
      city: "",
      countryregion: "",
      postalcode: "",
      stateprovince: "",
      unitnumber: "",
      lat: "",
      lng: "",
    },
    moveInDate: "",
    moveOutDate: "",
    aboutyourplace: {
      propertyType: "",
      privacyType: "",
    },
    basics: {
      bedrooms: [
        {
          bedType: [],
          ensuite: false,
        },
      ],
      bathrooms: 0,
    },
    amenities: {},
    utilities: {},
    expiryDate: "01-01-2050",
    price: 0,
    description: "",
  });

  console.log("listform rendered");

  //to put list id in local storage
  useEffect(() => {
    localStorage.setItem("listId", JSON.stringify(data._id) || "");
  }, [data]);

  //for loading effects
  const [loading, setLoading] = useState(true);

  //to update above data object with values from DB instead of using local storage (IDK if this makes sense lmao but whatever)
  useEffect(() => {
    setLoading(true);
    api
      .get("/listings/" + data._id)
      .then((response) => {
        console.log(response.data);
        setData((data) => ({
          ...data,
          title: response.data.title,
          description: response.data.description,
          price: response.data.price,
          aboutyourplace: {
            ...data.aboutyourplace,
            propertyType: response.data.aboutyourplace.propertyType,
            privacyType: response.data.aboutyourplace.privacyType,
          },
          location: {
            ...data.location,
            address1: response.data.location.address1,
            city: response.data.location.city,
            postalcode: response.data.location.postalcode,
            countryregion: response.data.location.countryregion,
            stateprovince: response.data.location.stateprovince,
            unitnumber: response.data.location.unitnumber,
            lat: response.data.location.lat,
            lng: response.data.location.lng,
          },
          basics: {
            ...data.basics,
            bedrooms: response.data.basics.bedrooms,
            bathrooms: response.data.basics.bathrooms,
          },
          amenities: response.data.amenities,
          utilities: response.data.utilities,
        }));
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, [data._id]);

  //to get list id from URL THIS WILL BE USED IF SOMEHOW URL CHANGES IDKKKKK

  /*
  const currentUrl = window.location.pathname;
  const x = currentUrl.slice(
    currentUrl.indexOf("/") + 1,
    currentUrl.lastIndexOf("/")
  );
  const x2 = x.substring(x.lastIndexOf("/") + 1);
  //console.log(x2)
  //console.log(JSON.parse(localStorage.getItem("listId")) || "")
  //console.log(data._id)
  //6421dd0e09d14e017654f557
  */

  //WHAT WE CAN DO:
  //check if local storage has an ID if not use this bad boy

  //to handle change of the inputs in all the forms
  const handleChange = (e) => {
    const type = e.target.type;
    const name = e.target.name;

    console.log(e.target);

    const value = type === "checkbox" ? e.target.checked : e.target.value;

    if (
      typeof data[urlTitleReverse[page]] === "object" &&
      data[urlTitleReverse[page]] !== null
    ) {
      setData((prevData) => ({
        ...prevData,
        [urlTitleReverse[page]]: {
          ...prevData[urlTitleReverse[page]],
          [name]: value,
        },
      }));
    } else if (urlTitleReverse[page] === "price") {
      if (name === "price") {
        const withouDollarSignValue = value.replace(/^\$/, "");
        const numberValue = parseInt(withouDollarSignValue)
        setData((prevData) => ({
          ...prevData,
          [name]: numberValue,
        }));
      } else {
        setData((prevData) => ({
          ...prevData,
          utilities: {
            ...prevData.utilities,
            [name]: value,
          },
        }));
      }
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  //to disable/enable submit at the end
  const { ...requiredInputs } = data;

  const canSubmit =
    [...Object.values(requiredInputs)].every(Boolean) &&
    page === Object.keys(urlTitle).length - 1;

  //to disable/enable the next button
  const [canGoNext, setCanGoNext] = useState(false);

  useEffect(() => {
    if (data) {
      const {
        location: { unitnumber, ...requiredLocation },
        basics: { bathrooms, ...requiredBasics },
        amenities,
        ...requiredData
      } = data;
      const copyData = {
        ...requiredData,
        location: { ...requiredLocation },
        basics: { ...requiredBasics },
      };
      if (urlTitleReverse[page] === "basics") {
        if (copyData.basics.bedrooms.length > 0) {
          for (let i = 0; i < copyData.basics.bedrooms.length; i++) {
            if (
              copyData.basics.bedrooms[i].bedType === undefined ||
              copyData.basics.bedrooms[i].bedType.length === 0
            ) {
              setCanGoNext(false);
            } else {
              setCanGoNext(true);
            }
          }
        } else {
          setCanGoNext(false);
        }
      } else if (urlTitleReverse[page] === "amenities") {
        setCanGoNext(true);
      } else if (urlTitleReverse[page] === "photos") {
        setCanGoNext(false);
      } else if (
        urlTitleReverse[page] === "title" ||
        urlTitleReverse[page] === "description"
      ) {
        setCanGoNext(
          [...Object.values(copyData[urlTitleReverse[page]])].filter(Boolean)
            .length > 0
        );
      } else if (urlTitleReverse[page] === "documents") {
        setCanGoNext(true);
      } else if (urlTitleReverse[page] === "price") {
       if(copyData.price > 24) {
        setCanGoNext(true)
       } else {
        setCanGoNext(false)
       }
      } else {
        setCanGoNext(
          [...Object.values(copyData[urlTitleReverse[page]])].every(Boolean)
        );
      }
    } else {
      console.log("no data");
    }
  }, [data, page, urlTitleReverse]);

  console.log(data);
  console.log(canGoNext);

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
        canGoNext,
      }}
    >
      {children}
    </ListFormContext.Provider>
  );
};

export default ListFormContext;
