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

  it("keeps directive comments inside array and object literals", async () => {
    editor.setText(
      "values := [\n  ;@region Values\n  1, rest* ;@endregion\n]\n" +
        "point := {\n  ;@region Point\n  x: 1, ;@endregion\n}\n",
    );
    expect(await editor.whenGrammarSettled()).toBe(true);
    const root = editor.getSyntaxNodeAtBufferPosition([0, 0], (node) => !node.parent);
    expect(root.hasError).toBe(false);
    expect(root.descendantsOfType("directive_comment").length).toBe(4);
    expect(root.descendantsOfType("array_expansion_operation")[0].text).toBe("rest*");
    expect(root.descendantsOfType("object_literal_member")[0].text).toBe("x: 1");
  });
});
