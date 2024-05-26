import { LinearSearch } from './linearSearch.js';
import { InterpolationSearch } from './interpolationSearch.js';
import { FibonacciSearch } from './fibonacciSearch.js';
import {HashSearch} from "./hashSearch.js";

export class SearchEngine {
    constructor(array) {
        this.array = array;
    }

    async search(value, method, isStopped) {
        let searchAlgorithm;
        switch (method){
            case "linear":
                searchAlgorithm = new LinearSearch(this.array);
                break;
            case "interpolation":
                searchAlgorithm = new InterpolationSearch(this.array);
                break;
            case "fibonacci":
                searchAlgorithm = new FibonacciSearch(this.array);
                break;
            case "hash":
                searchAlgorithm = new HashSearch(this.array);
                break;
            default:
                alert("No methods found.");
                break;

        }

        return await searchAlgorithm.search(value, isStopped);
    }
}
