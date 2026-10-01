([
  (line_comment)
  (block_comment)
] @injection.owner @injection.content
  (#set! injection.language "hyperlink")
  (#set! injection.language-scope "none")
  (#set! injection.include-children))

((string_literal) @injection.owner @injection.content
  (#set! injection.language "hyperlink")
  (#set! injection.language-scope "none"))

((multiline_string_literal (multiline_string_line_sequence (multiline_string_line) @injection.content)) @injection.owner
  (#set! injection.language "hyperlink")
  (#set! injection.language-scope "none")
  (#set! injection.newlines-between))
([
  (line_comment)
  (block_comment)
] @injection.owner @injection.content
  (#set! injection.language "todo")
  (#set! injection.language-scope "none")
  (#set! injection.include-children))
