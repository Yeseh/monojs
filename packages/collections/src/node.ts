class LinkedListNode<T> {
    data: T
    next: LinkedListNode<T> | null
    prev: LinkedListNode<T> | null

    constructor(data: T, next?: LinkedListNode<T> | null, prev?: LinkedListNode<T> | null) {
    	this.data = data;
    	this.next = next || null;
    	this.prev = prev || null;
    }

    toJson(): { data: T; next: LinkedListNode<T> | null; prev: LinkedListNode<T> | null } {
    	return {
    		data: this.data,
    		next: this.next,
    		prev: this.prev,
    	};
    }
}

export { LinkedListNode };
