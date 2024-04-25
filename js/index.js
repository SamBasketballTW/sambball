$(document).ready(function () {
	plg_rank = [];
	t1_rank = [];
	sbl_rank = [];
	wsbl_rank = [];
	league = ['plg', 't1', 'sbl', 'wsbl'];

	for (let i = 0; i < 6; i++) {
		if (i < 6) plg_rank.splice(i, 0, plg_teamRank[i + 1])
		if (i < 5) t1_rank.splice(i, 0, t1_teamRank[i + 1])
		if (i < 4) sbl_rank.splice(i, 0, sbl_teamRank[i + 1])
		if (i < 4) wsbl_rank.splice(i, 0, wsbl_teamRank[i + 1])
	}
	rank = [plg_rank, t1_rank, sbl_rank, wsbl_rank];
	team_count = [plg_rank.length, t1_rank.length, sbl_rank.length, wsbl_rank.length];


	for (let j = 0; j < 4; j++) {
		fetch(`../data/standings-${league[j]}.csv`)
			.then((response) => response.text())
			.then((result) => {

				lines = result.split('\n');
				lines = lines.slice(2);

				table = document.getElementById(`${league[j]}_tbody`)

				for (let i = 0; i < team_count[j]; i++) {
					team = rank[j][i];
					w_l = [0, 0];
					gb = 0;
					streak = ["", 0];

					lines.forEach(player => {
						infos = player.split(',');
						info = ""

						if (league[j] == "wsbl") {
							gender = "women"
						} else {
							gender = "men"
						}

						if (infos[3] == team) {
							w_l[0] += 1;
							if (streak[0] == "") {
								streak[0] = "W"
								streak[1] += 1;
							} else if (streak[0] == "W") {
								streak[1] += 1;
							} else if (streak [0]== "L") {
								streak[0] = `L${streak[1]}`;
							}
						} else if (infos[11] == team) {
							w_l[1] += 1;
							if (streak[0] == "") {
								streak[0] = "L"
								streak[1] += 1;
							} else if (streak[0] == "L") {
								streak[1] += 1;
							} else if (streak[0] == "W") {
								streak[0] = `W${streak[1]}`
							}
						}

					});

					if (team == rank[j][0]) {
						no1 = [w_l[0], w_l[1]];
						gb = "-"
					} else {
						gb = ((no1[0] - w_l[0]) + (w_l[1] - no1[1])) / 2
					}
					table.innerHTML += `
					<tr>
						<td class="borderR">${i + 1}</td>
						<td class="textL" style="font-size:14px">
							<img src="../asset/images/${gender}/${team}.png" alt="${team}" class="teamicon">
							<b>${cn_teamName[team]}<a style="font-size:12px">${playoff[team]}</a></b>
						</td>
						<td>${w_l[0] + w_l[1]}</td>
						<td>${w_l[0]}</td>
						<td>${w_l[1]}</td>
						<td>${((w_l[0] / (w_l[0] + w_l[1])) * 100).toFixed(0)}%</td>
						<td>${gb}</td>
						<td>${streak[0]}</td>
					</tr>`
				}

			});
	}

	table_bday = document.getElementById('birthday_td');

	fetch('./data/rosters.csv')
		.then((response) => response.text())
		.then((result) => {

			lines = result.split('\n');
			lines = lines.slice(2);

			count = 0;
			text = "";
			gender = "";

			lines.forEach(player => {
				infos = player.split(',');

				const today = new Date();
				const sam = new Date('10/11');
				if (count == 0 && sam.getDate() == today.getDate() && sam.getMonth() == today.getMonth()) {
					text += `今天是 山姆 的生日`
					count += 1;
					gender = "men";
				}

				if (infos[6] == "active") {
					birthday = new Date(infos[13]);

					if (birthday.getDate() == today.getDate() && birthday.getMonth() == today.getMonth()) {
						if (count == 0) {
							text += `今天是 ${team_name("full", infos[3], infos[4])}-${infos[1]} ${age(infos[13])}歲生日`
						} else {
							text += `、${team_name("full", infos[3], infos[4])}-${infos[1]} ${age(infos[13])}歲生日`;
						}
						count += 1;
						gender = infos[0];
					}
				}

			});

			if (count == 0) {
				text += `今天沒有球員生日，祝你有美好的一天！`
			} else if (count == 1 & gender == "men") {
				text += `，祝他生日快樂！`
			} else if (count == 1){
				text += `，祝她生日快樂！`
			} else if (count > 1) {
				text += `，祝他們生日快樂！`
			}

			table_bday.innerHTML += text;
		})

});
