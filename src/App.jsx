// Import Required Libraries
import { client, useConfig, useElementData, useElementColumns } from "@sigmacomputing/plugin";
import React from "react";
import parse from 'html-react-parser';

// Import the CSS file for the 'Inter' font
import './styles.css';

// Generate Source and Option Input Table in Sigma
client.config.configureEditorPanel([
  {
    name: "source",
    type: "element",
  },
  {
    name: "title",
    type: "column",
    source: "source",
    allowMultiple: false,
  },
  {
    name: "body",
    type: "column",
    source: "source",
    allowMultiple: false,
  },
  {
    name: "attributes",
    type: "column",
    source: "source",
    allowMultiple: true,
  },
  {
    name: "rowNumber",
    type: "text",
    allowMultiple: false,
  },
  {
    name: "titleFontSize",
    type: "text",
    allowMultiple: false,
  },
  {
    name: "titleFontColor",
    type: "text",
    allowMultiple: false,
  },
  {
    name: "minWidth",
    type: "text",
    allowMultiple: false,
  },
]);

// Generate Table Output and Render Content as HTML in the Viewport
function RenderDataTable({ data, titleName, bodyName, attributeNames, titleFontSize, titleFontColor, minWidth }) {
  if (data.length === 0) {
    return <div>No data available for the specified row number.</div>;
  }

  const renderCellContent = (content) => {
    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = content;
	tempContainer.style.fontSize = titleFontSize;
	tempContainer.style.color = titleFontColor;
	tempContainer.style.width = minWidth;
    return tempContainer.textContent;
  };

  const bodyTextHTML = data[0][bodyName].replace(/""/g, '"');

  const renderLink = (url, text) => {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    );
  };

  return (
	<table style={{ width: "100%", padding: "12px"}}>
      <tbody>
        <tr>
          <td colSpan="2">
            <b>
              <div style={{ whiteSpace: "nowrap", fontSize: "24px", fontWeight: "700", color: titleFontColor, marginBottom: "6px" }} dangerouslySetInnerHTML={{ __html: data[0][titleName] }}></div>
            </b>
          </td>
        </tr>
        <tr>
          <td colSpan="2">
            <div style={{ fontSize: "12px", fontWeight: "300" }}>{parse(bodyTextHTML)}</div>
          </td>
        </tr>
        {attributeNames.map((attributeName, i) => (
          <tr key={i}>
            <td style={{ width: "125px", lineHeight: "0.95", fontSize: "12px", fontWeight: "400" }}>
              {attributeName}:
            </td>
            <td style={{ lineHeight: "0.95", fontSize: "12px" }}>
              {data[0][attributeName].startsWith("http") ? (
                renderLink(data[0][attributeName], data[0][attributeName])
              ) : (
                renderCellContent(data[0][attributeName])
              )}
            </td>
          </tr>
        ))}
        <tr>
          <td colSpan="2">
            <div style={{ width: minWidth, height: "1px" }}>
              <img src="data:image/gif" id="image" style={{ width: minWidth, height: "1px" }} alt="" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

// Declare Variables in Plugin
function App({ bodyTextHTML }) {
  const config = useConfig();
  const sigmaData = useElementData(config.source);
  const columnInfo = useElementColumns(config.source);
  const { title, body, attributes, rowNumber, titleFontSize, titleFontColor, minWidth } = config;

  // Check if Data Exists for Required Inputs and Assign and Memoize the attributes Array
  if (title && body && attributes && Object.keys(columnInfo).length && columnInfo) {
    var titleName = columnInfo[title].name;
    var bodyName = columnInfo[body].name;
    var numattributes = attributes.length;
  }

  const attributeNames = React.useMemo(() => {
    const attributeNames = [];
    if (numattributes && Object.keys(columnInfo).length) {
      for (let i = 0; i < numattributes; i++) {
        attributeNames.push(columnInfo[attributes[i]].name);
      }
    }
    return attributeNames;
  }, [columnInfo, attributes, numattributes]);

  // Prepare Data for Use in Table
  const parsedRowNum = parseInt(rowNumber, 10);
  const data = React.useMemo(() => {
    const data = [];
    const rowCount = sigmaData[title]?.length || 0;

    if (
      titleName &&
      bodyName &&
      attributeNames &&
      rowCount > 0 &&
      parsedRowNum >= 1 &&
      parsedRowNum <= rowCount
    ) {
      const i = parsedRowNum - 1;
      const row = {};
      row[titleName] = sigmaData[title][i];
      row[bodyName] = sigmaData[body][i];
      for (let j = 0; j < numattributes; j++) {
        row[attributeNames[j]] = sigmaData[attributes[j]][i];
      }
      data.push(row);
    }

    return data;
  }, [
    title,
    body,
    attributes,
    numattributes,
    titleName,
    bodyName,
    sigmaData,
    attributeNames,
    parsedRowNum,
	titleFontSize,
	titleFontColor,
	minWidth,
  ]);

  return (
    <RenderDataTable
      data={data}
      titleName={titleName}
      bodyName={bodyName}
      attributeNames={attributeNames}
      rowNumber={rowNumber}
      titleFontSize={titleFontSize}
      titleFontColor={titleFontColor}
      minWidth={minWidth}
      bodyTextHTML={bodyTextHTML}
    />
  );
}

export default App;