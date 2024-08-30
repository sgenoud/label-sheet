import React from "react";
import {
  Page,
  Svg,
  Line,
  Document,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

const A4 = {
  width: 210,
  height: 297,
};

export const pageSize = (orientation) =>
  orientation === "portrait"
    ? { width: A4.width, height: A4.height }
    : { width: A4.height, height: A4.width };

const HLine = ({ x, y, width }) => {
  let len = ((width * 72) / 25.4) * 4;
  return (
    <Svg
      style={{
        position: "absolute",
        top: `${y}mm`,
        left: `${x}mm`,
        width: `${width}mm`,
      }}
      viewBox={`0 0 ${len} 3`}
    >
      <Line x1="0" y1="1" x2={len} y2="1" stroke="black" strokeWidth="1" />
    </Svg>
  );
};

const VLine = ({ x, y, height }) => {
  let len = ((height * 72) / 25.4) * 4;
  return (
    <Svg
      style={{
        position: "absolute",
        top: `${y}mm`,
        left: `${x}mm`,
        height: `${height}mm`,
      }}
      viewBox={`0 0 3 ${len}`}
    >
      <Line x1="1" y1="0" x2="1" y2={len} stroke="black" strokeWidth="1" />
    </Svg>
  );
};

export function Labels({
  nRows,
  nColumns,
  width,
  height,
  image,
  bleed,
  orientation,
}) {
  const totalWidth = nColumns * width;
  const totalHeight = nRows * height;

  const dims = pageSize(orientation);

  const leftMargin = (dims.width - totalWidth) / 2;
  const topMargin = (dims.height - totalHeight) / 2;

  const positions = Array.from({ length: nRows * nColumns }, (_, i) => {
    const x = i % nColumns;
    const y = Math.floor(i / nColumns);
    return {
      x: leftMargin + x * width + bleed,
      y: topMargin + y * height + bleed,
    };
  });

  const rowPositions = Array.from({ length: nRows + 1 }, (_, i) => {
    return topMargin + i * height;
  });

  const columnPositions = Array.from({ length: nColumns + 1 }, (_, i) => {
    return leftMargin + i * width;
  });

  const leftIndicatorMargin = leftMargin > 8 ? 5 : 2;
  const topIndicatorMargin = topMargin > 8 ? 5 : 2;

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation={orientation}>
        {positions.map(({ x, y }) => (
          <Image
            key={`${x}-${y}`}
            style={{
              key: `${x}-${y}`,
              width: `${width - 2 * bleed}mm`,
              height: `${height - 2 * bleed}mm`,
              position: "absolute",
              top: `${y}mm`,
              left: `${x}mm`,
            }}
            src={image}
          />
        ))}

        {rowPositions.map((y) => (
          <HLine
            key={y}
            x={leftIndicatorMargin}
            y={y}
            width={leftMargin - leftIndicatorMargin}
          />
        ))}
        {rowPositions.map((y) => (
          <HLine
            key={y}
            x={columnPositions[nColumns]}
            y={y}
            width={leftMargin - leftIndicatorMargin}
          />
        ))}
        {columnPositions.map((x) => (
          <VLine
            key={x}
            x={x}
            y={topIndicatorMargin}
            height={topMargin - topIndicatorMargin}
          />
        ))}
        {columnPositions.map((x) => (
          <VLine
            key={x}
            x={x}
            y={rowPositions[nRows]}
            height={topMargin - topIndicatorMargin}
          />
        ))}
      </Page>
    </Document>
  );
}
