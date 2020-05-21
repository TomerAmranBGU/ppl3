import { map } from "ramda";
import { allT, first, second, rest, isEmpty } from "../shared/list";
import { isArray, isString, isNumericString, isIdentifier } from "../shared/type-predicates";
import { Result, makeOk, makeFailure, bind, mapResult, safe2, isOk } from "../shared/result";
// import {EdgeLable, Edge, isNodeDecl,Node, NodeRef, NodeDecl, Dir, isTD, GraphContent, isAtomicGraph, Graph, makeGraph, makeTD, makeCompoundGraph, makeEdge, makeNodeDecl, makeNodeRef, makeEdgeLable } from "./mermaid-ast";
// import { unparseMermaid } from "./mermaid";
import { parseL4, parseL4Exp } from "./L4-ast";
import { parseL3 } from "../L3/L3-ast";
import { makeVarGen } from "../L3/substitute";
import { L4toMermaid, mapL4toMermaid } from "./mermaid";
import { parse as p, isSexpString, isToken } from "../shared/parser";
const util = require('util');

const p1 = L4toMermaid('(L4 (define x 1) (define y (if #t 1 +)) (+ 1 2) #t 3 x y)');
const p2 = L4toMermaid('(/ #t 2)');
const p3 = L4toMermaid(`(define x 1)`);
const p4 = L4toMermaid('(lambda (x y) ((lambda (x) (+ x y)) (+ x x)) 1) ');
const p5 = L4toMermaid('"Hello"');
const p6 = L4toMermaid('(if #t 1 +)');
const p7 = L4toMermaid('(lambda (x y) (+ x y))');
const p8 = L4toMermaid('(L4 1 (lambda (x y) (+ x y)))');
const p9 = L4toMermaid('(let ((x 3) (y 2)) (+ x y))');
const p10 = L4toMermaid('(L4 (let ((x 3) (y 2)) (+ x y) (/ y x)))');
const p11 = L4toMermaid('(L4 1)');
const p12 = parseL4('(L4 1 (+ 1 2))');
const p13 = parseL4(`(L4 '(1 #t (+ 1 2)))`);
const p14 = parseL4(`(L4 '+)`);
const p15 = L4toMermaid(`(L4 '(Buchris (+ 1 2)))`);
const p16 = L4toMermaid(`'1`);
const p17 = L4toMermaid('(L4 (letrec ((x 3) (y 2)) (+ x y) (/ y x)))');
const p18 = L4toMermaid('(L4 (set! x 5))');
const p19 = L4toMermaid('(set! x 5)');






// isOk(p1) ? console.log(p1.value) : console.log(p1.message)
// isOk(p2) ? console.log(p2.value) : console.log(p2.message)
// isOk(p3) ? console.log(p3.value) : console.log(p3.message)
isOk(p4) ? console.log(p4.value) : console.log(p4.message)
// isOk(p5) ? console.log(p5.value) : console.log(p5.message)
// isOk(p6) ? console.log(p6.value) : console.log(p6.message)
// isOk(p7) ? console.log(p7.value) : console.log(p7.message)
// isOk(p8) ? console.log(p8.value) : console.log(p8.message)
// isOk(p9) ? console.log(p9.value) : console.log(p9.message)
// isOk(p10) ? console.log(p10.value) : console.log(p10.message)
// isOk(p11) ? console.log(p11.value) : console.log(p11.message)
// isOk(p12)? console.log(util.inspect(p12.value)): console.log(p12.message)
// isOk(p13)? console.log(util.inspect(p13.value,true,null)): console.log(p13.message)
// isOk(p14)? console.log(util.inspect(p14.value,true,null)): console.log(p14.message)
// isOk(p15)? console.log(p15.value): console.log(p15.message)
// isOk(p16)? console.log(p16.value): console.log(p16.message)
// isOk(p17)? console.log(p17.value): console.log(p17.message)
isOk(p18)? console.log(p18.value): console.log(p18.message)
isOk(p19)? console.log(p19.value): console.log(p19.message)









//****UNPARSE MERMAID TEST****//
// const x =unparseMermaid(makeGraph(makeTD(),makeCompoundGraph(
//     [makeEdge(makeNodeDecl("NODE_1","x"),makeNodeDecl("NODE_2","y")),
//     makeEdge(makeNodeRef("NODE_1"),makeNodeDecl("NODE_3","z"), makeEdgeLable("x->z"))
// ])));
// bind(x, (y) => makeOk(console.log(y)))