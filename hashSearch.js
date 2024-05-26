class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.next = null;
    }
}

class SeparateChainingLinkedList {
    constructor(size) {
        this.table = new Array(size).fill(null);
    }

    hash(key) {
        return key % this.table.length;
    }

    insert(key, value) {
        const index = this.hash(key);
        const newNode = new Node(key, value);
        if (!this.table[index]) {
            this.table[index] = newNode;
        } else {
            let current = this.table[index];
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
    }

    async find(key, isStopped, visualize) {
        const index = this.hash(key);
        let current = this.table[index];
        while (current) {
            if (isStopped()) {
                return -1;
            }

            if (visualize) {
                const element = document.getElementById(`element-${current.value}`);
                if (element) {
                    element.classList.add("active");
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }

            if (current.key === key) {
                if (visualize) {
                    const element = document.getElementById(`element-${current.value}`);
                    if (element) {
                        element.classList.add("found");
                    }
                }
                return current.value;
            }

            current = current.next;
        }
        return -1;
    }
}

export class HashSearch {
    constructor(array) {
        this.hashTable = new SeparateChainingLinkedList(array.length);
        array.forEach((value, index) => {
            this.hashTable.insert(value, index);
        });
    }

    async search(value, isStopped) {
        return await this.hashTable.find(value, isStopped, this.hashTable.table.length <= 100);
    }
}
