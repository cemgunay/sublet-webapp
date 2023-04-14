import React, { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import Dropzone from 'react-dropzone';

import api from "../../api/axios";

const UploadImages = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});
    const [uploadedFiles, setUploadedFiles] = useState([]);

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
  
    const handleFileSelect = (event) => {
      setSelectedFiles([...selectedFiles, ...event.target.files]);
    };
  
    const handleUpload = async () => {
      const formData = new FormData();
  
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append(`images[${i}]`, selectedFiles[i]);
      }
  
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const fileIndex = progressEvent.target.dataset.index;
          setUploadProgress({
            ...uploadProgress,
            [fileIndex]: Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            ),
          });
        },
      };
  
      try {
        const res = await api.put(
            "/listings/images/" + data._id,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
  
        const newUploadedFiles = res.data.images.map((image) => {
          const fileSizeInKB = Math.round(image.size / 1024);
          return {
            url: image.url,
            filename: image.filename,
            isTooSmall: fileSizeInKB < 50,
          };
        });
  
        setUploadedFiles([...uploadedFiles, ...newUploadedFiles]);
        setSelectedFiles([]);
        setUploadProgress({});
      } catch (err) {
        console.error(err);
      }
    };
  
    return (
      <div>
        <input type="file" multiple onChange={handleFileSelect} />
        <button onClick={handleUpload}>Upload</button>
        <ul>
          {selectedFiles.map((file, index) => (
            <li key={index}>
              {file.name} - {Math.round(file.size / 1024)} KB
              <progress
                max="100"
                value={uploadProgress[index] || 0}
                data-index={index}
              />
            </li>
          ))}
          {uploadedFiles.map((file, index) => (
            <li key={index}>
              <img src={file.url} alt={file.filename} />
              {file.isTooSmall && (
                <div>
                  <span>It's too small</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default UploadImages