import { LinkedListNode as Node } from './node';
import { defaultEquals } from '@yeseh/ts-utils';
import type { EqualsFunction } from '@yeseh/ts-utils';

interface List<T> {
    head: Node<T>;
    tail: Node<T>;
    size: number;
}

export class LinkedList<T> implements Iterable<T> {
    private list: List<T> | undefined;
    private compareFn: EqualsFunction<T>

    constructor(vals: T[] = [], compareFn: EqualsFunction<T> = defaultEquals) {
    	if (Array.isArray(vals) && vals.length > 0) {
    		this.fromArray(vals);
    	};

    	this.compareFn = compareFn;
    }

    size(): number {
    	if (this.list) {
    		return this.list.size;
    	}

    	return 0;
    }

    isEmpty(): boolean {
    	return !this.list || this.size() === 0;
    }

    addFirst(val: T): void {
    	const node = new Node(val, this.list?.head);

    	if (!this.isEmpty()) {
            this.list!.head.prev = node;

            this.list!.head = node;

            this.list!.size++;
    	}

    	else {
    		this.list = {
    			head: node,
    			tail: node,
    			size: 1,
    		};
    	}
    }

    addLast(val: T): void {
    	const node = new Node(val, null, this.list?.tail);

    	if (!this.isEmpty()) {
            this.list!.tail.next = node;

            this.list!.tail = node;

            this.list!.size++;
    	}
    	else {
    		this.list = {
    			head: node,
    			tail: node,
    			size: 1,
    		};
    	}
    }

    addAt(i: number, val: T): void {
    	if (i === 0) {
    		this.addFirst(val);
    		return;
    	}

    	else if (i === this.size()) {
    		this.addLast(val);
    		return;
    	}

    	else if (i < 0 || i >= this.size() || !this.list) {
    		throw new Error('Index out of bounds');
    	}

    	const mid = (this.size() -1) / 2;

    	const cur = i > mid
    		? this.findFromTail(i)
    		: this.findFromHead(i);

    	const newNode = new Node(val);

        cur.next!.prev = newNode;
        newNode.next = cur.next;

        newNode.prev = cur;
        cur.next = newNode;

        this.list.size++;
    }

    peekFirst(): T {
    	if (this.isEmpty()) {
    		throw new Error('List is empty');
    	}

    	return this.list!.head.data;
    }

    peekLast(): T {
    	if (this.isEmpty()) {
    		throw new Error('List is empty');
    	}

    	return this.list!.tail.data;
    }

    get(i: number): T {
    	if (i < 0 || i >= this.size() || !this.list) {
    		throw new Error('Index out of bounds');
    	}

    	const mid = (this.size() -1) / 2;

    	const node = i > mid
    		? this.findFromTail(i)
    		: this.findFromHead(i);

    	return node.data;
    }

    private findFromHead(i: number): Node<T> {
    	let cur = this.list!.head;

    	for (let j = 0; j < i; j++) {
    		cur = cur.next!;
    	}

    	return cur;
    }

    private findFromTail(i: number): Node<T> {
    	const steps = this.list!.size - i;

    	let cur = this.list!.tail;
    	let j = 0;

    	while (j < steps) {
    		cur = cur.prev!;
    		j++;
    	}

    	return cur;
    }

    indexOf(val: T): number {
    	if (this.isEmpty()) {
    		return -1;
    	}

    	let cur = this.list!.head;
    	let i = 0;

    	while (!this.compareFn(val, cur.data)) {
    		cur = cur.next!;
    		i++;
    	}

    	return i;
    }

    contains(val: T) {
    	const index = this.indexOf(val);

    	return index !== -1;
    }

    removeFirst(): T {
    	if (this.isEmpty()) {
    		throw new Error('List is empty');
    	}

    	const val = this.list!.head.data;

    	if (this.list!.head.next) {
            this.list!.head.next.prev = null;
            this.list!.head = this.list!.head.next;

            this.list!.size--;
    	}
    	else {
    		this.list = undefined;
    	}

    	return val;
    }

    removeLast(): T {
    	if (this.isEmpty()) {
    		throw new Error('List is empty');
    	}

    	const val = this.list!.tail.data;

    	if (this.list!.tail.prev) {
            this.list!.tail.prev.next = null;
            this.list!.tail = this.list!.tail.prev;

            this.list!.size--;
    	}
    	else {
    		this.list = undefined;
    	}

    	return val;
    }

    remove(val: T): T {
    	const index = this.indexOf(val);

    	if (index === - 1) {
    		throw new Error('Value does not exist');
    	};

    	return this.removeAt(index);
    }

    removeAt(i: number): T {
    	if (i === 0) {
    		return this.removeFirst();
    	}

    	if (i === this.size() - 1) {
    		return this.removeLast();
    	}

    	if (i < 0 || i >= this.size() || !this.list) {
    		throw new Error('Index out of bounds');
    	}

    	const mid = (this.size() -1) / 2;

    	const node = i > mid
    		? this.findFromTail(i)
    		: this.findFromHead(i);

        node.prev!.next = node.next;
        node.next!.prev = node.prev;

        this.list.size--;

        return node.data;
    }

    clear(): void {
    	this.list = undefined;
    }

    fromArray(arr: T[]): LinkedList<T> {
    	for (const el of arr) {
    		this.addLast(el);
    	}

    	return this;
    }

    toAscArray(): Array<T> {
    	if (this.isEmpty()) {
    		return [];
    	}

    	const arr = [];
    	let cur = this.list!.tail;

    	while (cur.prev !== null) {
    		arr.push(cur.data);
    		cur = cur.prev;
    	}

    	return arr;
    }

    * [Symbol.iterator](): Iterator<T> {
    	if (!this.list) {
    		return;
    	}

    	let cur: Node<T> | null;

    	for (cur = this.list.head; cur !== null; cur = cur.next) {
    		yield cur.data;
    	}
    }
}
