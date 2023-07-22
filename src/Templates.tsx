import { useEffect } from "react";
import { IGridDrawingInfo } from "./types";
import { calculateFinalSquareSize } from "./utils";
import { exportCanvasToBlob } from "./canvas-utils";

export const Square1x1 = ({
  gridDrawingInfo,
  canvasId = "canvas-template-1x1",
}: {
  gridDrawingInfo: IGridDrawingInfo;
  canvasId?: string;
}) => {
  useEffect(() => {
    const mainCanvas = document.getElementById(
      "canvas-1-image"
    ) as HTMLCanvasElement;
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const squareSize = calculateFinalSquareSize(
      mainCanvas.width,
      gridDrawingInfo
    );
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.beginPath();
    canvas.width = squareSize;
    canvas.height = squareSize;
    context.fillStyle = "#FF0000";
    context.globalAlpha = 0.4;
    context.fillRect(0, 0, squareSize, squareSize);
    context.closePath();
  }, [gridDrawingInfo]);

  return (
    <div className="flex flex-col space-y-4 border border-dashed border-slate-500 p-4">
      <h3>1x1</h3>
      <canvas id={canvasId} className=""></canvas>
      <button
        className="bg-red-500 px-2 py-1 text-white"
        onClick={() => {
          exportCanvasToBlob(canvasId, (blob) => {
            navigator.clipboard.write([
              new ClipboardItem({ "image/png": blob }),
            ]);
          });
        }}
      >
        export template
      </button>
    </div>
  );
};

export const Square1x3 = ({
  gridDrawingInfo,
  canvasId = "canvas-template-1x3",
}: {
  gridDrawingInfo: IGridDrawingInfo;
  canvasId?: string;
}) => {
  useEffect(() => {
    const mainCanvas = document.getElementById(
      "canvas-1-image"
    ) as HTMLCanvasElement;
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const squareSize = calculateFinalSquareSize(
      mainCanvas.width,
      gridDrawingInfo
    );
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.beginPath();
    canvas.width = squareSize;
    canvas.height = squareSize * 3;
    context.fillStyle = "#FF0000";
    context.globalAlpha = 0.4;
    context.fillRect(0, 0, squareSize, squareSize * 3);
    context.closePath();
  }, [gridDrawingInfo]);

  return (
    <div className="flex flex-col space-y-4 border border-dashed border-slate-500 p-4">
      <h3>1x3</h3>
      <canvas id={canvasId}></canvas>
      <button
        className="bg-red-500 px-2 py-1 text-white"
        onClick={() => {
          exportCanvasToBlob(canvasId, (blob) => {
            navigator.clipboard.write([
              new ClipboardItem({ "image/png": blob }),
            ]);
          });
        }}
      >
        export template
      </button>
    </div>
  );
};

export const Square2x2 = ({
  gridDrawingInfo,
  canvasId = "canvas-template-2x2",
}: {
  gridDrawingInfo: IGridDrawingInfo;
  canvasId?: string;
}) => {
  useEffect(() => {
    const mainCanvas = document.getElementById(
      "canvas-1-image"
    ) as HTMLCanvasElement;
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const squareSize = calculateFinalSquareSize(
      mainCanvas.width,
      gridDrawingInfo
    );
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.beginPath();
    canvas.width = squareSize * 2;
    canvas.height = squareSize * 2;
    context.fillStyle = "#FF0000";
    context.globalAlpha = 0.4;
    context.fillRect(0, 0, squareSize * 2, squareSize * 2);
    context.closePath();
  }, [gridDrawingInfo]);

  return (
    <div className="flex flex-col space-y-4 border border-dashed border-slate-500 p-4">
      <h3>2x2</h3>
      <canvas id={canvasId}></canvas>
      <button
        className="bg-red-500 px-2 py-1 text-white"
        onClick={() => {
          exportCanvasToBlob(canvasId, (blob) => {
            navigator.clipboard.write([
              new ClipboardItem({ "image/png": blob }),
            ]);
          });
        }}
      >
        export template
      </button>
    </div>
  );
};

export const Square3x3 = ({
  gridDrawingInfo,
  canvasId = "canvas-template-3x3",
}: {
  gridDrawingInfo: IGridDrawingInfo;
  canvasId?: string;
}) => {
  useEffect(() => {
    const mainCanvas = document.getElementById(
      "canvas-1-image"
    ) as HTMLCanvasElement;
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const squareSize = calculateFinalSquareSize(
      mainCanvas.width,
      gridDrawingInfo
    );
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.beginPath();
    canvas.width = squareSize * 3;
    canvas.height = squareSize * 3;
    context.fillStyle = "#FF0000";
    context.globalAlpha = 0.4;
    context.fillRect(0, 0, squareSize * 3, squareSize * 3);
    context.closePath();
  }, [gridDrawingInfo]);

  return (
    <div className="flex flex-col space-y-4 border border-dashed border-slate-500 p-4">
      <h3>3x3</h3>
      <canvas id={canvasId}></canvas>
      <button
        className="bg-red-500 px-2 py-1 text-white"
        onClick={() => {
          exportCanvasToBlob(canvasId, (blob) => {
            navigator.clipboard.write([
              new ClipboardItem({ "image/png": blob }),
            ]);
          });
        }}
      >
        export template
      </button>
    </div>
  );
};

export const HexPointyTop1x1 = () => {};
