import { Route, Routes } from "react-router-dom";
import Explore from "./pages/Explore/Explore";
import SignUp from "./pages/Signup/SignUp";
import Layout from "./Layout";
import Listing from "./pages/Listing/Listing";
import Missing from "./pages/Missing/Missing";
import Profile from "./pages/Profile/Profile";
import List from "./pages/List/List";
import Overview from "./pages/List/Overview";
//import Autocomplete from "./components/Autocomplete/Autocomplete";
import Test from "./pages/Test/Test";
import AboutYourPlace from "./pages/List/AboutYourPlace";
import Location from "./pages/List/Location";
import SpecificList from "./pages/List/SpecificList/SpecificList";
import { RemoveTrailingSlash } from "./RemoveTrailingSlashes";
import ListFormContextLayout from "./ListFormContextLayout";
import Info from "./pages/List/Info";
import Basics from "./pages/List/Basics";
import Amenities from "./pages/List/Amenities";
import Photos from "./pages/List/Photos";
import Title from "./pages/List/Title";
import Description from "./pages/List/Description";
import Documents from "./pages/List/Documents";
import Price from "./pages/List/Price";
import Publish from "./pages/List/Publish";
import RequestFormContextLayout from "./RequestFormContextLayout";
import Request from "./pages/Request/Request";
import SubletsTenant from "./pages/Sublets/SubletsTenant/SubletsTenant";
import SubletsSubtenant from "./pages/Sublets/SubletsSubtenant/SubletsSubtenant";
import RequireAuth from "./components/RequireAuth";
import Sublet from "./pages/Sublet/Sublet";
import RequestDetails from "./pages/Sublet/RequestDetails";
import Menu from "./pages/Menu/Menu";
import ManageListing from "./pages/ManageListing/ManageListing";
import Preview from "./pages/ManageListing/Preview";
import UserProfile from "./pages/UserProfile/UserProfile";
import PersonalInfo from "./pages/PersonalInfo/PersonalInfo";
import AccountSettings from "./pages/AccountSettings/AccountSettings";
import ActiveSubletsSubtenant from "./pages/Sublets/SubletsSubtenant/ActiveSubletsSubtenant";
import PastSubletsSubtenant from "./pages/Sublets/SubletsSubtenant/PastSubletsSubtenant";
import ConfirmedSubletsSubtenant from "./pages/Sublets/SubletsSubtenant/ConfirmedSubletsSubtenant";
import ActiveSubletsTenant from "./pages/Sublets/SubletsTenant/ActiveSubletsTenant";
import PastSubletsTenant from "./pages/Sublets/SubletsTenant/PastSubletsTenant";
import ConfirmedSubletsTenant from "./pages/Sublets/SubletsTenant/ConfirmedSubletsTenant";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SubTenantInbox from "./pages/Inbox/SubTenantInbox";
import SubTenantInboxChat from "./pages/Inbox/SubTenantInboxChat";
import TenantInbox from "./pages/Inbox/TenantInbox";
import TenantInboxChat from "./pages/Inbox/TenantInboxChat";
import RequireOwnershipAndExist from "./components/RequireOwnershipAndExist";
import {
  checkListingOwnership,
  checkSubTenantInboxOwnership,
  checkSubTenantRequestOwnership,
  checkTenantInboxOwnership,
  checkTenantListingOwnership,
  checkTenantRequestOwnership,
  checkListingExists,
  checkProfileExistence,
} from "./ownershipAndExistChecks";
import RequireProgess from "./components/RequireProgress";

//import RequireAuth from "./components/Util/RequireAuth";

function App() {
  return (
    <>
      <RemoveTrailingSlash />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route path="/" element={<Explore />} />
          <Route path="signup" element={<SignUp />} />

          <Route element={<RequestFormContextLayout />}>
            <Route
              path="listing/:id"
              element={
                <RequireOwnershipAndExist
                  checkOwnership={checkListingOwnership}
                  paramName="id"
                  redirectPath={(id) => `/host/listing/${id}`}
                >
                  <Listing />
                </RequireOwnershipAndExist>
              }
            />
          </Route>

          {/* Private Routes */}
          <Route element={<RequireAuth />}>
            <Route path="profile" element={<Profile />} />
            <Route
              path="profile/:id"
              element={
                <RequireOwnershipAndExist
                  checkExistence={checkProfileExistence}
                  paramName="id"
                  redirectPath={() => "/not-found"}
                >
                  <UserProfile />
                </RequireOwnershipAndExist>
              }
            />
            <Route path="profile/personal-info" element={<PersonalInfo />} />
            <Route
              path="profile/account-settings"
              element={<AccountSettings />}
            />
            <Route path="inbox" element={<SubTenantInbox />} />
            <Route
              path="inbox/:id"
              element={
                <RequireOwnershipAndExist
                  checkOwnership={checkSubTenantInboxOwnership}
                  paramName="id"
                >
                  <SubTenantInboxChat />
                </RequireOwnershipAndExist>
              }
            />

            <Route element={<RequestFormContextLayout />}>
              <Route
                path="/listing/:listingId/request/:requestId/new"
                element={
                  <RequireOwnershipAndExist
                    checkExistence={checkListingExists}
                    paramName="listingId"
                  >
                    <Request />
                  </RequireOwnershipAndExist>
                }
              />
              <Route
                path="listing/:listingId/request/:requestId"
                element={
                  <RequireOwnershipAndExist
                    checkOwnership={checkSubTenantRequestOwnership}
                    paramName="requestId"
                    additionalParamName="listingId"
                  >
                    <Request />
                  </RequireOwnershipAndExist>
                }
              />
            </Route>
            <Route path="sublets" element={<SubletsSubtenant />}>
              <Route path="active" element={<ActiveSubletsSubtenant />} />
              <Route path="past" element={<PastSubletsSubtenant />} />
              <Route path="confirmed" element={<ConfirmedSubletsSubtenant />} />
            </Route>

            {/* Creating a root path for when on host side*/}
            <Route path="host" element={<Layout />}>
              <Route path="/host" element={<SubletsTenant />}>
                <Route path="active" element={<ActiveSubletsTenant />} />
                <Route path="past" element={<PastSubletsTenant />} />
                <Route path="confirmed" element={<ConfirmedSubletsTenant />} />
              </Route>
              <Route path="inbox" element={<TenantInbox />} />
              <Route
                path="inbox/:id"
                element={
                  <RequireOwnershipAndExist
                    checkOwnership={checkTenantInboxOwnership}
                    paramName="id"
                  >
                    <TenantInboxChat />
                  </RequireOwnershipAndExist>
                }
              />
              <Route path="menu" element={<Menu />} />

              <Route
                path="/host/listing/:id"
                element={
                  <RequireOwnershipAndExist
                    checkOwnership={checkTenantListingOwnership}
                    paramName="id"
                    redirectPath={(id) => `/listing/${id}`}
                  >
                    <Sublet />
                  </RequireOwnershipAndExist>
                }
              />

              <Route element={<RequestFormContextLayout />}>
                <Route
                  path="/host/listing/:listingId/request/:requestId"
                  element={
                    <RequireOwnershipAndExist
                      checkOwnership={checkTenantRequestOwnership}
                      paramName="requestId"
                      additionalParamName="listingId"
                    >
                      <RequestDetails />
                    </RequireOwnershipAndExist>
                  }
                />
              </Route>

              {/* Context Provider Pseudo Layout Route without a path to give context to nested routes */}
              <Route element={<ListFormContextLayout />}>
                <Route path="list" element={<List />} />
                <Route path="list/info" element={<Info />} />
                <Route path="list/overview" element={<Overview />} />

                <Route
                  path="list/:id"
                  element={
                    <RequireOwnershipAndExist
                      checkOwnership={checkTenantListingOwnership}
                      paramName="id"
                    >
                      <RequireProgess>
                        <SpecificList />
                      </RequireProgess>
                    </RequireOwnershipAndExist>
                  }
                >
                  <Route path="aboutyourplace" element={<AboutYourPlace />} />
                  <Route path="location" element={<Location />} />
                  <Route path="basics" element={<Basics />} />
                  <Route path="amenities" element={<Amenities />} />
                  <Route path="photos" element={<Photos />} />
                  <Route path="title" element={<Title />} />
                  <Route path="description" element={<Description />} />
                  <Route path="documents" element={<Documents />} />
                  <Route path="price" element={<Price />} />
                  <Route path="publish" element={<Publish />} />
                </Route>

                <Route
                  path="/host/listing/manage-your-listing/:id/details"
                  element={
                    <RequireOwnershipAndExist
                      checkOwnership={checkTenantListingOwnership}
                      paramName="id"
                    >
                      <ManageListing />
                    </RequireOwnershipAndExist>
                  }
                />

                <Route
                  path="/host/listing/manage-your-listing/:id/preview"
                  element={
                    <RequireOwnershipAndExist
                      checkOwnership={checkTenantListingOwnership}
                      paramName="id"
                    >
                      <Preview />
                    </RequireOwnershipAndExist>
                  }
                />
              </Route>
            </Route>
          </Route>

          <Route path="test" element={<Test />} />

          {/* catch all */}
          <Route path="*" element={<Missing />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

//This shouldn't be giving context to every component, need to figure out how to make this better
