import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/desbord";
import StoryPlayer from "./pages/storyplayer";
import Navbar from "./components/navwar";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Admin Dashboard */}
        <Route path="/admin" element={<Dashboard />} />

        {/* Homepage shows all stories */}
        <Route path="/" element={<StoryPlayer />} />

        {/* Single story view */}
        <Route path="/stories/:id" element={<StoryPlayer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
