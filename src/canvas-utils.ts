export const exportCanvasToBlob = (
  canvasId: string,
  callback: (blob: Blob) => void
) => {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }
  canvas.toBlob(function (blob) {
    if (!blob) {
      return;
    }
    callback(blob);
  });
};

export const getMainImageCanvas = () => {
  const canvas = document.getElementById("canvas-1-image") as HTMLCanvasElement;
  if (!canvas) {
    throw new Error("Main image canvas not found");
  }
  return canvas;
};
