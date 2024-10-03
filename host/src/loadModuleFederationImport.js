import { lazy } from "react";

const loadedScopes = new Map();

// Ensures a remote script is loaded only once.
export function loadScope(url, scope) {
  let p;

  if (loadedScopes.has(url)) {
    p = loadedScopes.get(url);
  } else {
    const el = document.createElement("script");
    const promise = new Promise((resolve, reject) => {
      el.src = url;
      el.type = "text/javascript";
      el.async = true;
      el.onload = () => resolve();
      el.onerror = reject;
    });

    loadedScopes.set(url, promise);
    document.head.appendChild(el);
    promise.finally(() => document.head.removeChild(el));
    p = promise;
  }

  return p.then(() => window[scope]);
}

// Loads a specific module from a remote container.
export async function loadModule(url, scope, module) {
  console.log("LOADING", scope, module, url);

  try {
    const container = await loadScope(url, scope); // load the script
    await __webpack_init_sharing__("default"); // prepare the default shared scope
    await container.init(__webpack_share_scopes__.default); // share the scope
    const factory = await container.get(module); // get the mod-fed export
    return factory();
  } catch (error) {
    console.error("Error loading module:", error);
    throw error;
  }
}
// Creates a function to lazily load modules based on a remote configuration, returning React components that can be used in the application.
export function loadModuleFederationImport(remoteConfig) {
  return function loadLazy(importStatement) {
    const [imp, mod] = importStatement.split("/");
    const entry = remoteConfig[imp];
    const [windowName, url] = entry.split("@");

    return lazy(() => {
      console.log("LOADING INIT", imp, mod, windowName, url);
      return loadModule(url, windowName, `./${mod}`);
    });
  };
}
