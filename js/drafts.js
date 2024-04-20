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
					if (infos[5] == "") teamName = cn_teamName[infos[4]];

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
				document.getElementById('draft_dropdown').getElementsByClassName('dropdown-item')[2].click();
			} else if (women_html) {
				document.getElementById('draft_dropdown').getElementsByClassName('dropdown-item')[1].click();
			}

		});
});
