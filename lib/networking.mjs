export default class Networking {
	jwt = () => { localStorage.getItem("asdf") };

	CreateUser(){
		const endpoint = "";

	}
	
	SignIn(){
		const endpoint = "https://icoewuxafsqfdyrpdtua.supabase.co/functions/v1/sign-in";

	}

	LogOut(){
		const endpoint = "";

	}


	SubmitData(
		inData = null,
		jwt = null,
	){
		const endpoint = "";

		if(inData == null){
			console.error("no inData to send:", inData);
		}
		if(jwt){
			console.error("no jwt:", jwt);
		}
		console.log("sending data:", inData);

		let params = {
			"data": inData,
			auth: jwt,
		};
		fetch(
			endpoint, 
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(params)
			}
		)
	}
}
