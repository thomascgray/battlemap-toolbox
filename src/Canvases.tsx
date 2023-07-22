import classnames from "classnames";
import { IGridDrawingInfo } from "./types";

export const Canvases = ({
  isImageImported,
  gridDrawingInfo,
}: {
  isImageImported: boolean;
  gridDrawingInfo: IGridDrawingInfo;
}) => {
  return (
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
  );
};
