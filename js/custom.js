function add_team_dropdown(dropdown, gender, value = '') {
	var team_dropdown = document.getElementById(dropdown);
	team_dropdown.innerHTML = ''
	active = 'active'
	
	if(value.includes('all')){
		team_dropdown.innerHTML += `
		<li><a class="dropdown-item active" onclick="f('all')">
			<img src="../asset/images/logo_round.png" alt="all" class="teamicon">全部球隊</a>
		</li>`
		active = '';
	}
	if(value.includes('oversea')){
		if(gender == 'men'){
			oversea = 'cba';
		}else if(gender == 'women'){
			oversea = 'wcba'
		}
		team_dropdown.innerHTML += `
		<li><a class="dropdown-item ${active}" onclick="f('oversea')">
			<img src="../asset/images/${gender}/${oversea}.png" alt="oversea" class="teamicon">${oversea.toUpperCase()} & 旅外</a>
		</li>`
	}
	if(value != ''){
		team_dropdown.innerHTML += `<li><hr class="dropdown-divider"></li>`
	}
	// if (all != "" | oversea != "") {
	// 	if (all != "") {
	// 		team_dropdown.innerHTML += `
	// 		<li><a class="dropdown-item active" onclick="f('all')">
	// 			<img src="../asset/images/logo_round.png" alt="all" class="teamicon">全部球隊</a>
	// 		</li>`
	// 		active = ''
	// 	}
	// 	if (oversea != "") {
	// 		team_dropdown.innerHTML += `
	// 		<li><a class="dropdown-item ${active}" onclick="f('oversea')">
	// 			<img src="../asset/images/${gender}/${oversea}.png" alt="oversea" class="teamicon">${oversea.toUpperCase()} & 旅外</a>
	// 		</li>`

	// 	}
	// 	team_dropdown.innerHTML += `<li><hr class="dropdown-divider"></li>`
	// }

	lastLeague = ''
	allTeams.forEach(team => {
		if (team.gender == gender) {
			if (lastLeague == '') lastLeague = team.league;
			if (lastLeague != team.league) {
				team_dropdown.innerHTML += `<li><hr class="dropdown-divider"></li>`
				lastLeague = team.league;
			}
			team_dropdown.innerHTML += `
			<li><a class="dropdown-item" onclick="f('${team.id}')">
				<img src="../asset/images/${team.gender}/${team.id}.png" alt="${team.id}" class="teamicon">${team.full_name_CN}</a>
			</li>`

		}
	});
}
function isOversea(id) {
	if (findTeam(id) == -1 & id != 'fa') {
		return 1;
	} else {
		return 0;
	}
}
function leagueIdFilter(id) {
	if (id == "本土" | id == "華裔" | id == "外籍生" | id == "特案外籍生") {
		return "local"
	} else if (id == "洋將" | id == "亞外") {
		return "import"
	}
	return -1;
}
function teamName(value, league, id, img = '') {
	if (id == 'fa') {
		return '自由球員'
	} else if (isOversea(id)) {
		if (value == 'full') {
			return `${league} ${id}`
		} else if (value == 'short') {
			return `${league}<br>${id}`
		}
	} else {
		team = findTeam(id);
		if (img != '') {
			return `
			<a href = "${team.url}" target = "_blank">
				<img src="../asset/images/${team.gender}/${team.id}.png" alt="${team.id}" class="teamicon"><b>${team.name_CN(value)}</b></a>`
		} else {
			return team.name_CN(value);
		}
	}
}
function teamFilter(id) {
	if (id != 'fa' & isOversea(id)) {
		return 'oversea';
	} else {
		return id;
	}
}
function teamBG(league, id) {
	if (isOversea(id)) {
		return `${league}-bg`
	} else {
		return `${id}-bg`
	}
}
function playerUrl(id, url) {
	if (url != '') {
		return url;
	} else if (!isOversea(id)) {
		return findTeam(id).url;
	} else {
		return '';
	}
}
function numOrder(num) {
	if (num != '00') {
		return num;
	} else {
		return 100;
	}
}
function birthToAge(bday) {
	const birthday = new Date(bday);
	const today = new Date();
	const diff = today - birthday
	const a = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
	return a;
}
function secToTime(t) {
	min = Math.floor(t / 60);
	sec = t % 60;
	return min + ':' + sec;
}

function f(value, table = "") {
	if (value == "filter") {
		filters = []
		checkboxes = []
		var actives = document.getElementsByClassName("active");
		for (let i = 0; i < actives.length; i++) {
			if (actives[i].getAttribute('onclick') != "") {
				var fil = actives[i].getAttribute('onclick').split('\'')[1];
			}
			if (table == "") {
				tab = ""
			} else {
				var tab = actives[i].getAttribute('onclick').split('\'')[3];
			}
			if (fil != "all" & tab == table) filters.push(fil)
		}
		if (table != "") {
			var rows = document.getElementById(table).getElementsByClassName(("filterTr"));
		} else {
			var rows = document.getElementsByClassName(("filterTr"));
		}
		cbs = document.querySelectorAll('.form-check-input:not(#checkSwitch)');
		for (let i = 0; i < cbs.length; i++) {
			if (!cbs[i].checked) {
				if (cbs[i].getAttribute('onclick')) {
					cb = cbs[i].getAttribute('onclick').split('\'')[1];
					checkboxes.push(cb);
				}

			}
		}
		for (let i = 0; i < rows.length; i++) {
			var text = rows[i].className.split(' ');
			show = 1;
			filters.forEach(filter => {
				if (text.indexOf(filter) == -1) show = 0
			})
			checkboxes.forEach(cb => {
				if (text.indexOf(cb) != -1) show = 0
			})
			if (show == 1) w3AddClass(rows[i], " showTr");
			if (show == 0) w3RemoveClass(rows[i], " showTr");
		}

	}

}
function w3AddClass(element, name) {
	var i, arr1, arr2;
	arr1 = element.className.split(" ");
	arr2 = name.split(" ");
	for (i = 0; i < arr2.length; i++) {
		if (arr1.indexOf(arr2[i]) == -1) {
			element.className += " " + arr2[i];
		}
	}
}
function w3RemoveClass(element, name) {
	var i, arr1, arr2;
	arr1 = element.className.split(" ");
	arr2 = name.split(" ");
	for (i = 0; i < arr2.length; i++) {
		while (arr1.indexOf(arr2[i]) > -1) {
			arr1.splice(arr1.indexOf(arr2[i]), 1);
		}
	}
	element.className = arr1.join(" ");
}