$(document).ready(function () {
	plg_rank = [];
	t1_rank = [];
	sbl_rank = [];
	wsbl_rank = [];
	league = ['plg', 't1', 'sbl', 'wsbl'];

	for (let i = 0; i < 6; i++) {
		if (i < 6) plg_rank.push(plg_team[i + 1])
		if (i < 5) t1_rank.push(t1_team[i + 1])
		if (i < 4) sbl_rank.push(sbl_team[i + 1])
		if (i < 4) wsbl_rank.push(wsbl_team[i + 1])
	}
	team_rank = [plg_rank, t1_rank, sbl_rank, wsbl_rank];
	team_count = [plg_rank.length, t1_rank.length, sbl_rank.length, wsbl_rank.length];


	for (let j = 0; j < 4; j++) {
		fetch(`../data/standings-${league[j]}.csv`)
			.then((response) => response.text())
			.then((result) => {

				if(league[j] == 'wsbl'){
					gender = "women"
				}else{
					gender = "men"
				}

				lines = result.split('\n');
				lines = lines.slice(2);

				table = document.getElementById(`${league[j]}_tbody`)

				rank = team_rank[j];

				teams_info = [];
				for (let i = 0; i < rank.length; i++) {
					team = rank[i];
					w_l = [0, 0, "W-L"];
					gb = 0;
					streak = ["", 0];
					recent5 = [0, 0, "recent5"];
					home_road = [[0, 0], [0, 0], "home_road"];
					ot = [0, 0, "OT"];
					total_pts_w = [0, 0, "Total Points"];
					total_pts_l = [0, 0, "Total Points against"];
					q_points = [0, 0, 0, 0, "Quarter Points"];
					q2_ahead = [0, 0, "Q2 Ahead"];
					q2_behind = [0, 0, "Q2 Behind"];
					q2_tied = [0, 0, "Q2 Tied"];
					q3_ahead = [0, 0, "Q3 Ahead"];
					q3_behind = [0, 0, "Q3 Behind"];
					q3_tied = [0, 0, "Q3 Tied"];
					more_less = [[0, 0], [0, 0], [0, 0], "<=3, 3<pts<10, >=10"];
					lunar = [[0, 0], [0, 0], "lunar stand"];
					cal = [];
					for (let i = 0; i < 12; i++) cal.push([0, 0]);
					matchup = [];
					for (let i = 0; i < rank.length; i++) matchup.push([rank[i], 0, 0, 0]);

					temp = [team, w_l, gb, streak, recent5, home_road, ot, q_points, total_pts_w, total_pts_l,
						q2_ahead, q2_behind, q2_tied, q3_ahead, q3_behind, q3_tied, more_less, lunar, cal, matchup];
					teams_info.push(temp);
				}
				lines.forEach(player => {
					infos = player.split(',');

					teamW_index = findIndex(rank, infos[3]);
					teamL_index = findIndex(rank, infos[11]);

					pts_w = parseInt(infos[10]);
					pts_l = parseInt(infos[18]);

					// W-L
					teams_info[teamW_index][1][0] += 1;
					teams_info[teamL_index][1][1] += 1;
					// matchup
					teams_info[teamW_index][19][teamL_index][1] += 1;
					teams_info[teamL_index][19][teamW_index][2] += 1;
					teams_info[teamW_index][19][teamL_index][3] += pts_w - pts_l
					teams_info[teamL_index][19][teamW_index][3] += pts_l - pts_w
					// streak
					if (teams_info[teamW_index][3][0] == "") {
						teams_info[teamW_index][3][0] = "W"
						teams_info[teamW_index][3][1] += 1;
					} else if (teams_info[teamW_index][3][0] == "W") {
						teams_info[teamW_index][3][1] += 1;
					} else if (teams_info[teamW_index][3][0] == "L") {
						teams_info[teamW_index][3][0] = `L${teams_info[teamW_index][3][1]}`;
					}
					if (teams_info[teamL_index][3][0] == "") {
						teams_info[teamL_index][3][0] = "L"
						teams_info[teamL_index][3][1] += 1;
					} else if (teams_info[teamL_index][3][0] == "L") {
						teams_info[teamL_index][3][1] += 1;
					} else if (teams_info[teamL_index][3][0] == "W") {
						teams_info[teamL_index][3][0] = `W${teams_info[teamL_index][3][1]}`
					}

				});
				SortStandings(teams_info);

				for(let i=0;i<rank.length;i++){
					if (i == 0) {
						no1_w = teams_info[0][1][0];
						no1_l = teams_info[0][1][1];
						teams_info[0][2] = "-"
					} else {
						teams_info[i][2] = ((no1_w - teams_info[i][1][0]) + (teams_info[i][1][1] - no1_l)) / 2
					}
					total_games = teams_info[i][1][0] + teams_info[i][1][1];

					table.innerHTML += `
					<tr>
						<td class="borderR">${i + 1}</td>
						<td class="textL">
							<img src="../asset/images/${gender}/${teams_info[i][0]}.png" alt="${teams_info[i][0]}" class="teamicon">
							<b>${cn_teamName[teams_info[i][0]]}<a style="font-size:12px">${playoff[teams_info[i][0]]}</a></b>
						</td>
						<td>${teams_info[i][1][0] + teams_info[i][1][1]}</td>
						<td>${teams_info[i][1][0]}</td>
						<td>${teams_info[i][1][1]}</td>
						<td>${((teams_info[i][1][0] / total_games) * 100).toFixed(0)}%</td>
						<td>${teams_info[i][2]}</td>
						<td>${teams_info[i][3][0]}</td>
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
				if (count == 0 && today.getDate() == 10 && today.getMonth() == 9) {
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
			} else if (count == 1) {
				text += `，祝她生日快樂！`
			} else if (count > 1) {
				text += `，祝他們生日快樂！`
			}

			table_bday.innerHTML += text;
		})
});