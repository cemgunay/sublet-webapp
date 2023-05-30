import {
  faCircleChevronLeft,
  faCheckCircle,
  faTrashAlt,
  faUpload,
  faDownload,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

import classes from "./AcceptModal.module.css";
import { Button, LinearProgress, Modal, Box } from "@mui/material";
import { Tooltip } from "react-tooltip";

function AcceptModal({
  request,
  setOpenModal,
  selectedAgreement,
  selectedGovId,
  setSelectedAgreement,
  setSelectedGovId,
  handleFileUploadAgreement,
  handleFileUploadGovId,
  handleFileDownload,
  handleFileDelete,
  handleFinalAccept,
  handleAcceptConfirm,
  getMonth,
  formatDate,
  getMonthDiff,
  subTotal,
  atic,
  total,
  due,
  canAccept,
  uploadProgress,
}) {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleConfirmation = () => {
    if (request.status === "pendingFinalAccept") {
      handleFinalAccept();
    } else {
      handleAcceptConfirm();
    }
    setShowConfirmationModal(false);
  };

  const handleCloseModal = () => {
    setShowConfirmationModal(false);
  };

  //to check if there is an agreement document
  const tenantDocumentAgreement = request.tenantDocuments.find(
    (document) => document.type === "Sublet Agreement"
  );

  //to check if there is an Gov ID document
  const tenantGovId = request.tenantDocuments.find(
    (document) => document.type === "Government ID"
  );

  //to check if there is an agreement document
  const subTenantDocumentAgreement = request.subtenantDocuments.find(
    (document) => document.type === "Sublet Agreement"
  );

  //to check if there is an Gov ID document
  const subTenantGovId = request.subtenantDocuments.find(
    (document) => document.type === "Government ID"
  );

  //to handle going back
  const goBack = () => {
    setOpenModal(false);
  };

  return (
    <div className={classes.container}>
      <div className={classes.headercontainer}>
        <div className={classes.header}>
          <div className={classes.back} onClick={goBack}>
            <FontAwesomeIcon icon={faCircleChevronLeft} />
          </div>
          <div className={classes.previewtitle}>Final Steps</div>
        </div>
      </div>
      <div className={classes.contentcontainer}>
        <div className={classes.agreementcontainer}>
          <div>Sublet Agreement Download</div>
          {tenantDocumentAgreement ? (
            <div className={classes.agreementexistcontainer}>
              <div className={classes.agreementexistcontainerleft}>
                <div className={classes.fileName} onClick={handleFileDownload}>
                  {tenantDocumentAgreement.originalFileName}
                </div>
              </div>
              <div className={classes.iconcontainer}>
                <FontAwesomeIcon
                  icon={faDownload}
                  onClick={handleFileDownload}
                />
              </div>
            </div>
          ) : (
            <div className={classes.agreementexistcontainer}>
              <div>Waiting for tenant to upload</div>
            </div>
          )}
        </div>
        <div className={classes.agreementcontainer}>
          <div>Signed Sublet Agreement Upload</div>
          {subTenantDocumentAgreement ? (
            <div className={classes.agreementexistcontainer}>
              <div className={classes.agreementexistcontainerleft}>
                <FontAwesomeIcon icon={faCheckCircle} color="green" />
                <div className={classes.fileName} onClick={handleFileDownload}>
                  {subTenantDocumentAgreement.originalFileName}
                </div>
              </div>
              {request.subtenantFinalAccept ? (
                <div className={classes.iconcontainer}>
                  <FontAwesomeIcon
                    icon={faDownload}
                    onClick={handleFileDownload}
                  />
                </div>
              ) : (
                <div className={classes.iconcontainer}>
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    onClick={() =>
                      handleFileDelete(subTenantDocumentAgreement._id)
                    }
                  />
                </div>
              )}
            </div>
          ) : (
            <div className={classes.agreementexistcontainer}>
              <input
                type="file"
                onChange={(e) => setSelectedAgreement(e.target.files[0])}
              />
              <div className={classes.iconcontainer}>
                <FontAwesomeIcon
                  icon={faUpload}
                  onClick={handleFileUploadAgreement}
                />
              </div>
            </div>
          )}
          {uploadProgress > 0 && selectedAgreement && (
            <LinearProgress variant="determinate" value={uploadProgress} />
          )}
        </div>
        <div className={classes.agreementcontainer}>
          <div>Tenant Government ID</div>
          {tenantGovId ? (
            <div className={classes.agreementexistcontainer}>
              <div className={classes.agreementexistcontainerleft}>
                <div className={classes.fileName} onClick={handleFileDownload}>
                  {tenantGovId.originalFileName}
                </div>
              </div>
              <div className={classes.iconcontainer}>
                <FontAwesomeIcon
                  icon={faDownload}
                  onClick={handleFileDownload}
                />
              </div>
            </div>
          ) : (
            <div className={classes.agreementexistcontainer}>
              <div>Waiting for tenant to upload</div>
            </div>
          )}
        </div>
        <div className={classes.agreementcontainer}>
          <div>Government ID</div>
          {subTenantGovId ? (
            <div className={classes.agreementexistcontainer}>
              <div className={classes.agreementexistcontainerleft}>
                <FontAwesomeIcon icon={faCheckCircle} color="green" />
                <div className={classes.fileName} onClick={handleFileDownload}>
                  {subTenantGovId.originalFileName}
                </div>
              </div>
              {request.subtenantFinalAccept ? (
                <div className={classes.iconcontainer}>
                  <FontAwesomeIcon
                    icon={faDownload}
                    onClick={handleFileDownload}
                  />
                </div>
              ) : (
                <div className={classes.iconcontainer}>
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    onClick={() => handleFileDelete(subTenantGovId._id)}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className={classes.agreementexistcontainer}>
              <input
                type="file"
                onChange={(e) => setSelectedGovId(e.target.files[0])}
              />
              <div className={classes.iconcontainer}>
                <FontAwesomeIcon
                  icon={faUpload}
                  onClick={handleFileUploadGovId}
                />
              </div>
            </div>
          )}
          {uploadProgress > 0 && selectedGovId && (
            <LinearProgress variant="determinate" value={uploadProgress} />
          )}
        </div>

        <div>Sign terms and conditions STYLL</div>
        <div className={classes.requestdetailscontainer}>
          Request
          <div className={classes.details}>
            <div>subLet months</div>
            {getMonth(request.startDate)} -{getMonth(request.endDate)}
            <div>Move in - Move out</div>
            {new Date(request.startDate)?.toLocaleDateString()} -{" "}
            {new Date(request.endDate)?.toLocaleDateString()}
          </div>
          <div className={classes.details}>
            <div>viewing date</div>
            {formatDate(request.viewingDate) ?? "No viewing date selected"}
          </div>
          <div className={classes.details}>
            <div>price details</div>
            <div className={classes.detailsrow}>
              <div>
                ${request.price} CAD x{" "}
                {getMonthDiff(request.startDate, request.endDate)} months
              </div>
              <div>${subTotal.toString()} CAD</div>
            </div>
            <div className={classes.detailsrow}>
              <div>ATIC</div>
              <div>${atic.toString()} CAD</div>
            </div>
          </div>
          <div className={classes.details}>
            <div className={classes.detailsrow}>
              <div>Total</div>
              <div>${total.toString()} CAD</div>
            </div>
          </div>
          <div className={classes.details}>
            <div className={classes.detailsrow}>
              <div>Due at Signing</div>
              <div>${due} CAD</div>
            </div>
            <div>First & Last Month Deposit</div>
            <div>ATIC</div>
          </div>
        </div>
      </div>

      <footer className={classes.wrapper}>
        <div className={classes.bottomcontainer}>
          <div
            className={`${classes.buttonContainer} ${
              !canAccept ? classes.disabled : ""
            }`}
            data-tooltip-id="info-tooltip"
            data-tooltip-content={
              request.tenantDocuments?.length > 1
                ? request.subtenantFinalAccept
                  ? "Waiting for tenant to verify and accept"
                  : "Waiting for you to upload"
                : "Waiting for tenant to upload"
            }
          >
            {!canAccept && (
              <div className={classes.infoIcon}>
                <Tooltip id="info-tooltip" className={classes.tooltip} />
                <FontAwesomeIcon icon={faInfoCircle} />
              </div>
            )}
            <button
              className={classes.button}
              onClick={() => setShowConfirmationModal(true)}
              disabled={!canAccept}
            >
              Accept
            </button>
          </div>
        </div>
      </footer>
      <Modal open={showConfirmationModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>
            {request.status === "pendingFinalAccept"
              ? "Did you verify all details and are ready to accept / sign terms and conditions"
              : "Are you sure you want to accept this offer"}
          </h2>
          <Button variant="contained" onClick={handleConfirmation}>
            Yes
          </Button>
          <Button variant="contained" onClick={handleCloseModal}>
            No
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default AcceptModal;
