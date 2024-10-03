import React from "react";
import { createRoot } from "react-dom/client";
import HostApp from "./components/HostApp";
import { BrowserRouter as Router } from "react-router-dom";
const root = createRoot(document.getElementById("root"));
root.render(
  <Router>
    <HostApp />
  </Router>
);
