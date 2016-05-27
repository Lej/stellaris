/* http://pegjs.org/online

{
// [ { key: "key1.key2", oper: ">", value: "value" } ]
// -> { key1: { oper: "=", value: { key2: { oper: ">", value: "value" } } } }
function assignments(asses) {
  let result = {};
  for (let ass of asses) {
    let keys = ass.key.split(".");
    let current = result;
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { oper: "=", value: { } };
      current = current[keys[i]].value;
    }
    current[keys[keys.length - 1]] = { oper: ass.oper, value: ass.value } ;
  }
  return result;
}
}

script = caw v:assignment* caw { return assignments(v) }

assignment = k:var caw o:oper caw v:(assignmentList / assignedValue) caw { return { key: k, oper: o, value: v } }

assignmentList = (open caw v:assignment* caw close) { return assignments(v) }

assignedValue = v:(single / list) caw { return v }

list = open caw v:single+ caw close { return v }
single = v:(var / number) caw { return v }

var = $(varName (dot varName)* / at varName / quotes varName quotes / varName)
varName = $([a-zA-Z_][a-zA-Z0-9_]*)

number = $([-]?([0] / [1-9][0-9]*)([\\.][0-9]+)?)

oper = equals / greater / less

caw "Comments and Whitespace" = (c / mws)*
c "Comment" = $([#]+[^\n]*)
ws "Whitespace" = [ \t\n]*
mws "Mandatory Whitespace" = [ \t\n]+
    
equals = '='
greater = '>'
less = '<'
open = '{'
close = '}'
at = '@'
quotes = '"'
dot = '.'

*/