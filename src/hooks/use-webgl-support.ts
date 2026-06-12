"use client";

import { useSyncExternalStore } from "react";

type WebGLSupportCache = {
  checked: boolean;
  ok: boolean;
};

const WEBGL_SUPPORT_CACHE_KEY = "__cortex_webgl_support__";

type GlobalWithWebGLCache = typeof globalThis & {
  [WEBGL_SUPPORT_CACHE_KEY]?: WebGLSupportCache;
};

function getWebGLSupportCache(): WebGLSupportCache {
  const scope = globalThis as GlobalWithWebGLCache;
  if (!scope[WEBGL_SUPPORT_CACHE_KEY]) {
    scope[WEBGL_SUPPORT_CACHE_KEY] = { checked: false, ok: false };
  }
  return scope[WEBGL_SUPPORT_CACHE_KEY];
}

function resetWebGLSupportCache(): void {
  delete (globalThis as GlobalWithWebGLCache)[WEBGL_SUPPORT_CACHE_KEY];
}

/** WebGL2 feature check — custom GLSL ShaderMaterials require WebGL, not WebGPU. */
function checkWebGLSupport(): boolean {
  const cache = getWebGLSupportCache();
  if (cache.checked) return cache.ok;

  try {
    const canvas = document.createElement("canvas");
    cache.ok = !!canvas.getContext("webgl2");
  } catch {
    cache.ok = false;
  }
  cache.checked = true;
  return cache.ok;
}

const noopSubscribe = () => () => {};

if (process.env.NODE_ENV === "development") {
  const hot = (
    import.meta as ImportMeta & {
      hot?: { dispose(callback: () => void): void };
    }
  ).hot;
  hot?.dispose(resetWebGLSupportCache);
}

export function useWebGLSupport(): boolean {
  return useSyncExternalStore(noopSubscribe, checkWebGLSupport, () => false);
}
