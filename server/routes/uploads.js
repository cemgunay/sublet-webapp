const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
const Document = require("../models/Documents");
const Request = require("../models/Requests");
const User = require("../models/User");
const util = require("util");

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
  const { user, requestId, documentType, role } = req.body;

  let userObj = JSON.parse(user);

  // Update the with latest user
  userObj = await User.findById(userObj._id);

  let currentSubTenantTransaction = null;
  let currentTenantTransaction = null;

  //set the fields
  if (userObj.currentSubTenantTransaction === null) {
    console.log("Value is null");
  } else {
    currentSubTenantTransaction =
      userObj.currentSubTenantTransaction.toString();
  }

  //set the fields
  if (userObj.currentTenantTransaction === null) {
    console.log("Value is null");
  } else {
    currentTenantTransaction = userObj.currentTenantTransaction.toString();
  }

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
          user: userObj._id,
          request: requestId,
          url: fileUrl,
          originalFileName: file.originalname,
          fileName: fileName,
          timestamp: new Date(),
        });

        console.log(role);
        console.log(userObj);
        console.log(requestId);

        try {
          await newDocument.save();

          // Update the request with the document
          let request = await Request.findById(requestId);

          if (role === "tenant") {
            request.tenantDocuments.push(newDocument._id);
            await request.save();
          } else if (role === "subtenant") {
            request.subtenantDocuments.push(newDocument._id);
            await request.save();
          }

          if (role === "tenant" && currentTenantTransaction === requestId) {
            // Reload the request from the database
            request = await Request.findById(requestId)
              .populate("tenantDocuments")
              .populate("subtenantDocuments");

            // Find documents of each type uploaded by the tenant and subtenant
            const tenantSubletAgreement = request.tenantDocuments.find(
              (doc) => doc.type === "Sublet Agreement"
            );
            const tenantGovernmentID = request.tenantDocuments.find(
              (doc) => doc.type === "Government ID"
            );
            const subtenantSubletAgreement = request.subtenantDocuments.find(
              (doc) => doc.type === "Sublet Agreement"
            );
            const subtenantGovernmentID = request.subtenantDocuments.find(
              (doc) => doc.type === "Government ID"
            );

            // Update the status of the request based on the presence of the required documents
            if (tenantSubletAgreement && tenantGovernmentID) {
              request.status = "pendingSubTenantUpload";
            }
            if (subtenantSubletAgreement && subtenantGovernmentID) {
              request.status = "pendingFinalAccept";
            }

            await request.save();
          } else if (
            role === "subtenant" &&
            currentSubTenantTransaction === requestId
          ) {
            console.log("testing");
            // Reload the request from the database
            request = await Request.findById(requestId)
              .populate("tenantDocuments")
              .populate("subtenantDocuments");

            // Find documents of each type uploaded by the tenant and subtenant
            const tenantSubletAgreement = request.tenantDocuments.find(
              (doc) => doc.type === "Sublet Agreement"
            );
            const tenantGovernmentID = request.tenantDocuments.find(
              (doc) => doc.type === "Government ID"
            );
            const subtenantSubletAgreement = request.subtenantDocuments.find(
              (doc) => doc.type === "Sublet Agreement"
            );
            const subtenantGovernmentID = request.subtenantDocuments.find(
              (doc) => doc.type === "Government ID"
            );

            // Update the status of the request based on the presence of the required documents
            if (
              tenantSubletAgreement &&
              tenantGovernmentID &&
              subtenantSubletAgreement &&
              subtenantGovernmentID
            ) {
              request.status = "pendingFinalAccept";
            } else if (!tenantSubletAgreement || !tenantGovernmentID) {
              request.status = "pendingTenantUpload";
            }

            await request.save();
          }

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
    return res.status(500).json({ error: "Error no file found" });
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

//for delete to be a promise
const deleteS3Object = util.promisify(s3.deleteObject.bind(s3));

// Delete route
router.delete("/delete/:id", async (req, res) => {
  try {
    // Fetch the document from the database
    const document = await Document.findById(req.params.id);

    console.log(document);

    // Delete the file from S3
    const params = {
      Bucket: "agreement-files-uploads",
      Key: document.fileName, //this is the field that holds the S3 key
    };

    try {
      await deleteS3Object(params);
      console.log("File deleted from S3");

      // If the file deletion is successful, delete the document from the database
      await Document.findByIdAndDelete(req.params.id);

      // Update the Request document
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
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Error deleting file from S3" });
    }

    // Fetch the updated Request associated with this document using the request ID which was present in the document
    let updatedRequest = await Request.findOne({ _id: document.request })
      .populate("tenantDocuments")
      .populate("subtenantDocuments");

    if (!updatedRequest) {
      res.status(404).json({ error: "Updated Request not found" });
      return;
    }

    // If the document type is "Sublet Agreement", delete the corresponding document from subTenantDocuments
    if (document.type === "Sublet Agreement") {
      const subTenantDocument = await Document.findOne({
        _id: { $in: updatedRequest.subtenantDocuments },
        type: "Sublet Agreement",
      });

      if (subTenantDocument) {
        const subTenantParams = {
          Bucket: "agreement-files-uploads",
          Key: subTenantDocument.fileName,
        };

        try {
          await deleteS3Object(subTenantParams);
          console.log("Subtenant file deleted from S3");

          await Document.findByIdAndDelete(subTenantDocument._id);

          await Request.updateMany(
            { subtenantDocuments: subTenantDocument._id },
            {
              $pull: {
                subtenantDocuments: subTenantDocument._id,
              },
            },
            { new: true, useFindAndModify: false }
          );
        } catch (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "Error deleting subtenant file from S3" });
        }
      }
    }

    // Fetch the user
    const user = await User.findById(document.user)
      .populate("currentSubTenantTransaction")
      .populate("currentTenantTransaction");

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // If the document deleted was a tenant's document and there is one or no documents left after the process has begun
    if (
      document.user.toString() === updatedRequest.tenantId &&
      updatedRequest.tenantDocuments.length < 2 &&
      user.currentTenantTransaction &&
      user.currentTenantTransaction._id.toString() ===
        updatedRequest._id.toString() // Checking if currentTenantTransaction is the current transaction
    ) {
      // Revert the status of the transaction
      updatedRequest.status = "pendingTenantUpload";
      await updatedRequest.save();
      // TODO: Notify the other party of the status change
    } else if (
      document.user.toString() === updatedRequest.subTenantId &&
      updatedRequest.subtenantDocuments.length < 2 &&
      updatedRequest.tenantDocuments.length === 2 &&
      user.currentSubTenantTransaction &&
      user.currentSubTenantTransaction._id.toString() ===
        updatedRequest._id.toString() // Checking if currentSubTenantTransaction is the current transaction
    ) {
      // If the document deleted was a subtenant's document and there is one or no document left after the process has begun
      // Revert the status of the transaction
      updatedRequest.status = "pendingSubTenantUpload";
      await updatedRequest.save();
      // TODO: Notify the other party of the status change
    }

    // Fetch the updated Request after all operations
    updatedRequest = await Request.findOne({ _id: document.request })
      .populate("tenantDocuments")
      .populate("subtenantDocuments");

    //if file was deleted when one side had already accepted
    updatedRequest.tenantFinalAccept = false;
    updatedRequest.subtenantFinalAccept = false;

    // Save the changes
    await updatedRequest.save();

    res.json(updatedRequest);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error deleting document" });
  }
});

module.exports = router;
