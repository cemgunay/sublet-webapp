import React, {useState} from 'react'
import Carousel from '../Carousel/Carousel';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

import classes from './Collage3.module.css'

function Collage3(props) {

    const images = props.images;

    const [data, setData] = useState({ img: "", i: 0 });

  const viewImage = (img, i) => {
    setData({ img, i });
  };

  const handleClick = () => {
    setData({ img: "", i: 0 })
  }

  return (
    <>
    {data.img && 
    
    <div className={classes.modal}>
        <div className={classes.backContainer}>
      <FontAwesomeIcon className={classes.back} icon={faChevronLeft} onClick={handleClick}/>
      <div className={classes.index}>{data.i + 1}/{images.length}</div>
      </div>
        <div className={classes.carousel}>
        <Carousel images={images} index={data.i} setData={setData} data={data}/>
        </div>
                
        </div>}
     <div className={classes.masonry}>
    {images.map((image, i) => (
        <div key={i} className={classes.children}>
            <img
            src={image}
            alt={image}
            onClick={() => viewImage(image, i)}
          />
        </div>
          
        ))}
        </div>
    </>
  )
}

export default Collage3