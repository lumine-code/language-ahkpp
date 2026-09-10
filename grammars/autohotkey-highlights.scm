; Adapted from holy-tao/tree-sitter-autohotkey at
; 26334c7e8b4dab2b421140964c0e9949a67df2cd (Unlicense).

[
  (directive_name)
  (include_ignore_failure)
  (directive_comment)
] @keyword.control.directive.ahk

[
  (file_or_dir_name)
  (lib_name)
  (requirement)
  (version_requirement)
  (warning_type)
  (warning_mode)
  (single_instance_mode)
  (bitness)
] @string.unquoted.ahk

(directive_comment arguments: (directive_arguments) @string.unquoted.ahk)

(import_directive module: (identifier) @entity.name.type.module.ahk)
(import_directive alias: (identifier) @entity.name.type.module.ahk)
(import_directive (export_name export: (identifier) @entity.name.type.module.ahk))
(import_directive (export_name alias: (identifier) @entity.name.type.module.ahk))
(module_directive name: (identifier) @entity.name.type.module.ahk)

[
  (if)
  (else)
  (while)
  (for)
  (loop)
  (until)
  (return)
  (break)
  (continue)
  (goto)
  (try)
  (catch)
  (finally)
  (throw)
  (switch)
  (case)
  (default)
  (class)
  (extends)
  (get)
  (set)
  (as)
  (is)
  (in)
  (unset)
  (export)
  (struct)
  (global)
  (scope_identifier)
] @keyword.control.ahk

(label name: (identifier) @entity.name.function.label.ahk)
(goto_statement label: (identifier) @entity.name.function.label.ahk)

(class_declaration name: (identifier) @entity.name.type.class.ahk)
(class_declaration superclass: (identifier) @entity.other.inherited-class.ahk)
(class_declaration superclass: (member_access member: (identifier) @entity.other.inherited-class.ahk))
(struct_declaration name: (identifier) @entity.name.type.struct.ahk)
(struct_declaration superclass: (identifier) @entity.other.inherited-class.ahk)

((identifier) @storage.type.primitive.ahk
  (#any-of? @storage.type.primitive.ahk
    "Int8" "Int16" "Int32" "Int64" "UInt8" "UInt16" "UInt32" "IntPtr" "Float32" "Float64"))

((identifier) @variable.parameter.ahk
  (#is? test.childOfType param_sequence))
(default_param name: (identifier) @variable.parameter.ahk)
(optional_param name: (identifier) @variable.parameter.ahk)
(variadic_param name: (identifier) @variable.parameter.ahk)

(property_declaration name: (identifier) @variable.other.property.ahk)
(typed_property_declaration name: (identifier) @variable.other.property.ahk)
(member_access member: (identifier) @variable.other.property.ahk)

(function_declaration name: (identifier) @entity.name.function.ahk)
(function_expression name: (identifier) @entity.name.function.ahk)
(method_declaration name: (identifier) @entity.name.function.ahk)
(getter) @entity.name.function.ahk
(setter) @entity.name.function.ahk

(function_call function: (identifier) @support.function.ahk)
(call_statement function: (identifier) @support.function.ahk)
(function_call function: (member_access member: (identifier) @support.function.ahk))

((identifier) @variable.language.ahk
  (#match? @variable.language.ahk "^[Aa]_"))
((identifier) @variable.language.ahk
  (#eq? @variable.language.ahk "this"))

[
  (integer_literal)
  (float_literal)
  (hex_literal)
] @constant.numeric.ahk

(boolean_literal) @constant.language.boolean.ahk

[
  (string_literal)
  (multiline_string_literal)
] @string.quoted.double.ahk

[
  (continuation_join)
  (continuation_ltrim)
  (continuation_ltrim_off)
  (continuation_rtrim_off)
  (continuation_allow_comments)
  (continuation_no_escape)
] @keyword.other.continuation.ahk

(hotkey_trigger) @constant.other.hotkey.ahk
(hotstring_trigger) @constant.other.hotstring.ahk
(hotstring_replacement) @string.unquoted.ahk

(line_comment) @comment.line.semicolon.ahk
((line_comment) @punctuation.definition.comment.ahk
  (#set! adjust.startAndEndAroundFirstMatchOf "^;"))

(block_comment) @comment.block.ahk
((block_comment) @punctuation.definition.comment.begin.ahk
  (#set! adjust.startAndEndAroundFirstMatchOf "^/\\*"))
((block_comment) @punctuation.definition.comment.end.ahk
  (#set! adjust.startAndEndAroundFirstMatchOf "\\*/$"))
