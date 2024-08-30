import { useState, useEffect, useRef } from "react";

import { Dropzone } from "./Dropzone.jsx";
import { PDFViewer } from "@react-pdf/renderer";
import { Labels, pageSize } from "./pdf.jsx";
import { useImageSize } from "react-image-size";
import "./App.css";

function Input({ label, value: input, onChange }) {
  const [value, setValue] = useState(input);
  const id = useRef(Math.random().toString(36).substring(7));

  useEffect(() => {
    setValue(input);
  }, [input]);

  return (
    <div className="labelled-input">
      <label htmlFor={id}>{label}</label>
      <input
        type="number"
        id={id}
        value={value}
        step="1"
        min="0"
        onChange={(e) => {
          setValue(e.target.value);
          const val = parseInt(e.target.value, 10);
          if (!Number.isNaN(val)) onChange(val);
        }}
      />
    </div>
  );
}

function OrientationSelector({ label, value, onChange }) {
  const id = useRef(Math.random().toString(36).substring(7));

  return (
    <div className="labelled-input">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="portrait">Portrait</option>
        <option value="landscape">Landscape</option>
      </select>
    </div>
  );
}

function App() {
  const [image, setImage] = useState();

  const [width, setWidth] = useState(70);
  const [columns, setColumns] = useState(2);
  const [rows, setRows] = useState(3);
  const [bleed, setBleed] = useState(0);
  const [orientation, setOrientation] = useState("portrait");

  const [dimensions] = useImageSize(image);

  let height = (width * dimensions?.height) / dimensions?.width;
  height = Number.isNaN(height) ? 1 : Math.round(height);

  const size = pageSize(orientation);
  const maxColumns = Math.floor((size.width - 10) / width);
  const maxRows = Math.floor((size.height - 10) / height);

  useEffect(() => {
    if (columns > maxColumns) setColumns(maxColumns);
    if (rows > maxRows) setRows(maxRows);
  }, [maxColumns, maxRows, columns, rows]);

  if (!image) {
    return (
      <Dropzone onChosenFile={setImage}>
        <div className="dropzone-container">
          <p>This simple web app allows you to create a sheet of labels.</p>
          <p>Drag and drop a jpg or png file here (or click to select)</p>
        </div>
      </Dropzone>
    );
  }

  return (
    <div id="edit-grid">
      <div className="edit-container">
        <Dropzone onChosenFile={setImage}>
          <img src={image} alt="uploaded" className="image-preview" />
        </Dropzone>
        <div className="input-container">
          <Input label="Width (mm)" value={width} onChange={setWidth} />
          <Input label="Columns" value={columns} onChange={setColumns} />
          <Input label="Rows" value={rows} onChange={setRows} />
          <Input label="Bleed (mm)" value={bleed} onChange={setBleed} />
          <OrientationSelector
            label="Orientation"
            value={orientation}
            onChange={setOrientation}
          />
        </div>
      </div>
      <PDFViewer width="420px" height="630px" frameborder="0">
        <Labels
          nRows={Math.min(rows, maxRows)}
          nColumns={Math.min(columns, maxColumns)}
          width={width}
          height={height}
          image={image}
          bleed={bleed}
          orientation={orientation}
        />
      </PDFViewer>
    </div>
  );
}

export default App;
