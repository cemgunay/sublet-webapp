import { Route, Routes } from "react-router-dom";
import Explore from "./pages/Explore/Explore";
import SignUp from "./pages/signup/SignUp";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Explore/>}/>
      <Route path="/signup" element={<SignUp/>}/>
    </Routes>
  );
}

export default App;
