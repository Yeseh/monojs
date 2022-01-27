import { defaultEquals } from '@yeseh/ts-utils';
import type { EqualsFunction } from '@yeseh/ts-utils';

class CircularBuffer<T> {
    private list: T[]
    private _size: number;
    private capacity: number;

    private readIndex: number;
    private writeIndex: number;

    private compareFn: EqualsFunction<T>;

    constructor(capacity: number, compareFn?: EqualsFunction<T>) {
    	this.list = new Array(capacity);
    	this._size = 0;
    	this.capacity = capacity;

    	this.readIndex = 0;
    	this.writeIndex = 0;

    	this.compareFn = compareFn || defaultEquals;
    }

    get size(): number {
    	return this._size;
    }

    isEmpty(): boolean {
    	return this._size === 0;
    }

    enqueue(element: T): void {
    	this.list[this.writeIndex] = element;

    	const overridden = this.size !== 0 && this.writeIndex === this.readIndex;

    	if (overridden) {
    		this.readIndex = (this.readIndex + 1) % this.capacity;
    	}

    	this.writeIndex = (this.writeIndex + 1) % this.capacity;

    	this._size++;
    }

    dequeue(): T | null {
    	if (this.isEmpty()) {
    		return null;
    	};

    	const removedVal = this.list[this.readIndex];
    	this.readIndex = (this.readIndex + 1) % this.capacity;

    	this._size--;

    	return removedVal;
    }

    peekFirst(): T | null {
    	if (this.isEmpty()) {
    		return null;
    	}

    	return this.list[this.readIndex];
    }

    peekLast(): T | null {
    	if (this.isEmpty()) {
    		return null;
    	}

    	let i = this.writeIndex - 1;

    	if (i < 0) {
    		i = this.capacity - 1;
    	}

    	return this.list[i];
    }

    contains(element: T): boolean {
    	return this.list.some((val: T) => {
    		this.compareFn(val, element);
    	});
    }
}

export { CircularBuffer };

