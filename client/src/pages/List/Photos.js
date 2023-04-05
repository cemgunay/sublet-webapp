import React, {useState} from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

import api from "../../api/axios";
import BottomBar from '../../components/List/BottomBar';

function Photos() {

  const {
    urlTitleReverse,
    page,
    setPage,
    data,
    setData,
    handleChange,
    currentUserId,
    canGoNext,
    loading,
  } = useOutletContext();

  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    for (const file of selectedFiles) {
      formData.append('images', file);
    }
    try {
      const response = await api.put("/listings/images/" + data._id, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setImages(response.data.images);
      setSelectedFiles(null);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(images)

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" multiple onChange={handleFileChange} />
      <button type="submit">Upload</button>
      <div>
        {images.map((image) => (
          <img src={image.url} alt={image.filename} key={image.filename} />
        ))}
      </div>
    </form>
  );
}

export default Photos;
