$(document).ready(function () {
	fetch('../data/drafts.csv')
		.then((response) => response.text())
		.then((result) => {

			lines = result.split('\n');
			lines = lines.slice(2);

			table = document.getElementById('drafts_tbody');

			lines.forEach(line => {
				infos = line.split(',');

				let [
					gender,
					year,
					league,
					pick,
					team_id,
					team_name,
					name

				] = infos;

				if (team_name == "") {
					team_name = teamName('full', '', team_id);
				}

				table.innerHTML += `
				<tr class="filterTr ${gender} ${year}${league} ${team_id}">	
					<td class="borderR">${year} ${league.toUpperCase()} 選秀大會</td>
					<td class="borderR">${pick}</td>
					<td class="borderR">${team_name}</td>
					<td>${name}</td>
				</tr>`
			});

			document.getElementById('gender-dropdown').getElementsByClassName('dropdown-item')[0].click();
		});

	var genders = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item");
	var genderbtn = document.getElementById("genderbtn");

	for (var i = 0; i < genders.length; i++) {
		genders[i].addEventListener("click", function () {
			switch_gender = 0;
			if (this.className != "dropdown-item active") {
				switch_gender = 1;
			}
			var currentGender = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item active");
			currentGender[0].className = currentGender[0].className.replace(" active", "");
			this.className += " active";
			genderbtn.innerHTML = this.innerHTML;

			if (switch_gender == 1) {
				var team_dropdown = document.getElementById('team-dropdown');
				var draft_dropdown = document.getElementById('draft-dropdown');
				if (this.innerHTML == "男籃") {
					temp = `
					<li><a class="dropdown-item" onclick="f('oversea')">CBA & 旅外</a></li>
					<li><hr class="dropdown-divider"></li>
					<li>
						<a class="dropdown-item disabled" style="color:black">PLG</a>
						<ul class="dropdown-menu dropdown-submenu">`
					for (let i = 2024; i >= 2021; i--) {
						temp += `<li><a class="dropdown-item" onclick="f('${i}plg')">${i} PLG 選秀</a></li>`
					}
					temp += `
						</ul>
					</li>
					<li>
						<a class="dropdown-item disabled" style="color:black">T1</a>
						<ul class="dropdown-menu dropdown-submenu">`
					for (let i = 2023; i >= 2021; i--) {
						temp += `<li><a class="dropdown-item" onclick="f('${i}t1')">${i} T1 選秀</a></li>`
					}
					temp += `
						</ul>
					</li>
					<li>
						<a class="dropdown-item disabled" style="color:black">SBL</a>
						<ul class="dropdown-menu dropdown-submenu">`
					for (let i = 2023; i >= 2020; i--) {
						temp += `<li><a class="dropdown-item" onclick="f('${i}sbl')">${i} SBL 選秀</a></li>`
					}
					temp += `
						</ul>
					</li>`

					draft_dropdown.innerHTML = temp;
					add_team_dropdown('team-dropdown', 'men');

				} else if (this.innerHTML == "女籃") {
					temp = `
					<li><a class="dropdown-item" onclick="f('oversea')">WCBA & 旅外</a></li>
					<li><hr class="dropdown-divider"></li>`
					for (let i = 2023; i >= 2019; i--) {
						temp += `<li><a class="dropdown-item" onclick="f('${i}wsbl')">${i} WSBL 選秀</a></li>`
					}

					draft_dropdown.innerHTML = temp;
					add_team_dropdown('team-dropdown', 'women');

				}
				var drafts = document.getElementById("draft-dropdown").getElementsByClassName("dropdown-item");
				var teams = document.getElementById("team-dropdown").getElementsByClassName("dropdown-item");
				var draftbtn = document.getElementById("draftbtn");
				var teambtn = document.getElementById("teambtn");

				for (let i = 0; i < drafts.length; i++) {
					drafts[i].addEventListener("click", function () {
						currentDraft = document.getElementById("draft-dropdown").getElementsByClassName("active");
						if (currentDraft.length != 0) currentDraft[0].className = currentDraft[0].className.replace(" active", "");

						currentTeam = document.getElementById("team-dropdown").getElementsByClassName("dropdown-item active");
						if (currentTeam.length != 0) currentTeam[0].className = currentTeam[0].className.replace(" active", "");

						this.className += " active";
						draftbtn.innerHTML = this.innerHTML;
						teambtn.innerHTML = `<img src="../asset/images/logo_round.png" alt="all" class="teamicon">全部球隊</a>`

						f('filter');
					});
				}

				for (let i = 0; i < teams.length; i++) {
					teams[i].addEventListener("click", function () {
						currentTeam = document.getElementById("team-dropdown").getElementsByClassName("active");
						if (currentTeam.length != 0) currentTeam[0].className = currentTeam[0].className.replace(" active", "");

						currentDraft = document.getElementById("draft-dropdown").getElementsByClassName("active");
						if (currentDraft.length != 0) currentDraft[0].className = currentDraft[0].className.replace(" active", "");

						this.className += " active";
						teambtn.innerHTML = this.innerHTML;
						draftbtn.innerHTML = `<img src="../asset/images/logo_round.png" alt="all" class="teamicon">歷屆選秀</a>`;

						f('filter');
					});
				}

				if (this.innerHTML == "男籃") {
					drafts[2].click();
				} else if (this.innerHTML == "女籃") {
					drafts[1].click();
				}
			}
		});
	}
});
