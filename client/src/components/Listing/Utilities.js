import React, { useState } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDroplet, faBolt } from '@fortawesome/free-solid-svg-icons'

import classes from './Utilities.module.css'

function Utilities(props) {
  const utilities = props.listing.utilities;

  const [matchData, setMatchData] = useState({
    hydro: false,
    electricity: false,
    water: false,
  });

  //this is the better way to do it with spread but i cant get it to work with object
  const handleState = (index) => {
    const temp = { ...matchData };
    temp[index] = true;
    setMatchData(temp);
  };

  for (var index = 0; index < Object.keys(utilities).length; ++index) {
    if (utilities[Object.keys(utilities)[index]] === true) {
      //below is for the better way to do it but cant figure it out
      //setMatchData({...matchData, matchData[Object.keys(matchData)[index]]: true})
      //handleState(index);

      matchData[Object.keys(matchData)[index]] = true;
    }
  }

  return (
    <div className={classes.container}>
      {matchData.hydro && 
      <FontAwesomeIcon icon={faDroplet} />}
      {matchData.electricity && 
      <FontAwesomeIcon icon={faBolt} />}
      {matchData.water && 
      <FontAwesomeIcon icon={faDroplet} />}
    </div>
  )
}

export default Utilities;
