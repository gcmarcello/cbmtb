const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    ["bold", "italic", "underline", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    [
      {
        color: [
          "#000000",
          "#333333",
          "#666666",
          "#999999",
          "#ff4000",
          "#ff8000",
          "#ffbf00",
          "#ffff00",
          "#bfff00",
          "#80ff00",
          "#40ff00",
          "#00ff00",
          "#00ff40",
          "#00ff80",
          "#00ffbf",
          "#00ffff",
          "#00bfff",
          "#0080ff",
          "#0040ff",
          "#0000ff",
          "#4000ff",
          "#8000ff",
          "#bf00ff",
          "#ff00ff",
          "#ff00bf",
          "#ff0080",
          "#ff0040",
          "#ff0000",
        ],
      },
    ],
  ],
};

const formats = ["header", "bold", "italic", "underline", "blockquote", "list", "bullet", "indent", "link", "image", "color"];

export { modules, formats };
