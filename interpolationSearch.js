export class InterpolationSearch {
    constructor(array) {
        this.array = array;
    }

    async search(value, isStopped) {
        let pos;
        let low = 0;
        let high = this.array.length - 1;


        while (low <= high && value >= this.array[low] && value <= this.array[high]) {

            if (isStopped()) {
                this.array.forEach((_, index) => {
                    const element = document.getElementById(`element-${index}`);
                    element.classList.remove("active");
                });
                return -1;
            }

            pos = low + Math.floor(((high - low) / (this.array[high] - this.array[low])) * (value - this.array[low]));

            const element = document.getElementById(`element-${pos}`);
            if(element) {
                element.classList.add("active");
            }

            if(this.array.length <= 100) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }else {
                await new Promise(resolve => setTimeout(resolve));
            }


            if (this.array[pos] === value){
                if(element) {
                    element.classList.remove("active");
                    element.classList.add("found");
                }
                return pos;
            }

            if (this.array[pos] < value){
                low = pos + 1;
            }else{
                high = pos - 1;
            }
        }

        return -1;
    }
}
