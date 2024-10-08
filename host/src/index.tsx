import React from "react";
import { createRoot } from "react-dom/client";
import HostApp from "./components/HostApp";
import { BrowserRouter as Router } from "react-router-dom";
import { onCLS, onINP, onLCP, onFCP, onTTFB } from "web-vitals";

// Function to report metrics
const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Cumulative Layout Shift (CLS): Measures visual stability
    // Relevance: Indicates how much unexpected layout shifts occur during page load
    // Target: Lower is better (ideally below 0.1)
    onCLS((metric) => {
      console.log(`CLS: ${metric.value.toFixed(3)} - Rating: ${metric.rating}`);
      onPerfEntry(metric);
    });

    // Interaction to Next Paint (INP): Measures responsiveness
    // Relevance: Shows how quickly the page responds to user interactions
    // Target: Lower is better (ideally below 200ms)
    onINP((metric) => {
      console.log(
        `INP: ${metric.value.toFixed(0)}ms - Rating: ${metric.rating}`
      );
      onPerfEntry(metric);
    });

    // Largest Contentful Paint (LCP): Measures loading performance
    // Relevance: Indicates when the largest content element becomes visible
    // Target: Lower is better (ideally below 2.5 seconds)
    onLCP((metric) => {
      console.log(
        `LCP: ${(metric.value / 1000).toFixed(2)}s - Rating: ${metric.rating}`
      );
      onPerfEntry(metric);
    });

    // First Contentful Paint (FCP): Measures initial render time
    // Relevance: Shows how quickly the first piece of content is displayed
    // Target: Lower is better (ideally below 1.8 seconds)
    onFCP((metric) => {
      console.log(
        `FCP: ${(metric.value / 1000).toFixed(2)}s - Rating: ${metric.rating}`
      );
      onPerfEntry(metric);
    });

    // Time to First Byte (TTFB): Measures server response time
    // Relevance: Indicates how fast the server responds to initial request
    // Target: Lower is better (ideally below 0.8 seconds)
    onTTFB((metric) => {
      console.log(
        `TTFB: ${(metric.value / 1000).toFixed(2)}s - Rating: ${metric.rating}`
      );
      onPerfEntry(metric);
    });
  }
};

// measures 2 important web performance metrics: Time to Interactive (TTI) and Total Blocking Time (TBT)
const measurePerformance = () => {
  const performanceEntries = performance.getEntriesByType("navigation");
  if (performanceEntries.length > 0) {
    const navigationEntry =
      performanceEntries[0] as PerformanceNavigationTiming;
    const ttiInSeconds = (navigationEntry.domInteractive / 1000).toFixed(2);
    const tbtInSeconds = (
      (navigationEntry.domContentLoadedEventEnd -
        navigationEntry.domContentLoadedEventStart) /
      1000
    ).toFixed(2);

    console.log("Time to Interactive (TTI):", ttiInSeconds, "seconds");
    console.log("Total Blocking Time (TBT):", tbtInSeconds, "seconds");
  }
};

// Measure Network resource all scripts Bundle Size
const measureJSBundleSize = () => {
  const resources = performance.getEntriesByType("resource");
  let totalSize = 0;
  let scriptCount = 0;

  resources.forEach((resource) => {
    if (resource.initiatorType === "script") {
      const size = (resource as PerformanceResourceTiming).encodedBodySize;
      if (size > 0) {
        totalSize += size;
        scriptCount++;
      }
    }
  });

  const sizeInKB = (totalSize / 1024).toFixed(2);
  const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
  console.log(
    `JS Bundle Size (${scriptCount} scripts):`,
    sizeInKB,
    "KB",
    `(${sizeInMB} MB)`
  );
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
