import { Route, Routes, useLocation } from "react-router-dom";
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

//import RequireAuth from "./components/Util/RequireAuth";

function App() {
  return (
    <>
      <RemoveTrailingSlash />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route path="/" element={<Explore />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="listing/:id" element={<Listing />} />

          {/* Private Routes */}
          <Route path="profile" element={<Profile />} />

          {/* Context Provider Pseudo Layout Route without a path to give context to nested routes */}
          <Route element={<ListFormContextLayout />}>
            <Route path="list" element={<List />} />
            <Route path="list/info" element={<Info />} />
            <Route path="list/overview" element={<Overview />} />
            <Route path="list/:id" element={<SpecificList />}>
              <Route path="aboutyourplace" element={<AboutYourPlace />} />
              <Route path="location" element={<Location />} />
              <Route path="basics" element={<Basics />} />
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
