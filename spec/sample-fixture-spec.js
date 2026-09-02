const path = require("path");

describe("AutoHotkey sample fixture", () => {
  beforeEach(async () => {
    await lumine.packages.activatePackage("language-ahkpp");
  });

  it("parses and highlights representative AutoHotkey syntax", async () => {
    const editor = await lumine.workspace.open(path.join(__dirname, "fixtures", "sample.ahk"));
    await editor.languageMode.ready;

    const scopesAt = (needle, offset = 0) => {
      const index = editor.getText().indexOf(needle);
      expect(index).not.toBe(-1);
      const position = editor.getBuffer().positionForCharacterIndex(index + offset);
      return editor.scopeDescriptorForBufferPosition(position).getScopesArray();
    };

    expect(editor.getGrammar().scopeName).toBe("source.ahk");
    expect(scopesAt("#Requires", 1)).toContain("keyword.control.directive.ahk");
    expect(scopesAt("Greet(name")).toContain("entity.name.function.ahk");
    expect(scopesAt("; Hotkeys")).toContain("comment.line.semicolon.ahk");
    expect(scopesAt("Rectangle extends")).toContain("entity.name.type.class.ahk");
  });
});
