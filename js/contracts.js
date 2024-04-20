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
					filter = `${filter_team(infos[3], infos[4])} ${bg_team(infos[3], infos[4])}`;

					if (is_oversea(infos[3]) | identity(infos[9]) == "local") {
						filter = ` local`
					} else if (identity(infos[9]) == "import" | infos[7] == "import" | infos[1] == "阿拉薩"){
						filter = ` import`
					} else if (coach_name[infos[4]] == "") {
						filter = ` local`
					} else {
						filter = ` import`
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
						<tr class="filterTr ${filter_team(infos[3], infos[4])} ${bg_team(infos[3], infos[4])} ${filter} ${infos[21]} ${infos[22]} showTr">
							<td class="borderR">${team_name("short", infos[3], infos[4], gender)}</td>
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