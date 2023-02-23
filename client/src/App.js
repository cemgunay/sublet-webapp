import { Route, Routes } from "react-router-dom";
import Explore from "./pages/Explore/Explore";
import SignUp from "./pages/signup/SignUp";

import Listing from "./pages/Listing/Listing";

function App() {
  return (
  <main>
    <Routes>
      <Route path="/" element={<Explore/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/listing/:id" element={<Listing/>}/>
    </Routes>
  </main>
  );
}

export default App;
