describe("language-ahkpp", () => {
  beforeEach(async () => {
    await atom.packages.activatePackage("language-ahkpp");
  });

  it("loads the AutoHotkey v1 grammar", () => {
    const grammar = atom.grammars.grammarForScopeName("source.ahk1");
    expect(grammar).toBeTruthy();
    expect(grammar.name).toBe("AutoHotkey v1");
  });

  it("loads the AutoHotkey v2 grammar", () => {
    const grammar = atom.grammars.grammarForScopeName("source.ahk2");
    expect(grammar).toBeTruthy();
    expect(grammar.name).toBe("AutoHotKey v2");
  });

  it("selects the v1 grammar for plain .ahk files", () => {
    const grammar = atom.grammars.selectGrammar("script.ahk", "MsgBox, Hello\n");
    expect(grammar.scopeName).toBe("source.ahk1");
  });

  it("selects the v2 grammar when #Requires AutoHotkey v2 is present", () => {
    const grammar = atom.grammars.selectGrammar("script.ahk", "#Requires AutoHotkey v2.0\n");
    expect(grammar.scopeName).toBe("source.ahk2");
  });

  it("tokenizes a v1 comment line", () => {
    const grammar = atom.grammars.grammarForScopeName("source.ahk1");
    const { tokens } = grammar.tokenizeLine("; a comment");
    const scopes = tokens.flatMap((token) => token.scopes);
    expect(scopes.some((scope) => scope.includes("comment"))).toBe(true);
  });

  it("tokenizes a v2 comment line", () => {
    const grammar = atom.grammars.grammarForScopeName("source.ahk2");
    const { tokens } = grammar.tokenizeLine("; a comment");
    const scopes = tokens.flatMap((token) => token.scopes);
    expect(scopes.some((scope) => scope.includes("comment"))).toBe(true);
  });
});
