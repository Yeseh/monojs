import { LinkedList } from './linked-list';
import { defaultEquals } from '@yeseh/ts-utils';
import type { EqualsFunction } from '@yeseh/ts-utils';

class Queue<T> {
    protected list: LinkedList<T>

    constructor(vals: T[] = [], compareFn: EqualsFunction<T> = defaultEquals) {
    	this.list = new LinkedList(vals, compareFn);
    }

    size(): number {
    	return this.list.size();
    }

    isEmpty(): boolean {
    	return this.list.isEmpty();
    }

    clear(): void {
    	this.list.clear();
    }

    enqueue(val: T): void {
    	this.list.addLast(val);
    }

    dequeue(): T {
    	return this.list.removeFirst();
    }

    peekFirst(): T {
    	return this.list.peekFirst();
    }

    peekLast(): T {
    	return this.list.peekLast();
    }

    contains(val: T): boolean {
    	return this.list.contains(val);
    }

    [Symbol.iterator](): Iterator<T> {
    	return this.list[Symbol.iterator]();
    }
}

export { Queue };
