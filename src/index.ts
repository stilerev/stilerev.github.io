import * as A1lib from "alt1";
import ChatboxReader from "alt1/chatbox";

import "./index.html";
import "./appconfig.json";
import "./css/nis.css";
import "./css/style.css";
import "./css/tooltipster.bundle.min.css";
import "./css/tooltipster.css";

if (window.alt1) {
	alt1.identifyAppUrl("./appconfig.json");
} else {
	let addappurl = `alt1://addapp/${new URL("./appconfig.json", document.location.href).href}`;
	document.querySelector("body").innerHTML = `Alt1 not detected, click <a href='${addappurl}'>here</a> to add this app to Alt1`;
}

const appColor = A1lib.mixColor(255, 0, 0);
const reader = new ChatboxReader();

reader.readargs = {
	colors: [
		A1lib.mixColor(232, 4, 4),
	],
};

interface Attack {
	message: string[];
	action: string;
}

let currentAttack = 0;

const messages: { [key: string]: Attack } = {
	"burn": {
		message: ["Burn!"],
		action: "Use freedom"
	},
	"sear": {
		message: ["Sear!", "Suffer!"],
		action: "Deflect magic for fireball\nSurge"
	},
	"quake": {
		message: ["Tremble before me!", "Fall before my might!", "The earth yields to me!"],
		action: "Deflect magic for fireball\nSurge/Dive to other side."
	},
	"empowered": {
		message: ["Die!", "Begone!", "Ful's flame burns within me!"],
		action: "Resonance"
	},
	"igneous": {
		message: ["The skies burn!", "Flames consume you!", "Fall, and burn to ash!"],
		action: "Anticipation. Deflect magic. Surge to minions.\nFirst minion: Stun\nSecond minion: Threshold\nThird minion: Stand within shield and kill\nUse special ability"
	}
};

function showSelectedChat(chat) {
	//Attempt to show a temporary rectangle around the chatbox.  skip if overlay is not enabled.
	try {
		alt1.overLayRect(appColor, chat.mainbox.rect.x, chat.mainbox.rect.y, chat.mainbox.rect.width, chat.mainbox.rect.height, 2000, 5);
	} catch { }
}

window.setTimeout(function () {
	//Find all visible chatboxes on screen
	let findChat = setInterval(function () {
		if (reader.pos === null) reader.find();
		else {
			console.log(reader);
			clearInterval(findChat);
			//If multiple boxes are found, this will select the first, which should be the top-most chat box on the screen.
			reader.pos.mainbox = reader.pos.boxes[0];

			showSelectedChat(reader.pos);
			updateUI(getActionRequired(readChatbox()));
			console.log(reader.pos);
			setInterval(function () {
				readChatbox();
			}, 600);
		}
	}, 1000);
}, 50);

function readChatbox() {
	var opts = reader.read() || [];
	var chat = "";

	for (const a in opts) {
		chat += opts[a].text + " ";
	}

	console.log(chat);

	return chat;
}

function updateUI(action: string) {
	document.getElementById("action").innerText = action;
}

function getActionRequired(text: string) {
	let action = "";
	for (const [key, attack] of Object.entries(messages)) {
		if (attack.message.includes(text)) {
			action = attack.action;
			console.log(key);
		}
	}
	return action;
}