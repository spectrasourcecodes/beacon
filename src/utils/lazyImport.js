// client/src/utils/lazyImport.js
import { lazy } from 'react';

/**
 * Safely lazy-load a component that may be a default or named export.
 * Usage: lazyImport(() => import('./MyComponent'))
 */
export const lazyImport = (factory) =>
  lazy(() =>
    factory().then((module) => {
      // If the module has a default export, use it.
      // Otherwise, look for a named export with the same name as the file (or fallback to first export).
      // We'll assume the component is the default export if it exists, else use the only named export.
      // For safety, we can also accept a named export.
      const possibleExports = Object.keys(module);
      // If the module has a default export, use it.
      if (module.default) {
        return { default: module.default };
      }
      // If there's only one named export, use it.
      if (possibleExports.length === 1) {
        const key = possibleExports[0];
        return { default: module[key] };
      }
      // Fallback: try to find a component (by convention, PascalCase)
      const componentKey = possibleExports.find(
        (key) => key[0] === key[0].toUpperCase() && key !== 'default'
      );
      if (componentKey) {
        return { default: module[componentKey] };
      }
      // Last resort: throw an error
      throw new Error(
        `Could not find a default or named export in ${factory.toString()}`
      );
    })
  );