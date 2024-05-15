$(document).ready(function () {
	men_html = document.getElementById("men_page");
	women_html = document.getElementById("women_page");

	if (men_html) {
		gender = "men"
	} else if (women_html) {
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
					teamName = infos[5];
					if (infos[5] == "") teamName = teamName_full_CN[infos[4]];

					info += `
					<tr class="filterTr ${infos[1]}${infos[2]} ${infos[4]} showTr">	
						<td class="borderR">${infos[1]} ${infos[2].toUpperCase()} 選秀大會</td>
						<td class="borderR">${infos[3]}</td>
						<td class="borderR">${teamName}</td>
						<td>${infos[6]}</td>
					</tr>
					`
				}

				table.innerHTML += info;
			});

			if (men_html) {
				document.getElementById('draft-dropdown').getElementsByClassName('dropdown-item')[2].click();
			} else if (women_html) {
				document.getElementById('draft-dropdown').getElementsByClassName('dropdown-item')[1].click();
			}

		});



	if (men_html) {
		plg_draft = document.getElementById('plg_draft');
		t1_draft = document.getElementById('t1_draft');
		sbl_draft = document.getElementById('sbl_draft');
		for (let i = year['season']; i >= 2020; i--) {
			if (i > 2020) plg_draft.innerHTML += `<li><a class="dropdown-item" onclick="f('${i}plg')">${i} PLG 選秀</a></li>`
			if (i > 2020) t1_draft.innerHTML += `<li><a class="dropdown-item" onclick="f('${i}t1')">${i} T1 選秀</a></li>`
			sbl_draft.innerHTML += `<li><a class="dropdown-item" onclick="f('${i}sbl')">${i} SBL 選秀</a></li>`
		}

	} else if (women_html) {
		wsbl_draft = document.getElementById('draft-dropdown');
		for (let i = year['season']; i >= 2019; i--) {
			wsbl_draft.innerHTML += `<li><a class="dropdown-item" onclick="f('${i}wsbl')">${i} WSBL 選秀</a></li>`
		}
	}

	var drafts = document.getElementById("draft-dropdown").getElementsByClassName("dropdown-item");
	var teams = document.getElementById("team-dropdown_" + gender).getElementsByClassName("dropdown-item");
	var draftbtn = document.getElementById("draftbtn");
	var teambtn = document.getElementById("teambtn");

	for (let i = 0; i < drafts.length; i++) {
		drafts[i].addEventListener("click", function () {
			currentDraft = document.getElementById("draft-dropdown").getElementsByClassName("active");
			if (currentDraft.length != 0) currentDraft[0].className = currentDraft[0].className.replace(" active", "");

			currentTeam = document.getElementById("team-dropdown_" + gender).getElementsByClassName("dropdown-item active");
			if (currentTeam.length != 0) currentTeam[0].className = currentTeam[0].className.replace(" active", "");

			this.className += " active";
			draftbtn.innerHTML = this.innerHTML;
			teambtn.innerHTML = `<img src="../asset/images/logo_round.png" alt="all" class="teamicon">全部球隊</a>`

			f('filter');
		});
	}

	for (let i = 0; i < teams.length; i++) {
		teams[i].addEventListener("click", function () {
			currentTeam = document.getElementById("team-dropdown_" + gender).getElementsByClassName("active");
			if (currentTeam.length != 0) currentTeam[0].className = currentTeam[0].className.replace(" active", "");

			currentDraft = document.getElementById("draft-dropdown").getElementsByClassName("active");
			if (currentDraft.length != 0) currentDraft[0].className = currentDraft[0].className.replace(" active", "");

			this.className += " active";
			teambtn.innerHTML = this.innerHTML;
			draftbtn.innerHTML = `<img src="../asset/images/logo_round.png" alt="all" class="teamicon">歷屆選秀</a>`;

			f('filter');
		});
	}
});
