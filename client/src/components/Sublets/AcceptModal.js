import {
  faCircleChevronLeft,
  faCheckCircle,
  faTrashAlt,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import classes from "./AcceptModal.module.css";
import { LinearProgress } from "@mui/material";

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
  getMonth,
  formatDate,
  getMonthDiff,
  subTotal,
  atic,
  total,
  due,
  canAccept,
  uploadProgress,
  handleAcceptConfirm
}) {

  //to check if there is an agreement document
  const documentAgreement = request.tenantDocuments.find(
    (document) => document.type === "Sublet Agreement"
  );

  //to check if there is an Gov ID document
  const govId = request.tenantDocuments.find(
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
          <div>Sublet Agreement</div>
          {documentAgreement ? (
            <div className={classes.agreementexistcontainer}>
              <div className={classes.agreementexistcontainerleft}>
                <FontAwesomeIcon icon={faCheckCircle} color="green" />
                <div className={classes.fileName} onClick={handleFileDownload}>
                  {documentAgreement.originalFileName}
                </div>
              </div>
              <div className={classes.iconcontainer}>
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  onClick={() => handleFileDelete(documentAgreement._id)}
                />
              </div>
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
          <div>Government ID</div>
          {govId ? (
            <div className={classes.agreementexistcontainer}>
              <div className={classes.agreementexistcontainerleft}>
                <FontAwesomeIcon icon={faCheckCircle} color="green" />
                <div className={classes.fileName} onClick={handleFileDownload}>
                  {govId.originalFileName}
                </div>
              </div>
              <div className={classes.iconcontainer}>
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  onClick={() => handleFileDelete(govId._id)}
                />
              </div>
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
          <button disabled={!canAccept} onClick={handleAcceptConfirm}>Accept</button>
        </div>
      </footer>
    </div>
  );
}

export default AcceptModal;