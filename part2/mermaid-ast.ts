import { map } from "ramda";
import { allT, first, second, rest, isEmpty } from "../shared/list";
import { isArray, isString, isNumericString, isIdentifier } from "../shared/type-predicates";
import { parse as p, isSexpString, isToken } from "../shared/parser";
import { Result, makeOk, makeFailure, bind, mapResult, safe2 } from "../shared/result";


/*      MERMAID      */
// <graph> ::= <header> <graphContent> // Graph(dir: Dir, content: GraphContent)
// <header> ::= graph (TD|LR)<newline> // Direction can be TD or LR
// <graphContent> ::= <atomicGraph> | <compoundGraph>
// <atomicGraph> ::= <nodeDecl>
// <compoundGraph> ::= <edge>+
// <edge> ::= <node> --><edgeLabel>? <node><newline> // <edgeLabel> is optional
// // Edge(from: Node, to: Node, label?: string)
// <node> ::= <nodeDecl> | <nodeRef>
// <nodeDecl> ::= <identifier>["<string>"] // NodeDecl(id: string, label: string)
// <nodeRef> ::= <identifier> // NodeRef(id: string)
// <edgeLabel> ::= |<identifier>| // string

// A value returned by parse
export type GraphContent = AtomicGraph | CompoundGraph;
export type Node = NodeDecl | NodeRef;
export type Dir = TD | LR;

export interface TD{tag:"TD"}
export interface LR{tag:"LR"}
export interface Graph {tag:"Graph"; dir: Dir ; content: GraphContent}
export interface AtomicGraph{tag: "AtomicGraph" ;nodeDecl: NodeDecl};
export interface CompoundGraph{tag:"CompoundGraph", edges: Edge[]}
export interface Edge{tag:"Edge"; parent: Node ;  child: Node; lable?: EdgeLable}
export interface NodeDecl{tag:"NodeDecl"; id: string; lable: string}
export interface NodeRef{tag:"NodeRef"; id:string}
export interface EdgeLable{tag:"EdgeLable"; id:string}

// Type value constructors for disjoint types
export const makeTD = (): TD => ({tag:"TD"});
export const makeLR = (): LR => ({tag:"LR"});
export const makeGraph = (dir: Dir , content: GraphContent): Graph => ({tag:"Graph" , dir:dir , content:content});
export const makeAtomicGraph = (nodeDecl: NodeDecl): AtomicGraph => ({tag:"AtomicGraph", nodeDecl: nodeDecl});
export const makeCompoundGraph = (edges: Edge[]): CompoundGraph => ({tag:"CompoundGraph",edges:edges});
export const makeEdge = (parent: Node, child: Node, lable?: EdgeLable): Edge => ({tag:"Edge", parent:parent, child:child, lable:lable});
export const makeNodeDecl = (id: string, lable: string): NodeDecl => ({tag:"NodeDecl", id: id, lable: lable});
export const makeNodeRef = (id:string): NodeRef => ({tag:"NodeRef", id:id});
export const makeEdgeLable = (id:string): EdgeLable=> ({tag:"EdgeLable", id:id});

// Type predicates for disjoint types
export const isGraph = (x: any): x is Graph => x.tag == "Graph";
export const isTD = (x: any): x is TD => x.tag == "TD";
export const isLR = (x: any): x is LR => x.tag == "LR";
export const isAtomicGraph = (x: any): x is AtomicGraph => x.tag == "AtomicGraph";
export const isCompoundGraph = (x: any): x is CompoundGraph => x.tag == "CompundGraph";
export const isNodeDecl = (x: any): x is NodeDecl => x.tag == "NodeDecl";
export const isNodeRef = (x: any): x is NodeRef => x.tag == "NodeRef";
export const isEdge = (x: any): x is Edge => x.tag == "Edge";
export const isEdgeLable = (x: any): x is EdgeLable => x.tag == "EdgeLable";

// Type predicates for type unions
export const isGraphContent = (x: any): x is GraphContent => isAtomicGraph(x) || isCompoundGraph(x);
export const isNode = (x: any): x is Node => isNodeDecl(x) || isNodeRef(x);
export const isDir = (x: any): x is Dir => isTD(x) || isLR(x);

