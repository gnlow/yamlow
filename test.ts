import type { Operator } from "./mod.ts"

const operatorFuncs = {
    "==": (a: any, b: any) => a == b,
    ">=": (a: number, b: number) => a >= b,
    "<=": (a: number, b: number) => a <= b,
    "square": (a: number) => a ** 2
}

type Fs = typeof operatorFuncs

const a: Operator<Fs, any> = { // No error
    "==": [0, 1]
}

const b: Operator<Fs, any> = { // Error occur (An operator should have only one key.)
    "==": [0, 1],
    "<=": [1, 2],
}

const c: Operator<Fs, any> = { // Error occur ("==" operator needs 2 parameters.)
    "==": [0]
}

const d: Operator<Fs, any> = { // No error
    square: 2
}

const e: Operator<Fs, any> = { // No error
    "==": [
        {square: {square: 2}},
        16
    ]
}