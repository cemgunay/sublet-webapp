import { Route, Routes } from "react-router-dom";
import Explore from "./pages/Explore/Explore";
import SignUp from "./pages/Signup/SignUp";
import Layout from "./Layout";
import Listing from "./pages/Listing/Listing";
import Missing from "./pages/Missing/Missing";

//import RequireAuth from "./components/Util/RequireAuth";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        {/* Public Routes */}
        <Route path="/" element={<Explore />}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/listing/:id" element={<Listing/>}/>

        {/* Private Routes 
        
        This will have the other pages that can only be accessed if user exists

        */}

        {/* catch all */}
        <Route path="*" element={<Missing />}/>
      </Route>
    </Routes>
  );
}

export default App;
