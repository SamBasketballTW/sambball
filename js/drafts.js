$(document).ready(function () {
	men_html = document.getElementById("men_page");
	women_html = document.getElementById("women_page");

	if (men_html) {
		team_dropdown = 'team-dropdown_m';
		gender = "men"
	} else if (women_html) {
		team_dropdown = 'team-dropdown_w';
		gender = "women"
	}

	fetch('../data/drafts.csv')
		.then((response) => response.text())
		.then((result) => {

			lines = result.split('\n');
			lines = lines.slice(2);

			table = document.getElementById('drafts_tbody');

			lines.forEach(player => {
				infos = player.split(',');
				info = ""

				if (infos[0] == gender) {
					team_name = infos[5];
					if (infos[5] == "") team_name = cn_teamName[infos[4]];

					info += `
					<tr class="filterTr ${infos[1]}${infos[2]} ${infos[4]} showTr">	
						<td class="borderR">${infos[1]} ${infos[2].toUpperCase()} 選秀大會</td>
						<td class="borderR">${infos[3]}</td>
						<td class="borderR">${team_name}</td>
						<td>${infos[6]}</td>
					</tr>
					`
				}

				table.innerHTML += info;
			});

			var drafts = document.getElementById("draft_dropdown").getElementsByClassName("dropdown-item");
			var teams = document.getElementById(team_dropdown).getElementsByClassName("dropdown-item");
			var draftbtn = document.getElementById("draftbtn");
			var teambtn = document.getElementById("teambtn");

			for (let i = 0; i < drafts.length; i++) {
				drafts[i].addEventListener("click", function () {
					currentDraft = document.getElementById("draft_dropdown").getElementsByClassName("active");
					if (currentDraft.length != 0 ) currentDraft[0].className = currentDraft[0].className.replace(" active", "");

					currentTeam = document.getElementById(team_dropdown).getElementsByClassName("dropdown-item active");
					if (currentTeam.length != 0 ) currentTeam[0].className = currentTeam[0].className.replace(" active", "");

					this.className += " active";
					draftbtn.innerHTML = this.innerHTML;
					teambtn.innerHTML = `<img src="../asset/images/logo_round.png" alt="all" class="teamicon">全部球隊</a>`

				});
			}

			for (let i = 0; i < teams.length; i++) {
				teams[i].addEventListener("click", function () {
					currentTeam = document.getElementById(team_dropdown).getElementsByClassName("active");
					if(currentTeam.length != 0) currentTeam[0].className = currentTeam[0].className.replace(" active", "");

					currentDraft = document.getElementById("draft_dropdown").getElementsByClassName("active");
					if (currentDraft.length != 0 ) currentDraft[0].className = currentDraft[0].className.replace(" active", "");

					this.className += " active";
					teambtn.innerHTML = this.innerHTML;
					draftbtn.innerHTML = `歷屆選秀`;

				});
			}
			if (men_html) {
				document.getElementById('draft_dropdown').getElementsByClassName('dropdown-item')[2].click();
			} else if (women_html) {
				document.getElementById('draft_dropdown').getElementsByClassName('dropdown-item')[1].click();
			}

		});
});
