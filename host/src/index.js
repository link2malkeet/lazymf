import React from "react";
import { createRoot } from "react-dom/client";
import HostApp from "./components/HostApp";

const root = createRoot(document.getElementById("root"));
root.render(<HostApp />);
