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

				if (infos[0] == gender & infos[4] != "" & infos[6] != "isFA" & infos[7] != "coach" & infos[7] != "GM") {
					is_oversea = (infos[3] != "PLG" & infos[3] != "T1" & infos[3] != "SBL" & infos[3] != "WSBL");

					if (is_oversea) {
						filter = `oversea ${infos[3]}-bg`
						cn_team_name = `${infos[3]} ${infos[4]}`;
					} else {
						filter = `${infos[4]} ${infos[4]}-bg`;
						cn_team_name = `
						<img src="../asset/images/${gender}/${infos[4]}.png" alt="${infos[4]}" class="teamicon">
							<b>${shorts[infos[4]]}</b>`
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