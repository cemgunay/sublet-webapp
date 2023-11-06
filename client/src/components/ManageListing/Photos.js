import React, { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";
import BottomBar from "../../components/List/BottomBar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faImages } from "@fortawesome/free-solid-svg-icons";

import classes from "./Photos.module.css";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

function Photos({
  data,
  setData,
  setOpenPhotos,
  setEditingField,
  setEditValue,
}) {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [images, setImages] = useState(data.images || []);

  console.log(data);
  console.log(images);

  const [uploadedImageCount, setUploadedImageCount] = useState(0);

  //to handle grey overlay and next button
  const [doneUpload, setDoneUpload] = useState(true);
  const [canGoNext, setCanGoNext] = useState(false);
  const [uploadedImages, setUploadedImages] = useState(data.images || []);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Updating images state:", data.images);
    setImages(data.images.filter((image) => image.file));
  }, [data.images]);

  useEffect(() => {
    console.log(uploadedImages);
    if (uploadedImages.length > 2) {
      if (data.images === images) {
        setCanGoNext(false);
      } else {
        setCanGoNext(true);
      }
    } else {
      setCanGoNext(false);
    }

    console.log("Current Uploaded Images State:", uploadedImages);
  }, [uploadedImages, setCanGoNext]);

  const uploadImagesWithDelay = async (
    images,
    setUploadCount,
    totalImages,
    delay
  ) => {
    for (const image of images) {
      console.log('hooooo')
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
    const { file, isTooSmall } = image;

    try {
      const formData = new FormData();
      formData.append("images", file);

      const response = await api.put("listings/images/" + id, formData, {
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
              progress,
            };

            return updatedImages;
          });
        },
      });

      console.log("done this upload");

      const responseData = response.data;

      const uploadedImage = responseData.images[responseData.images.length - 1];

      if (responseData) {
        setUploadedImages((prevUploadedImages) => [
          ...prevUploadedImages,
          uploadedImage,
        ]);
      }

      setUploadCount((count) => count + 1);

      setImages((prevImages) => {
        const index = prevImages.findIndex((img) => img.file === file);

        const updatedImages = [...prevImages];
        updatedImages[index] = {
          ...uploadedImage,
          isTooSmall,
        };

        return updatedImages;
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validImages = images.filter(
      (image) =>
        image.file &&
        image.file.size &&
        image.file.size >= 50 * 1024 &&
        image.progress === 100
    );

    const updateData = {
      userId: currentUser._id,
    };

    setData(validImages);

    try {
      await api.put("/listings/" + id, updateData);
      setOpenPhotos(false);
      toast.success("Update successful!");
    } catch (err) {
      console.log(err);
      toast.error("Update failed! Please try again.");
    }
  };

  console.log(images);

  const [popup, setPopup] = useState({ show: false, x: 0, y: 0, index: null });
  const containerRef = useRef(null);

  const handleImageAction = (index, action) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      if (action === "move_backwards" && index < prevImages.length - 1) {
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
      } else if (action === "delete") {
        deleteImage(index);
      }
      return updatedImages;
    });
  };

  const deleteImage = async (index) => {
    console.log(index);
    if (uploadedImages.length < 4) {
      toast.error("Must have 3 photos, please upload one before deleting");
    } else {
      try {
        const image = images[index];

        console.log(image);

        if (image.file.path) {
          // If the image is uploaded, delete it using the API
          await api.delete("/listings/images/" + id + "/" + image._id);
        }

        // Remove the image from the images array
        setImages((prevImages) => {
          const updatedImages = prevImages.filter(
            (img, imgIndex) => imgIndex !== index
          );

          console.log(updatedImages);
          return updatedImages;
        });

        // Remove the image from the uploadedImages array
        setUploadedImages((prevUploadedImages) => {
          const updatedUploadedImages = prevUploadedImages.filter(
            (img, imgIndex) => img._id !== images[index]._id
          );
          return updatedUploadedImages;
        });

        console.log("Images after deleting:", images);

        // Close the popup menu
        setPopup({ show: false, index: null, x: 0, y: 0 });
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  useEffect(() => {
    console.log("Images array updated:", images);
  }, [images]);

  const handleButtonClick = (event, index) => {
    event.preventDefault();
    const button = event.currentTarget;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();

    const buttonRect = button.getBoundingClientRect();
    const x = buttonRect.left - containerRect.left - 130;
    const y = buttonRect.top - containerRect.top;

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

  // Handle window resize
  const handleResize = () => {
    if (popup.show) {
      setPopup({ show: false, index: null, x: 0, y: 0 });
    }
  };

  // Add event listener
  useEffect(() => {
    window.addEventListener("resize", handleResize);

    // Cleanup function: remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [popup]);

  return (
    <>
      {images && (
        <div className={classes.container} ref={containerRef}>
          <div className={classes.header}>
            <FontAwesomeIcon
              icon={faChevronLeft}
              onClick={() => {
                setEditingField("");
                setEditValue("");
                setOpenPhotos(false);
              }}
            />
            <div className={classes.title}>Edit your photos</div>
            <div></div>{" "}
            {/* empty div to balance the chevron icon on the left */}
          </div>
          <div className={classes.content}>
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
                  <div className={classes.imagecontainer}>
                    {index === 0 ? (
                      <div className={classes.coverphoto}>Cover photo</div>
                    ) : null}
                    <button
                      className={classes.actionButton}
                      onClick={(event) => handleButtonClick(event, index)}
                      disabled={!doneUpload}
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
                      <div
                        className={classes.progressbar}
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
                      <div className={classes.imageoverlay}></div>
                    )}
                  </div>

                  {image.isTooSmall && (
                    <div className={classes.imageTooSmall}>Image too small</div>
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
            <button onClick={handleSubmit} disabled={!canGoNext}>
              {" "}
              Save
            </button>
          </div>
          {popup.show && (
            <div
              className={classes.popupMenu}
              style={{ position: "absolute", top: popup.y, left: popup.x }}
            >
              <button onClick={(event) => handleOptionClick(event, "delete")}>
                Delete
              </button>
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
              <button
                onClick={(event) => handleOptionClick(event, "make_cover")}
              >
                Make cover photo
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Photos;
