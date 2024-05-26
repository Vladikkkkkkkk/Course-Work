export class FibonacciSearch {
    constructor(array) {
        this.array = array;
    }
    async search(value, isStopped) {
        let n = this.array.length;
        let fibMMm2 = 0;
        let fibMMm1 = 1;
        let fibM = fibMMm1 + fibMMm2;

        while (fibM < n) {
            fibMMm2 = fibMMm1;
            fibMMm1 = fibM;
            fibM = fibMMm1 + fibMMm2;
        }

        let offset = -1;

        while (fibM > 1) {
            if (isStopped()) {
                this.array.forEach((_, index) => {
                    const element = document.getElementById(`element-${index}`);
                    element.classList.remove("active");
                });
                return -1;
            }

            const i = Math.min(offset + fibMMm2, n - 1);
            const element = document.getElementById(`element-${i}`);
            if(element) {
                element.classList.add("active");
            }

            if(this.array.length <= 100) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }else {
                await new Promise(resolve => setTimeout(resolve));
            }

            if (this.array[i] < value) {
                fibM = fibMMm1;
                fibMMm1 = fibMMm2;
                fibMMm2 = fibM - fibMMm1;
                offset = i;
            } else if (this.array[i] > value) {
                fibM = fibMMm2;
                fibMMm1 = fibMMm1 - fibMMm2;
                fibMMm2 = fibM - fibMMm1;
            } else {
                if(element) {
                    element.classList.remove("active");
                    element.classList.add("found");
                }
                return i;
            }
        }

        if (fibMMm1 && this.array[offset + 1] === value) {
            const element = document.getElementById(`element-${offset + 1}`);
            if(element) {
                element.classList.add("found");
            }
            return offset + 1;
        }

        return -1;
    }
}
