describe("language-ahkpp", () => {
  beforeEach(async () => {
    await lumine.packages.activatePackage("language-ahkpp");
  });

  it("loads a single AutoHotkey grammar", () => {
    const grammar = lumine.grammars.grammarForScopeName("source.ahk");

    expect(grammar).toBeTruthy();
    expect(grammar.name).toBe("AutoHotkey");
    expect(grammar.type).toBe("tree-sitter");
    expect(lumine.grammars.grammarForScopeName("source.ahk1")).toBeFalsy();
    expect(lumine.grammars.grammarForScopeName("source.ahk2")).toBeFalsy();
  });

  it("selects AutoHotkey for every .ahk file", () => {
    const withoutRequires = lumine.grammars.selectGrammar("legacy.ahk", "MsgBox, Hello\n");
    const withRequires = lumine.grammars.selectGrammar("script.ahk", "#Requires AutoHotkey v2.0\n");

    expect(withoutRequires.scopeName).toBe("source.ahk");
    expect(withRequires.scopeName).toBe("source.ahk");
  });

  describe("scoped settings", () => {
    it("indents the body of a block", async () => {
      const editor = await lumine.workspace.open("script.ahk");
      expect(editor.getGrammar().scopeName).toBe("source.ahk");

      editor.setText('if (x) {\nMsgBox "Hello"\n}');
      await editor.languageMode.ready;
      editor.autoIndentBufferRows(0, editor.getLineCount() - 1);
      expect(editor.lineTextForBufferRow(1)).toBe('  MsgBox "Hello"');
      expect(editor.lineTextForBufferRow(2)).toBe("}");
    });

    it("comments a line with a semicolon", async () => {
      const editor = await lumine.workspace.open("script.ahk");
      editor.setText('MsgBox "Hello"');
      await editor.languageMode.ready;
      editor.toggleLineCommentsForBufferRows(0, 0);
      expect(editor.lineTextForBufferRow(0)).toBe('; MsgBox "Hello"');
    });
  });
});
