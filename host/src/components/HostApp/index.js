import React, { useState, Suspense, useEffect } from "react";
import { loadModuleFederationImport } from "../../loadModuleFederationImport";
import { Routes, Route, Link, useLocation } from "react-router-dom";
export const remoteConfig = {
  remoteApp2: "remoteApp2@http://localhost:3002/remoteEntry.js",
};
const loadRemoteComponent = loadModuleFederationImport(remoteConfig);

const HostApp = () => {
  const [RemoteComponent, setRemoteComponent] = useState(null);
  const location = useLocation();
  const [LazyRemoteEntry, setLazyRemoteEntry] = useState(null);
  const resetRemoteComponent = () => {
    setRemoteComponent(null);
    setLazyRemoteEntry(null);
  };

  const loadRemoteComponent1 = async () => {
    const remoteApp1 = await import("remoteApp1/RemoteComponent1");
    setRemoteComponent(() => remoteApp1.default);
  };

  const loadRemoteEntry = async (remoteApp) => {
    try {
      const RemoteComponent2 = loadRemoteComponent(
        "remoteApp2/RemoteComponent2"
      );

      setLazyRemoteEntry(RemoteComponent2);
    } catch (error) {
      console.error("Error loading remote component:", error);
    }
  };

  useEffect(() => {
    const currentPath = location.pathname;

    if (currentPath === "/remote1") {
      loadRemoteComponent1();
    } else if (currentPath === "/remote2") {
      loadRemoteEntry();
    } else {
      resetRemoteComponent();
    }
  }, [location]);

  return (
    <div>
      <h1>Host Application</h1>
      <p>Click the buttons below to load remote components dynamically.</p>

      <div style={{ display: "flex", marginBottom: "20px" }}>
        <Link to="/" style={{ marginRight: "10px" }}>
          <button>Host Application</button>
        </Link>
        <Link
          to="/remote1"
          style={{ marginRight: "10px" }}
          onClick={loadRemoteComponent1}
        >
          <button>Lazy Remote Component</button>
        </Link>
        <Link
          to="/remote2"
          style={{ marginRight: "10px" }}
          onClick={loadRemoteEntry}
        >
          <button>Lazy Remote Entry</button>
        </Link>
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <div>
              <p>Welcome to the Host Application!</p>
            </div>
          }
        />
        <Route
          path="/remote1"
          element={
            <Suspense fallback={<div>Loading Remote Component 1...</div>}>
              {RemoteComponent ? (
                <RemoteComponent />
              ) : (
                <p>No remote component loaded.</p>
              )}
            </Suspense>
          }
        />
        <Route
          path="/remote2"
          element={
            <Suspense fallback={<div>Loading Remote Component 2...</div>}>
              {LazyRemoteEntry ? (
                <LazyRemoteEntry />
              ) : (
                <p>No lazy remote entry loaded.</p>
              )}
            </Suspense>
          }
        />
      </Routes>
    </div>
  );
};

export default HostApp;
