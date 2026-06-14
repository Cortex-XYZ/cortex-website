import type { WebGLRenderer } from "three";

/**
 * Sync the GL viewport to the drawing-buffer dimensions.
 *
 * Firefox warns when `gl.viewport` exceeds the backing store. In three@0.182.0
 * (pinned in package.json — do not bump three without re-verifying this),
 * `WebGLRenderer.setSize` uses Math.floor for the canvas backing store but
 * Math.round for the viewport. Call after every R3F resize / DPR change.
 */
export function syncGlobeRendererViewport(gl: WebGLRenderer): void {
  const ctx = gl.getContext();
  ctx.viewport(0, 0, ctx.drawingBufferWidth, ctx.drawingBufferHeight);
}
