const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
const Document = require("../models/Documents");
const Request = require("../models/Requests");

const router = express.Router();
//const upload = multer({ dest: "uploads/" }); // temporary local storage
const upload = multer();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION, // the region where your bucket is
});

const s3 = new AWS.S3();

// Helper function to generate a unique file name
function generateUniqueFileName(originalName) {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split(".").pop();
  return `${timestamp}_${randomString}.${extension}`;
}

// Upload route
router.post("/upload", upload.single("file"), async (req, res) => {
  const file = req.file;
  const { userId, requestId, documentType, role } = req.body;

  if (file) {
    const fileName = generateUniqueFileName(file.originalname);

    // Upload file to S3
    const data = {
      Bucket: "agreement-files-uploads",
      Key: fileName,
      Body: file.buffer,
      ContentType: "application/pdf",
    };

    s3.putObject(data, async (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Error uploading file to S3" });
      } else {
        console.log(data);
        const fileUrl = `https://agreement-files-uploads.s3.us-east-2.amazonaws.com/${fileName}`;
        console.log(fileUrl);

        // Create new document
        const newDocument = new Document({
          type: documentType,
          user: userId,
          request: requestId,
          url: fileUrl,
          originalFileName: file.originalname,
          fileName: fileName,
          timestamp: new Date(),
        });

        try {
          await newDocument.save();

          // Update the request with the document
          const request = await Request.findById(requestId);
          console.log(request);

          if (role === "tenant") {
            request.tenantDocuments.push(newDocument._id);
          } else if (role === "subtenant") {
            request.subtenantDocuments.push(newDocument._id);
          }

          await request.save();
          return res.json({
            data,
            message: "File uploaded and document updated!",
          });
        } catch (error) {
          console.log(error);
          return res
            .status(500)
            .json({ error: "Error updating document and request" });
        }
      }
    });
  } else {
    return res
            .status(500)
            .json({ error: "Error no file found" });
  }
});

// Download route
router.get("/download/:fileName", async (req, res) => {
  const { fileName } = req.params;

  // Create params for S3 getObject
  const params = {
    Bucket: "agreement-files-uploads",
    Key: fileName,
    Expires: 60 * 60, // 1 hour
  };

  // Download file from S3
  try {
    const url = s3.getSignedUrl("getObject", params);
    res.json({ url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error generating URL" });
  }
});

// Delete route
router.delete("/delete/:id", async (req, res) => {
  try {
    // Fetch the document from the database
    const document = await Document.findById(req.params.id);

    console.log(document);

    // Delete the file from S3
    const params = {
      Bucket: "agreement-files-uploads",
      Key: document.fileName, // Assuming this is the field that holds the S3 key
    };

    s3.deleteObject(params, async (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Error deleting file from S3" });
      } else {
        console.log("File deleted from S3");

        // If the file deletion is successful, delete the document from the database
        await Document.findByIdAndDelete(req.params.id);

        // Find the Request document and update it by pulling the document's id from the tenantDocuments array
        await Request.updateMany(
          {
            $or: [
              { tenantDocuments: req.params.id },
              { subtenantDocuments: req.params.id },
            ],
          },
          {
            $pull: {
              tenantDocuments: req.params.id,
              subtenantDocuments: req.params.id,
            },
          },
          { new: true, useFindAndModify: false }
        );

        res.json({ message: "Document deleted" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error deleting document" });
  }
});

module.exports = router;
