$(document).ready(function () {
	men_html = document.getElementById("men_page");
	women_html = document.getElementById("women_page");

	if (men_html) {
		gender = "men"
	} else if (women_html) {
		gender = "women"
	}

	fetch('../data/rosters.csv')
		.then((response) => response.text())
		.then((result) => {

			lines = result.split('\n');
			lines = lines.slice(2);

			table = document.getElementById('contracts_tbody');

			lines.forEach(player => {
				infos = player.split(',');
				info = ""

				if (infos[0] == gender & infos[4] != "" & infos[4] !=  "fa" & infos[7] != "coach") {
					is_oversea = infos[3] != "PLG" & infos[3] != "T1" & infos[3] != "SBL" & infos[3] != "WSBL";

					if (is_oversea) {
						filter = `oversea local ${infos[3]}-bg`
						cn_team_name = `${infos[3]} ${infos[4]}`;
					}else {
						filter = `${infos[4]} ${infos[4]}-bg`;
						cn_team_name = `
						<img src="../asset/images/${gender}/${infos[4]}.png" alt="${infos[4]}" class="teamicon">
							<b>${short_teamName[infos[4]]}</b>`
					}

					if (infos[7] == "import"){
						filter += ` import`
					}else if (is_oversea | infos[9] == "本土" | infos[9] == "華裔" | infos[9] == "外籍生" | coach_name[infos[1]]) {
						filter += ` local`
					}else if (coach_name[infos[4]] == "") {
						filter += ` local`
					}else {
						filter += ' import'
					}

					url = ""
					for (let i = 27; i < 30; i += 2) {
						if (infos[i] != "") {
							url += `
							<a style="color:inherit; text-decoration:underline" href="${infos[i + 1]}" target="_blank">
							<i class="bi bi-link-45deg"></i>${infos[i]}</a>`;
						}
					}

					info += `
						<tr class="filterTr ${filter} ${infos[21]} ${infos[22]} ${infos[23]} showTr">
							<td class="borderR">${cn_team_name}</td>
							<td class="borderR">${infos[2]}</td>
							<td class="borderR"><a style="text-decoration:underline;color:inherit" href="${infos[5]}" target="_blank">${infos[1]}</a></td>
							<td>${infos[23]}</td>
							<td class="borderR">${infos[24]}</td>
							<td class="borderR">${infos[25]}</td>
							<td class="borderR">${infos[26]}</td>
							<td>${url}</td>
						</tr>`
				}

				table.innerHTML += info;
			});
		});
});