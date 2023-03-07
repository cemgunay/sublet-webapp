import { Route, Routes } from "react-router-dom";
import Explore from "./pages/Explore/Explore";
import SignUp from "./pages/Signup/SignUp";
import Layout from "./Layout";
import Listing from "./pages/Listing/Listing";
import Missing from "./pages/Missing/Missing";
import Profile from "./pages/Profile/Profile";
import List from "./pages/List/List";
import PostListing from "./pages/List/PostListing";


//import RequireAuth from "./components/Util/RequireAuth";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        {/* Public Routes */}
        <Route path="/" element={<Explore />}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/listing/:id" element={<Listing/>}/>

        {/* Private Routes */}
        <Route path="/profile" element={<Profile />}/>
        <Route path="/list" element={<List />}/>
        <Route path="/list/postlisting" element={<PostListing />}/>


        {/* catch all */}
        <Route path="*" element={<Missing />}/>
      </Route>
    </Routes>
  );
}

export default App;
