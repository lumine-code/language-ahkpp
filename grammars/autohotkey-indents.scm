; Unterminated strings can expose braces and parentheses as ERROR children.
(ERROR ["\"" "'"] @match.next
  (#set! indent.match startPosition))

[
  "{"
  "("
  "["
] @indent

[
  "}"
  ")"
  "]"
] @dedent

; Reindent code without rewriting whitespace that belongs to multiline text.
([(multiline_string_literal) (block_comment)] @preserve
  (#is? indent.reindent true)
  (#is-not? indent.matchesCurrentRow startPosition)
  (#set! indent.force true))
