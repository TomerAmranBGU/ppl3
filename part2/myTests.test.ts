import { map } from "ramda";
import { allT, first, second, rest, isEmpty } from "../shared/list";
import { isArray, isString, isNumericString, isIdentifier } from "../shared/type-predicates";
import { Result, makeOk, makeFailure, bind, mapResult, safe2, isOk } from "../shared/result";
// import {EdgeLable, Edge, isNodeDecl,Node, NodeRef, NodeDecl, Dir, isTD, GraphContent, isAtomicGraph, Graph, makeGraph, makeTD, makeCompoundGraph, makeEdge, makeNodeDecl, makeNodeRef, makeEdgeLable } from "./mermaid-ast";
// import { unparseMermaid } from "./mermaid";
import { parseL4 } from "./L4-ast";
import { parseL3 } from "../L3/L3-ast";
import { makeVarGen } from "../L3/substitute";
const util = require('util');
const counter  =makeVarGen();
console.log(util.inspect(counter("hello")));
console.log(util.inspect(counter("hello")));
console.log(util.inspect(counter("hello")));

console.log('kaki baleben!!!!')
const y = parseL4(`(L4 ((lambda (x) (* x x)) (+ 5 4)) (if (> y 6) 8 (for i 1 3 (* i i))))`)
isOk(y) ? console.log(util.inspect(y.value)):
console.log('f')


//****UNPARSE MERMAID TEST****//
// const x =unparseMermaid(makeGraph(makeTD(),makeCompoundGraph(
//     [makeEdge(makeNodeDecl("NODE_1","x"),makeNodeDecl("NODE_2","y")),
//     makeEdge(makeNodeRef("NODE_1"),makeNodeDecl("NODE_3","z"), makeEdgeLable("x->z"))
// ])));
// bind(x, (y) => makeOk(console.log(y)))