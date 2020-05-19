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
export const makeTD = () => ({tag:"TD"});
export const makeLR = () => ({tag:"LR"});
export const makeGraph = (dir: Dir , content: GraphContent): Graph => ({tag:"Graph" , dir:dir , content:content});
export const makeAtomicGraph = (): => ({});
export const makeCompundGraph = (): => ({});
export const makeEdge = (): => ({});
export const makeNodeDecl = (): => ({});
export const makeNodeRef = (): => ({});
export const makeEdgeLable = (): => ({});

export const isGraph = (o : any) => o.tag == "Graph";