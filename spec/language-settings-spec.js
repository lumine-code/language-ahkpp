describe("ahkpp editing settings", () => {
  let editor, pairingWasActive, snippetsWereActive;
  beforeAll(() => {
    pairingWasActive = lumine.packages.isPackageActive("bracket-matcher");
    snippetsWereActive = lumine.packages.isPackageActive("snippets");
  });
  afterAll(async () => {
    if (!pairingWasActive) await lumine.packages.deactivatePackage("bracket-matcher");
    if (!snippetsWereActive) await lumine.packages.deactivatePackage("snippets");
  });
  beforeEach(async () => {
    jasmine.useRealClock();
    editor = null;
    await lumine.packages.activatePackage("language-ahkpp");
    await lumine.packages.activatePackage("bracket-matcher");
  });
  afterEach(() => editor?.destroy());
  async function start(scope, text = "value") {
    editor ??= await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName(scope));
    editor.setText(text);
    expect(await editor.whenGrammarSettled()).toBe(true);
    editor.update({ autoIndent: false });
  }
  for (const [scope, line] of [["source.ahk", ";"]]) {
    it("exposes safe line comment metadata in " + scope, async () => {
      await start(scope);
      expect(await editor.getCommentDelimitersForBufferPosition([0, 0])).toEqual({
        line,
        block: undefined,
      });
      await editor.toggleLineCommentsForBufferRows(0, 0);
      expect(editor.getText()).toBe(line + " value");
      await editor.toggleLineCommentsForBufferRows(0, 0);
      expect(editor.getText()).toBe("value");
    });
    it("does not offer line-bound block markers to inline snippets in " + scope, async () => {
      const snippets = (await lumine.packages.activatePackage("snippets")).mainModule;
      await start(scope, "value := 1");
      editor.setCursorBufferPosition([0, Infinity]);
      await snippets.expandSnippet(editor, " ${BLOCK_COMMENT_START}note${BLOCK_COMMENT_END}");
      expect(editor.getText()).toBe("value := 1 note");

      await start(scope, "value := 1");
      editor.setCursorBufferPosition([0, Infinity]);
      await snippets.expandSnippet(editor, " ${LINE_COMMENT} note");
      expect(editor.getText()).toBe("value := 1 ; note");
      expect(await editor.whenGrammarSettled()).toBe(true);
      expect(editor.scopeDescriptorForBufferPosition([0, 14]).getScopesArray()).toContain(
        "comment.line.semicolon.ahk",
      );
    });
  }
  it("pairs valid punctuation without duplicating unsupported quote or escape characters", async () => {
    for (const [scope, character, expected] of [
      ["source.ahk", "`", "`"],
      ["source.ahk", '"', '""'],
      ["source.ahk", "'", "''"],
    ]) {
      await start(scope, "");
      await editor.insertText(character, { autoIndent: false, autoDecreaseIndent: false });
      await editor.whenGrammarSettled();
      expect(editor.getText())
        .withContext(scope + " " + character)
        .toBe(expected);
    }
  });
});
