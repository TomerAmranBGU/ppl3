import {bind, Result, isOk} from "../shared/result";
// import {evalNormalParse, evalNormalProgram} from '../L3/L3-normal';
import {evalNormalProgram, evalNormalParse} from './L4-normal';
import {parseL3} from "../L3/L3-ast";
import { parseL4 } from "./L4-ast";
const util = require('util');

const pretty = (obj: Result<any>): void => isOk(obj) ? console.log(util.inspect(obj, true, null)): console.log(obj.message);

// const e1 = evalNormalParse("(+)");
// const e2 = evalNormalParse("(-)");
// const p1 = bind(parseL4(`(L4 (define x (+)) x)`), evalNormalProgram);
const p2 = bind(parseL4(`(L4 (define x (-)) x (define f (lambda (x) (+ x x))) (f 1))`), evalNormalProgram);
// const p3 = bind(parseL4(`(L4 (define x (-)) 1)`), evalNormalProgram);
// const p4 = bind(parseL4(`(L4 (define x 1)(if #t x (/ x 0)))`), evalNormalProgram);
// const p5 = bind(parseL4("(L4 3)"), evalNormalProgram);
const p6 = bind(parseL4(
    `(L4 (define map
          (lambda (f l)
            (if (eq? l '())
                l
                (cons (f (car l)) (map f (cdr l))))))
        (map (lambda (x) (* x x)) '(1 2 3)))`
  ), evalNormalProgram);
//x = promies((- x 1), env)
// pretty(e1);
// pretty(p1);
// pretty(e2);
// pretty(p2);
// pretty(p3);
// pretty(p4);
// pretty(p5);
pretty(p6);

