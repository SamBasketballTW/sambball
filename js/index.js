class Standings {
	constructor(gender, league, id, playoff = '', w = 0, l = 0, gb = '', streak = '', streak_count = 0, matchup = []) {
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
	constructor(id, w = 0, l = 0, win_pts = 0) {
		this.id = id;
		this.w = w;
		this.l = l;
		this.win_pts = win_pts;
	}
}

$(document).ready(function () {
	document.getElementById('plg-champ').innerHTML = `
	<td class="${teamBG('kings')}">P. LEAGUE+ 2023-24年度總冠軍: ${teamName('full', '', 'kings')}</td>`

	document.getElementById('t1-champ').innerHTML = `
	<td class="${teamBG('leopards')}">T1 LEAGUE 2023-24年度總冠軍: ${teamName('full', '', 'leopards')}</td>`

	document.getElementById('sbl-champ').innerHTML = `
	<td class="${teamBG('yulon')}">第21屆 SBL年度總冠軍: ${teamName('full', '', 'yulon')}</td>`

	document.getElementById('wsbl-champ').innerHTML = `
	<td class="${teamBG('cathay')}">第21屆 WSBL年度總冠軍: ${teamName('full', '', 'cathay')}</td>`

	league = ['plg', 't1', 'sbl', 'wsbl'];
	champ = ['kings', 'leopards', 'yulon', 'cathay'];
	plg_teams = ['braves', 'kings', 'pilots', 'lioneers', 'dreamers', 'steelers'];
	t1_teams = ['dea', 'mars', 'leopards', 'ghosthawks', 'aquas'];
	sbl_teams = ['beer', 'bank', 'yulon', 'bll'];
	wsbl_teams = ['cathay', 'taipower', 'cht', 'taiyuen'];

	for (let lg = 0; lg < 4; lg++) {
		fetch(`../data/standings-${league[lg]}.csv`)
			.then((response) => response.text())
			.then((result) => {

				lines = result.split('\n');
				lines = lines.slice(2);

				table = document.getElementById(`${league[lg]}_tbody`)

				stand_info = [];
				if (league[lg] == 'plg') {
					teams = plg_teams;
					games = 40;
					po_teams = 4;
				} else if (league[lg] == 't1') {
					teams = t1_teams;
					games = 28
					po_teams = 4
				} else if (league[lg] == 'sbl') {
					teams = sbl_teams;
					games = 30;
					po_teams = 3;
				} else if (league[lg] == 'wsbl') {
					teams = wsbl_teams;
					games = 30;
					po_teams = 3;
				}
				for (let i = 0; i < teams.length; i++) stand_info.push(new Standings('men', league[lg], teams[i]));

				for (let i = 0; i < stand_info.length; i++) {
					for (let j = 0; j < teams.length; j++) {
						stand_info[i].matchup.push(new Matchup(teams[j]));
					}
				}
				lines.forEach(player => {
					infos = player.split(',');

					let [
						league,
						game,
						date,
						teamW,
						teamW_home_road,
						teamW_q1,
						teamW_q2,
						teamW_q3,
						teamW_q4,
						teamW_ot,
						teamW_pts,
						teamL,
						teamL_home_road,
						teamL_q1,
						teamL_q2,
						teamL_q3,
						teamL_q4,
						teamL_ot,
						teamL_pts

					] = infos;

					teamW_index = teams.indexOf(teamW);
					teamL_index = teams.indexOf(teamL);

					teamW_pts = parseInt(teamW_pts);
					teamL_pts = parseInt(teamL_pts);

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
					stand_info[teamW_index].matchup[teamW_index].win_pts += teamW_pts - teamL_pts
					stand_info[teamW_index].matchup[teamL_index].win_pts += teamW_pts - teamL_pts
					stand_info[teamL_index].matchup[teamW_index].win_pts += teamL_pts - teamW_pts

				});
				sortStandings();

				temp_w = (games / (stand_info.length - 1)) / 2;
				for (let i = 0; i < stand_info.length; i++) {
					stand_behind = 0;
					stand_ahead = 0;
					for (let j = 0; j < stand_info.length; j++) {
						if (i < j) {
							if (stand_info[i].w > (games - stand_info[j].l)) {
								stand_ahead += 1;
							} else if (stand_info[i].w == (games - stand_info[j].l)) {
								if (stand_info[i].matchup[j].w > temp_w) {
									stand_ahead += 1;
								} else if (stand_info[i].matchup[j].w == temp_w & stand_info[i].matchup[j].l == temp_w) {
									if (stand_info[i].matchup[j].win_pts > 0) {
										stand_ahead += 1;
									}
								}
							}
						} else if (i > j) {
							if (stand_info[j].w > (games - stand_info[i].l)) {
								stand_behind += 1;
							} else if (stand_info[j].w == (games - stand_info[i].l)) {
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
					if (stand_ahead >= (stand_info.length - po_teams)) stand_info[i].playoff += 'x';
					if (stand_behind >= po_teams) stand_info[i].playoff += 'o';
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
							${teamName('full', '', stand_info[i].id, 'img')}<a style="font-size:12px"><b>${stand_info[i].playoff}</a></b>
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

			count1_gender = "";
			bdays = [];

			lines.forEach(player => {
				infos = player.split(',');

				let [
					gender,
					name,
					jersey_num, league, team, player_url,
					status,
					identity,
					rookie,
					league_identity, pos, height, weight, birth,
					school,
					aquired,
					last_team,
					contract_filter, contract_season, contract_years, contract_years_left,
					contract_note,
					contract_link_title, contract_url,
					fa_status, fa_total_sec, fa_ppg, fa_rpg, fa_apg

				] = infos;

				const today = new Date();
				const blackie = new Date('1977/5/2');
				if (bdays.length == 0 & today.getDate() == blackie.getDate() & today.getMonth() == blackie.getMonth()) {
					bdays.push(['PLG聯盟副會長-陳建州', birthToAge(blackie)]);
					count1_gender = 'men'
				}

				if (status == 'active' | status == 'unknown') {
					birthday = new Date(birth);

					if (birthday.getDate() == today.getDate() & birthday.getMonth() == today.getMonth()) {
						bdays.push([`${teamName('full', league, team)}-${name}`, birthToAge(birth)]);
						count1_gender = gender;
					}
				}

			});

			if (bdays.length == 0) {
				table_bday.innerHTML += `今天沒有球員生日，祝你有美好的一天！`
			} else {
				bdays.sort((a, b) => b[1] - a[1]);
				for (let i = 0; i < bdays.length; i++) {
					if (i == 0) {
						table_bday.innerHTML += '今天是 '
					} else {
						table_bday.innerHTML += '、'
					}
					table_bday.innerHTML += ` ${bdays[i][0]} ${bdays[i][1]}歲生日`
				}
				if (bdays.length == 1 & count1_gender == 'women') {
					table_bday.innerHTML += `，祝她生日快樂！`
				} else if (bdays.length == 1) {
					table_bday.innerHTML += `，祝他生日快樂！`
				} else {
					table_bday.innerHTML += `，祝他們生日快樂！`
				}
			}
		})
});
function sortStandings() {
	needSort = 0;
	for (let i = 0; i < stand_info.length - 1; i++) {
		team1 = stand_info[i].w / (stand_info[i].w + stand_info[i].l);
		team2 = stand_info[i + 1].w / (stand_info[i + 1].w + stand_info[i + 1].l);
		if (team1 < team2) {
			needSort = 1;
			temp1 = stand_info[i];
			stand_info[i] = stand_info[i + 1];
			stand_info[i + 1] = temp1;
			for (let j = 0; j < stand_info.length; j++) {
				temp2 = stand_info[j].matchup[i];
				stand_info[j].matchup[i] = stand_info[j].matchup[i + 1];
				stand_info[j].matchup[i + 1] = temp2;
			}
		} else if (team1 == team2) {
			matchup_w = stand_info[i].matchup[i + 1].w;
			matchup_l = stand_info[i].matchup[i + 1].l;
			if (matchup_l > matchup_w) {
				needSort = 1;
				temp1 = stand_info[i];
				stand_info[i] = stand_info[i + 1];
				stand_info[i + 1] = temp1;
				for (let j = 0; j < stand_info.length; j++) {
					temp2 = stand_info[j].matchup[i];
					stand_info[j].matchup[i] = stand_info[j].matchup[i + 1];
					stand_info[j].matchup[i + 1] = temp2;
				}
			} else if (matchup_l == matchup_w) {
				if (stand_info[i].matchup[i + 1].win_pts < 0) {
					needSort = 1;
					temp1 = stand_info[i];
					stand_info[i] = stand_info[i + 1];
					stand_info[i + 1] = temp1;
					for (let j = 0; j < stand_info.length; j++) {
						temp2 = stand_info[j].matchup[i];
						stand_info[j].matchup[i] = stand_info[j].matchup[i + 1];
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