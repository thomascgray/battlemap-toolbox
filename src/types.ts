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
  templateOpacity: number;
  templateColour: string;
}
