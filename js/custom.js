function add_team_dropdown(dropdown, gender, value = '') {
	var team_dropdown = document.getElementById(dropdown);
	team_dropdown.innerHTML = ''
	active = 'active'

	if (value.includes('all')) {
		team_dropdown.innerHTML += `
		<li><a class="dropdown-item active" value="all">
			<img src="../asset/images/logo.png" alt="all" class="teamicon">全部球隊</a>
		</li>`
	}
	if (value.includes('oversea')) {
		if (gender == 'men') {
			oversea = 'cba';
		} else if (gender == 'women') {
			oversea = 'wcba'
		}
		team_dropdown.innerHTML += `
		<li><a class="dropdown-item" value="oversea">
			<img src="../asset/images/${gender}/${oversea}.png" alt="oversea" class="teamicon">${oversea.toUpperCase()} & 旅外</a>
		</li>`
	}
	if (value != '') {
		team_dropdown.innerHTML += `<li><hr class="dropdown-divider"></li>`
	}

	lastLeague = ''
	allTeams.forEach(team => {
		if (team.gender == gender) {
			if (lastLeague == '') lastLeague = team.league;
			if (lastLeague != team.league) {
				team_dropdown.innerHTML += `<li><hr class="dropdown-divider"></li>`
				lastLeague = team.league;
			}
			team_dropdown.innerHTML += `
			<li><a class="dropdown-item" value="${team.id}">
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
	if (id == "本土" | id == "華裔" | id == "外籍生") {
		return "local"
	} else if (id == "洋將" | id == "亞外") {
		return "import"
	}
	return -1;
}
function teamName(value, league, id, img = '') {
	if (id == '') {
		return '';
	} else if (id == 'fa') {
		return '自由球員';
	} else if (isOversea(id)) {
		if (value == 'full') {
			return `${league} ${id}`;
		} else if (value == 'short') {
			return `<a style="font-size:12px">${league}<br>${id}</a>`;
		}
	} else {
		team = findTeam(id);
		if (img != '') {
			return `
			<a href = "${team.url}" target = "_blank"><img src="../asset/images/${team.gender}/${team.id}.png" alt="${team.id}" class="teamicon"><b>${team.name_CN(value)}</b></a>`
		} else {
			return `
			<a href = "${team.url}" target = "_blank"><b>${team.name_CN(value)}</b></a>`
		}
	}
}
function teamBG(league, id) {
	if (id == '') {
		return '';
	} else if (isOversea(id)) {
		return `${league}-bg`
	} else {
		return `${id}-bg`
	}
}
function teamOrder(league, id) {
	if (id == 'fa') {
		return 5 + allTeams.length;
	} else if (id == '') {
		return 6 + allTeams.length;
	} else if (league.includes('CBA')) {
		return 0;
	} else if (league.includes('日本')) {
		return 1;
	} else if (league.includes('韓國')) {
		return 2;
	} else if (isOversea(id)) {
		return 3;
	} else {
		return 4 + findTeam(id).teamIndex();
	}
}
function numOrder(num) {
	if (num != '00') {
		return num;
	} else {
		return 100;
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
function birthToAge(bday) {
	const birthday = new Date(bday);
	const today = new Date();
	const diff = today - birthday
	const a = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
	return a;
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