import { FC} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Pages/Landing/Landing";
import Login from "./Pages/Auth/Login";

const App:FC=() =>{
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/logIn" element={<Login />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;