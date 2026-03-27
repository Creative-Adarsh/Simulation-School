export function setupHiDPICanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const dpr = window.devicePixelRatio || 1;

  // Use CSS size (clientWidth/Height) as the logical drawing size
  const cssW = Math.max(1, canvas.clientWidth);
  const cssH = Math.max(1, canvas.clientHeight);

  const needResize = canvas.width !== Math.floor(cssW * dpr) || canvas.height !== Math.floor(cssH * dpr);

  if (needResize) {
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    // draw in CSS pixels
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  return { w: cssW, h: cssH, dpr };
}