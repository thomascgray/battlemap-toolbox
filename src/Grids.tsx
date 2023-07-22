import { useEffect } from "react";
import { IGridDrawingInfo } from "./types";
import {
  calculateFinalSquareSize,
  drawGrid_FlatTop,
  drawGrid_PointyTop,
} from "./utils";
import { getMainImageCanvas } from "./canvas-utils";
export const SquareGrid = ({
  isImageImported,
  gridDrawingInfo,
}: {
  isImageImported: boolean;
  gridDrawingInfo: IGridDrawingInfo;
}) => {
  useEffect(() => {
    if (!isImageImported) {
      return;
    }
    const canvas = document.getElementById(
      "canvas-2-grid"
    ) as HTMLCanvasElement;
    if (!canvas) {
      return;
    }
    const mainImageCanvas = getMainImageCanvas();
    canvas.width = mainImageCanvas.width;
    canvas.height = mainImageCanvas.height;
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    const squareSize = calculateFinalSquareSize(canvas.width, gridDrawingInfo);
    const numberOfSquaresX = Math.ceil(canvas.width / squareSize);
    const numberOfSquaresY = Math.ceil(canvas.height / squareSize);
    // // clear the canvas
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.beginPath();
    // // work out how many squares we need to draw
    // // now draw the squares
    for (let x = 0; x < numberOfSquaresX; x++) {
      for (let y = 0; y < numberOfSquaresY; y++) {
        context.rect(
          x * squareSize + gridDrawingInfo.xOffset,
          y * squareSize + gridDrawingInfo.yOffset,
          squareSize,
          squareSize
        );
      }
    }

    context.strokeStyle = gridDrawingInfo.colour;
    context.lineWidth = gridDrawingInfo.lineThickness;
    context.globalAlpha = gridDrawingInfo.opacity;
    context.stroke();
  }, [gridDrawingInfo, isImageImported]);

  return (
    <canvas
      style={{
        opacity: gridDrawingInfo.opacity,
      }}
      width="1"
      height="1"
      className="w-full absolute top-0 left-0"
      id="canvas-2-grid"
    ></canvas>
  );
};

export const HexGridFlatTop = ({
  isImageImported,
  gridDrawingInfo,
}: {
  isImageImported: boolean;
  gridDrawingInfo: IGridDrawingInfo;
}) => {
  useEffect(() => {
    if (!isImageImported) {
      return;
    }
    const canvas = document.getElementById(
      "canvas-2-grid"
    ) as HTMLCanvasElement;
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    const mainImageCanvas = getMainImageCanvas();
    canvas.width = mainImageCanvas.width;
    canvas.height = mainImageCanvas.height;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.beginPath();
    context.lineWidth = gridDrawingInfo.lineThickness;
    context.strokeStyle = gridDrawingInfo.colour;

    drawGrid_FlatTop(
      context,
      canvas.width,
      canvas.height,
      gridDrawingInfo.totalUnitsAcross,
      gridDrawingInfo.totalUnitsAcross
    );
    context.closePath();
  }, [gridDrawingInfo, isImageImported]);

  return (
    <canvas
      style={{
        opacity: gridDrawingInfo.opacity,
      }}
      width="1"
      height="1"
      className="w-full absolute top-0 left-0"
      id="canvas-2-grid"
    ></canvas>
  );
};

export const HexGridPointyTop = ({
  isImageImported,
  gridDrawingInfo,
}: {
  isImageImported: boolean;
  gridDrawingInfo: IGridDrawingInfo;
}) => {
  useEffect(() => {
    console.log("isImageImported", isImageImported);
    if (!isImageImported) {
      return;
    }
    const canvas = document.getElementById(
      "canvas-2-grid"
    ) as HTMLCanvasElement;
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    const mainImageCanvas = getMainImageCanvas();
    canvas.width = mainImageCanvas.width;
    canvas.height = mainImageCanvas.height;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.beginPath();
    context.lineWidth = gridDrawingInfo.lineThickness;
    context.strokeStyle = gridDrawingInfo.colour;

    drawGrid_PointyTop(
      context,
      canvas.width,
      canvas.height,
      gridDrawingInfo.totalUnitsAcross,
      gridDrawingInfo.totalUnitsAcross
    );
    context.closePath();
  }, [gridDrawingInfo, isImageImported]);

  return (
    <canvas
      style={{
        opacity: gridDrawingInfo.opacity,
      }}
      width="1"
      height="1"
      className="w-full absolute top-0 left-0"
      id="canvas-2-grid"
    ></canvas>
  );
};
