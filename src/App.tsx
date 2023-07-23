import { useState } from "react";
import classnames from "classnames";
import * as Icons from "./icons";
import { EGridOverlayType, IGridDrawingInfo } from "./types";
import { GridControls } from "./GridControls";
import * as Templates from "./Templates";
import * as Grids from "./Grids";
import classNames from "classnames";

function App() {
  const [isImageImported, setIsImageImported] = useState(false);
  const [isExportingImage, setisExportingImage] = useState(false);
  const [gridDrawingInfo, setGridDrawingInfo] = useState<IGridDrawingInfo>({
    totalUnitsAcross: 10,
    opacity: 0.25,
    gridType: EGridOverlayType.SQUARES,
    lineThickness: 2,
    xOffset: 0,
    yOffset: 0,
    colour: "#ffffff",
    templateOpacity: 0.25,
    templateColour: "#e74c3c",
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
      setIsImageImported(true);
      setGridDrawingInfo({
        ...gridDrawingInfo,
      });
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

  return (
    <>
      <div className="container mx-auto space-y-4 mt-4 mb-8">
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
          <div className="w-[70%]">
            <div
              id="canvas-layers"
              className={classNames("relative", {
                hidden: !isImageImported,
              })}
            >
              <canvas
                width="1"
                height="1"
                className="w-full absolute top-0 left-0"
                id="canvas-1-image"
              ></canvas>
              {gridDrawingInfo.gridType === EGridOverlayType.SQUARES && (
                <Grids.SquareGrid
                  gridDrawingInfo={gridDrawingInfo}
                  isImageImported={isImageImported}
                />
              )}
              {gridDrawingInfo.gridType ===
                EGridOverlayType.HEXAGONS_POINTY_TOP && (
                <Grids.HexGridPointyTop
                  gridDrawingInfo={gridDrawingInfo}
                  isImageImported={isImageImported}
                />
              )}
              {gridDrawingInfo.gridType ===
                EGridOverlayType.HEXAGONS_FLAT_TOP && (
                <Grids.HexGridFlatTop
                  gridDrawingInfo={gridDrawingInfo}
                  isImageImported={isImageImported}
                />
              )}
              <canvas
                width="1"
                height="1"
                className="w-full absolute top-0 left-0"
                id="canvas-3-final-output"
              ></canvas>
            </div>
          </div>
          <div className="w-[30%]">
            {isImageImported && (
              <GridControls
                gridDrawingInfo={gridDrawingInfo}
                setGridDrawingInfo={setGridDrawingInfo}
              />
            )}
          </div>
        </div>

        {isImageImported && (
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
                {isExportingImage ? (
                  <Icons.Update />
                ) : (
                  <Icons.CopyToClipboard />
                )}
              </span>
              {isExportingImage
                ? "Exporting..."
                : "Export final image to clipboard"}
            </button>
          </div>
        )}

        {isImageImported && (
          <section className="space-y-2">
            <h2>Templates</h2>
            <p className="text-sm text-slate-500 italic">
              Useful transparent PNG templates for marking out areas of effect,
              etc. When you copy to clipboard, they'll be the right scaled size
              - the previews are not to scale.
            </p>
            <div className="template-controls flex space-x-4">
              <label className="flex flex-col space-y-2 w-1/2">
                <span>Templates opacity: {gridDrawingInfo.opacity}</span>
                <input
                  value={gridDrawingInfo.templateOpacity}
                  onChange={(e) => {
                    setGridDrawingInfo({
                      ...gridDrawingInfo,
                      templateOpacity: parseFloat(e.target.value),
                    });
                  }}
                  type="range"
                  step="0.05"
                  min="0.05"
                  max="1"
                ></input>
              </label>

              <label className="flex flex-col space-y-2 w-1/2">
                <span>Templates colour: {gridDrawingInfo.colour}</span>
                <input
                  type="color"
                  value={gridDrawingInfo.templateColour}
                  onChange={(e) => {
                    setGridDrawingInfo({
                      ...gridDrawingInfo,
                      templateColour: e.target.value,
                    });
                  }}
                />
              </label>
            </div>
            <div className="flex space-x-4">
              {gridDrawingInfo.gridType === EGridOverlayType.SQUARES && (
                <>
                  <Templates.Square1x1 gridDrawingInfo={gridDrawingInfo} />
                  <Templates.Square1x3 gridDrawingInfo={gridDrawingInfo} />
                  <Templates.Square2x2 gridDrawingInfo={gridDrawingInfo} />
                  <Templates.Square3x3 gridDrawingInfo={gridDrawingInfo} />
                </>
              )}
              {gridDrawingInfo.gridType ===
                EGridOverlayType.HEXAGONS_POINTY_TOP && (
                <>
                  <Templates.HexPointyTop1x1
                    gridDrawingInfo={gridDrawingInfo}
                  />
                  <Templates.HexPointyTop1Slash2
                    gridDrawingInfo={gridDrawingInfo}
                  />
                  <Templates.HexPointyTop1x3
                    gridDrawingInfo={gridDrawingInfo}
                  />
                  <Templates.HexPointyTop3x1
                    gridDrawingInfo={gridDrawingInfo}
                  />
                </>
              )}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

export default App;
