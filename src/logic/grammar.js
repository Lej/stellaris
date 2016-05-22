/* http://pegjs.org/online



{
// [ { key: "key1.key2", value: "value" } ]
// -> { key1: { key2: value } }
function assignments(kvps) {
  let result = {};
  for (let kvp of kvps) {
    let keys = kvp.key.split(".");
    let current = result;
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = kvp.value;
  }
  return result;
}
}

script = caw v:assignment* caw { return assignments(v) }

assignment = k:var caw equals caw v:(assignmentList / assignedValue) caw { return { key: k, value: v } }

assignmentList = (open caw v:assignment+ caw close) { return assignments(v) }

assignedValue = v:(single / list) caw { return v }

list = open caw v:single+ caw close { return v }
single = v:(var / number) caw { return v }

var = $(varName (dot varName)* / at varName / quotes varName quotes / varName)
varName = $([a-zA-Z_][a-zA-Z0-9_]*)

number = $([-]?([0] / [1-9][0-9]*)([\\.][0-9]+)?)

caw "Comments and Whitespace" = (c / mws)*
c "Comment" = $([#]+[^\n]*)
ws "Whitespace" = [ \t\n]*
mws "Mandatory Whitespace" = [ \t\n]+
    
equals = '='
open = '{'
close = '}'
at = '@'
quotes = '"'
dot = '.'










script = ws? s:(comment / macroAssignment / assignment / s:anything)*
	{ return { rule: "script" , value: s } }
comment = c:$([#]+[^\n]*) ws?
	{ return { rule: "comment", value: c } }
macroAssignment = i:macroIdentifier ws? equals ws? n:number ws?
	{ return { rule: "macroAssignment(" + i.rule + ", " + n.rule + ")", value: { macroIdentifier: i.value, value: n.value } } }
assignment = i:identifier ws? equals ws? v:assignedValue ws?
	{ return { rule: "assignment", value: { identifier: i.value, value: v } } }

assignedValue = (open ws? v:assignment+ ws? close) { return { rules: "assignedValue", value: v } }
    / v:identifier { return { rules: "assignedValue", value: v } }


macroIdentifier = i:$(at identifier) ws?
	{ return { rule: "macroIdentifier", value: i } }
//macroList = open macroIdentifier+ close ws?
stringIdentifier = i:$(quotes identifier quotes) ws?
	{ return { rule: "stringIdentifier", value: i } }
//stringList = open stringList+ close ws?
identifier = i:$([a-zA-Z0-9_]+)
	{ return { rule: "identifier", value: i } }

number = n:$(([0] / [1-9][0-9]*)([\\.][0-9]+)?)
	{ return { rule: "number(" + n.rule + ")", value: n } }

ws = [ \t\n]+
	{ return { rule: "ws", value: undefined } }
    
equals = '='
open = '{'
close = '}'
at = '@'
quotes = '"'
    
anything = a:$.+
	{ return { rule: "anything", value: a } }







script -> assignment*
assignment -> identifier operator value | identifier = { assignment* }
operator -> = | >
variable -> string | number | identifier
string -> ".*"
number -> [0-9](.[0-9]+)?
identifier -> .* (Och är inte string eller number)





script = s:(macro / ws / s:anything)*
	{ return { rule: "s" , value: s } }
macro = at i:identifier ws equals ws n:number ws
	{ return { rule: "m(" + i.rule + ", " + n.rule + ")", value: { macro: i.value, value: n.value } } }
at = '@'
identifier = i:$([a-zA-Z0-9]+)
	{ return { rule: "i", value: i } }
anything = .+
equals = '='
number = n:(n1 / n2 / n3 / n4)
	{ return { rule: "n(" + n.rule + ")", value: n.value } }
n1 = n:$([1-9][0-9]*[\\.][0-9]+)
	{ return { rule: "n1", value: n } }
n2 = n:$([0][\\.][0-9]+)
	{ return { rule: "n2", value: n } }
n3 = n:$([1-9][0-9]*)
	{ return { rule: "n3", value: n } }
n4 = n:$([0])
	{ return { rule: "n4", value: n } }
ws = [ \t\n]+
	{ return { rule: "ws", value: null } }

















*/