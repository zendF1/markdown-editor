const INDENTATION_LIST = 2;
const INDENTATION_NUMBER_LIST = 3;

const languageMap = {
  "language-python": "Python",
  "language-cpp": "C++",
  "language-javascript": "JavaScript",
  "language-java": "Java",
  "language-typescript": "TypeScript",
  "language-csharp": "C#",
  "language-go": "Go",
  "language-php": "PHP",
  "language-ruby": "Ruby",
  "language-swift": "Swift",
  "language-kotlin": "Kotlin",
  "language-rust": "Rust",
  "language-scala": "Scala",
  "language-c": "C",
  "language-html": "HTML",
  "language-css": "CSS",
  "language-bash": "Bash",
  "language-sql": "SQL",
  "language-markdown": "Markdown",
  "language-json": "JSON",
  "language-xml": "XML",
  "language-yaml": "YAML",
  "language-ini": "INI",
};

document.addEventListener("DOMContentLoaded", () => {
  const markdownInput = document.getElementById("markdown-input");
  const preview = document.getElementById("preview");

  window.updatePreview = () => {
    const markdownText = markdownInput.value;
    const htmlContent = marked.parse(markdownText);
    preview.innerHTML = htmlContent;
    Prism.highlightAll();

    document.querySelectorAll("pre code").forEach((codeElement) => {
      const languageClass = [...codeElement.classList].find((cls) =>
        cls.startsWith("language-")
      );
      if (languageClass) {
        const languageName = languageMap[languageClass];
        if (languageName) {
          const languageLabel = document.createElement("div");
          languageLabel.className = "language-label";
          languageLabel.textContent = languageName;

          const codeBlock = codeElement.parentElement;
          const codeBlockContainer = document.createElement("div");
          codeBlockContainer.className = "code-block";

          codeBlock.replaceWith(codeBlockContainer);
          codeBlockContainer.appendChild(languageLabel);
          codeBlockContainer.appendChild(codeBlock);
        }
      }
    });
  };

  markdownInput.addEventListener("input", updatePreview); // realtime run updatePreview() when the input changes
  markdownInput.addEventListener("keydown", handleKeyDown); // handle auto rendering when pressing Enter
  markdownInput.addEventListener("paste", handlePaste); // handle convert text to markdown syntax when pasting, and auto rendering when pasting
});

const syncTaxList = {
  normal: "normal",
  bold: "bold",
  italic: "italic",
  heading1: "heading1",
  heading2: "heading2",
  heading3: "heading3",
  heading4: "heading4",
  heading5: "heading5",
  heading6: "heading6",
  code: "code",
  blockquote: "blockquote",
  numberedList: "numberedList",
  list: "list",
  link: "link",
};

let markdownSyntax = syncTaxList.normal;

// button call
function addMarkdownSyntax(type) {
  const textarea = document.getElementById("markdown-input");
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  let markdownSyntax = "";
  let cursorPosition = start;

  switch (type) {
    case "bold":
      markdownSyntax = `**${text.substring(start, end)}**`;
      cursorPosition = start + 2;
      addSyncTax(syncTaxList.bold);
      break;
    case "italic":
      markdownSyntax = `*${text.substring(start, end)}*`;
      cursorPosition = start + 1;
      addSyncTax(syncTaxList.italic);
      break;
    case "heading1":
      markdownSyntax = `# ${text.substring(start, end)}`;
      cursorPosition = start + 2;
      addSyncTax(syncTaxList.heading1);
      break;
    case "heading2":
      markdownSyntax = `## ${text.substring(start, end)}`;
      cursorPosition = start + 3;
      addSyncTax(syncTaxList.heading2);
      break;
    case "heading3":
      markdownSyntax = `### ${text.substring(start, end)}`;
      cursorPosition = start + 4;
      addSyncTax(syncTaxList.heading3);
      break;
    case "heading4":
      markdownSyntax = `#### ${text.substring(start, end)}`;
      cursorPosition = start + 5;
      addSyncTax(syncTaxList.heading4);
      break;
    case "heading5":
      markdownSyntax = `##### ${text.substring(start, end)}`;
      cursorPosition = start + 6;
      addSyncTax(syncTaxList.heading5);
      break;
    case "heading6":
      markdownSyntax = `###### ${text.substring(start, end)}`;
      cursorPosition = start + 7;
      addSyncTax(syncTaxList.heading6);
      break;
    case "link":
      const url = prompt("Input URL:");
      if (url) {
        markdownSyntax = `[${text.substring(start, end)}](${url})`;
        cursorPosition = end + url.length + 3;
        addSyncTax(syncTaxList.link);
      }
      break;
    case "quote":
      markdownSyntax = `> ${text.substring(start, end)}`;
      cursorPosition = start + 2;
      addSyncTax(syncTaxList.blockquote);
      break;
    case "list":
      markdownSyntax = `- ${text.substring(start, end).replace(/\n/g, "\n- ")}`;
      cursorPosition = start + 2;
      addSyncTax(syncTaxList.list);
      break;
    case "numbered-list":
      markdownSyntax = text
        .substring(start, end)
        .split("\n")
        .map((line, index) => `${index + 1}. ${line}`)
        .join("\n");
      cursorPosition = start + 3;
      addSyncTax(syncTaxList.numberedList);
      break;
    default:
      markdownSyntax = text.substring(start, end);
      cursorPosition = end;
  }

  textarea.setRangeText(markdownSyntax, start, end, "end");
  textarea.selectionStart = textarea.selectionEnd = cursorPosition;
  textarea.focus();

  updatePreview();
}

function addCodeBlock(language) {
  const textarea = document.getElementById("markdown-input");
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const markdownSyntax = `\`\`\`${language}\n${text.substring(
    start,
    end
  )}\n\`\`\``;

  const newCursorPosition = start + 3 + language.length + 1;

  textarea.setRangeText(markdownSyntax, start, end, "end");
  textarea.selectionStart = newCursorPosition;
  textarea.selectionEnd = newCursorPosition;
  textarea.focus();

  updatePreview();
}

function handleKeyDown(event) {
  const textarea = event.target;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;

  const lines = text.substring(0, start).split("\n");
  const currentLine = lines[lines.length - 1];

  const matchNumberList = currentLine.trimStart().match(/^(\d+)\.\s(.*)/);
  const matchList = currentLine.trimStart().match(/^-\s(.*)/);
  const currentLineIndent = currentLine.match(/^(\s*)/)[0].length;

  if (event.key === "Enter") {
    if (matchNumberList) {
      event.preventDefault();
      handleEventEnterWithNumberList(textarea, start);
      updatePreview();
    } else if (matchList) {
      event.preventDefault();
      handleEventEnterWithList(textarea, currentLine, start, end);
      updatePreview();
    } else if (currentLine.trim() === "") {
      event.preventDefault();
      textarea.setRangeText("\n", start, end, "end");
      updatePreview();
    }
  } else if (event.key === "Tab") {
    event.preventDefault();
    const INDENTATION =
      markdownSyntax === syncTaxList.list
        ? INDENTATION_LIST
        : INDENTATION_NUMBER_LIST;
    if (event.shiftKey) {
      // Shift + Tab: Remove one level of indentation
      if (currentLineIndent > 0) {
        if (matchNumberList) {
          handleEventTab(textarea, start, true);
        } else {
          const newLine = currentLine.slice(INDENTATION, currentLine.length);
          textarea.setRangeText(newLine, end - currentLine.length, end, "end");
        }
      }
    } else {
      // Tab: Add one level of indentation
      if (matchNumberList) {
        handleEventTab(textarea, start);
      } else {
        const newIndentLevel = currentLineIndent + INDENTATION;
        const newLine = getNewLineContentEventTab(
          textarea,
          start,
          currentLine,
          newIndentLevel
        );
        textarea.setRangeText(newLine, start - currentLine.length, end, "end");
      }
    }
    updatePreview();
  }
}

function handlePaste(event) {
  event.preventDefault();
  const clipboardData = event.clipboardData || window.clipboardData;
  const pastedDataHtml = clipboardData.getData("text/html");

  let markdownData = "";
  if (pastedDataHtml) {
    markdownData = convertToMarkdown("text/html", pastedDataHtml);
  } else {
    markdownData = convertToMarkdown(
      "text/plain",
      clipboardData.getData("text/plain")
    );
  }

  const textarea = event.target;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  textarea.setRangeText(markdownData, start, end, "end");

  updatePreview();
}

function convertToMarkdown(type, content) {
  switch (type) {
    case "text/html":
      let turndownService = new TurndownService();
      turndownService.use(turndownPluginGfm.gfm);
      turndownService.addRule("listItem", {
        filter: "li",
        replacement: function (content, node, options) {
          content = content.replace(/^\s+|\s+$/g, "").replace(/\n/gm, "\n    ");
          var prefix = node.parentNode.nodeName === "OL" ? "1. " : "- ";
          var parent = node.parentNode;
          var nested = Array.from(node.children).some(
            (child) => child.nodeName === "UL" || child.nodeName === "OL"
          );
          if (nested) {
            content += "\n";
          }
          return (
            prefix +
            content +
            (node.nextSibling && !/\n$/.test(content) ? "\n" : "")
          );
        },
      });
      return turndownService.turndown(content);
    case "text/plain":
      let lines = content.split("\n");
      let markdown = "";

      lines.forEach((line) => {
        if (line.startsWith("•") || line.startsWith("-")) {
          markdown += `- ${line.slice(1).trim()}\n`;
        } else if (line.match(/^\d+\./)) {
          markdown += `${line.trim()}\n`;
        } else {
          markdown += `${line.trim()}\n`;
        }
      });
      return markdown;
    default:
      return content;
  }
}

function getNewLineContentEventTab(
  textarea,
  start,
  currentLine,
  newIndentLevel
) {
  const endLineBeforeTab = start - currentLine.length - 1;
  const lines = textarea.value.substring(0, endLineBeforeTab).split("\n");
  const lineBefore = lines[lines.length - 1];
  const matchNumberListLineBefore = lineBefore.trimStart().match(/^(\d+)\.\s/);
  if (matchNumberListLineBefore) {
    return `${" ".repeat(newIndentLevel)}${1}. `;
  }
  return currentLine.replace(/^\s*/, " ".repeat(newIndentLevel));
}

function addSyncTax(type) {
  markdownSyntax =
    markdownSyntax === type ? syncTaxList.normal : syncTaxList[type];
}

function handleEventTab(textarea, start, shiftTab = false) {
  const text = textarea.value;
  const mapNumberList = new Map();
  let textArr = text.split("\n");
  mappingNumberList(textArr, mapNumberList);
  if (mapNumberList.size === 0) return;

  let currentLineInMap;
  let currentLineIndexInMap;

  for (let [key, value] of mapNumberList.entries()) {
    if (value.startLine <= start && start <= value.endLine) {
      currentLineIndexInMap = key;
      currentLineInMap = value;
    }
  }

  const mappingNumberListOfCurrentLine = new Map();
  let startIndexNumberListOfCurrentLine = currentLineIndexInMap;
  let endNumberListOfCurrentLine = null;

  while (
    startIndexNumberListOfCurrentLine > 0 &&
    mapNumberList.get(startIndexNumberListOfCurrentLine).index - 1 ===
      mapNumberList.get(startIndexNumberListOfCurrentLine - 1).index
  ) {
    startIndexNumberListOfCurrentLine--;
  }

  endNumberListOfCurrentLine = startIndexNumberListOfCurrentLine;
  mappingNumberListOfCurrentLine.set(endNumberListOfCurrentLine, {
    ...mapNumberList.get(endNumberListOfCurrentLine),
  });
  while (
    endNumberListOfCurrentLine < mapNumberList.size - 1 &&
    mapNumberList.get(endNumberListOfCurrentLine).index + 1 ===
      mapNumberList.get(endNumberListOfCurrentLine + 1).index
  ) {
    endNumberListOfCurrentLine++;
    mappingNumberListOfCurrentLine.set(endNumberListOfCurrentLine, {
      ...mapNumberList.get(endNumberListOfCurrentLine),
    });
  }

  const newMappingNumberList = new Map();
  const mappingNumberOfLatestIndent = new Map();
  let cursorPosition = 0;

  // update with INDENTATION_NUMBER_LIST
  if (!shiftTab) {
    const lineBeforeCurrentLine = mappingNumberListOfCurrentLine.get(
      currentLineIndexInMap - 1
    );
    if (!lineBeforeCurrentLine) return;
    const newIndentLevel =
      currentLineInMap.currentLineIndent + INDENTATION_NUMBER_LIST;

    if (
      currentLineInMap.currentLineIndent ===
      lineBeforeCurrentLine.currentLineIndent + INDENTATION_NUMBER_LIST
    )
      return;
    if (
      mappingNumberListOfCurrentLine.get(currentLineIndexInMap - 1)
        .currentLineIndent === 0 ||
      mappingNumberListOfCurrentLine.get(currentLineIndexInMap - 1)
        .currentLineIndent ===
        mappingNumberListOfCurrentLine.get(currentLineIndexInMap)
          .currentLineIndent
    ) {
      mappingNumberListOfCurrentLine.set(currentLineIndexInMap, {
        ...mappingNumberListOfCurrentLine.get(currentLineIndexInMap),
        currentLineIndent: newIndentLevel,
        number: 1,
      });
    } else {
      let number;
      if (lineBeforeCurrentLine.currentLineIndent === newIndentLevel) {
        number = lineBeforeCurrentLine.number + 1;
      } else {
        let latestNumberOfNewIndent;
        for (let [key, value] of mappingNumberListOfCurrentLine.entries()) {
          if (
            key < currentLineIndexInMap &&
            value.currentLineIndent === newIndentLevel
          ) {
            latestNumberOfNewIndent = value.number;
          }
        }
        number = latestNumberOfNewIndent + 1;
      }
      const endLine =
        mappingNumberListOfCurrentLine.get(currentLineIndexInMap).endLine +
        INDENTATION_NUMBER_LIST;
      mappingNumberListOfCurrentLine.set(currentLineIndexInMap, {
        ...mappingNumberListOfCurrentLine.get(currentLineIndexInMap),
        currentLineIndent: newIndentLevel,
        number: number,
        endLine,
      });
    }

    for (let [key, value] of mappingNumberListOfCurrentLine.entries()) {
      if (currentLineIndexInMap < key) {
        const number = mappingNumberOfLatestIndent.has(
          mappingNumberListOfCurrentLine.get(key).currentLineIndent
        )
          ? mappingNumberOfLatestIndent.get(
              mappingNumberListOfCurrentLine.get(key).currentLineIndent
            ) + 1
          : 1;
        newMappingNumberList.set(key, {
          ...mappingNumberListOfCurrentLine.get(key),
          number: number,
        });
        const currentLineIndent = value.currentLineIndent;
        mappingNumberOfLatestIndent.set(currentLineIndent, number);
      } else {
        newMappingNumberList.set(key, value);
        const currentLineIndent = value.currentLineIndent;
        const number = value.number;
        mappingNumberOfLatestIndent.set(currentLineIndent, number);
      }
    }
    cursorPosition = start + INDENTATION_NUMBER_LIST;
  } else {
    if (currentLineInMap.currentLineIndent === 0) return;
    const newIndentLevel =
      currentLineInMap.currentLineIndent - INDENTATION_NUMBER_LIST;

    const lineBeforeCurrentLine = mappingNumberListOfCurrentLine.get(
      currentLineIndexInMap - 1
    );
    // update number
    let number;
    if (lineBeforeCurrentLine.currentLineIndent === newIndentLevel) {
      number = lineBeforeCurrentLine.number + 1;
    } else {
      let latestNumberOfNewIndent;
      for (let [key, value] of mappingNumberListOfCurrentLine.entries()) {
        if (
          key < currentLineIndexInMap &&
          value.currentLineIndent === newIndentLevel
        ) {
          latestNumberOfNewIndent = value.number;
        }
      }
      number = latestNumberOfNewIndent ? latestNumberOfNewIndent + 1 : 1;
    }
    mappingNumberListOfCurrentLine.set(currentLineIndexInMap, {
      ...mappingNumberListOfCurrentLine.get(currentLineIndexInMap),
      currentLineIndent: newIndentLevel,
      number: number,
    });

    for (let [key, value] of mappingNumberListOfCurrentLine.entries()) {
      if (currentLineIndexInMap < key) {
        let number = mappingNumberOfLatestIndent.has(
          mappingNumberListOfCurrentLine.get(key).currentLineIndent
        )
          ? mappingNumberOfLatestIndent.get(
              mappingNumberListOfCurrentLine.get(key).currentLineIndent
            ) + 1
          : 1;
        if (
          value.currentLineIndent >
          newMappingNumberList.get(key - 1).currentLineIndent
        ) {
          number = 1;
        }
        newMappingNumberList.set(key, {
          ...mappingNumberListOfCurrentLine.get(key),
          number: number,
        });
        const currentLineIndent = value.currentLineIndent;
        mappingNumberOfLatestIndent.set(currentLineIndent, number);
      } else {
        newMappingNumberList.set(key, value);
        const currentLineIndent = value.currentLineIndent;
        const number = value.number;
        mappingNumberOfLatestIndent.set(currentLineIndent, number);
      }
    }
    cursorPosition = start - INDENTATION_NUMBER_LIST;
  }

  for (let [key, value] of newMappingNumberList.entries()) {
    const newLine = `${" ".repeat(value.currentLineIndent)}${value.number}. ${
      value.input
    }`;
    textArr[value.index] = newLine;
  }

  textarea.value = textArr.join("\n");
  textarea.selectionStart = cursorPosition;
  textarea.selectionEnd = cursorPosition;
}

function handleEventEnterWithNumberList(textarea, start) {
  const text = textarea.value;
  const mapNumberList = new Map();
  let textArr = text.split("\n");
  mappingNumberList(textArr, mapNumberList);
  if (mapNumberList.size === 0) return;

  let currentLineInMap;
  let currentLineIndexInMap;

  for (let [key, value] of mapNumberList.entries()) {
    if (value.startLine <= start && start <= value.endLine) {
      currentLineIndexInMap = key;
      currentLineInMap = value;
    }
  }

  const mappingNumberListOfCurrentLine = new Map();
  let startIndexNumberListOfCurrentLine = currentLineIndexInMap;
  let endNumberListOfCurrentLine = null;

  while (
    startIndexNumberListOfCurrentLine > 0 &&
    mapNumberList.get(startIndexNumberListOfCurrentLine).index - 1 ===
      mapNumberList.get(startIndexNumberListOfCurrentLine - 1).index
  ) {
    startIndexNumberListOfCurrentLine--;
  }

  endNumberListOfCurrentLine = startIndexNumberListOfCurrentLine;
  mappingNumberListOfCurrentLine.set(endNumberListOfCurrentLine, {
    ...mapNumberList.get(endNumberListOfCurrentLine),
  });
  while (
    endNumberListOfCurrentLine < mapNumberList.size - 1 &&
    mapNumberList.get(endNumberListOfCurrentLine).index + 1 ===
      mapNumberList.get(endNumberListOfCurrentLine + 1).index
  ) {
    endNumberListOfCurrentLine++;
    mappingNumberListOfCurrentLine.set(endNumberListOfCurrentLine, {
      ...mapNumberList.get(endNumberListOfCurrentLine),
    });
  }

  let newLine;
  let cursorPosition;

  if (currentLineInMap.input === "") {
    if (currentLineInMap.currentLineIndent === 0) {
      newLine = "";
      textArr[currentLineInMap.index] = "";
      textArr.splice(currentLineInMap.index + 1, 0, "");

      cursorPosition = currentLineInMap.startLine + 1;
      textarea.value = textArr.join("\n");
      textarea.selectionStart = cursorPosition;
      textarea.selectionEnd = cursorPosition;
    } else {
      handleEventTab(textarea, start, true);
    }
  } else {
    newLine = `${" ".repeat(currentLineInMap.currentLineIndent)}${
      currentLineInMap.number + 1
    }. `;
    textArr.splice(currentLineInMap.index + 1, 0, newLine);

    cursorPosition = currentLineInMap.endLine + newLine.length + 1;
    textarea.value = textArr.join("\n");
    textarea.selectionStart = cursorPosition;
    textarea.selectionEnd = cursorPosition;
  }
}

function handleEventEnterWithList(textarea, currentLine, start, end) {
  console.log("handleEventEnterWithList");
  const text = textarea.value;
  const mapList = new Map();
  let textArr = text.split("\n");
  mappingList(textArr, mapList);

  if (mapList.size === 0) return;

  let currentLineInMap;
  let currentLineIndexInMap;

  for (let [key, value] of mapList.entries()) {
    if (value.startLine <= start && start <= value.endLine) {
      currentLineIndexInMap = key;
      currentLineInMap = value;
    }
  }

  const mappingListOfCurrentLine = new Map();
  let startIndexListOfCurrentLine = currentLineIndexInMap;
  let endListOfCurrentLine = null;

  while (
    startIndexListOfCurrentLine > 0 &&
    mapList.get(startIndexListOfCurrentLine).index - 1 ===
      mapList.get(startIndexListOfCurrentLine - 1).index
  ) {
    startIndexListOfCurrentLine--;
  }

  endListOfCurrentLine = startIndexListOfCurrentLine;
  mappingListOfCurrentLine.set(endListOfCurrentLine, {
    ...mapList.get(endListOfCurrentLine),
  });
  while (
    endListOfCurrentLine < mapList.size - 1 &&
    mapList.get(endListOfCurrentLine).index + 1 ===
      mapList.get(endListOfCurrentLine + 1).index
  ) {
    endListOfCurrentLine++;
    mappingListOfCurrentLine.set(endListOfCurrentLine, {
      ...mapList.get(endListOfCurrentLine),
    });
  }

  console.log(currentLineInMap);

  let newLine;
  let cursorPosition;

  if (currentLineInMap.input === "") {
    if (currentLineInMap.currentLineIndent === 0) {
      newLine = "";
      textArr[currentLineInMap.index] = "";
      textArr.splice(currentLineInMap.index + 1, 0, "");

      cursorPosition = currentLineInMap.startLine + 1;
      textarea.value = textArr.join("\n");
      textarea.selectionStart = cursorPosition;
      textarea.selectionEnd = cursorPosition;
    } else {
      const newLine = currentLine.slice(INDENTATION_LIST, currentLine.length);
      textarea.setRangeText(newLine, end - currentLine.length, end, "end");
    }
  } else {
    newLine = `${" ".repeat(currentLineInMap.currentLineIndent)}- `;
    textArr.splice(currentLineInMap.index + 1, 0, newLine);

    cursorPosition = currentLineInMap.endLine + newLine.length + 1;
    textarea.value = textArr.join("\n");
    textarea.selectionStart = cursorPosition;
    textarea.selectionEnd = cursorPosition;
  }
}

function mappingNumberList(textArr, map) {
  let index = 0;
  let indexMap = 0;
  let startLine = 0;
  let endLine = -1; // -1 because index start from 0
  while (index < textArr.length) {
    const line = textArr[index];
    const matchNumberList = line.trimStart().match(/^(\d+)\.\s(.*)/);

    startLine = endLine + 1;
    endLine = startLine + line.length;
    if (matchNumberList) {
      const currentLineIndent = line.match(/^(\s*)/)[0].length;
      const number = parseInt(matchNumberList[1], 10);
      const input = matchNumberList[2];
      map.set(indexMap, {
        index,
        startLine,
        endLine,
        currentLineIndent,
        number,
        input,
      });
      indexMap += 1;
    }
    index += 1;
  }
}

function mappingList(textArr, map) {
  let index = 0;
  let indexMap = 0;
  let startLine = 0;
  let endLine = -1; // -1 because index start from 0
  while (index < textArr.length) {
    const line = textArr[index];
    const matchList = line.trimStart().match(/^-\s(.*)/);

    startLine = endLine + 1;
    endLine = startLine + line.length;
    if (matchList) {
      const currentLineIndent = line.match(/^(\s*)/)[0].length;
      const input = matchList[1];
      map.set(indexMap, {
        index,
        startLine,
        endLine,
        currentLineIndent,
        input,
      });
      indexMap += 1;
    }
    index += 1;
  }
}
