describe("ahkpp conservative indentation", () => {
  let editor;
  beforeEach(async () => {
    editor = null;
    jasmine.useRealClock();
    await lumine.packages.activatePackage("language-ahkpp");
  });
  afterEach(() => editor?.destroy());
  async function start(file, text) {
    if (!editor || !editor.getPath()?.endsWith(file)) {
      editor?.destroy();
      editor = await lumine.workspace.open(file);
    }
    editor.update({ autoIndent: true, tabLength: 2, softTabs: true });
    editor.setText(text);
    expect(await editor.whenGrammarSettled()).toBe(true);
  }
  describe("ahk", () => {
    it("indents Enter inside a block", async () => {
      await start("indentation.ahk", "Test() {\n}");
      editor.setCursorBufferPosition([0, Infinity]);
      await editor.insertNewline();
      expect(editor.lineTextForBufferRow(1)).toBe("  ");
    });
    it("dedents a typed closing brace", async () => {
      await start("indentation.ahk", 'Test() {\n  Run("hi")\n  ');
      editor.setCursorBufferPosition([2, Infinity]);
      await editor.insertText("}", { autoIndent: true, autoDecreaseIndent: true });
      await editor.whenGrammarSettled();
      expect(editor.lineTextForBufferRow(2)).toBe("}");
    });
    it("reindents a body and its closing delimiter once", async () => {
      await start("indentation.ahk", 'Test() {\nRun("hi")\n}');
      await editor.autoIndentBufferRows(0, 2);
      expect(editor.getText()).toBe('Test() {\n  Run("hi")\n}');
    });
    it("does not add indent after a complete one-line block or delimiters in a comment", async () => {
      for (const text of ['Test() { Run("hi") }', "; { [ ("]) {
        await start("indentation.ahk", text);
        editor.moveToEndOfLine();
        await editor.insertNewline();
        expect(editor.lineTextForBufferRow(1)).toBe("");
      }
    });
    it("preserves multiline comment interiors during reindent", async () => {
      const source = "/* first\n      { [ (\n  last */";
      await start("indentation.ahk", source);
      await editor.autoIndentBufferRows(0, editor.getLastBufferRow());
      expect(editor.getText()).toBe(source);
    });
  });

  it("keeps quoted recovery punctuation from indenting the next row", async () => {
    for (const source of [
      'value := "{',
      'value := "(',
      'value := "[',
      "value := '{",
      'value := "a`"{',
    ]) {
      await start("recovery.ahk", source);
      editor.setCursorBufferPosition([0, Infinity]);
      await editor.insertNewline();
      expect(editor.lineTextForBufferRow(1)).withContext(source).toBe("");
    }
  });

  it("retains the current margin while entering recovered literal text", async () => {
    await start("recovery.ahk", 'Test() {\n  value := "{');
    editor.setCursorBufferPosition([1, Infinity]);
    await editor.insertNewline();
    expect(editor.lineTextForBufferRow(2)).toBe("  ");
  });

  it("retains indentation for real incomplete containers and interpolation", async () => {
    for (const source of ["Test() {", "value := [", 'Call("done", [']) {
      await start("recovery.ahk", source);
      editor.setCursorBufferPosition([0, Infinity]);
      await editor.insertNewline();
      expect(editor.indentationForBufferRow(1)).withContext(source).toBe(1);
    }
  });
});
