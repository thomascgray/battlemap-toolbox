import { EGridOverlayType, IGridDrawingInfo } from "./types";

export const GridControls = ({
  gridDrawingInfo,
  setGridDrawingInfo,
}: {
  gridDrawingInfo: IGridDrawingInfo;
  setGridDrawingInfo: (gridDrawingInfo: IGridDrawingInfo) => void;
}) => {
  return (
    <>
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
          }}
        />
      </label>
    </>
  );
};
