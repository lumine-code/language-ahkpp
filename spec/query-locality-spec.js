const fs = require("fs");
const path = require("path");
const { Point } = require("lumine");

describe("AutoHotkey highlight query locality", () => {
  let editor;

  beforeEach(async () => {
    await lumine.packages.activatePackage("language-ahkpp");
    editor = await lumine.workspace.open("parameters.ahk");
  });

  afterEach(() => editor?.destroy());

  async function setUp(text) {
    editor.setText(text);
    await editor.languageMode.ready;
    await editor.languageMode.atTransactionEnd();
  }

  function capturesForRows(startRow, endRow) {
    const layer = editor.languageMode.rootLanguageLayer;
    return layer.queries.highlightsQuery.captures(layer.tree.rootNode, {
      startPosition: new Point(startRow, 0),
      endPosition: new Point(endRow, 0),
    });
  }

  it("preserves direct, default, optional, variadic, and empty parameter lists", async () => {
    await setUp("generated(first, second := 2, third?, rest*) {\n}\nempty() {\n}");

    for (const name of ["first", "second", "third", "rest"]) {
      const column = editor.lineTextForBufferRow(0).indexOf(name);
      expect(editor.scopeDescriptorForBufferPosition([0, column]).getScopesArray()).toContain(
        "variable.parameter.ahk",
      );
    }
    for (const [row, name] of [
      [0, "generated"],
      [2, "empty"],
    ]) {
      const column = editor.lineTextForBufferRow(row).indexOf(name);
      expect(editor.scopeDescriptorForBufferPosition([row, column]).getScopesArray()).not.toContain(
        "variable.parameter.ahk",
      );
    }
  });

  it("keeps direct parameters local inside a 6000-row sequence", async () => {
    const lines = ["generated("];
    for (let index = 0; index < 6000; index++) {
      lines.push(`  parameter_${index}${index < 5999 ? "," : ""}`);
    }
    lines.push(") {", "}");
    await setUp(lines.join("\r\n"));

    expect(editor.languageMode.rootLanguageLayer.tree.rootNode.hasError).toBe(false);
    const captures = capturesForRows(3000, 3006);
    expect(captures.length).toBeLessThanOrEqual(32);
    const parameters = captures.filter((capture) => capture.name === "variable.parameter.ahk");
    expect(parameters.length).toBe(6);
    expect(
      parameters.every(
        (capture) =>
          capture.node.startPosition.row >= 3000 && capture.node.startPosition.row < 3006,
      ),
    ).toBe(true);

    const query = fs.readFileSync(
      path.join(__dirname, "..", "grammars", "autohotkey-highlights.scm"),
      "utf8",
    );
    expect(query).not.toContain("(param_sequence (identifier)");
    expect(query).toContain("(#is? test.childOfType param_sequence)");
  });
});
