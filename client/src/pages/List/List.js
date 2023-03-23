import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function List() {

  const navigate = useNavigate();

  const { user: currentUser} = useContext(AuthContext)

  const goToInfo = () => {
    navigate("info");
  };

  return (
    <>
      <div>Welcome back {currentUser.firstName}</div>
      <div>Check if user has an unfinished listing</div>
      <div>Start new listing</div>
      <button onClick={goToInfo}>Create a new listing</button>
    </>
  );
}

export default List;
