const createUserUrl = "https://borjomi.loremipsum.ge/api/register", //method POST  ყველა ველი სავალდებულო
	getAllUsersUrl = "https://borjomi.loremipsum.ge/api/all-users", //method GET
	getSingleUserUrl = "https://borjomi.loremipsum.ge/api/get-user/120 ", //id, method  GET
	updateUserUrl = "https://borjomi.loremipsum.ge/api/update-user/145 ", //id, method PUT  ყველა ველი სავალდებულო
	deleteUserUrl = "https://borjomi.loremipsum.ge/api/delete-user/145"; //id, method DELETE

const regForm = document.querySelector("#registration-form"),
	userName = regForm.querySelector("#user-name"),
	userSurname = regForm.querySelector("#user-surname"),
	userEmail = regForm.querySelector("#user-email"),
	userPhone = regForm.querySelector("#user-phone"),
	userPersonalID = regForm.querySelector("#user-personal-id"),
	userZip = regForm.querySelector("#user-zip-code"),
	userGender = regForm.querySelector("[name='gender']:checked"),
	// user id ფორმში, რომელიც გვჭირდება დაედითებისთვის
	userId = document.querySelector("#user-id");

const addNewUserBtn = document.querySelector("#add-new-user"),
	dialogEl = document.querySelector("dialog"),
	closeDialog = dialogEl.querySelector("#close");
addNewUserBtn.addEventListener("click", () => {
	dialogEl.showModal();
});
closeDialog.addEventListener("click", (e) => {
	dialogEl.close();
});

const dataExample = {
	first_name: "satesto",
	last_name: "text",
	phone: "123456789",
	id_number: "12345678909",
	email: "text121324567@gmail.com",
	gender: "male",
	zip_code: "1245",
};

function getCharacters1() {
	fetch("https://hp-api.onrender.com/api/characters")
		.then((res) => res.json())
		.then((data) => {
			console.log("getCharacters1", data);
		})
		.catch((e) => {
			console.log("Error fetching characters:", e);
		})
		.finally(() => {
			console.log("finally Fetch completed");
		});
}

function userActions() {
	// 1. ცხრილში ღილაკებზე უნდა მიამაგროთ event listener-ები
	// 2. იქნება 2 ღილაკი რედაქტირება და წაშლა როგორც "ცხრილი.png" ში ჩანს
	// 3. id შეგიძლიათ შეინახოთ data-user-id ატრიბუტად ღილაკებზე, data ატრიბუტებზე წვდომა შეგიძლიათ dataset-ის გამოყენებით 
	// მაგ:selectedElement.dataset
	// 4. წაშლა ღილაკზე დაჭერისას უნდა გაიგზავნოს წაშლის მოთხოვნა (deleteUser ფუნქციის მეშვეობით) სერვერზე და გადაეცეს id
	// 5. ედიტის ღილაკზე უნდა გაიხსნას მოდალი სადაც ფორმი იქნება იმ მონაცემებით შევსებული რომელზეც მოხდა კლიკი. 
	// ედიტის ღილაკზე უნდა გამოიძახოთ getSingleUser ფუნქცია და რომ დააბრუნებს ერთი მომხმარებლის დატას 
	// (ობიექტს და არა მასივს) const data = await getSingleUser(btn.dataset.userId); 
	// ამ ინფორმაციით  უნდა შეივსოს ფორმი და ამის შემდეგ შეგიძლიათ დააედიტოთ ეს ინფორმაცია და ფორმის დასაბმითებისას უნდა მოხდეს updateUser()
	//  ფუნქციის გამოძახება,
	//  სადაც გადასცემთ განახლებულ იუზერის ობიექტს, გვჭირდება იუზერის აიდიც, 
	// რომელიც  მოდალის გახსნისას user-id-ის (hidden input არის და ვიზუალურად არ ჩანს) value-ში შეგიძლიათ შეინახოთ.
}

async function getUsers() {
	try {
		const response = await fetch("https://borjomi.loremipsum.ge/api/all-users");
		const data = await response.json();
		console.log("getUsers", data.users);
		// render user cards
		// TODO: data.users არის სერვერიდან დაბრუნებული ობიექტების მასივი
		// TODO: ამ მონაცმების მიხედვით html ში ჩასვით ცხრილი როგორც "ცხრილი.png" შია

		userActions(); // ყოველ რენდერზე ახლიდან უნდა მივაბათ ივენთ ლისნერები
	} catch (e) {
		console.log("Error fetching users:", e);
	} finally {
		console.log("finally Fetch completed");
	}
}

async function getSingleUser(id) {
	try {
		const response = await fetch(
			`https://borjomi.loremipsum.ge/api/get-user/${id}`
		);
		const data = await response.json();
		return data;
	} catch (e) {
		console.log("Error - ", e);
	}
}
function sendUserData(userDataObject) {
	fetch("https://borjomi.loremipsum.ge/api/register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(userDataObject),
	})
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			console.log(data);
		});
}

function deleteUser(id) {
	fetch(`https://borjomi.loremipsum.ge/api/delete-user/${id}`, {
		method: "DELETE",
	})
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			console.log(data);
			getUsers();
		});
}

function updateUser(userObj) {
	// მიიღებს დაედითებულ ინფორმაციას და გააგზავნით სერვერზე, ისე როგორც რეგისტრაციისას
	// TODO დაასრულეთ ფუნქცია
	//  method: "put",  http://borjomi.loremipsum.ge/api/update-user/${userObj.id}
	// TODO: შენახვის, ედიტირების და წაშლის შემდეგ ახლიდან წამოიღეთ დატა
}

try {
	regForm.addEventListener("submit", (e) => {
		e.preventDefault();
		// validations

		if (true) {
			// request to send data

			const userData = {
				first_name: userName.value,
				last_name: userSurname.value,
				phone: userPhone.value,
				id_number: userPersonalID.value,
				email: userEmail.value,
				gender: regForm.querySelector("[name='gender']:checked").value,
				zip_code: userZip.value,
			};
			// console.log(userData);

			//  TODO: თუ userId.value არის ცარიელი (თავიდან ცარიელია) მაშინ უნდა შევქმნათ  -->  sendUserData(userData);
			// sendUserData(userData);

			// თუ დაედითებას ვაკეთებთ, ჩვენ ვანიჭებთ მნიშვნელობას userActions ფუნქციაში
			// TODO: თუ userId.value არის (არაა ცარიელი სტრინგი) მაშინ უნდა დავაედიტოთ, (როცა ფორმს ედითის ღილაკის შემდეგ იუზერის ინფუთით ვავსებთ, ვაედითებთ და ვასაბმითებთ) -->  updateUser(userData);
		}
	});
} catch (e) {
	console.log(e);
}

getCharacters1();
getUsers();
// console.log("after fetch");
