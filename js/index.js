class Standings {
	constructor(gender, league, id, playoff = '', w = 0, l = 0, gb = '', streak = '', streak_count = 0, matchup = []){
		this.gender = gender;
		this.league = league;
		this.id = id;
		this.playoff = playoff;
		this.w = w;
		this.l = l;
		this.gb = gb;
		this.streak = streak;
		this.streak_count = streak_count;
		this.matchup = matchup;
	}
}
class Matchup {
	constructor(id, w = 0, l = 0, win_pts = 0){
		this.id = id;
		this.w = w;
		this.l = l;
		this.win_pts = win_pts;
	}
}

$(document).ready(function () {
	league = ['plg', 't1', 'sbl', 'wsbl'];
	plg_rank = ['braves', 'kings', 'pilots', 'lioneers', 'dreamers', 'steelers'];
	t1_rank = ['dea', 'mars', 'leopards', 'ghosthawks', 'aquas'];
	sbl_rank = ['beer', 'bank', 'yulon', 'bll'];
	wsbl_rank = ['cathay', 'taipower', 'cht', 'taiyuen'];

	for (let lg = 0; lg < 4; lg++) {
		fetch(`../data/standings-${league[lg]}.csv`)
			.then((response) => response.text())
			.then((result) => {

				lines = result.split('\n');
				lines = lines.slice(2);

				table = document.getElementById(`${league[lg]}_tbody`)

				stand_info = [];
				if(league[lg] == 'plg'){
					teams = plg_rank;
				}else if(league[lg] == 't1'){
					teams = t1_rank;
				}else if(league[lg] == 'sbl'){
					teams = sbl_rank
				}else if(league[lg] == 'wsbl'){
					teams = wsbl_rank;
				}
				for(let i = 0; i<teams.length;i++) stand_info.push(new Standings('men',league[lg],teams[i]));

				for(let i = 0; i<stand_info.length; i++){
					for(let j =0; j<teams.length;j++){
						stand_info[i].matchup.push(new Matchup(teams[j]));
					}
				}
				lines.forEach(player => {
					infos = player.split(',');

					teamW_index = findIndex(teams, infos[3]);
					teamL_index = findIndex(teams, infos[11]);

					pts_w = parseInt(infos[10]);
					pts_l = parseInt(infos[18]);

					stand_info[teamW_index].w += 1;
					stand_info[teamL_index].l += 1;

					if (stand_info[teamW_index].streak == "") {
						stand_info[teamW_index].streak = "W"
						stand_info[teamW_index].streak_count += 1;
					} else if (stand_info[teamW_index].streak == "W") {
						stand_info[teamW_index].streak_count += 1;
					} else if (stand_info[teamW_index].streak == "L") {
						stand_info[teamW_index].streak = 'L' + stand_info[teamW_index].streak_count;
					}
					if (stand_info[teamL_index].streak == "") {
						stand_info[teamL_index].streak = "L"
						stand_info[teamL_index].streak_count += 1;
					} else if (stand_info[teamL_index].streak == "L") {
						stand_info[teamL_index].streak_count += 1;
					} else if (stand_info[teamL_index].streak == "W") {
						stand_info[teamL_index].streak = 'W' + stand_info[teamL_index].streak_count;
					}

					stand_info[teamW_index].matchup[teamL_index].w += 1;
					stand_info[teamL_index].matchup[teamW_index].l += 1;
					stand_info[teamW_index].matchup[teamW_index].win_pts += pts_w - pts_l
					stand_info[teamW_index].matchup[teamL_index].win_pts += pts_w - pts_l
					stand_info[teamL_index].matchup[teamW_index].win_pts += pts_l - pts_w

				});
				sortStandings();
				console.log(stand_info);

				temp_w = (games[league[lg]] / (stand_info.length - 1)) / 2;
				for (let i = 0; i < stand_info.length; i++) {
					stand_behind = 0;
					stand_ahead = 0;
					for (let j = 0; j < stand_info.length; j++) {
						if (i < j) {
							if (stand_info[i].w > (games[league[lg]] - stand_info[j].l)) {
								stand_ahead += 1;
							} else if (stand_info[i].w == (games[league[lg]] - stand_info[j].l)) {
								if (stand_info[i].matchup[j].w > temp_w) {
									stand_ahead += 1;
								} else if (stand_info[i].matchup[j].w == temp_w & stand_info[i].matchup[j].l == temp_w) {
									if (stand_info[i].matchup[j].win_pts > 0) {
										stand_ahead += 1;
									}
								}
							}
						} else if (i > j) {
							if (stand_info[j].w > (games[league[lg]] - stand_info[i].l)) {
								stand_behind += 1;
							} else if (stand_info[j].w == (games[league[lg]] - stand_info[i].l)) {
								if (stand_info[i].matchup[j].l > temp_w) {
									stand_behind += 1;
								} else if (stand_info[i].matchup[j].w == temp_w & stand_info[i].matchup[j].l == temp_w) {
									if (stand_info[i].matchup[j].win_pts < 0) {
										stand_behind += 1;
									}
								}
							}
						}
					}
					if ((stand_behind + stand_ahead + 1) == stand_info.length) stand_info[i].playoff += 'p';
					if (stand_ahead >= (stand_info.length - po_teams[league[lg]])) stand_info[i].playoff += 'x';
					if (stand_behind >= po_teams[league[lg]]) stand_info[i].playoff += 'o';
					if (stand_info[i].playoff != '') {
						stand_info[i].playoff = '- ' + stand_info[i].playoff;
					}
				}

				for (let i = 0; i < stand_info.length; i++) {
					if (i == 0) {
						no1_w = stand_info[0].w;
						no1_l = stand_info[0].l;
						stand_info[0].gb = "-"
					} else {
						stand_info[i].gb = ((no1_w - stand_info[i].w) + (stand_info[i].l - no1_l)) / 2
					}
					total_games = stand_info[i].w + stand_info[i].l;

					table.innerHTML += `
					<tr>
						<td class="borderR">${i + 1}</td>
						<td class="textL" style="font-size:14px">
							${teamName('full','',stand_info[i].id,'img')}<a style="font-size:12px"><b>${stand_info[i].playoff}</a></b>
						</td>
						<td>${total_games}</td>
						<td>${stand_info[i].w}</td>
						<td>${stand_info[i].l}</td>
						<td>${((stand_info[i].w / total_games) * 100).toFixed(0)}%</td>
						<td>${stand_info[i].gb}</td>
						<td>${stand_info[i].streak}</td>
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
							text += `今天是 ${teamName('full',infos[3],infos[4])}-${infos[1]} ${birthToAge(infos[13])}歲生日`
						} else {
							text += `、${teamName('full',infos[3],infos[4])}-${infos[1]} ${birthToAge(infos[13])}歲生日`;
						}
						count += 1;
						gender = infos[0];
					}
				}

			});

			if (count == 0) {
				text += `今天沒有球員生日，祝你有美好的一天！`
			} else if (count == 1 & gender == "women") {
				text += `，祝她生日快樂！`
			} else if (count == 1) {
				text += `，祝他生日快樂！`
			} else if (count > 1) {
				text += `，祝他們生日快樂！`
			}

			table_bday.innerHTML += text;
		})
});
function sortStandings() {
	needSort = 0;
	for (let i = 0; i < stand_info.length - 1; i++) {
		team1 = stand_info[i].w / (stand_info[i].w + stand_info[i].l);
		team2 = stand_info[i+1].w / (stand_info[i+1].w + stand_info[i+1].l);
		if (team1 < team2) {
			needSort = 1;
			temp1 = stand_info[i];
			stand_info[i] = stand_info[i + 1];
			stand_info[i + 1] = temp1;
			for (let j = 0; j < stand_info.length; j++) {
				temp2 = stand_info[j].matchup[i];
				stand_info[j].matchup[i] = stand_info[j].matchup[i+1];
				stand_info[j].matchup[i + 1] = temp2;
			}
		} else if (team1 == team2) {
			matchup_w = stand_info[i].matchup[findIndex(teams, stand_info[i + 1].id)].w;
			matchup_l = stand_info[i].matchup[findIndex(teams, stand_info[i + 1].id)].l;
			if (matchup_l > matchup_w) {
				needSort = 1;
				temp1 = stand_info[i];
				stand_info[i] = stand_info[i + 1];
				stand_info[i + 1] = temp1;
				for (let j = 0; j < stand_info.length; j++) {
					temp2 = stand_info[j].matchup[i];
					stand_info[j].matchup[i] = stand_info[j].matchup[i+1];
					stand_info[j].matchup[i + 1] = temp2;
				}
			} else if (matchup_l == matchup_w) {
				if (stand_info[i].matchup[findIndex(teams, stand_info[i + 1].id)].win_pts < 0) {
					needSort = 1;
					temp1 = stand_info[i];
					stand_info[i] = stand_info[i + 1];
					stand_info[i + 1] = temp1;
					for (let j = 0; j < stand_info.length; j++) {
						temp2 = stand_info[j].matchup[i];
						stand_info[j].matchup[i] = stand_info[j].matchup[i+1];
						stand_info[j].matchup[i + 1] = temp2;
					}
				}
			}

		}
	}
	if (needSort == 1) {
		sortStandings();
	}
}