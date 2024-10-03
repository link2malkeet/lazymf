import React, { useState, Suspense } from "react";
import { loadModuleFederationImport } from "../../loadModuleFederationImport";
export const remoteConfig = {
  remoteApp2: "remoteApp2@http://localhost:3002/remoteEntry.js",
};
const loadRemoteComponent = loadModuleFederationImport(remoteConfig);

const HostApp = () => {
  const [RemoteComponent, setRemoteComponent] = useState(null);
  const [LazyRemoteEntry, setLazyRemoteEntry] = useState(null);

  // // Lazy load RemoteComponent1
  const loadRemoteComponent1 = async () => {
    const remoteApp1 = await import("remoteApp1/RemoteComponent1");
    setRemoteComponent(() => remoteApp1.default);
  };

  // // // Lazy load RemoteComponent2
  // const loadRemoteComponent2 = async () => {
  //   const remoteApp2 = await import("remoteApp2/RemoteComponent2");
  //   setRemoteComponent(() => remoteApp2.default);
  // };

  // // Lazy load RemoteComponent3
  // const loadRemoteComponent3 = async () => {
  //   const remoteApp3 = await import("remoteApp3/RemoteComponent3");
  //   setRemoteComponent(() => remoteApp3.default);
  // };
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

  return (
    <div>
      <h1>Host Application</h1>
      <p>Click the buttons below to load remote components dynamically.</p>
      <button onClick={loadRemoteComponent1}>
        Lazy Load Remote Component 1
      </button>
      {/* <button onClick={loadRemoteComponent2}>Load Remote Component 2</button>
      <button onClick={loadRemoteComponent3}>Load Remote Component 3</button> */}

      <div>
        <Suspense fallback={<div>Loading remote component...</div>}>
          {RemoteComponent ? (
            <RemoteComponent />
          ) : (
            <p>No remote component loaded yet.</p>
          )}
        </Suspense>
      </div>

      <button onClick={() => loadRemoteEntry("remoteApp2")}>
        Lazy Load Remote Entry
      </button>
      <div>
        <Suspense fallback={<div>Loading remote entry...</div>}>
          {LazyRemoteEntry ? (
            <LazyRemoteEntry />
          ) : (
            <p>No Lazy remote entry loaded yet.</p>
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default HostApp;
