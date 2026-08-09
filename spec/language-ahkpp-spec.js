describe("language-ahkpp", () => {
  beforeEach(async () => {
    await lumine.packages.activatePackage("language-ahkpp");
  });

  it("loads the AutoHotkey v1 grammar", () => {
    const grammar = lumine.grammars.grammarForScopeName("source.ahk1");
    expect(grammar).toBeTruthy();
    expect(grammar.name).toBe("AutoHotkey v1");
  });

  it("loads the AutoHotkey v2 grammar", () => {
    const grammar = lumine.grammars.grammarForScopeName("source.ahk2");
    expect(grammar).toBeTruthy();
    expect(grammar.name).toBe("AutoHotKey v2");
  });

  it("selects the v1 grammar for plain .ahk files", () => {
    const grammar = lumine.grammars.selectGrammar("script.ahk", "MsgBox, Hello\n");
    expect(grammar.scopeName).toBe("source.ahk1");
  });

  it("selects the v2 grammar when #Requires AutoHotkey v2 is present", () => {
    const grammar = lumine.grammars.selectGrammar("script.ahk", "#Requires AutoHotkey v2.0\n");
    expect(grammar.scopeName).toBe("source.ahk2");
  });

  it("tokenizes a v1 comment line", () => {
    const grammar = lumine.grammars.grammarForScopeName("source.ahk1");
    const { tokens } = grammar.tokenizeLine("; a comment");
    const scopes = tokens.flatMap((token) => token.scopes);
    expect(scopes.some((scope) => scope.includes("comment"))).toBe(true);
  });

  it("tokenizes a v2 comment line", () => {
    const grammar = lumine.grammars.grammarForScopeName("source.ahk2");
    const { tokens } = grammar.tokenizeLine("; a comment");
    const scopes = tokens.flatMap((token) => token.scopes);
    expect(scopes.some((scope) => scope.includes("comment"))).toBe(true);
  });

  // The per-grammar settings live in the `language` namespace; under the
  // legacy `editor` one nothing reads them.
  describe("scoped settings", () => {
    it("indents the body of a block", async () => {
      const editor = await lumine.workspace.open("script.ahk");
      expect(editor.getGrammar().scopeName).toBe("source.ahk1");

      editor.setText("if (x) {\nMsgBox, Hello\n}");
      editor.autoIndentBufferRows(0, editor.getLineCount() - 1);
      expect(editor.lineTextForBufferRow(1)).toBe("  MsgBox, Hello");
      expect(editor.lineTextForBufferRow(2)).toBe("}");
    });

    it("comments a line with a semicolon", async () => {
      const editor = await lumine.workspace.open("script.ahk");
      editor.setText("MsgBox, Hello");
      editor.toggleLineCommentsForBufferRows(0, 0);
      expect(editor.lineTextForBufferRow(0)).toBe("; MsgBox, Hello");
    });
  });
});
