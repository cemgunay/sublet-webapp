import api from "./api/axios";

export async function checkTenantInboxOwnership(currentUser, conversationId) {
  try {
    const response = await api.get("/conversations/" + conversationId);
    const conversation = response.data;

    if (conversation.members.includes(currentUser._id)) {
      return conversation.tenant === currentUser._id;
    } else {
      throw new Error("Not authorized");
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("Conversation not found");
    }
    throw new Error("Conversation not found");
  }
}

export async function checkSubTenantInboxOwnership(
  currentUser,
  conversationId
) {
  
  try {
    const response = await api.get("/conversations/" + conversationId);
    const conversation = response.data;

    console.log('joke ting')
    console.log(conversation)
    console.log(conversation.subTenant)

    console.log(currentUser._id)
  console.log(conversationId)

    if (conversation.members.includes(currentUser._id)) {
      return conversation.subTenant === currentUser._id;
    } else {
      throw new Error("Not authorized");
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("Conversation not found");
    }
    throw new Error("Conversation not found");
  }
}

export async function checkProfileExistence(currentUser, id) {
  try {
    await api.get("/users/id/" + id);
    return true;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return false;
    }
    throw error;
  }
}

export async function checkListingOwnership(currentUser, listingId) {

  if (!currentUser){
    return true
  }

  try {
    const response = await api.get("/listings/" + listingId);
    const listing = response.data;

    console.log(listing)
    console.log(!listing.published)

    if (!listing.published){
      throw new Error("Listing not published");
    } else {
      return listing.userId !== currentUser._id;
    }
  } catch (error) {
    console.error("Caught error:", error);
    if (error.response) {
      console.error("Error status:", error.response.status);
      if (error.response.status === 404) {
        throw new Error("Listing not found");
      }
    } else if (error.request) {
      console.error("Error request:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    throw error;
  }
}

export async function checkListingExists(currentUser, listingId) {
  console.log("begin");

  try {
    console.log("enter try catch block");
    await api.get("/listings/" + listingId);
    console.log("listing exists");
    return true;
  } catch (error) {
    console.log("listing does not exist");
    console.error("Caught error:", error);
    if (error.response && error.response.status === 404) {
      throw new Error("Listing not found");
    }
  }
}

export async function checkTenantListingOwnership(currentUser, listingId) {
  try {
    const response = await api.get("/listings/" + listingId);
    const listing = response.data;

    if (listing.userId !== currentUser._id) {
      throw new Error("Not authorized");
    }

    return true;
  } catch (error) {
    console.error("Caught error:", error);
    if (error.response) {
      console.error("Error status:", error.response.status);
      if (error.response.status === 404) {
        throw new Error("Listing not found");
      }
    } else if (error.request) {
      console.error("Error request:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    throw error;
  }
}


export async function checkTenantRequestOwnership(
  currentUser,
  requestId,
  listingId
) {
  try {
    const response = await api.get("/requests/" + requestId);
    const request = response.data;

    if (currentUser._id !== request.tenantId) {
      // The current user is not the tenant of the request
      throw new Error("Not authorized");
    }

    // If we've gotten this far, the user is the tenant. Now let's check if listingId = request.listingId
    if (request.listingId === listingId) {
      // listing ids match
      try {
        await api.get("/listings/" + listingId);
        return true;
      } catch (error) {
        //listing doesnt exist
        if (error.response && error.response.status === 404) {
          throw new Error("Listing not found");
        }
        throw error;
      }
    } else {
      // If the listingId doesn't match, throw an error
      throw new Error("Mismatched listingId");
    }
  } catch (error) {
    //request doesnt exist
    if (error.response && error.response.status === 404) {
      throw new Error("Request not found");
    }
    throw error;
  }
}

export async function checkSubTenantRequestOwnership(
  currentUser,
  requestId,
  listingId
) {
  try {
    const response = await api.get("/requests/" + requestId);
    const request = response.data;

    if (currentUser._id !== request.subTenantId) {
      // The current user is not the subtenant of the request
      throw new Error("Not authorized");
    }

    // If we've gotten this far, the user is the subtenant. Now let's check if listingId = request.listingId
    if (request.listingId === listingId) {
      // listing ids match
      try {
        await api.get("/listings/" + listingId);
        return true;
      } catch (error) {
        //listing doesnt exist
        if (error.response && error.response.status === 404) {
          throw new Error("Listing not found");
        }
        throw error;
      }
    } else {
      // If the listingId doesn't match, throw an error
      throw new Error("Mismatched listingId");
    }
  } catch (error) {
    //request doesnt exist
    if (error.response && error.response.status === 404) {
      throw new Error("Request not found");
    }
    throw error;
  }
}
