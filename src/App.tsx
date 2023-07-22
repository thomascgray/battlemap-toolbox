import { useState } from "react";
import {
  calculateFinalSquareSize,
  drawGrid_FlatTop,
  drawGrid_PointyTop,
} from "./utils";
import classnames from "classnames";
import * as Icons from "./icons";
import { EGridOverlayType, IGridDrawingInfo } from "./types";
import { Canvases } from "./Canvases";
import { GridControls } from "./GridControls";

function App() {
  const [isImageImported, setIsImageImported] = useState(false);
  const [isExportingImage, setisExportingImage] = useState(false);
  const [gridDrawingInfo, setGridDrawingInfo] = useState<IGridDrawingInfo>({
    totalUnitsAcross: 10,
    opacity: 0.5,
    gridType: EGridOverlayType.SQUARES,
    lineThickness: 2,
    xOffset: 0,
    yOffset: 0,
    colour: "#ffffff",
  });

  const importImageAndSetupCanvases = (image: File | Blob) => {
    var canvas = document.getElementById("canvas-1-image") as HTMLCanvasElement;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(image);
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);

      // also needs to set the width and height of the other canvases
      const canvas2 = document.getElementById(
        "canvas-2-grid"
      ) as HTMLCanvasElement;
      canvas2.width = img.width;
      canvas2.height = img.height;
      const canvas3 = document.getElementById(
        "canvas-3-final-output"
      ) as HTMLCanvasElement;
      canvas3.width = img.width;
      canvas3.height = img.height;
    };

    setTimeout(() => {
      clearGrid();
      drawGrid(gridDrawingInfo);
      drawTemplates(gridDrawingInfo);
      setIsImageImported(true);
    }, 100);
    setTimeout(() => {
      const verticalSpacer = document.getElementById(
        "canvas-layers"
      ) as HTMLDivElement;
      verticalSpacer.style.height = `${canvas.offsetHeight}px`;
    }, 200);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length <= 0) {
      return;
    }
    importImageAndSetupCanvases(e.target.files[0]);
  };

  const onReadImageFromClipboard = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const clipboardItem of clipboardItems) {
        const imageType = clipboardItem.types.find((type) =>
          type.startsWith("image/")
        );
        if (!imageType) {
          continue;
        }
        const blob = await clipboardItem.getType(imageType);

        importImageAndSetupCanvases(blob);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onCopyImageToClipboard = () => {
    setisExportingImage(true);
    // combine all the canvases together into 1 image
    const canvas1 = document.getElementById(
      "canvas-1-image"
    ) as HTMLCanvasElement;
    const canvas2 = document.getElementById(
      "canvas-2-grid"
    ) as HTMLCanvasElement;
    const canvas3 = document.getElementById(
      "canvas-3-final-output"
    ) as HTMLCanvasElement;

    const canvas3Context = canvas3.getContext("2d");
    if (!canvas3Context) {
      return;
    }

    canvas3Context.drawImage(canvas1, 0, 0);
    canvas3Context.globalAlpha = gridDrawingInfo.opacity;
    canvas3Context.drawImage(canvas2, 0, 0);
    canvas3Context.globalAlpha = 1;
    try {
      canvas3.toBlob(function (blob) {
        if (!blob) {
          return;
        }
        navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        setisExportingImage(false);
      });
    } catch (e) {
      console.log("e", e);
      setisExportingImage(false);
    }
    canvas3Context.clearRect(0, 0, canvas3.width, canvas3.height);
  };

  const drawGrid_Squares = (gridDrawingInfo: IGridDrawingInfo) => {
    const canvas = document.getElementById(
      "canvas-2-grid"
    ) as HTMLCanvasElement;
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    // clear the canvas
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.beginPath();
    const squareSize = calculateFinalSquareSize(canvas.width, gridDrawingInfo);
    // work out how many squares we need to draw
    const numberOfSquaresX = Math.ceil(canvas.width / squareSize);
    const numberOfSquaresY = Math.ceil(canvas.height / squareSize);

    // now draw the squares
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
  };

  const drawGrid_Hexagon = (gridDrawingInfo: IGridDrawingInfo) => {
    const canvas = document.getElementById(
      "canvas-2-grid"
    ) as HTMLCanvasElement;
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.beginPath();
    context.lineWidth = gridDrawingInfo.lineThickness;
    context.strokeStyle = gridDrawingInfo.colour;

    if (gridDrawingInfo.gridType === EGridOverlayType.HEXAGONS_FLAT_TOP) {
      drawGrid_FlatTop(
        context,
        canvas.width,
        canvas.height,
        gridDrawingInfo.totalUnitsAcross,
        gridDrawingInfo.totalUnitsAcross
      );
    } else if (
      gridDrawingInfo.gridType === EGridOverlayType.HEXAGONS_POINTY_TOP
    ) {
      drawGrid_PointyTop(
        context,
        canvas.width,
        canvas.height,
        gridDrawingInfo.totalUnitsAcross,
        gridDrawingInfo.totalUnitsAcross
      );
    }
    context.closePath();
  };

  const clearGrid = () => {
    const canvas = document.getElementById(
      "canvas-2-grid"
    ) as HTMLCanvasElement;
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  };

  const drawGrid = (gridDrawingInfo: IGridDrawingInfo) => {
    if (gridDrawingInfo.gridType === EGridOverlayType.HEXAGONS_FLAT_TOP) {
      drawGrid_Hexagon(gridDrawingInfo);
    } else if (gridDrawingInfo.gridType === EGridOverlayType.SQUARES) {
      drawGrid_Squares(gridDrawingInfo);
    } else if (
      gridDrawingInfo.gridType === EGridOverlayType.HEXAGONS_POINTY_TOP
    ) {
      drawGrid_Hexagon(gridDrawingInfo);
    }
  };

  const drawTemplates = (gridDrawingInfo: IGridDrawingInfo) => {
    const mainCanvas = document.getElementById(
      "canvas-1-image"
    ) as HTMLCanvasElement;
    const canvas = document.getElementById(
      "canvas-template-1-single-unit"
    ) as HTMLCanvasElement;
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    // clear the canvas
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.beginPath();

    if (gridDrawingInfo.gridType === EGridOverlayType.SQUARES) {
      // draw a single square at the correct size
      const squareSize = calculateFinalSquareSize(
        mainCanvas.width,
        gridDrawingInfo
      );
      console.log("squareSize", squareSize);
      canvas.width = squareSize;
      canvas.height = squareSize;
      context.fillStyle = "#FF0000";
      context.globalAlpha = 0.4;
      context.fillRect(0, 0, squareSize, squareSize);
      context.closePath();
    }

    // get the final hexagon size
  };

  return (
    <>
      <div className="container mx-auto space-y-4 mt-4 mb-4">
        <h1 className="text-3xl">Tombola's BattleMap Toolbox</h1>

        <span>Import a map</span>
        <div className="import-controls flex space-x-2 items-center">
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/png, image/jpeg"
            onChange={onFileChange}
          />
          or
          <button
            onClick={onReadImageFromClipboard}
            className="bg-red-600 rounded px-2 py-1 text-white hover:scale-110 hover:bg-red-500 active:scale-90 active:bg-red-700"
          >
            Import from clipboard
          </button>
        </div>

        <div className="canvases-wrapper flex space-x-2">
          {/* the canvas layers */}
          <div className="w-3/5">
            <Canvases
              key="canvases"
              gridDrawingInfo={gridDrawingInfo}
              isImageImported={isImageImported}
            />
          </div>
          <div className="w-2/5">
            <GridControls
              drawGrid={drawGrid}
              drawTemplates={drawTemplates}
              gridDrawingInfo={gridDrawingInfo}
              setGridDrawingInfo={setGridDrawingInfo}
            />
          </div>
        </div>

        <div className="export-button">
          <span className="text-sm text-slate-500 italic">
            Remember: the image is exported at the ORIGINAL resolution that it
            was imported, not the preview size above.
          </span>
          <button
            onClick={onCopyImageToClipboard}
            disabled={!isImageImported || isExportingImage}
            className={classnames(
              "bg-red-600 rounded px-2 py-2 text-white text-2xl flex items-center",
              {
                "opacity-50 cursor-not-allowed": !isImageImported,
              }
            )}
          >
            <span
              className={classnames("mr-2", {
                "animate-spin": isExportingImage,
              })}
            >
              {isExportingImage ? <Icons.Update /> : <Icons.CopyToClipboard />}
            </span>
            {isExportingImage
              ? "Exporting..."
              : "Export final image to clipboard"}
          </button>
        </div>

        <h2>Templates</h2>
        <canvas id="canvas-template-1-single-unit" className=""></canvas>
        <button
          onClick={() => {
            const canvas = document.getElementById(
              "canvas-template-1-single-unit"
            ) as HTMLCanvasElement;
            const context = canvas.getContext("2d");
            if (!context) {
              return;
            }
            canvas.toBlob(function (blob) {
              if (!blob) {
                return;
              }
              navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob }),
              ]);
              setisExportingImage(false);
            });
          }}
        >
          export template
        </button>
      </div>
    </>
  );
}

export default App;
