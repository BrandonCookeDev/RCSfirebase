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

function getStaffPicture(staffObj){
	return storage.ref().child('Staff/' + staffObj.Picture).getDownloadURL()
		.then(url => {
			staffObj.PictureUrl = url;
			return (staffObj);
		})
		.catch(e => {
			console.warn(e);
			return staffObj;
		})
}

function getPlayerPicture(playerObj){
	return storage.ref().child('Player/' + playerObj.Picture).getDownloadURL()
		.then(url => {
			playerObj.PictureUrl = url;
			return (playerObj);
		})
		.catch(e => {
			console.warn(e);
			return playerObj;
		})
}

function updateStaffDiv(staff){
	let promises = [];
	promises = staff.map(member => {
		return getStaffPicture(member);
	})

	Promise.all(promises)
		.then(members => {

			let divs = members.map(member => {
				let tag = member.key;
				return `
				<h4>${tag}</h4>
				<div class="row">
					<div class="col-md-6">
						<img src="${member.PictureUrl}" class="staffPic" />
					</div>
					<div class="col-md-6">
						<ul>
							<li><label>Name: </label> ${member.Name}</li>
							<li><label>Position: </label> ${member.Position}</li>
							<li><label>Twitter: </label> <a href="twitter.com/${member.Twitter}">@${member.Twitter}</a></li>
							<li><label>Bio: </label> ${member.Bio}</li>
						</ul>
					</div>
				</div>
				`;
			})
			staffDiv.innerHTML = divs;

		}).catch(console.error);
}

function updatePlayersDiv(players){
	let promises = [];
	promises = players.map(member => {
		return getPlayerPicture(member);
	})

	Promise.all(promises)
		.then(members => {
			let divs = members.map(member => {
				let tag = member.key;
				return `
				<h4>${tag}</h4>
				<div class="row">
					<div class="col-md-6">
						<img src="${member.PictureUrl}" class="playerPic" />
					</div>
					<div class="col-md-6">
						<ul>
							<li><label>Name: </label> ${member.Name}</li>
							<li><label>Twitter: </label> @${member.Twitter}</li>
							<li><label>Bio: </label> ${member.Bio}</li>
						</ul>
					</div>
				</div>
				`
			})
			playerDiv.innerHTML = divs;
		})
		.catch(console.error)
}

function getTeam(){
	let team = database.ref('/Team/Staff').orderByKey();
	team.on('value', function(snapshot){
		let results = toArray(snapshot.val()) || [];
		updateStaffDiv(results);
	})
}

function getPlayers(){
	let players = database.ref('/Team/Players').orderByKey();
	players.on('value', function(snapshot){
		let results = toArray(snapshot.val()) || [];
		updatePlayersDiv(results);
	})
}

getTeam();
getPlayers();