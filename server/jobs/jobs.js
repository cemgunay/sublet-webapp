const Agenda = require("agenda");
const Request = require("../models/Requests");
const Listing = require("../models/Listing");
const User = require("../models/User");

module.exports = function (agendaMongoUri) {
  const agenda = new Agenda({ db: { address: agendaMongoUri } });

  agenda.define("revert request status", async (job) => {
    const { requestId } = job.attrs.data;

    const request = await Request.findById(requestId);

    // If the status is still 'pendingSubTenantUpload' or 'pendingTenantUpload', revert it to 'previousStatus'
    if (
      request.status === "pendingSubTenantUpload" ||
      request.status === "pendingTenantUpload" || 
      request.status === "pendingFinalAccept"
    ) {
      request.status = request.previousStatus;

      // Fetch the tenant, subtenant, and listing using their IDs
      const tenant = await User.findById(request.tenantId);
      const subtenant = await User.findById(request.subTenantId);
      const listing = await Listing.findById(request.listingId);

      // Clear the currentTenantTransaction and currentSubTenantTransaction
      tenant.currentTenantTransaction = null;
      subtenant.currentSubTenantTransaction = null;

      // Update the listing's transactionInProgress
      listing.transactionInProgress = false;

      // Save updates
      await tenant.save();
      await subtenant.save();
      await listing.save();

      await request.save();
    }
  });

  return agenda;
};
