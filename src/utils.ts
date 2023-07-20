function calculateWidthUsedHexagonFlatTop(
  numHexagons: number,
  hexagonWidth: number
) {
  if (numHexagons <= 0) {
    return 0;
  }

  // Distance between adjacent hexagon centers along the x-axis
  const hexagonSpacing = (hexagonWidth * 3) / 4;

  // Total width taking into account the overlap
  const totalWidth = (numHexagons - 1) * hexagonSpacing + hexagonWidth;

  return totalWidth;
}

export const drawGrid_FlatTop = (
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  gridWidth: number,
  gridHeight: number
) => {
  const heightFactor = canvasHeight / canvasWidth;
  let hexagonDiameter = canvasWidth / gridWidth;

  // the diameter needs to take into account the fact that when the hexes are tiled,
  // they're overlapping - and therefore it needs to be larger than calculated

  const totalWidthUsedActuallyUsed = calculateWidthUsedHexagonFlatTop(
    gridWidth,
    hexagonDiameter
  );

  const widthNotAccountedFor = (canvasWidth - totalWidthUsedActuallyUsed) * 1.5;
  const amountToAddToDiameter = widthNotAccountedFor / gridWidth;

  hexagonDiameter += amountToAddToDiameter;
  //   let hexagondiameter
  //   we start from an earlier number so that it covers the whole canvas
  for (let y = -1; y < Math.ceil(gridHeight * heightFactor) + 1; y++) {
    for (let x = -1; x < gridWidth + 1; x++) {
      let xTilingOffset = 0;
      let yTilingOffset = 0;

      // on even columns
      if (x % 2 === 0) {
        yTilingOffset = hexagonDiameter / 2;
      }

      xTilingOffset = x * (hexagonDiameter / 4) * -1 - hexagonDiameter / 2;

      const xPos = x * hexagonDiameter + xTilingOffset;
      const yPos = y * hexagonDiameter + yTilingOffset;

      drawHexagonFlatTop(context, xPos, yPos, hexagonDiameter, hexagonDiameter);
    }
  }
};

export const drawHexagonFlatTop = (
  context: CanvasRenderingContext2D,
  xPos: number,
  yPos: number,
  width: number,
  height: number
) => {
  const hexagonWidth = width;
  const hexagonHeight = height;
  const hexagonWidthQuarter = hexagonWidth / 4;
  context.beginPath();

  /*1*/ context.moveTo(xPos, yPos + hexagonWidth / 2);
  /*2*/ context.lineTo(xPos + hexagonWidthQuarter, yPos);
  /*3*/ context.lineTo(xPos + hexagonWidthQuarter * 3, yPos);
  /*4*/ context.lineTo(xPos + hexagonWidth, yPos + hexagonHeight / 2);
  /*5*/ context.lineTo(xPos + hexagonWidthQuarter * 3, yPos + hexagonHeight);
  /*6*/ context.lineTo(xPos + hexagonWidthQuarter, yPos + hexagonHeight);

  context.closePath();
  context.stroke();
};

export const drawHexagonPointyTop = (
  context: CanvasRenderingContext2D,
  xPos: number,
  yPos: number,
  width: number,
  height: number
) => {
  const hexagonWidth = width;
  const hexagonHeight = height;
  const hexagonRadius = hexagonWidth / 2;

  context.beginPath();
  context.moveTo(xPos + hexagonRadius, yPos);
  context.lineTo(xPos + hexagonWidth, yPos + hexagonHeight / 4);
  context.lineTo(xPos + hexagonWidth, yPos + (hexagonHeight * 3) / 4);
  context.lineTo(xPos + hexagonRadius, yPos + hexagonHeight);
  context.lineTo(xPos, yPos + (hexagonHeight * 3) / 4);
  context.lineTo(xPos, yPos + hexagonHeight / 4);
  context.closePath();
  context.stroke();
  context.fill();
};
