describe("AutoHotkey upstream parser regressions", () => {
  let editor;

  beforeEach(async () => {
    await lumine.packages.activatePackage("language-ahkpp");
    editor = await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName("source.ahk"));
  });

  afterEach(() => editor?.destroy());

  it("keeps every scoped declaration in its own declarator", async () => {
    editor.setText("global first := 1, second := 2, third\n");
    expect(await editor.whenGrammarSettled()).toBe(true);
    const root = editor.getSyntaxNodeAtBufferPosition([0, 0], (node) => !node.parent);
    expect(root.hasError).toBe(false);
    expect(
      root
        .descendantsOfType("variable_declarator")
        .map((node) => node.childForFieldName("name").text),
    ).toEqual(["first", "second", "third"]);
  });
});
