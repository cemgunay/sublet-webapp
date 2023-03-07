import React from "react";
import { ScrollMenu } from "react-horizontal-scrolling-menu";

import ScrollCard from "./ScrollCard";

import './Scroll.css'

function Scroll(props) {

  const getItems = () =>
  Array(4)
    .fill(0)
    .map((_, ind) => ({ id: `element-${ind}` }));

  const [items, setItems] = React.useState(getItems);
  const [selected, setSelected] = React.useState([]);
  const [position, setPosition] = React.useState(0);

  const isItemSelected = (id) => !!selected.find((el) => el === id);

  const handleClick =
    (id) =>
    ({ getItemById, scrollToItem }) => {
      const itemSelected = isItemSelected(id);

      setSelected((currentSelected) =>
        itemSelected
          ? currentSelected.filter((el) => el !== id)
          : currentSelected.concat(id)
      );
    };

  return (
    <ScrollMenu>
      {props.bedrooms.map((bedroom, index) => (
        <ScrollCard
        itemId={index} // NOTE: itemId is required for track items
        key={index}
        title={"Bedroom " + (index+1)}
        beds={bedroom.bedTypes}
        onClick={handleClick(index+1)}
        selected={isItemSelected(index+1)}
      />
      ))}
    </ScrollMenu>
  );
}

export default Scroll;


//This is from the api itself
/*

{items.map(({ id }) => (
  <ScrollCard
    itemId={id} // NOTE: itemId is required for track items
    title={id}
    key={id}
    onClick={handleClick(id)}
    selected={isItemSelected(id)}
  />
))}

*/