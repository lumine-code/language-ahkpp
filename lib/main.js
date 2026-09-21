const SCOPE = "source.ahk";

exports.consumeHyperlinkInjection = (hyperlink) => {
  return hyperlink.addInjectionPoint(SCOPE, {
    types: ["line_comment", "block_comment", "string_literal", "multiline_string_literal"],
  });
};

exports.consumeTodoInjection = (todo) => {
  return todo.addInjectionPoint(SCOPE, { types: ["line_comment", "block_comment"] });
};
