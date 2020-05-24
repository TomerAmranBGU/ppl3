import {bind} from "../shared/result";
// import {evalNormalParse, evalNormalProgram} from '../L3/L3-normal';
import {evalNormalProgram, evalNormalParse} from '../part3/L4-normal';
import {parseL3} from "../L3/L3-ast";
import { parseL4 } from "./L4-ast";

const pretty = (obj: any): void => console.log(JSON.parse(JSON.stringify(obj, undefined, 2)));

// const e1 = evalNormalParse("(+)");
// const e2 = evalNormalParse("(-)");
// const p1 = bind(parseL4(`(L4 (define x (+)) x)`), evalNormalProgram);
const p2 = bind(parseL4(`(L4 (define x (-)) x)`), evalNormalProgram);
// const p3 = bind(parseL4(`(L4 (define x (-)) 1)`), evalNormalProgram);
// const p4 = bind(parseL4(`(L4 (define x 1)(if #t x (/ x 0)))`), evalNormalProgram);

// pretty(e1);
// pretty(p1);
// pretty(e2);
pretty(p2);
// pretty(p3);
pretty(p4);
