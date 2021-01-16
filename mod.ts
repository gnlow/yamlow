type ValueOf<T> = T[keyof T]

type FsType = Record<string, (...args: any[]) => any> // Fs is operators list

type OperatorNames<Fs> = keyof Fs

type OperatorOutput<Fs extends FsType, N extends OperatorNames<Fs>> = ReturnType<Fs[N]>

type OperatorInfos<Fs extends FsType> = { 
    [K in keyof Fs]: {
        output: OperatorOutput<Fs, K>,
        name: K,
    }
}

type OperatorNamesByOutputType<Fs extends FsType, O> = Extract<
    ValueOf<OperatorInfos<Fs>>, 
    { output: O }
> ["name"]

type OperatorInputFromFunc<Fs extends FsType, F extends (...args: any) => any> = 
    F extends () => any ? undefined :
    F extends (input: infer I) => any ? I | Operator<Fs, I> :
    {
        [K in Exclude<keyof Parameters<F>, keyof any[]>]: Parameters<F>[K] | Operator<Fs, Parameters<F>[K]>
    }

type OperatorInputFromName<Fs extends FsType, N extends OperatorNames<Fs>> = OperatorInputFromFunc<Fs, Fs[N]>

export type Operator<Fs extends FsType, O> = {
    /* 
        Single-key object type
        https://stackoverflow.com/a/57576688
        ```
        type OneKey<K extends string, V = any> = {
        [P in K]: (Record<P, V> &
            Partial<Record<Exclude<K, P>, never>>) extends infer O
            ? { [Q in keyof O]: O[Q] }
            : never
        }[K]
        ```
    */
    [P in OperatorNamesByOutputType<Fs, O>]: ({ [A in P]: OperatorInputFromName<Fs, P> } &
        Partial<{ [B in Exclude<OperatorNamesByOutputType<Fs, O>, P>]: never }>) extends infer O
        ? { [Q in keyof O]: O[Q] }
        : never
}[OperatorNamesByOutputType<Fs, O>]