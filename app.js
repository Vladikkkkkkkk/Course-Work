import { SearchEngine } from './searchEngine.js';

class SearchApp {
    constructor() {
        this.array = [];
        this.isSearchStopped = false;
    }

    generateRandomArray(size, min, max) {
        const array = new Set();
        while (array.size < size) {
            const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
            array.add(randomNumber);
        }
        return Array.from(array).sort((a, b) => a - b);
    }

    renderArray(array) {
        const arrayContainer = document.getElementById("arrayContainer");
        arrayContainer.innerHTML = "";
        array.forEach((value, index) => {
            const element = document.createElement("div");
            element.className = "array-element";
            element.id = `element-${index}`;
            element.textContent = value;
            arrayContainer.appendChild(element);
        });
    }

    validateInput(arraySize, minValue, maxValue) {
        if (isNaN(arraySize) || isNaN(minValue) || isNaN(maxValue)) {
            alert("Some fields are empty. Fill in the array size, minimum value and maximum value fields to generate an array.");
            return false;
        }
        if (!Number.isInteger(arraySize) || !Number.isInteger(minValue) || !Number.isInteger(maxValue)) {
            alert("Please, enter integer values for the array size, minimum, and maximum values.");
            return false;
        }
        if (arraySize > 50000 || minValue < -100000 || maxValue > 100000) {
            alert("Array size cannot be bigger than 50,000. Boundary values must be in the range [-100,000; 100,000]");
            return false;
        }
        if (arraySize <= 0) {
            alert("Array size cannot be negative or equal to 0.");
            return false;
        }
        if (arraySize > maxValue - minValue + 1 || minValue === maxValue) {
            alert("Array size must be less than or equal to the range of boundary values while the upper bound must be always greater than the lower one.");
            return false;
        }
        return true;
    }

    generateArray() {
        const arraySize = parseFloat(document.getElementById("arraySize").value);
        const minValue = parseFloat(document.getElementById("minValue").value);
        const maxValue = parseFloat(document.getElementById("maxValue").value);
        const arrayContainer = document.getElementById("arrayContainer");
        const resultDiv = document.getElementById("result");
        const comparisons = document.getElementById("complexity");

        resultDiv.innerText = '';
        comparisons.innerText = '';

        if (!this.validateInput(arraySize, minValue, maxValue)) {
            return;
        }

        this.array = this.generateRandomArray(arraySize, minValue, maxValue);

        if (arraySize <= 100) {
            this.renderArray(this.array);
        } else {
            arrayContainer.innerHTML = "Array is generated. Download the file to see the generated array and results of search.";
        }
    }

    async startSearch() {
        this.isSearchStopped = false;
        const searchInput = parseFloat(document.getElementById("searchInput").value);
        const selectedMethod = document.getElementById("searchMethod").value;
        const resultDiv = document.getElementById("result");
        const comparisons = document.getElementById("complexity");
        resultDiv.innerText = '';
        comparisons.innerText = '';

        if (this.array === null || this.array.length === 0) {
            alert("Generate an array to start the search.");
            return;
        }

        if (this.array.length > 100) {
            resultDiv.innerText = 'Searching..';
            resultDiv.className = "result-not-found";
        }

        if (isNaN(searchInput)) {
            alert("Value of element to search is missed. Fill in the field.");
            return;
        }
        if (!Number.isInteger(searchInput)) {
            alert("Enter the integer number.");
            return;
        }

        const searchEngine = new SearchEngine(this.array);

        document.querySelectorAll('.array-element').forEach(el => {
            el.className = 'array-element';
        });

        let resultIndex = await searchEngine.search(searchInput, selectedMethod, () => this.isSearchStopped);

        if (resultIndex !== -1 && resultIndex !== undefined) {
            resultDiv.innerText = `Element is found on the position ${resultIndex}`;
            resultDiv.className = "result-found";
        } else if(this.isSearchStopped) {
            resultDiv.innerText = '';
        } else {
            resultDiv.innerText = "Element is not found";
            resultDiv.className = "result-not-found";
        }
    }

    stopSearch() {
        this.isSearchStopped = true;
    }

    saveToFile() {
        const searchInput = document.getElementById("searchInput").value;
        const selectedMethod = document.getElementById("searchMethod").value;
        const resultDiv = document.getElementById("result").innerText;
        const comparisons = document.getElementById("complexity").innerText;

        const dataToSave = {
            array: this.array,
            searchInput: searchInput,
            searchMethod: selectedMethod,
            result: resultDiv,
            complexity: comparisons
        };

        const dataStr = JSON.stringify(dataToSave, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'search_results.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    clearAllFields() {
        document.getElementById("arrayContainer").innerHTML = '';
        document.getElementById("result").innerText = '';
        document.getElementById("complexity").innerText = '';
        document.getElementById("arraySize").value = null;
        document.getElementById("maxValue").value = null;
        document.getElementById("minValue").value = null;
        document.getElementById("searchInput").value = null;
        this.array = [];
    }
}

const app = new SearchApp();

window.generateArray = app.generateArray.bind(app);
window.startSearch = app.startSearch.bind(app);
window.stopSearch = app.stopSearch.bind(app);
window.saveToFile = app.saveToFile.bind(app);
window.clearAllFields = app.clearAllFields.bind(app);
