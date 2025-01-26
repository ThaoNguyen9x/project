import React from "react";
import Highlighter from "react-highlight-words";

const HighlightText = ({ text, searchText }) => {
  return (
    <Highlighter
      highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
      searchWords={[searchText]}
      autoEscape
      textToHighlight={text || ""}
    />
  );
};

export default HighlightText;
