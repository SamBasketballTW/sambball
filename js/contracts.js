$(document).ready(function () {
	fetch('../data/rosters.csv')
		.then((response) => response.text())
		.then((result) => {

			lines = result.split('\n');
			lines = lines.slice(2);

			table = document.getElementById('contracts_tbody');

			lines.forEach(player => {
				infos = player.split(',');
				info = ""

				if (infos[0] != "" & infos[4] != "fa" & !(infos[18] == "" & infos[19] == "" & infos[20] == "")) {
					if (infos[5] == '') infos[5] = team_link[infos[4]];

					if (infos[7] == "coach") {
						filter = `coach`
					} else if (is_oversea(infos[3]) | identity(infos[9]) == "local") {
						filter = `local`
					} else {
						filter = `import`
					}
					if(infos[17].includes("trade")){
						if(infos[18] != "") infos[18] = '*'+infos[18]+'*'
						if(infos[19] != "") infos[19] = '*'+infos[19]+'*'
						if(infos[20] != "") infos[20] = '*'+infos[20]+'*'
					}
					
					if(infos[20] == "0" | infos[20].includes("0+")) filter += ` 1y`;

					url = ""
						if (infos[22] != "") {
							url += `
							<a style="color:inherit; text-decoration:underline" href="${infos[23]}" target="_blank">
							<i class="bi bi-link-45deg"></i>${infos[22]}</a>`;
						}

					info += `
						<tr class="filterTr ${infos[0]} ${filter_team(infos[3], infos[4])} ${infos[17]} ${filter} ">
							<td class="${bg_team(infos[3], infos[4])} borderR">${team_name("short", infos[3], infos[4], infos[0])}</td>
							<td class="borderR">${infos[2]}</td>
							<td class="borderR"><a style="text-decoration:underline;color:inherit" href="${infos[5]}" target="_blank">${infos[1]}</a></td>
							<td>${infos[18]}</td>
							<td class="borderR">${infos[19]}</td>
							<td class="borderR">${infos[20]}</td>
							<td class="borderR">${infos[21]}</td>
							<td>${url}</td>
						</tr>`
				}

				table.innerHTML += info;
			});
			document.getElementById('gender-dropdown').getElementsByClassName('dropdown-item')[0].click();
		});

	var team_dropdown = document.getElementById("team-dropdown");
	team_dropdown.innerHTML = `
	<li><a class="dropdown-item active" onclick="f('all')">
		<img src="../asset/images/logo_round.png" alt="all" class="teamicon">全部球隊</a></li>
    <li><a class="dropdown-item" onclick="f('oversea')">
        <img src="../asset/images/men/cba.png" alt="oversea" class="teamicon">CBA & 旅外</a></li>
    <li><hr class="dropdown-divider"></li>`

	add_team_dropdown("team-dropdown", "men");

	var genders = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item");
	var genderbtn = document.getElementById("genderbtn");
	var teams = document.getElementById("team-dropdown").getElementsByClassName("dropdown-item");
	var contracts = document.getElementById("contract-dropdown").getElementsByClassName("dropdown-item");
	var teambtn = document.getElementById("teambtn");
	var contractbtn = document.getElementById("contractbtn");

	for (var i = 0; i < genders.length; i++) {
		genders[i].addEventListener("click", function () {
			var currentGender = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item active");
			currentGender[0].className = currentGender[0].className.replace(" active", "");
			this.className += " active";
			genderbtn.innerHTML = this.innerHTML;

			f('filter');
		});
	}

	for (let i = 0; i < teams.length; i++) {
		teams[i].addEventListener("click", function () {
			var currentTeam = document.getElementById("team-dropdown").getElementsByClassName("active");
			currentTeam[0].className = currentTeam[0].className.replace(" active", "");
			this.className += " active";
			teambtn.innerHTML = this.innerHTML;

			f('filter');
		});
	}

	for (let i = 0; i < contracts.length; i++) {
		contracts[i].addEventListener("click", function () {
			var currentContract = document.getElementById("contract-dropdown").getElementsByClassName("dropdown-item active");
			currentContract[0].className = currentContract[0].className.replace(" active", "");
			this.className += " active";
			contractbtn.innerHTML = this.innerHTML;

			f('filter');
		});
	}
});