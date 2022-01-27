export type StringIndexable = { [key: string]: any }
export type NumberIndexable = { [index: number]: any }
export type Constructor<T> = new (...args: any[]) => T;

export type SubType<Base, Condition> = Pick<
    Base,
    {
        [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
    }[keyof Base]
>;

export type MethodsOfObject<T> = keyof SubType<T, Function>;
