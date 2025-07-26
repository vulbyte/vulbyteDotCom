class Store {
	constructor() {

	}

	GetItems() {

	}

	RemoveItems() {

	}

	AddToCart() {

	}

	RemoveFromCart() {

	}
}

class StoreItem {
	constructor(
		args = {
			id: undefined, //uuid
			name: undefined, // str
			description: undefined, // str
			model3d: undefined,
			images: undefined, //str | arr
			hazards: {
				types: undefined,
				reasons: undefined,
			},
			price: {
				subscription: false,
				term: false,
				termDuration: false,
				price: undefined,
				autoRenew: false,
			},
			lastDayOfSale: undefined,
			expiry: undefined,
			isCollection: [/*collection of store items*/],
		}
	) {

	}
}
