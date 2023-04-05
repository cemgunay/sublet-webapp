import React, { useState } from "react";

import classes from "./IncrementalInput.module.css";

function IncrementalInput(props) {
  const [beds, setBeds] = useState(0);

  const [value, setValue] = useState("")

  const handlePlus = () => {
    if (props.type === "bedrooms") {
      console.log(props.data);
      props.setData((prevData) => ({
        ...prevData,
        basics: {
          ...prevData.basics,
          bedrooms: [
            ...prevData.basics.bedrooms,
            { bedType: [], ensuite: false },
          ],
        },
      }));
    } else if (props.type === "beds") {
      setBeds(beds + 1);
    } else if (props.type === "price") {
      setValue(parseInt(props.data.price))
      if (props.data.price === "") {
        props.setData((prevData) => ({
          ...prevData,
          price: 25,
        }));
      } else {
        props.setData((prevData) => ({
          ...prevData,
          price: prevData.price + 25,
        }));
      }
      
    } else {
      props.setData((prevData) => ({
        ...prevData,
        basics: {
          ...prevData.basics,
          bathrooms: prevData.basics.bathrooms + 1,
        },
      }));
    }
  };

  const handleMinus = () => {
    if (props.type === "bedrooms") {
      if (props.data.basics.bedrooms.length > 0) {
        props.setData((prevData) => ({
          ...prevData,
          basics: {
            ...prevData.basics,
            bedrooms: prevData.basics.bedrooms.slice(0, -1),
          },
        }));
      }
    } else if (props.type === "beds") {
      if (beds > 0) {
        setBeds(beds - 1);
      }
    } else if (props.type === "price") {
      if (props.data.price > 5) {
        props.setData((prevData) => ({
        ...prevData,
        price: props.data.price - 25,
      }));
      }
      
    } else {
      if (props.data.basics.bathrooms > 0) {
        props.setData((prevData) => ({
          ...prevData,
          basics: {
            ...prevData.basics,
            bathrooms: prevData.basics.bathrooms - 1,
          },
        }));
      }
    }
  };

  if (props.type === "bedrooms") {
    return (
      <div className={classes.container}>
        <button id="minus" type="button" onClick={handleMinus}>
          -
        </button>
        <div>{props.data.basics.bedrooms.length || 0}</div>
        <button id="plus" type="button" onClick={handlePlus}>
          +
        </button>
      </div>
    );
  } else if (props.type === "beds") {
    return (
      <div className={classes.container}>
        <button id="minus" type="button" onClick={handleMinus}>
          -
        </button>
        <div>{beds || 0}</div>
        <button id="plus" type="button" onClick={handlePlus}>
          +
        </button>
      </div>
    );
  } else if (props.type === "price") {
    return (
      <div className={classes.container}>
        <button id="minus" type="button" onClick={handleMinus}>
          -
        </button>
        <input
          type="text"
          name="price"
          placeholder="$00"
          value={props.data.price !== 0 ? `$${props.data.price}` : ""}
          onChange={props.handleChange}
        />
        <button id="plus" type="button" onClick={handlePlus}>
          +
        </button>
      </div>
    );
  } else {
    return (
      <div className={classes.container}>
        <button id="minus" type="button" onClick={handleMinus}>
          -
        </button>
        <div>{props.data.basics.bathrooms || 0}</div>
        <button id="plus" type="button" onClick={handlePlus}>
          +
        </button>
      </div>
    );
  }
}

export default IncrementalInput;

/*
    const handlePlus = () => {
        const newCount = count + 1
        setCount(newCount)
        props.handleChange(newCount)
    }
    */
