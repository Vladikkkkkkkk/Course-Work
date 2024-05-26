export class LinearSearch {
    constructor(array) {
        this.array = array;
    }

    async search(value, isStopped) {
        let comparisonCount = 0;
        const comparisons = document.getElementById("complexity");

        for (let i = 0; i < this.array.length; i++) {
            if (isStopped()) {
                this.array.forEach((_, index) => {
                    const element = document.getElementById(`element-${index}`);
                    element.classList.remove("active");
                });
                return -1;
            }

            comparisonCount++;

            const element = document.getElementById(`element-${i}`);
            if (element) {
                element.classList.add("active");
            }

            if(this.array.length <= 100) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }else {
                await new Promise(resolve => setTimeout(resolve));
            }

            if (this.array[i] === value) {
                if (element) {
                    element.classList.add("found");
                }
                comparisons.innerText = `Number of comparisons: ${comparisonCount}`;
                comparisons.className = "result-comparisons";
                return i;
            }

        }

        comparisons.innerText = `Number of comparisons: ${comparisonCount}`;
        comparisons.className = "result-comparisons";
        return -1;
    }
}
