import { UpdateCanvas } from "/content/code_stuff/algorithms_tester.js";

// all the sort algorithms

export async function BubbleSort(arr) {
	let start = new Date();

	const sort = new Promise((Resolve, Reject) => {

		console.log('beginning bubble sort');

		for (var i = 0; i < arr.length; i++) {

			// Last i elements are already in place  
			for (var j = 0; j < (arr.length - i - 1); j++) {
				UpdateCanvas({ 'list': arr, 'index': i });

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

		}

		// Print the sorted array
		console.log(arr);

		Resolve(arr);
	}).then((arr) => {
		endTime(start);

		return (arr);
	})

	start;
}

function endTime(start_time) {
	let end_time = new Date();

	start_time = start_time.getTime();
	end_time = end_time.getTime();

	console.log('time taken: ', (end_time - start_time) + 'ms');
}
