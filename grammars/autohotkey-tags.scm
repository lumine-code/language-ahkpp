(class_declaration
  name: (identifier) @name) @definition.class

(struct_declaration
  name: (identifier) @name) @definition.struct

(function_declaration
  name: (identifier) @name) @definition.function

(method_declaration
  name: (identifier) @name) @definition.method

(function_call
  function: (identifier) @name) @reference.call

(call_statement
  function: (identifier) @name) @reference.call

(function_call
  function: (member_access
    member: (identifier) @name)) @reference.call
