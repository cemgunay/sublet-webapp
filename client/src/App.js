import { Route, Routes } from "react-router-dom";
import Explore from "./pages/Explore/Explore";
import SignUp from "./pages/signup/SignUp";
import BottomNav from "./components/BottomNav/BottomNav";

import classes from './App.module.css'

function App() {
  return (
  <>
    <main className={classes.container}>
      <Routes>
        <Route path="/" element={<Explore/>}/>
        <Route path="/signup" element={<SignUp/>}/>
      </Routes>
    </main>
    <footer>
      <BottomNav />
    </footer>
  </>
  );
}

export default App;
