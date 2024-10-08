import React from "react";
import { createRoot } from "react-dom/client";
import HostApp from "./components/HostApp";
import { BrowserRouter as Router } from "react-router-dom";
import { onCLS, onFID, onLCP, onFCP, onTTFB } from "web-vitals";

// Function to report metrics
const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry);
    onFID(onPerfEntry);
    onLCP(onPerfEntry);
    onFCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
};

// Custom function to measure TTI and TBT
const measurePerformance = () => {
  const performanceEntries = performance.getEntriesByType("navigation");
  if (performanceEntries.length > 0) {
    const navigationEntry = performanceEntries[0];
    console.log("Time to Interactive (TTI):", navigationEntry.domInteractive);
    console.log(
      "Total Blocking Time (TBT):",
      navigationEntry.domContentLoadedEventEnd -
        navigationEntry.domContentLoadedEventStart
    );
  }
};

// Measure JS Bundle Size
const measureJSBundleSize = () => {
  const scripts = document.getElementsByTagName("script");
  let totalSize = 0;
  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].src) {
      fetch(scripts[i].src)
        .then((response) => response.text())
        .then((text) => {
          totalSize += text.length;
          const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
          console.log("JS Bundle Size:", sizeInMB, "MB");
        });
    }
  }
};

// Measure API response times
const measureAPIResponseTime = (url: string) => {
  const start = performance.now();
  fetch(url).then(() => {
    const end = performance.now();
    const responseTimeInSeconds = ((end - start) / 1000).toFixed(3);
    console.log(`API Response Time (${url}):`, responseTimeInSeconds, "s");
  });
};

// Measure module load times
const measureModuleLoadTime = (moduleName: string) => {
  performance.mark(`${moduleName}-start`);
  import(`./components/${moduleName}`).then(() => {
    performance.mark(`${moduleName}-end`);
    performance.measure(
      `${moduleName} Load Time`,
      `${moduleName}-start`,
      `${moduleName}-end`
    );
    const measures = performance.getEntriesByName(`${moduleName} Load Time`);
    const loadTimeInSeconds = (measures[0].duration / 1000).toFixed(3);
    console.log(`${moduleName} Load Time:`, loadTimeInSeconds, "s");
  });
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <Router>
    <HostApp />
  </Router>
);

// Report web vitals
reportWebVitals(console.log);

measurePerformance();
measureJSBundleSize();
measureAPIResponseTime("");
measureModuleLoadTime("HostApp");
