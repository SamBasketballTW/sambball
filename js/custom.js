function is_oversea(league, team) {
	if (league != "PLG" & league != "T1" & league != "SBL" & league != "WSBL") {
		return 1
	} else {
		return 0
	}
}
function identity(id) {
	if (id == "本土" | id == "華裔" | id == "外籍生" | id == "特案外籍生") {
		return "local"
	} else if (id == "洋將" | id == "亞外") {
		return "import"
	} else {
		return "unknown"
	}
}
function team_name(value, league, team, gender = "") {
	if (value == "full") teamName = teamName_full_CN[team];
	if (value == "short") teamName = teamName_short_CN[team];

	if (team == "fa") {
		return `自由球員`
	} else if (league != "" & is_oversea(league)) {
		return `${league} ${team}`

	} else if (team != "fa" & gender != "") {
		return `<img src="../asset/images/${gender}/${team}.png" alt="${team}" class="teamicon"><b>${teamName}</b>`

	} else {
		return teamName
	}
}

function filter_team(league, team) {
	if (is_oversea(league)) {
		return `oversea`
	} else {
		return team
	}
}
function bg_team(league, team) {
	if (is_oversea(league)) {
		return `${league}-bg`
	} else {
		return `${team}-bg`
	}
}
function team_order(league, team) {
	if (is_oversea(league)) {
		return order[league]
	} else {
		return order[team]
	}
}

function num_order(num) {
	if (num != "00") {
		return num
	} else {
		return 100
	}
}
function school(s) {
	if (s.includes("HBL") | s == "-") {
		return ""
	} else if (college[s] == undefined) {
		return "college-us"
	} else {
		return college[s]
	}
}
function age(bday) {
	const birthday = new Date(bday);
	const today = new Date();
	const diff = today - birthday
	const a = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
	return a;
}

function f(value, table = "") {
	if (value == "filter") {
		filters = []
		checkboxes = []
		var actives = document.getElementsByClassName("active");
		for (let i = 0; i < actives.length; i++) {
			var fil = actives[i].getAttribute('onclick').split('\'')[1];
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
			var text = rows[i].className;
			show = 1
			for (let j = 0; j < filters.length; j++) {
				if (text.indexOf(filters[j]) == -1) show = 0
			}
			for (let j = 0; j < checkboxes.length; j++) {
				if (text.indexOf(checkboxes[j]) > -1) show = 0
			}
			if (show == 1) w3AddClass(rows[i], " showTr");
			if (show == 0) w3RemoveClass(rows[i], " showTr");
		}

	}

}

function findIndex(array, team) {
	for (let i = 0; i < array.length; i++) {
		if (array[i] == team) {
			return i;
		}
	}
	return -1;
}

function rankArray(array) {
	temp = [];
	for (let i = 0; i < array.length; i++) {
		count = 0;
		for (let j = 0; j < array.length; j++) {
			if (array[i] < array[j]) count += 1;
		}
		temp.push(count + 1);
	}
	return temp;
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