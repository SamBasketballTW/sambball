$(document).ready(function () {

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
				if (this.innerHTML == '男籃') {
					var draft_dropdown = document.getElementById('draft-dropdown');
					draft_items = `
					<li><a class="dropdown-item"">CBA & 旅外</a></li>
					<li><hr class="dropdown-divider"></li>
					<li>
						<a class="dropdown-item disabled" style="color:black">PLG</a>
						<ul class="dropdown-menu dropdown-submenu">`
					for (let i = 2024; i >= 2021; i--) {
						draft_items += `<li><a class="dropdown-item" value="${i}plg">${i} PLG 選秀</a></li>`
					}
					draft_items += `</ul></li>
					<li>
						<a class="dropdown-item disabled" style="color:black">TPBL</a>
						<ul class="dropdown-menu dropdown-submenu">`
					for (let i = 2024; i >= 2024; i--) {
						draft_items += `<li><a class="dropdown-item" value="${i}tpbl">${i} TPBL 選秀</a></li>`
					}
					draft_items += `</ul></li>
					<li>
						<a class="dropdown-item disabled" style="color:black">T1</a>
						<ul class="dropdown-menu dropdown-submenu">`
					for (let i = 2023; i >= 2021; i--) {
						draft_items += `<li><a class="dropdown-item" value="${i}t1">${i} T1 選秀</a></li>`
					}
					draft_items += `</ul></li>
					<li>
						<a class="dropdown-item disabled" style="color:black">SBL</a>
						<ul class="dropdown-menu dropdown-submenu">`
					for (let i = 2024; i >= 2020; i--) {
						draft_items += `<li><a class="dropdown-item" value="${i}sbl">${i} SBL 選秀</a></li>`
					}
					draft_items += `</ul></li>`

					draft_dropdown.innerHTML = draft_items;
					add_team_dropdown('team-dropdown', 'men');

				} else if (this.innerHTML == '女籃') {
					var draft_dropdown = document.getElementById('draft-dropdown');
					draft_items = `
					<li><a class="dropdown-item" value="oversea">WCBA & 旅外</a></li>
					<li><hr class="dropdown-divider"></li>`
					for (let i = 2024; i >= 2019; i--) {
						draft_items += `<li><a class="dropdown-item" value="${i}wsbl">${i} WSBL 選秀</a></li>`
					}
					draft_dropdown.innerHTML = draft_items;
					add_team_dropdown('team-dropdown', 'women');
				}

				var drafts = document.getElementById("draft-dropdown").getElementsByClassName("dropdown-item");
				var draftbtn = document.getElementById("draftbtn");
				var teams = document.getElementById("team-dropdown").getElementsByClassName("dropdown-item");
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

						showDraftsInfo();
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

						showDraftsInfo();
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

	genders[0].click();
});
function showDraftsInfo() {
	var currentGender = document.getElementById("gender-dropdown").getElementsByClassName("active");
	var filter_gender = currentGender[0].getAttribute("value");
	var currentDraft = document.getElementById("draft-dropdown").getElementsByClassName("active");
	var currentTeam = document.getElementById("team-dropdown").getElementsByClassName("active");

	if (currentDraft.length == 0) {
		filter_draft = '';
		filter_team = currentTeam[0].getAttribute("value");
	} else if (currentTeam.length == 0) {
		if (currentDraft[0].innerHTML.includes('CBA')) {
			filter_draft = '';
			filter_team = 'oversea';
		} else {
			filter_draft = currentDraft[0].getAttribute("value");
			filter_team = '';
		}
	}

	fetch('../data/drafts.csv')
		.then((response) => response.text())
		.then((result) => {
			lines = result.split('\n');
			lines = lines.slice(1);

			drafts_info = '';
			currentYear = '';
			count = 0;

			lines.forEach(line => {
				infos = line.split(',');

				let [
					gender,
					year,
					league,
					pick,
					team_id,
					team_name,
					player

				] = infos;

				if (gender == filter_gender) {
					showDraft = 0;
					if (filter_draft != '' & filter_draft == (year + league)) {
						showDraft = 1;
					} else if (filter_team != '' & team_id == filter_team) {
						showDraft = 1;
					}

					if (showDraft == 1) {
						if (currentYear != year) {
							if (currentYear != '') {
								drafts_info += `
								<tr style="background-color:#BBBBBB; hover:#BBBBBB">
									<td class="borderR"></td>
									<td class="borderR"></td>
									<td class="borderR"></td>
									<td></td>
								</tr>`
							}
							count += 1;
							currentYear = year;
						}
						if (team_name == '') team_name = teamName('full', '', team_id);

						drafts_info += `
						<tr>
							<td class="borderR">${year} ${league.toUpperCase()} 選秀大會</td>
							<td class="borderR">${pick}</td>
							<td class="borderR">${team_name}</td>
							<td>${player}</td>
						</tr>`
					}
				}
			})

			drafts_tbody = document.getElementById('drafts_tbody');
			drafts_tbody.innerHTML = drafts_info;
		})
}