

window.addEventListener("load", async (event) => {
	let current = 11;

	let loggedIn = false;
	try {
		let userId = await getData("/users/userid");
		userId = userId.userId;

		if (typeof userId === "number") {
			loggedIn = true;

			let followsTopics = await getData(`follows/topics/${userId}`);
			followsTopics = followsTopics.map((each) => {
				return `topic-${each.topicId}`;
			});

			let nodes = [];
			followsTopics.forEach((x) => {
				nodes.push(document.getElementById(`${x}`));
			});
			nodes.forEach((node) => {
				node.classList.add("toggled");
				node.style.order = current;
			});
		}
	} catch (e) {}

	const topics = document.querySelectorAll(".topics").forEach((topic) => {
		topic.addEventListener("click", async (e) => {
			const topicId = topic.id.split("-")[1];
			if (!e.target.classList.contains("toggled")) {
				toggle(e.target);
				e.target.style.order = 1;
				let cssId = `relevant-${topicId}`;
				const relevantPosts = document.querySelectorAll(`.${cssId}`);
				relevantPosts.forEach((post) => {
					post.style.order = current;
					current--;
				});

				if (loggedIn) {
					let userId = await getData("/users/userid");
					const body = {
						userId: userId.userId,
						topicId: parseInt(topicId, 10),
					};
					console.log(body);
					//this line creates a follow between a user and a topic
					let res = await fetch("/follows/topics", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(body),
					});
				}
			}
		});
	});
});

async function getData(url) {
	const response = await fetch(url);

	return response.json();
}

function toggle(element) {
	element.classList.add("toggled");
}

const signUpModalTrigger = document.querySelector("#signUpSplashButton");
const signUp = document.querySelector(".sign-up-modal");

const mainBodyDiv = document.querySelector(".body-encapsulation");


signUpModalTrigger.addEventListener("click", (ev) => {
    const clickEvent = new Event("click", { bubbles: true, cancelable: false });

		//call event on element
		signUp.dispatchEvent(clickEvent);
	// mainBodyDiv.addEventListener(
	// 	"click",
	// 	(ev) => {
	// 		ev.preventDefault();
	// 		signUp.classList.toggle("show-modal");
	// 		mainBodyDiv.classList.toggle("blur");
	// 	},
	// 	{ once: true }
	// );
});
