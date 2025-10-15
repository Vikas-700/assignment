import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/desbord";
import StoryPlayer from "./pages/storyplayer"; // list of stories
import StoryDetail from "./pages/storydetail"; 
import Navbar from "./components/navwar";// create this
import "./App.css";

function App() {
  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/" element={<StoryPlayer />} />
        <Route path="/stories/:id" element={<StoryDetail />} /> {/* <-- add this */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
