$(document).ready(function () {
	league = ['plg', 't1', 'sbl', 'wsbl'];
	plg_rank = ['braves', 'kings', 'pilots', 'lioneers', 'dreamers', 'steelers'];
	t1_rank = ['dea', 'mars', 'leopards', 'ghosthawks', 'aquas'];
	sbl_rank = ['beer', 'bank', 'yulon', 'bll'];
	wsbl_rank = ['cathay', 'taipower', 'cht', 'taiyuen'];
	teams_count = [6, 5, 4, 4];
	all_rank = [plg_rank, t1_rank, sbl_rank, wsbl_rank];

	for (let lgue = 0; lgue < league.length; lgue++) {
		fetch(`../data/standings-${league[lgue]}.csv`)
			.then((response) => response.text())
			.then((result) => {

				if (league[lgue] == 'wsbl') {
					gender = "women"
				} else {
					gender = "men"
				}

				lines = result.split('\n');
				lines = lines.slice(2);

				table = document.getElementById(`${league[lgue]}_tbody`)

				rank = all_rank[lgue];

				teams_info = [];
				for (let i = 0; i < rank.length; i++) {
					team = rank[i];
					w_l = [0, 0, "W-L"];
					streak = ["", 0];
					matchup = [];
					for (let i = 0; i < rank.length; i++) matchup.push([rank[i], 0, 0, 0]);

					temp = [team, '', w_l, '', streak, matchup];
					tI = ['team', 'playoff', 'w_l', 'gb', 'streak', 'matchup'];
					teams_info.push(temp);
				}
				lines.forEach(player => {
					infos = player.split(',');

					teamW_index = findIndex(rank, infos[3]);
					teamL_index = findIndex(rank, infos[11]);

					pts_w = parseInt(infos[10]);
					pts_l = parseInt(infos[18]);

					// W-L
					teams_info[teamW_index][2][0] += 1;
					teams_info[teamL_index][2][1] += 1;
					// streak
					if (teams_info[teamW_index][4][0] == "") {
						teams_info[teamW_index][4][0] = "W"
						teams_info[teamW_index][4][1] += 1;
					} else if (teams_info[teamW_index][4][0] == "W") {
						teams_info[teamW_index][4][1] += 1;
					} else if (teams_info[teamW_index][4][0] == "L") {
						teams_info[teamW_index][4][0] = 'L' + teams_info[teamW_index][4][1];
					}
					if (teams_info[teamL_index][4][0] == "") {
						teams_info[teamL_index][4][0] = "L"
						teams_info[teamL_index][4][1] += 1;
					} else if (teams_info[teamL_index][4][0] == "L") {
						teams_info[teamL_index][4][1] += 1;
					} else if (teams_info[teamL_index][4][0] == "W") {
						teams_info[teamL_index][4][0] = 'W' + teams_info[teamL_index][4][1];
					}
					// matchup
					teams_info[teamW_index][findIndex(tI, 'matchup')][teamL_index][1] += 1;
					teams_info[teamL_index][findIndex(tI, 'matchup')][teamW_index][2] += 1;
					teams_info[teamW_index][findIndex(tI, 'matchup')][teamL_index][3] += pts_w - pts_l
					teams_info[teamL_index][findIndex(tI, 'matchup')][teamW_index][3] += pts_l - pts_w

				});
				SortStandings(teams_info);

				temp_w = (games[league[lgue]] / (teams_info.length - 1)) / 2;
				for (let i = 0; i < teams_info.length; i++) {
					stand_behind = 0;
					stand_ahead = 0;
					for (let j = 0; j < teams_info.length; j++) {
						if (i < j) {
							if (teams_info[i][2][0] > (games[league[lgue]] - teams_info[j][2][1])) {
								stand_ahead += 1;
							} else if (teams_info[i][2][0] == (games[league[lgue]] - teams_info[j][2][1])) {
								if (teams_info[i][findIndex(tI, 'matchup')][j][1] > temp_w) {
									stand_ahead += 1;
								} else if (teams_info[i][findIndex(tI, 'matchup')][j][1] == temp_w & teams_info[i][findIndex(tI, 'matchup')][j][2] == temp_w) {
									if (teams_info[i][findIndex(tI, 'matchup')][j][3] > 0) {
										stand_ahead += 1;
									}
								}
							}
						} else if (i > j) {
							if (teams_info[j][2][0] > (games[league[lgue]] - teams_info[i][2][1])) {
								stand_behind += 1;
							} else if (teams_info[j][2][0] == (games[league[lgue]] - teams_info[i][2][1])) {
								if (teams_info[i][findIndex(tI, 'matchup')][j][2] > temp_w) {
									stand_behind += 1;
								} else if (teams_info[i][findIndex(tI, 'matchup')][j][1] == temp_w & teams_info[i][findIndex(tI, 'matchup')][j][2] == temp_w) {
									if (teams_info[i][findIndex(tI, 'matchup')][j][3] < 0) {
										stand_behind += 1;
									}
								}
							}
						}
					}
					if ((stand_behind + stand_ahead + 1) == teams_count[lgue]) teams_info[i][1] += 'p';
					if (stand_ahead >= (teams_count[lgue] - po_teams[league[lgue]])) teams_info[i][1] += 'x';
					if (stand_behind >= po_teams[league[lgue]]) teams_info[i][1] += 'o';
					if (teams_info[i][1] != '') {
						teams_info[i][1] = '- ' + teams_info[i][1];
					}
				}

				for (let i = 0; i < teams_info.length; i++) {
					if (i == 0) {
						no1_w = teams_info[0][2][0];
						no1_l = teams_info[0][2][1];
						teams_info[0][3] = "-"
					} else {
						teams_info[i][3] = ((no1_w - teams_info[i][2][0]) + (teams_info[i][2][1] - no1_l)) / 2
					}
					total_games = teams_info[i][2][0] + teams_info[i][2][1];

					table.innerHTML += `
					<tr>
						<td class="borderR">${i + 1}</td>
						<td class="textL" style="font-size:14px">
							${team_name("full", '', teams_info[i][0], gender)}<a style="font-size:12px"><b>${teams_info[i][1]}</a></b>
						</td>
						<td>${teams_info[i][2][0] + teams_info[i][2][1]}</td>
						<td>${teams_info[i][2][0]}</td>
						<td>${teams_info[i][2][1]}</td>
						<td>${((teams_info[i][2][0] / total_games) * 100).toFixed(0)}%</td>
						<td>${teams_info[i][3]}</td>
						<td>${teams_info[i][4][0]}</td>
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
			text = ``;
			gender = "";

			lines.forEach(player => {
				infos = player.split(',');

				const today = new Date();
				const sam = new Date('10/11');
				const blackie = new Date('1977/5/2');
				if (count == 0 && today.getDate() == sam.getDate() && today.getMonth() == sam.getMonth()) {
					text += `今天是 山姆 的生日`
					count += 1;
					gender = "men";
				} else if (count == 0 && today.getDate() == blackie.getDate() && today.getMonth() == blackie.getMonth()) {
					text += `今天是 PLG聯盟副會長-陳建州 ${age(blackie)}歲生日`
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
function SortStandings(list) {
	m = findIndex(tI, 'matchup');
	needSort = 0;
	for (let i = 0; i < list.length - 1; i++) {
		team1 = list[i][2][0] / (list[i][2][0] + list[i][2][1]);
		team2 = list[i + 1][2][0] / (list[i + 1][2][0] + list[i + 1][2][1]);
		if (team1 < team2) {
			needSort = 1;
			temp = list[i];
			list[i] = list[i + 1];
			list[i + 1] = temp;
			for (let j = 0; j < list.length; j++) {
				temp2 = list[j][m][i];
				list[j][m][i] = list[j][m][i + 1];
				list[j][m][i + 1] = temp2;
			}
		} else if (team1 == team2) {
			matchup_w = list[i][m][findIndex(rank, list[i + 1][0])][1];
			matchup_l = list[i][m][findIndex(rank, list[i + 1][0])][2];
			if (matchup_l > matchup_w) {
				needSort = 1;
				temp = list[i];
				list[i] = list[i + 1];
				list[i + 1] = temp;
				for (let j = 0; j < list.length; j++) {
					temp2 = list[j][m][i];
					list[j][m][i] = list[j][m][i + 1];
					list[j][m][i + 1] = temp2;
				}
			} else if (matchup_l == matchup_w) {
				if (list[i][m][findIndex(rank, list[i + 1][0])][3] < 0) {
					needSort = 1;
					temp = list[i];
					list[i] = list[i + 1];
					list[i + 1] = temp;
					for (let j = 0; j < list.length; j++) {
						temp2 = list[j][m][i];
						list[j][m][i] = list[j][m][i + 1];
						list[j][m][i + 1] = temp2;
					}
				}
			}

		}
	}
	if (needSort == 1) {
		SortStandings(list);
	}
	return list;
}