import { useState } from "react";
import { drawGrid_FlatTop, drawGrid_PointyTop } from "./utils";
import classnames from "classnames";

export enum EGridOverlayType {
  SQUARES = "SQUARES",
  HEXAGONS_FLAT_TOP = "HEXAGONS_FLAT_TOP",
  HEXAGONS_POINTY_TOP = "HEXAGONS_POINTY_TOP",
}
export interface IGridDrawingInfo {
  totalUnitsAcross: number;
  gridType: EGridOverlayType;
  opacity: number;
  lineThickness: number;
  xOffset: number;
  yOffset: number;
  colour: string;
}

function App() {
  const [isImageImported, setIsImageImported] = useState(false);
  const [isExportingImage, setisExportingImage] = useState(false);
  const [gridDrawingInfo, setGridDrawingInfo] = useState<IGridDrawingInfo>({
    totalUnitsAcross: 10,
    opacity: 0.5,
    gridType: EGridOverlayType.HEXAGONS_POINTY_TOP,
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
      });
    } catch (e) {
      console.log("e", e);
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
    const gridSize = Math.floor(
      context.canvas.width / gridDrawingInfo.totalUnitsAcross
    );
    // work out how many squares we need to draw
    const numberOfSquaresX = Math.ceil(canvas.width / gridSize);
    const numberOfSquaresY = Math.ceil(canvas.height / gridSize);

    // now draw the squares
    for (let x = 0; x < numberOfSquaresX; x++) {
      for (let y = 0; y < numberOfSquaresY; y++) {
        context.rect(
          x * gridSize + gridDrawingInfo.xOffset,
          y * gridSize + gridDrawingInfo.yOffset,
          gridSize,
          gridSize
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

  return (
    <>
      <div className="container mx-auto space-y-4 mt-4 mb-4">
        <h1 className="text-3xl">Tombola's BattleMap Toolbox</h1>

        <span>Import a map</span>
        <div className="flex space-x-2 items-center">
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/png, image/jpeg"
            onChange={onFileChange}
          />

          <button
            onClick={onReadImageFromClipboard}
            className="bg-red-600 rounded px-2 py-1 text-white hover:scale-110 hover:bg-red-500 active:scale-90 active:bg-red-700"
          >
            Import from clipboard
          </button>
        </div>

        <>
          {/* the canvas layers */}
          <div
            id="canvas-layers"
            className={classnames("canvas-layers relative", {
              hidden: !isImageImported,
            })}
          >
            <canvas
              width="1"
              height="1"
              className="w-full absolute top-0 left-0"
              id="canvas-1-image"
            ></canvas>
            <canvas
              style={{
                opacity: gridDrawingInfo.opacity,
              }}
              width="1"
              height="1"
              className="w-full absolute top-0 left-0"
              id="canvas-2-grid"
            ></canvas>
            <canvas
              width="1"
              height="1"
              className="w-full absolute top-0 left-0"
              id="canvas-3-final-output"
            ></canvas>
          </div>

          <label className="flex flex-col">
            <span>Overlay Grid Type</span>
            <select
              className="border-2 border-gray-400 rounded px-2 py-1"
              value={gridDrawingInfo.gridType}
              onChange={(e) => {
                setGridDrawingInfo({
                  ...gridDrawingInfo,
                  gridType: e.target.value as EGridOverlayType,
                });
                drawGrid({
                  ...gridDrawingInfo,
                  gridType: e.target.value as EGridOverlayType,
                });
              }}
            >
              <option value={EGridOverlayType.SQUARES}>Squares</option>
              <option value={EGridOverlayType.HEXAGONS_POINTY_TOP}>
                Hexagons (Pointy Top)
              </option>
              <option value={EGridOverlayType.HEXAGONS_FLAT_TOP}>
                Hexagons (Flat Top)
              </option>
            </select>
          </label>

          <label className="flex flex-col space-y-2">
            <span>
              Total{" "}
              {gridDrawingInfo.gridType === EGridOverlayType.SQUARES
                ? "squares"
                : "hexes"}{" "}
              horizontally (Roughly, Ish)
            </span>
            <span className="text-xs italic text-slate-500">
              We add some extra columns and rows to make sure the map is fully
              covered, plus line thickness might affect exactly how many{" "}
              {gridDrawingInfo.gridType === EGridOverlayType.SQUARES
                ? "squares"
                : "hexes"}{" "}
              get drawn
            </span>
            <input
              className="border-2 border-gray-400 rounded px-2 py-1"
              value={gridDrawingInfo.totalUnitsAcross}
              onChange={(e) => {
                setGridDrawingInfo({
                  ...gridDrawingInfo,
                  totalUnitsAcross: parseInt(e.target.value),
                });
                drawGrid({
                  ...gridDrawingInfo,
                  totalUnitsAcross: parseInt(e.target.value),
                });
              }}
              type="number"
            />
          </label>

          <label className="flex flex-col space-y-2">
            <span>Line thickness: {gridDrawingInfo.lineThickness}</span>
            <input
              value={gridDrawingInfo.lineThickness}
              onChange={(e) => {
                setGridDrawingInfo({
                  ...gridDrawingInfo,
                  lineThickness: parseInt(e.target.value),
                });
                drawGrid({
                  ...gridDrawingInfo,
                  lineThickness: parseInt(e.target.value),
                });
              }}
              type="range"
              step="1"
              min="1"
              max="10"
            ></input>
          </label>

          <label className="flex flex-col space-y-2">
            <span>Grid overlay opacity: {gridDrawingInfo.opacity}</span>
            <input
              value={gridDrawingInfo.opacity}
              onChange={(e) => {
                setGridDrawingInfo({
                  ...gridDrawingInfo,
                  opacity: parseFloat(e.target.value),
                });
                drawGrid({
                  ...gridDrawingInfo,
                  opacity: parseFloat(e.target.value),
                });
              }}
              type="range"
              step="0.05"
              min="0.05"
              max="1"
            ></input>
          </label>

          <label className="flex flex-col space-y-2">
            <span>Grid colour: {gridDrawingInfo.colour}</span>
            <input
              type="color"
              value={gridDrawingInfo.colour}
              onChange={(e) => {
                setGridDrawingInfo({
                  ...gridDrawingInfo,
                  colour: e.target.value,
                });
                drawGrid({
                  ...gridDrawingInfo,
                  colour: e.target.value,
                });
              }}
            />
          </label>

          <button
            onClick={onCopyImageToClipboard}
            className="bg-red-600 rounded px-2 py-1 text-white text-2xl"
          >
            Export final image to clipboard
          </button>
        </>
      </div>
    </>
  );
}

export default App;
