// import { Stack } from '../datastructures/stack';
// import { StringIndexable } from '../types/utility-types';
// import { isPrimitive } from '../functions/is-primitive';

// export type HistoryPreserved<T> = T & History<T> & StringIndexable & object

// const excludedKeys = ['history', 'undo'];

// interface History<T> {
//     history?: ObjectHistory<T>;
//     undo?: () => void;
// }

// interface Operation<T> {
//     id?: number;
//     type: 'get' | 'set' | 'creation';
//     property?: string;
//     oldValue?: T;
//     currentValue?: T;
// }

// export class ObjectHistory<T> {
//     private _operations: Stack<Operation<T>>;

//     constructor(initialValue: T) {
//     	this._operations = new Stack<Operation<T>>();

//     	this.add({
//     		type: 'creation',
//     		property: undefined,
//     		oldValue: undefined,
//     		currentValue: initialValue,
//     	});
//     }

//     get operations() {
//     	return [...this._operations.arrayFromTail()];
//     }

//     log() {
//     	console.table([...this._operations.arrayFromTail()]);
//     }

//     add(op: Operation<T>): number {
//     	const newId = this._operations.size();

//     	this._operations.push({
//     		id: newId,
//     		...op,
//     	});

//     	return newId;
//     }

//     pop() {
//     	return this._operations.pop();
//     }
// }

// const historyHandler = {
// 	get: function(target: any, prop: string, receiver: any) {
// 		const result = Reflect.get(target, prop, receiver);

// 		if (excludedKeys.includes(prop)) {
// 			return result;
// 		}


// 		return result;
// 	},

// 	set: function(target: any, key: string, value: any, receiver: any) {
// 		const currentValue = Reflect.get(target, key, receiver);

// 		const result = Reflect.set(target, key, value, receiver);

// 		if (excludedKeys.includes(key)) {
// 			return result;
// 		}

// 		const op: Operation<typeof target> = {
// 			type: 'set',
// 			property: key,
// 			oldValue: currentValue,
// 			currentValue: value,
// 		};

// 		target.history.add(op);

// 		return result;
// 	},
// };

// export const historyProxy = <T extends object>(obj: T): HistoryPreserved<T> => {
// 	const cast = obj as any;

// 	cast.history = new ObjectHistory(obj);

// 	cast.undo = function() {
// 		const prevOp = this.history!.pop();

// 		if (!prevOp) {
// 			throw new Error('Object history is empty, nothing to undo;');
// 		}

// 		if (isPrimitive(prevOp?.currentValue)) {
// 			this[prevOp.property] = prevOp.currentValue;
// 		}

// 		else {
// 			const oldEntries = prevOp.oldValue;

// 			for (const [key, value] of oldEntries) {
// 				this[key] = value;
// 			}
// 		}
// 	};

// 	const proxied = new Proxy(cast, historyHandler) as HistoryPreserved<T>;


// 	return proxied;
// };
