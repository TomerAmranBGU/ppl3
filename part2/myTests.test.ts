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
const p4 = L4toMermaid('+');
const p5 = L4toMermaid('"Hello"');
const p6 = L4toMermaid('(if #t 1 +)');
const p7 = L4toMermaid('(lambda (x y) (+ x y))');
const p8 = L4toMermaid('(L4 1 (lambda (x y) (+ x y)))');


// isOk(p1) ? console.log(p1.value) : console.log(p1.message)
// isOk(p2) ? console.log(p2.value) : console.log(p2.message)
// isOk(p3) ? console.log(p3.value) : console.log(p3.message)
// isOk(p4) ? console.log(p4.value) : console.log(p4.message)
// isOk(p5) ? console.log(p5.value) : console.log(p5.message)
// isOk(p6) ? console.log(p6.value) : console.log(p6.message)
// isOk(p7) ? console.log(p7.value) : console.log(p7.message)
isOk(p8) ? console.log(p8.value) : console.log(p8.message)




//****UNPARSE MERMAID TEST****//
// const x =unparseMermaid(makeGraph(makeTD(),makeCompoundGraph(
//     [makeEdge(makeNodeDecl("NODE_1","x"),makeNodeDecl("NODE_2","y")),
//     makeEdge(makeNodeRef("NODE_1"),makeNodeDecl("NODE_3","z"), makeEdgeLable("x->z"))
// ])));
// bind(x, (y) => makeOk(console.log(y)))