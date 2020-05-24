// ========================================================
// L4 normal eval
import { Sexp } from "s-expression";
import { map } from "ramda";
import { CExp, Exp, IfExp, Program, parseL4Exp, VarDecl } from "./L4-ast";
import { isAppExp, isBoolExp, isCExp, isDefineExp, isIfExp, isLitExp, isNumExp,
         isPrimOp, isProcExp, isStrExp, isVarRef } from "./L4-ast";
import { applyEnv, makeEmptyEnv, Env, makeExtEnv } from './L4-env-normal';
import { isTrueValue } from "./L4-eval";
import { applyPrimitive } from "./evalPrimitive";
import { isClosure, makeClosure, Value, makePromise, isPromise, Promise } from "./L4-value";
import { first, rest, isEmpty } from '../shared/list';
import { Result, makeOk, makeFailure, bind, mapResult } from "../shared/result";
import { parse as p } from "../shared/parser";


export const L4normalEval = (exp: CExp, env: Env): Result<Value> =>
    isBoolExp(exp) ? makeOk(exp.val) :
    isNumExp(exp) ? makeOk(exp.val) :
    isStrExp(exp) ? makeOk(exp.val) :
    isPrimOp(exp) ? makeOk(exp) :
    isLitExp(exp) ? makeOk(exp.val) :
    isVarRef(exp) ? applyEnv(env, exp.var) :
    isIfExp(exp) ? evalIf(exp, env) :
    isProcExp(exp) ? makeOk(makeClosure(exp.args, exp.body, env)) :
    // This is the difference between applicative-eval and normal-eval
    // Substitute the arguments into the body without evaluating them first.
    isAppExp(exp) ? bind(bind(L4normalEval(exp.rator, env),evalPromise), proc => L4normalApplyProc(proc, exp.rands, env)) :
    makeFailure(`Bad ast: ${exp}`);

const evalIf = (exp: IfExp, env: Env): Result<Value> =>
    bind(bind(L4normalEval(exp.test, env),evalPromise),
         test => isTrueValue(test) ? L4normalEval(exp.then, env) : L4normalEval(exp.alt, env));

// Purpose: Apply a procedure to NON evaluated arguments.
// Signature: L4-normalApplyProcedure(proc, args)
// Pre-conditions: proc must be a prim-op or a closure value
const L4normalApplyProc = (proc: Value, args: CExp[], env: Env): Result<Value> => {
    if (isPrimOp(proc)) {
        const argVals: Result<Value[]> = mapResult((arg) => bind(L4normalEval(arg, env),evalPromise), args); // in case of return Promise, take out the Value
        return bind(argVals, (args: Value[]) => applyPrimitive(proc, args));
    } else if (isClosure(proc)) {
        const vars = map((v: VarDecl)=> v.var , proc.params)
        return evalExps(proc.body, makeExtEnv(vars,map((exp:CExp)=> makePromise(exp,env), args),env))
    }
    else {
        return makeFailure(`Bad proc applied ${proc}`);
    }
};

// Evaluate a sequence of expressions (in a program)
export const evalExps = (exps: Exp[], env: Env): Result<Value> =>
    isEmpty(exps) ? makeFailure("Empty program") :
    isDefineExp(first(exps)) ? evalDefineExps(first(exps), rest(exps), env) :
    evalCExps(first(exps), rest(exps), env);

const evalCExps = (exp1: Exp, exps: Exp[], env: Env): Result<Value> =>
    isCExp(exp1) && isEmpty(exps) ? L4normalEval(exp1, env) :
    isCExp(exp1) ? bind(L4normalEval(exp1, env), _ => evalExps(exps, env)) :
    makeFailure("Never");

// Eval a sequence of expressions when the first exp is a Define.
// Compute the rhs of the define, extend the env with the new binding
// then compute the rest of the exps in the new env.
const evalDefineExps = (def: Exp, exps: Exp[], env: Env): Result<Value> =>
    isDefineExp(def) ?    
        evalExps(exps, makeExtEnv([def.var.var], [makePromise(def.val, env)], env)):   
    makeFailure("Unexpected " + def);

export const evalNormalProgram = (program: Program): Result<Value> =>
    evalExps(program.exps, makeEmptyEnv());

export const evalNormalParse = (s: string): Result<Value> =>
    bind(p(s),
         (parsed: Sexp) => bind(parseL4Exp(parsed),
                                (exp: Exp) => evalExps([exp], makeEmptyEnv())));

export const evalPromise = (value: Value):  Result<Value> =>
    isPromise(value) ? 
        bind(L4normalEval(value.val, value.env),evalPromise):
    makeOk(value)

