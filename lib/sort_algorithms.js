import { UpdateCanvas } from "/content/code_stuff/algorithms_tester.js";

// all the sort algorithms

export function BubbleSort(arr) {
	console.log('beginning bubble sort');

	for (var i = 0; i < arr.length; i++) {

		// Last i elements are already in place  
		for (var j = 0; j < (arr.length - i - 1); j++) {

			// Checking if the item at present iteration 
			// is greater than the next iteration
			if (arr[j] > arr[j + 1]) {

				// If the condition is true
				// then swap them
				var temp = arr[j]
				arr[j] = arr[j + 1]
				arr[j + 1] = temp
			}
		}

		UpdateCanvas();
	}

	// Print the sorted array
	console.log(arr);
}
