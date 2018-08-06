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
			staffObj.PictureUrl = url;
			return (staffObj);
		})
		.catch(e => {
			console.warn(e);
			return staffObj;
		})
}

function getTeam(){
	let getTeam = database.ref('/Team/Staff').orderByKey();
	getTeam.on('value', function(snapshot){
		let results = toArray(snapshot.val()) || [];

		let promises = [];
		promises = results.map(member => {
			return getStaffPicture(member);
		})

		Promise.all(promises)
			.then(members => {

			let divs = members.map(member => {
				let tag = member.key;
				return `
				<div>
					<h4>${tag}</h4>
					<span>
						<img src="${member.PictureUrl}" height="100px" />
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
		}).catch(console.error);
	})
}

getTeam();