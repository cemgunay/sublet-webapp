import React from "react";
import { ScrollMenu } from "react-horizontal-scrolling-menu";

import ScrollCard from "./ScrollCard";

import './Scroll.css'

const getItems = () =>
  Array(4)
    .fill(0)
    .map((_, ind) => ({ id: `element-${ind}` }));

function Scroll() {
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
      {items.map(({ id }) => (
        <ScrollCard
          itemId={id} // NOTE: itemId is required for track items
          title={id}
          key={id}
          onClick={handleClick(id)}
          selected={isItemSelected(id)}
        />
      ))}
    </ScrollMenu>
  );
}

export default Scroll;
