import { map } from "ramda";
import { allT, first, second, rest, isEmpty } from "../shared/list";
import { isArray, isString, isNumericString, isIdentifier } from "../shared/type-predicates";
import { parse as p, isSexpString, isToken } from "../shared/parser";
import { Result, makeOk, makeFailure, bind, mapResult, safe2 } from "../shared/result";
import {EdgeLable, Edge, isNodeDecl,Node, NodeRef, NodeDecl, Dir, isTD, GraphContent, isAtomicGraph, Graph, makeGraph, makeTD, makeCompoundGraph, makeEdge, makeNodeDecl, makeNodeRef, makeEdgeLable } from "./mermaid-ast";
import {makeVarGen} from "../L3/substitute"
import { Parsed } from "./L4-ast";

interface GlobalCounter {tag:"GlobalCounter" 
                        ; ProgramCounter: (s:string)=>string
                        ; DefineExpCounter: (s:string)=>string
                        ; NumExpCounter: (s:string)=>string
                        ; BoolExpCounter: (s:string)=>string
                        ; StrExpCounter: (s:string)=>string
                        ; PrimOpCounter: (s:string)=>string
                        ; VarRefCounter: (s:string)=>string
                        ; VarDeclCounter: (s:string)=>string
                        ; AppExpCounter: (s:string)=>string
                        ; IfExpCounter: (s:string)=>string
                        ; ProcExpCounter: (s:string)=>string
                        ; BindingCounter: (s:string)=>string
                        ; LetExpCounter: (s:string)=>string
                        ; LitExpCounter: (s:string)=>string
                        ; LetrecExpCounter: (s:string)=>string
                        ; SetExpCounter: (s:string)=>string
                                           }
const makeGlobalCounter = (): GlobalCounter => ({tag:"GlobalCounter",
                                                ProgramCounter : makeVarGen(),
                                                DefineExpCounter : makeVarGen(),
                                                NumExpCounter : makeVarGen(),
                                                BoolExpCounter : makeVarGen(),
                                                StrExpCounter : makeVarGen(),
                                                PrimOpCounter : makeVarGen(),
                                                VarRefCounter : makeVarGen(),
                                                VarDeclCounter : makeVarGen(),
                                                AppExpCounter : makeVarGen(),
                                                IfExpCounter : makeVarGen(),
                                                ProcExpCounter : makeVarGen(),
                                                BindingCounter : makeVarGen(),
                                                LetExpCounter : makeVarGen(),
                                                LitExpCounter : makeVarGen(),
                                                LetrecExpCounter : makeVarGen(),
                                                SetExpCounter : makeVarGen()})



export const mapL4toMermaid = (exp: Parsed): Result<Graph> => 
                            






















//parsing AST of mermaid to string
const unparseEdgeLable= (exp: EdgeLable): string => `${exp.id}`
const unparseEdge = (exp: Edge) => 
    (exp.lable == undefined) ? `${unparseNode(exp.parent)}-->${unparseNode(exp.child)}`:
    `${unparseNode(exp.parent)}-->|${unparseEdgeLable(exp.lable)}|${unparseNode(exp.child)}`
const unparseNode = (exp: Node):  string =>
    isNodeDecl(exp) ? unparseNodeDecl(exp):
    unparseNodeRef(exp)
const unparseNodeRef = (exp : NodeRef): string => `${exp.id}`
const unparseNodeDecl = (exp: NodeDecl): string => 
    `${exp.id}[${exp.lable}]`
const unparseDir = (exp: Dir):string =>
    isTD(exp) ? `TD`: 'LS'
const unparseGraphContent = (content: GraphContent): string  =>
    isAtomicGraph(content) ? unparseNodeDecl(content.nodeDecl):
    map(unparseEdge,content.edges).join(`\n`)

export const unparseMermaid = (exp: Graph): Result<string> => 
    makeOk(`graph ${unparseDir(exp.dir)}\n${unparseGraphContent(exp.content)}`)










    //****TEST****//
const x =unparseMermaid(makeGraph(makeTD(),makeCompoundGraph(
    [makeEdge(makeNodeDecl("NODE_1","x"),makeNodeDecl("NODE_2","y")),
    makeEdge(makeNodeRef("NODE_1"),makeNodeDecl("NODE_3","z"), makeEdgeLable("x->z"))
])));
bind(x, (y) => makeOk(console.log(y)))