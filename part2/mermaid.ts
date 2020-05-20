import { map, flatten, concat } from "ramda";
import { allT, first, second, rest, isEmpty } from "../shared/list";
import { isArray, isString, isNumericString, isIdentifier } from "../shared/type-predicates";
import { parse as p, isSexpString, isToken } from "../shared/parser";
import { Result, makeOk, makeFailure, bind, mapResult, safe2, isOk } from "../shared/result";
import {EdgeLable, Edge, isNodeDecl,Node, NodeRef, NodeDecl, Dir, isTD, GraphContent, isAtomicGraph, Graph, makeGraph, makeTD, makeCompoundGraph, makeEdge, makeNodeDecl, makeNodeRef, makeEdgeLable, makeAtomicGraph } from "./mermaid-ast";
import {makeVarGen} from "../L3/substitute"
import { Program,AtomicExp,Parsed, parseL4, parseL4Exp, isAtomicExp, isNumExp, isBoolExp, isStrExp, isPrimOp, isVarRef, isProgram, Exp, isDefineExp, DefineExp, isCExp, VarDecl, AppExp, CExp, isAppExp, isIfExp, isProcExp, isLetExp, isLitExp, isLetrecExp, isSetExp } from "./L4-ast";
import { isVarDecl } from "../L3/L3-ast";

// interface Rands {tags: "Rands" ; }
interface Exps {tag: "Exps" ; exps:Exp[]}
const isExps = (x:any): x is Exps => (x.tag === "Exps")
const makeExps = (exps: Exp[]): Exps => ({tag:"Exps", exps:exps})
interface Rator {tag : "Rator"; exp:CExp}
const isRator = (x:any): x is Rator => (x.tag === "Rator")
const makeRator = (exp: CExp): Rator => ({tag:"Rator", exp:exp})
interface Rands {tag : "Rands"; cexps:CExp[]}
const isRands = (x:any): x is Rands => (x.tag === "Rator")
const makeRands = (cexps: CExp[]): Rands => ({tag:"Rands", cexps:cexps})

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
    ; ExpsCounter: (s:string)=>string
    ; SetExpCounter: (s:string)=>string
    ; RatorCounter: (s:string)=>string
    ; RandsCounter: (s:string)=>string

                                           }
const makeGlobalCounter = (): GlobalCounter => 
    ({tag:"GlobalCounter",
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
    ExpsCounter : makeVarGen(),
    SetExpCounter : makeVarGen(),
    RatorCounter : makeVarGen(),
    RandsCounter : makeVarGen()
})
//AtomicGraph code
const AtomicExpToNodeDecl = (exp: AtomicExp, GC : GlobalCounter):NodeDecl => 
        (isNumExp(exp)) ? makeNodeDecl(GC.NumExpCounter(exp.tag),`${exp.tag}(${exp.val})`):
        (isBoolExp(exp)) ? makeNodeDecl(GC.BoolExpCounter(exp.tag),`${exp.tag}(${exp.val})`):
        (isStrExp(exp)) ? makeNodeDecl(GC.StrExpCounter(exp.tag),`${exp.tag}(${exp.val})`):
        isPrimOp(exp) ? makeNodeDecl(GC.PrimOpCounter(exp.tag),`${exp.tag}(${exp.op})`):
        //last one is VarRef
        makeNodeDecl(GC.VarRefCounter(exp.tag),`${exp.tag}(${exp.var})`)

// CompoundGraphCode
const doProgram = (program: Program, GC : GlobalCounter): Edge[] =>
            innerNode(makeExps(program.exps),makeNodeDecl(GC.ProgramCounter('Program'),`Program`),'exps',GC) 

const doExps = (exps: Exps, my_id: string , parentNode: Node , lable:string,GC : GlobalCounter): Edge[] =>
         [makeEdge(parentNode,makeNodeDecl(my_id,`[:]`),makeEdgeLable(lable))]
         .concat(flatten(exps.exps.map((x:Exp)=>innerNode(x,makeNodeRef(my_id),'',GC))))

const doDefineExp = (def: DefineExp, my_id: string , parentNode: Node ,lable: string ,isRoot: Boolean,GC : GlobalCounter): Edge[] =>
        concat(
            (isRoot) ? [] : 
            (lable === '') ? [makeEdge(parentNode,makeNodeDecl(my_id,`DefineExp`))] :
            [makeEdge(parentNode,makeNodeDecl(my_id,`DefineExp`),makeEdgeLable(lable))],
            innerNode(def.var,(isRoot)?makeNodeDecl(my_id,'DefineExp'):makeNodeRef(my_id),'var',GC))
            .concat(innerNode(def.val,makeNodeRef(my_id),'val',GC))
const doVarDecl = (varDecl: VarDecl , parentNode: Node ,lable: string,GC : GlobalCounter): Edge[] =>
            [makeEdge(parentNode,makeNodeDecl(GC.VarDeclCounter('VarDecl'),`VarDecl(${varDecl.var})`),makeEdgeLable(lable))]
const doAppExp = (app: AppExp, my_id: string , parentNode: Node ,lable: string ,isRoot: Boolean,GC : GlobalCounter): Edge[]=>
        concat(
            (isRoot) ? [] : 
            (lable === '') ? [makeEdge(parentNode,makeNodeDecl(my_id,`AppExp`))] :
            [makeEdge(parentNode,makeNodeDecl(my_id,`AppExp`),makeEdgeLable(lable))],
            innerNode(app.rator,(isRoot) ? makeNodeDecl(my_id,'AppExp'):makeNodeRef(my_id),'rator',GC)).
            concat(innerNode(makeRands(app.rands),(isRoot) ? makeNodeDecl(my_id,'AppExp'):makeNodeRef(my_id),'rands',GC))
const doRands = (rands: Rands, my_id : string, parentNode: Node, lable: string, GC : GlobalCounter): Edge[]=>
            [makeEdge(parentNode,makeNodeDecl(my_id,`[:]`),makeEdgeLable(lable))]
            .concat(flatten(rands.cexps.map((cexp:CExp)=> innerNode(cexp,makeNodeRef(my_id),'',GC))))
const doAtomicExp = (exp: AtomicExp, parentNode: Node ,lable: string ,GC : GlobalCounter): Edge[]=>
            (lable === '') ? [makeEdge(parentNode,AtomicExpToNodeDecl(exp,GC))]:
            [makeEdge(parentNode,AtomicExpToNodeDecl(exp,GC),makeEdgeLable(lable))]

const innerNode = (exp: Exp| Exps | VarDecl | Rands, parentNode: Node , lable: string , GC : GlobalCounter): Edge[] =>
            isExps(exp) ? doExps(exp,GC.ExpsCounter('Exps'),parentNode,lable,GC):
            isRands(exp) ? doRands(exp,GC.RandsCounter('Rands'),parentNode,lable,GC):
            isAppExp(exp) ? doAppExp(exp,GC.AppExpCounter('AppExp'),parentNode,lable,false,GC):
            isDefineExp(exp) ? doDefineExp(exp,GC.DefineExpCounter('DefineExp'),parentNode,lable,false,GC):
            isVarDecl(exp) ? doVarDecl(exp ,parentNode,lable,GC):
            isAtomicExp(exp) ? doAtomicExp(exp, parentNode,lable,GC):
            []

const rootNode = (exp: Parsed, GC : GlobalCounter): GraphContent => 
            isProgram(exp) ? makeCompoundGraph(doProgram(exp,GC)):
            isDefineExp(exp)? makeCompoundGraph(doDefineExp(exp, GC.DefineExpCounter(`Program`),makeNodeRef('dummi'),'',true,GC)):
            isAtomicExp(exp) ? makeAtomicGraph(AtomicExpToNodeDecl(exp,GC)):
            isAppExp(exp)? makeCompoundGraph(doAppExp(exp,GC.AppExpCounter('AppExp'),makeNodeRef('dummi'),'',true,GC)):
            makeAtomicGraph(makeNodeDecl('EVERYTHING IS WROG!!!','EVERYTHING IS WROG!!!'))
            // isIfExp(exp)? :
            // isProcExp(exp)? :
            // isLetExp(exp)? :
            // isLitExp(exp)? :
            // isLetrecExp(exp)? :
            // isSetExp(exp)? :

export const mapL4toMermaid = (exp: Parsed): Result<Graph> =>  
        makeOk(makeGraph(makeTD(),rootNode(exp,makeGlobalCounter())))
                            



//parsing AST of mermaid to string
const unparseEdgeLable = (exp: EdgeLable): string => `${exp.id}`
const unparseEdge = (exp: Edge) => 
    (exp.lable == undefined) ? `${unparseNode(exp.parent)}-->${unparseNode(exp.child)}`:
    `${unparseNode(exp.parent)}-->|${unparseEdgeLable(exp.lable)}|${unparseNode(exp.child)}`
const unparseNode = (exp: Node):  string =>
    isNodeDecl(exp) ? unparseNodeDecl(exp):
    unparseNodeRef(exp)
const unparseNodeRef = (exp : NodeRef): string => `${exp.id}`
const unparseNodeDecl = (exp: NodeDecl): string => 
    `${exp.id}["${exp.lable}"]`
const unparseDir = (exp: Dir):string =>
    isTD(exp) ? `TD`: 'LS'
const unparseGraphContent = (content: GraphContent): string  =>
    isAtomicGraph(content) ? unparseNodeDecl(content.nodeDecl):
    map(unparseEdge,content.edges).join(`\n`)

export const unparseMermaid = (exp: Graph): Result<string> => 
    makeOk(`graph ${unparseDir(exp.dir)}\n${unparseGraphContent(exp.content)}`)




export const L4toMermaid = (concrete: string): Result<string> => 
        bind(bind(ExpOrProgram(concrete),mapL4toMermaid),unparseMermaid)

const ExpOrProgram = (concrete: string) : Result<Parsed> => isOk(parseL4(concrete)) ? parseL4(concrete) : bind(p(concrete), parseL4Exp)





