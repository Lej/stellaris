/*
script -> assignment*
assignment -> identifier operator value | identifier = { assignment* }
operator -> = | >
variable -> string | number | identifier
string -> ".*"
number -> [0-9](.[0-9]+)?
identifier -> .* (Och är inte string eller number)


http://pegjs.org/online


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