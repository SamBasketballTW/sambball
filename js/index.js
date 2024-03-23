$(document).ready(function () {

	fetch('./data/standings.csv')
		.then((response) => response.text())
		.then((result) => {

			lines = result.split('\n');
			lines = lines.slice(2);

			table_plg = document.getElementById('plg_tb');
			table_t1 = document.getElementById('t1_tb');
			table_sbl = document.getElementById('sbl_tb');
			table_wsbl = document.getElementById('wsbl_tb');

			plg_rank = [];
			t1_rank = [];
			sbl_rank = [];
			wsbl_rank = [];

			infothead = `
			<th style="width:50px">排名</th>
			<th style="width:95px">球隊</th>
			<th style="width:50px">已賽</th>
			<th style="width:50px">勝場</th>
			<th style="width:50px">敗場</th>
			<th style="width:50px">勝率</th>
			<th style="width:50px">勝差</th>
			<th style="width:50px">連勝</th>`

			lines.forEach(player => {
				infos = player.split(',');
				info = ""

				plg_standings_th = "";
				t1_standings_th = "";
				sbl_standings_th = "";
				wsbl_standings_th = "";

				plg_standings = ['-', '-', '-', '-', '-', '-'];
				t1_standings = ['-', '-', '-', '-', '-'];
				sbl_standings = ['-', '-', '-', '-'];
				wsbl_standings = ['-', '-', '-', '-'];
				standings = "";

				if (infos[0] == "plg_rank") {
					plg_rank = [infos[1], infos[2], infos[3], infos[4], infos[5], infos[6]];
					for (let i = 1; i < 7; i++) {
						plg_standings_th += `<th style="width:70px">${shorts[infos[i]]}</th>`
					}
					table_plg.innerHTML += `<thead>${infothead}${plg_standings_th}</thead>`
				} else if (infos[0] == "t1_rank") {
					t1_rank = [infos[1], infos[2], infos[3], infos[4], infos[5]];
					for (let i = 1; i < 6; i++) {
						t1_standings_th += `<th style="width:70px">${shorts[infos[i]]}</th>`
					}
					table_t1.innerHTML += `<thead>${infothead}${t1_standings_th}</thead>`
				} else if (infos[0] == "sbl_rank") {
					sbl_rank = [infos[1], infos[2], infos[3], infos[4], infos[5]];
					for (let i = 1; i < 5; i++) {
						sbl_standings_th += `<th style="width:70px">${shorts[infos[i]]}</th>`
					}
					table_sbl.innerHTML += `<thead>${infothead}${sbl_standings_th}</thead>`
				} else if (infos[0] == "wsbl_rank") {
					wsbl_rank = [infos[1], infos[2], infos[3], infos[4], infos[5]];
					for (let i = 1; i < 5; i++) {
						wsbl_standings_th += `<th style="width:70px">${shorts[infos[i]]}</th>`
					}
					table_wsbl.innerHTML += `<thead>${infothead}${wsbl_standings_th}</thead>`
				}

				if (infos[0] == "plg") {
					table = table_plg
					for (let i = 24; i < 39; i += 3) plg_standings.splice(findRank(plg_rank, infos[i]), 1, infos[i + 1] + "-" + infos[i + 2]);
					for (let i = 0; i < 6; i++) standings += `<td>${plg_standings[i]}</td>`;
				} else if (infos[0] == "t1") {
					table = table_t1
					for (let i = 24; i < 36; i += 3) t1_standings.splice(findRank(t1_rank, infos[i]), 1, infos[i + 1] + "-" + infos[i + 2]);
					for (let i = 0; i < 5; i++) standings += `<td>${t1_standings[i]}</td>`;
				} else if (infos[0] == "sbl") {
					table = table_sbl
					for (let i = 24; i < 33; i += 3) sbl_standings.splice(findRank(sbl_rank, infos[i]), 1, infos[i + 1] + "-" + infos[i + 2]);
					for (let i = 0; i < 4; i++) standings += `<td>${sbl_standings[i]}</td>`;
				} else if (infos[0] == "wsbl") {
					table = table_wsbl
					for (let i = 24; i < 33; i += 3) wsbl_standings.splice(findRank(wsbl_rank, infos[i]), 1, infos[i + 1] + "-" + infos[i + 2]);
					for (let i = 0; i < 4; i++) standings += `<td>${wsbl_standings[i]}</td>`;
				}


				if (infos[0] == "plg" | infos[0] == "t1" | infos[0] == "sbl" | infos[0] == "wsbl") {

					if (infos[0] == "plg" | infos[0] == "t1" | infos[0] == "sbl") {
						gender = "men";
					} else if (infos[0] == "wsbl") {
						gender = "women";
					}

					info += `
					<tbody>
						<tr>
							<td class="borderR">${infos[1]}</td>
							<td>
								<img src="../asset/images/${gender}/${infos[2]}.png" alt="${infos[2]}" class="teamicon">
								<b>${shorts[infos[2]]}</b>
							</td>
							<td>${infos[3]}</td>
							<td>${infos[4]}</td>
							<td>${infos[5]}</td>
							<td>${infos[6]}</td>
							<td>${infos[7]}</td>
							<td class="borderR">${infos[8]}</td>
							${standings}
						</tr>
					</tbody>`

					table.innerHTML += info;
				}
			});
		});

	table_bday = document.getElementById('birthday_td');

	fetch('./data/rosters.csv')
		.then((response) => response.text())
		.then((result) => {

			lines = result.split('\n');
			lines = lines.slice(2);

			count = 0;
			text = "";

			lines.forEach(player => {
				infos = player.split(',');

				const today = new Date();
				const sam = new Date('10/11');
				if (count == 0 && sam.getDate() == today.getDate() && sam.getMonth() == today.getMonth()) {
					text += `今天是 山姆 的生日`
					count += 1;
				}

				if (infos[6] == "active") {
					const birthday = new Date(infos[13]);
					const diff = today - birthday
					const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));

					if (birthday.getDate() == today.getDate() && birthday.getMonth() == today.getMonth()) {
						team_name = cn_teams[infos[4]];
						if (infos[3] != "PLG" & infos[3] != "T1" & infos[3] != "SBL" & infos[3] != "WSBL") {
							team_name = infos[3] + infos[4];
						}
						if (count == 0) {
							text += `今天是 ${team_name}-${infos[1]} ${age}歲生日`
						} else {
							text += `、${team_name}-${infos[1]} ${age}歲生日`;
						}
						count += 1;
					}
				}

			});
			if (count == 0) {
				text += `今天沒有球員生日，祝你有美好的一天！`
			} else if (count == 1) {
				text += `，祝他生日快樂！`
			} else if (count > 1) {
				text += `，祝他們生日快樂！`
			}

			table_bday.innerHTML += text;
		})
});