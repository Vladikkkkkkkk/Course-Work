import { SearchEngine } from './searchEngine.js';

let array = [];
let isSearchStopped = false;

function generateRandomArray(size, min, max) {
    const array = new Set();
    while (array.size < size) {
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        array.add(randomNumber);
    }
    return Array.from(array).sort((a, b) => a - b);
}

function renderArray(array) {
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

window.generateArray = function() {
    const arraySize = parseFloat(document.getElementById("arraySize").value);
    const minValue = parseFloat(document.getElementById("minValue").value);
    const maxValue = parseFloat(document.getElementById("maxValue").value);
    const arrayContainer = document.getElementById("arrayContainer");
    const resultDiv = document.getElementById("result");
    const comparisons = document.getElementById("complexity");

    resultDiv.innerText = '';
    comparisons.innerText = '';

    if(isNaN(arraySize) || isNaN(minValue) || isNaN(maxValue)){
        alert("Some fields are empty. Fill in the array size, minimum value and maximum value fields to generate an array.");
        return;
    } else if (!Number.isInteger(arraySize) || !Number.isInteger(minValue) || !Number.isInteger(maxValue)) {
        alert("Please, enter integer values for the array size, minimum, and maximum values.");
        return;
    } else if(arraySize > 50000 || minValue < -100000 || maxValue > 100000){
        alert("Array size cannot be bigger than 50 000. Boundary values must be in range -100 000 - 100 000");
        return;
    } else if (arraySize <= 0){
        alert("Array size cannot be negative or equal to 0.");
        return;
    } else if (arraySize > maxValue - minValue + 1){
        alert("Array size must be less than or equal to the range of boundary values while upper bound must be always greater than the lower one.");
        return;
    }

    array = generateRandomArray(arraySize, minValue, maxValue);

    if (arraySize <= 100) {
        renderArray(array);
    } else {
        arrayContainer.innerHTML = "Array is generated. Download the file to see the generated array and results of search.";
    }
};

window.startSearch = async function() {
    isSearchStopped = false;
    const searchInput = parseFloat(document.getElementById("searchInput").value);
    const selectedMethod = document.getElementById("searchMethod").value;
    const resultDiv = document.getElementById("result");
    const comparisons = document.getElementById("complexity");

    if(array.length > 100) {
        resultDiv.innerText = 'Searching..';
        resultDiv.className = "result-not-found";
    } else {
        resultDiv.innerText = '';
        comparisons.innerText = '';
    }

    if (isNaN(searchInput)) {
        resultDiv.innerText = "Value of element to search is missed. Fill in the field.";
        resultDiv.className = "result-invalid";
        return;
    }else if(!Number.isInteger(searchInput)){
        resultDiv.innerText = "Invalid input. Enter the integer number.";
        resultDiv.className = "result-invalid";
    }

    const searchEngine = new SearchEngine(array);

    document.querySelectorAll('.array-element').forEach(el => {
        el.className = 'array-element';
    });

    let resultIndex;

    resultIndex = await searchEngine.search(searchInput, selectedMethod, () => isSearchStopped);

    if (resultIndex !== -1 && resultIndex !== undefined) {
        resultDiv.innerText = `Element is found on the position ${resultIndex}`;
        resultDiv.className = "result-found";
    } else if (isSearchStopped) {
        resultDiv.innerText = "";
    } else {
        resultDiv.innerText = "Element is not found";
        resultDiv.className = "result-not-found";
    }
};

window.stopSearch = function() {
    isSearchStopped = true;
}

window.saveToFile = function() {
    const searchInput = document.getElementById("searchInput").value;
    const selectedMethod = document.getElementById("searchMethod").value;
    const resultDiv = document.getElementById("result").innerText;
    const comparisons = document.getElementById("complexity").innerText;

    const dataToSave = {
        array: array,
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
};

window.ClearAllFields = function() {
    document.getElementById("arrayContainer").innerHTML = '';
    document.getElementById("result").innerText = '';
    document.getElementById("arraySize").value = null;
    document.getElementById("maxValue").value = null;
    document.getElementById("minValue").value = null;
    document.getElementById("searchInput").value = null;
    document.getElementById("complexity").innerText = '';
    array = [];
}
