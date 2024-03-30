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
					currentDraft[0].className = currentDraft[0].className.replace(" active", "");
					this.className += " active";

					var currentLeague = this.parentElement.parentElement.parentElement.getElementsByTagName('a')[0];
					if (this.innerHTML.includes("全部選秀")) {
						draftbtn.innerHTML = this.innerHTML;
						if (teams[0].className.includes("active")) {
							if (men_html) {
								teams[1].click();
							} else if (women_html) {
								teams[2].click();
							}
						} else {
							currentTeam = document.getElementById(team_dropdown).getElementsByClassName("active");
							currentTeam[0].click();
						}
					} else {
						draftbtn.innerHTML = this.innerHTML;
						teams[0].click();
					}
				});
			}

			for (let i = 0; i < teams.length; i++) {
				teams[i].addEventListener("click", function () {
					currentTeam = document.getElementById(team_dropdown).getElementsByClassName("dropdown-item active");
					currentTeam[0].className = currentTeam[0].className.replace(" active", "");
					this.className += " active";
					teambtn.innerHTML = this.innerHTML;

					if (this.innerHTML.includes("全部球隊") & drafts[0].className.includes("active")) {
						drafts[3].click();
					} else if (!this.innerHTML.includes("全部球隊") & draftbtn.innerHTML.includes("旅外")) {
						drafts[0].click();
					}
				});
			}
			if (men_html) {
				document.getElementById('draft_dropdown').getElementsByClassName('dropdown-item')[3].click();
			} else if (women_html) {
				document.getElementById('draft_dropdown').getElementsByClassName('dropdown-item')[2].click();
			}

		});
});
