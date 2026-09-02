const SCOPE = "source.ahk";

exports.consumeHyperlinkInjection = (hyperlink) => {
  hyperlink.addInjectionPoint(SCOPE, {
    types: ["line_comment", "block_comment", "string_literal", "multiline_string_literal"],
  });
};

exports.consumeTodoInjection = (todo) => {
  todo.addInjectionPoint(SCOPE, { types: ["line_comment", "block_comment"] });
};
