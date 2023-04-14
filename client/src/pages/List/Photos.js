import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

import api from "../../api/axios";
import BottomBar from "../../components/List/BottomBar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages } from "@fortawesome/free-solid-svg-icons";

import classes from "./Photos.module.css";

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
    setCanGoNext,
    loading,
  } = useOutletContext();

  const [images, setImages] = useState(data.images || []);

  const [uploadedImages, setUploadedImages] = useState([]);

  const [uploadedImageCount, setUploadedImageCount] = useState(0);

  const [doneUpload, setDoneUpload] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    setImages(data.images);
  }, [data.images]);

  useEffect(() => {
    const validImages = images.filter(
      (image) => image.file.size >= 50 * 1024 && image.progress === 100
    );

    if (validImages.length >= 3) {
      setCanGoNext(true);
    } else {
      setCanGoNext(false);
    }
  }, [images]);

  const uploadImagesWithDelay = async (
    images,
    setUploadCount,
    totalImages,
    delay
  ) => {
    for (const image of images) {
      await uploadImage(image, setUploadCount, totalImages);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  };

  const handleFileChange = (event) => {
    setDoneUpload(false);

    event.preventDefault();

    const files = event.target.files;

    const newImages = [
      ...Array.from(files).map((file) => {
        const url = URL.createObjectURL(file);
        const isTooSmall = file.size < 50 * 1024;
        return {
          file,
          filename: file.name,
          url,
          progress: 10,
          isTooSmall,
        };
      }),
    ];

    setImages((prevImages) => [...prevImages, ...newImages]);

    const imagesToUpload = newImages.filter((image) => !image.isTooSmall);

    uploadImagesWithDelay(
      imagesToUpload,
      setUploadedImageCount,
      newImages.length,
      1000
    ).then(() => {
      console.log("All new images uploaded.");
      setDoneUpload(true);
    });
  };

  const uploadImage = async (image, setUploadCount, totalImages) => {
    const { file } = image;

    try {
      const formData = new FormData();
      formData.append("images", file);

      const response = await api.put("listings/images/" + data._id, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const progress = Math.round((loaded / total) * 100);

          setImages((prevImages) => {
            const index = prevImages.findIndex((img) => img.file === file);

            console.log(index);

            const updatedImages = [...prevImages];
            updatedImages[index] = {
              ...updatedImages[index],
            };

            return updatedImages;
          });
        },
      });

      console.log("done this upload");

      const responseData = response.data;

      const uploadedImage = responseData.images[responseData.images.length - 1];

      setUploadCount((count) => count + 1);

      setImages((prevImages) => {
        const index = prevImages.findIndex((img) => img.file === file);

        const updatedImages = [...prevImages];
        updatedImages[index] = {
          file: uploadedImage.file,
          filename: uploadedImage.filename,
          url: uploadedImage.url,
          progress: uploadedImage.progress,
        };

        return updatedImages;
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentUrl = window.location.pathname;
    const newUrl = currentUrl.substring(0, currentUrl.lastIndexOf("/"));
    setPage((prev) => prev + 1);
    navigate(newUrl + "/" + urlTitleReverse[page + 1]);

    const validImages = images.filter(
      (image) => image.file.size >= 50 * 1024 && image.progress === 100
    );

    console.log(validImages)

    setData((prevData) => ({
      ...prevData,
      images: validImages,
    }));

    const { _id, ...updateData } = data;

    try {
      await api.put("/listings/" + data._id, updateData);
    } catch (err) {
      console.log(err);
    }

  };

  console.log(images);

  const [popup, setPopup] = useState({ show: false, x: 0, y: 0, index: null });

  const handleImageAction = (index, action) => {
    const updatedImages = [...images];
    if (action === "move_backwards" && index < images.length - 1) {
      [updatedImages[index], updatedImages[index + 1]] = [
        updatedImages[index + 1],
        updatedImages[index],
      ];
    } else if (action === "move_forwards" && index > 0) {
      [updatedImages[index], updatedImages[index - 1]] = [
        updatedImages[index - 1],
        updatedImages[index],
      ];
    } else if (action === "make_cover") {
      updatedImages.unshift(updatedImages.splice(index, 1)[0]);
    }
    setImages(updatedImages);
  };

  const handleButtonClick = (event, index) => {
    event.preventDefault();
    const button = event.currentTarget;
    const buttonRect = button.getBoundingClientRect();
    const x = buttonRect.left - 130; // 130 is the width of the pop-up menu, adjust as needed
    const y = buttonRect.top + window.pageYOffset; // Include scroll position

    // Check if the pop-up is open for the clicked button's image and close it if necessary
    if (popup.show && popup.index === index) {
      setPopup({ show: false, index: null, x: 0, y: 0 });
    } else {
      setPopup({ show: true, index, x, y });
    }
  };

  const handleOptionClick = (event, action) => {
    event.preventDefault();
    handleImageAction(popup.index, action);
    setPopup({ show: false, x: 0, y: 0, index: null });
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div>Add some photos of your apartment</div>
        <div>
          You’ll need 3 photos to get started. You can add more or make changes
          later.
        </div>
      </div>
      <div className={classes.content}>
        <form id="photos" onSubmit={handleSubmit}>
          {images.length > 0 ? null : (
            <div className={classes.inputcontainer}>
              <div className={classes.inputheader}>
                <FontAwesomeIcon icon={faImages} />
                <div>Choose at least 3 photos</div>
              </div>
              <input
                id="imageupload"
                type="file"
                multiple
                onChange={handleFileChange}
              />
              <label htmlFor="imageupload">Upload from your device</label>
            </div>
          )}
          <div className={classes.imagelist}>
            {images.map((image, index) => (
              <div
                className={classes.imageitem}
                key={`${image.filename}-${index}`}
              >
                
                {index === 0 ? <div className={classes.coverphoto}>Cover photo</div> : null}
                <button
                  className={classes.actionButton}
                  onClick={(event) => handleButtonClick(event, index)}
                >
                  <span className={classes.dots}>&#8942;</span>
                </button>
                {/* ... */}
                <img
                  src={image.url}
                  alt={image.filename}
                  key={image.filename}
                  className={classes.imageitemImg}
                />
                {image.progress >= 0 && (
                  <div className={classes.progressbar}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: `${image.progress}%`,
                      height: "5px",
                      backgroundColor: `var(--color-primary)`,
                      zIndex: 1,
                    }}
                  ></div>
                )}
                {image.isTooSmall && (
                  <div
                    style={{
                      marginTop: "5px",
                      fontSize: "14px",
                      color: "red",
                    }}
                  >
                    Image too small
                  </div>
                )}
              </div>
            ))}
            {images.length > 0 ? (
              <div className={classes.inputcontainer}>
                {doneUpload ? null : (
                  <div className={classes.greyoverlay}></div>
                )}
                <div className={classes.inputheader}>
                  <FontAwesomeIcon icon={faImages} />
                </div>
                <input
                  id="imageupload"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  disabled={!doneUpload}
                />
                <label htmlFor="imageupload">Add another photo</label>
              </div>
            ) : null}
          </div>
          <BottomBar
            form={urlTitleReverse[page]}
            page={page}
            setPage={setPage}
            urlTitleReverse={urlTitleReverse}
            listId={data._id}
            currentUserId={currentUserId}
            data={data}
            setData={setData}
            canGoNext={canGoNext}
          />
        </form>
      </div>
      {popup.show && (
        <div
          className={classes.popupMenu}
          style={{ position: "absolute", top: popup.y, left: popup.x }}
        >
          <button
            onClick={(event) => handleOptionClick(event, "move_backwards")}
          >
            Move backwards
          </button>
          <button
            onClick={(event) => handleOptionClick(event, "move_forwards")}
          >
            Move forwards
          </button>
          <button onClick={(event) => handleOptionClick(event, "make_cover")}>
            Make cover photo
          </button>
        </div>
      )}
    </div>
  );
}

export default Photos;
