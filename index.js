'use strict';

let database = firebase.database();
let storage = firebase.storage();

let staffDiv = document.getElementById('staff');
let playerDiv = document.getElementById('players');

function toArray(o){
	let elements = [];
	for(var prop in o){
		let newO = {};
		Object.assign(newO, o[prop], {key: prop})
		elements.push(newO);
	}
	return elements;
}

function getStaffPicture(name){
	let pic = storage.ref().child('Staff/' + name).getDownloadURL();
	return pic;
}

function getPlayerPicture(name){
	return storage.ref().child('Player/' + name)
}

function getTeam(){
	let getTeam = database.ref('/Team/Staff').orderByKey();
	getTeam.on('value', function(snapshot){
		let results = toArray(snapshot.val()) || [];
		let divs = results.map(member => {
			let tag = member.key;
			return `
			<div>
				<h4>${tag}</h4>
				<span>
					<img src="${getStaffPicture(member.Picture)}" height="100px" />
				</span>
				<span>
					<ul>
						<li><label>Name: </label> ${member.Name}</li>
						<li><label>Twitter: </label> <a href="twitter.com/${member.Twitter}">@${member.Twitter}</a></li>
						<li><label>Bio: </label> ${member.Bio}</li>
					</ul>
				</span>
			</div>
			`;
		})

		staffDiv.innerHTML = divs;
	})
}

getTeam();