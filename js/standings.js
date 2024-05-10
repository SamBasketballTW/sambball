$(document).ready(function () {
    men_html = document.getElementById("men_page");
    women_html = document.getElementById("women_page");

    if (men_html) {
        gender = "men"

        plg_rank = [];
        t1_rank = [];
        sbl_rank = [];
        league = ['plg', 't1', 'sbl'];

        for (let i = 0; i < league_teams['plg']; i++) plg_rank.push(plg_teams[i + 1]);
        for (let i = 0; i < league_teams['t1']; i++) t1_rank.push(t1_teams[i + 1]);
        for (let i = 0; i < league_teams['sbl']; i++) sbl_rank.push(sbl_teams[i + 1]);
        all_rank = [plg_rank, t1_rank, sbl_rank];

    } else if (women_html) {
        gender = "women"

        wsbl_rank = [];
        league = ['wsbl']

        for (let i = 0; i < league_teams['wsbl']; i++) wsbl_rank.push(wsbl_teams[i + 1]);
        all_rank = [wsbl_rank]
    }

    for (let lgue = 0; lgue < league.length; lgue++) {
        fetch(`../data/standings-${league[lgue]}.csv`)
            .then((response) => response.text())
            .then((result) => {

                lines = result.split('\n');
                lines = lines.slice(2);

                table_overall = document.getElementById('overall_tbody');
                table_points = document.getElementById('points_tbody');
                table_ahead = document.getElementById('ahead_tbody');
                table = document.getElementById(`${league[lgue]}_tb`);
                table_calendar = document.getElementById(`calendar_${league[lgue]}_tbody`);

                rank = all_rank[lgue];

                teams_info = [];
                matchup_thead = '';
                for (let i = 0; i < rank.length; i++) {
                    team = rank[i];
                    w_l = [0, 0, "W-L"];
                    streak = ["", 0];
                    matchup = [];
                    for (let i = 0; i < rank.length; i++) matchup.push([rank[i], 0, 0, 0]);

                    recent5 = [0, 0, "recent5"];
                    if (league[lgue] == "sbl" | league[lgue] == "wsbl") {
                        home_road = [['', ''], ['', ''], "home_road"];
                    } else {
                        home_road = [[0, 0], [0, 0], "home_road"];
                    }
                    ot = [0, 0, "OT"];
                    total_pts_t = [0, 0, "Total Points W-L"];
                    total_pts_a = [0, 0, "Total Points against W-L"];
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

                    temp = [team, '', w_l, '', streak, matchup, recent5, home_road, ot, q_points, total_pts_t, total_pts_a,
                        q2_ahead, q2_behind, q2_tied, q3_ahead, q3_behind, q3_tied, more_less, lunar, cal];
                    tI = ['team', 'playoff', 'w_l', 'gb', 'streak', 'matchup', 'recent5', 'home_road', 'ot', 'q_points', 'total_pts_t', 'total_pts_a',
                        'q2_ahead', 'q2_behind', 'q2_tied', 'q3_ahead', 'q3_behind', 'q3_tied', 'more_less', 'lunar', 'cal']
                    teams_info.push(temp);
                }
                lines.forEach(player => {
                    infos = player.split(',');

                    gameDate = new Date(infos[2]);
                    lunarDate = new Date('2024/2/9');

                    teamW_index = findIndex(rank, infos[3]);
                    teamL_index = findIndex(rank, infos[11]);

                    q1_w = parseInt(infos[5]);
                    q2_w = parseInt(infos[6]);
                    q3_w = parseInt(infos[7]);
                    q4_w = parseInt(infos[8])
                    pts_w = parseInt(infos[10]);
                    q1_l = parseInt(infos[13]);
                    q2_l = parseInt(infos[14]);
                    q3_l = parseInt(infos[15]);
                    q4_l = parseInt(infos[16]);
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
                        teams_info[teamW_index][4][0] = `L${teams_info[teamW_index][4][1]}`;
                    }
                    if (teams_info[teamL_index][4][0] == "") {
                        teams_info[teamL_index][4][0] = "L"
                        teams_info[teamL_index][4][1] += 1;
                    } else if (teams_info[teamL_index][4][0] == "L") {
                        teams_info[teamL_index][4][1] += 1;
                    } else if (teams_info[teamL_index][4][0] == "W") {
                        teams_info[teamL_index][4][0] = `W${teams_info[teamL_index][4][1]}`
                    }
                    // recent5
                    if (teams_info[teamW_index][findIndex(tI, 'recent5')][0] + teams_info[teamW_index][findIndex(tI, 'recent5')][1] < 5) teams_info[teamW_index][findIndex(tI, 'recent5')][0] += 1;
                    if (teams_info[teamL_index][findIndex(tI, 'recent5')][0] + teams_info[teamL_index][findIndex(tI, 'recent5')][1] < 5) teams_info[teamL_index][findIndex(tI, 'recent5')][1] += 1;
                    // home-road
                    if (infos[4] == "home") teams_info[teamW_index][findIndex(tI, 'home_road')][0][0] += 1;
                    if (infos[4] == "road") teams_info[teamW_index][findIndex(tI, 'home_road')][1][0] += 1;
                    if (infos[12] == "home") teams_info[teamL_index][findIndex(tI, 'home_road')][0][1] += 1;
                    if (infos[12] == "road") teams_info[teamL_index][findIndex(tI, 'home_road')][1][1] += 1;
                    // ot
                    if (infos[9] != "-") teams_info[teamW_index][findIndex(tI, 'ot')][0] += 1;
                    if (infos[17] != "-") teams_info[teamL_index][findIndex(tI, 'ot')][1] += 1;
                    // matchup
                    teams_info[teamW_index][findIndex(tI, 'matchup')][teamL_index][1] += 1;
                    teams_info[teamL_index][findIndex(tI, 'matchup')][teamW_index][2] += 1;
                    teams_info[teamW_index][findIndex(tI, 'matchup')][teamL_index][3] += pts_w - pts_l
                    teams_info[teamL_index][findIndex(tI, 'matchup')][teamW_index][3] += pts_l - pts_w
                    // calendar
                    teams_info[teamW_index][findIndex(tI, 'cal')][gameDate.getMonth()][0] += 1;
                    teams_info[teamL_index][findIndex(tI, 'cal')][gameDate.getMonth()][1] += 1;
                    // lunar
                    if (gameDate < lunarDate) {
                        teams_info[teamW_index][findIndex(tI, 'lunar')][0][0] += 1
                        teams_info[teamL_index][findIndex(tI, 'lunar')][0][1] += 1
                    } else {
                        teams_info[teamW_index][findIndex(tI, 'lunar')][1][0] += 1
                        teams_info[teamL_index][findIndex(tI, 'lunar')][1][1] += 1
                    }
                    // q_points
                    teams_info[teamW_index][findIndex(tI, 'q_points')][0] += q1_w - q1_l
                    teams_info[teamW_index][findIndex(tI, 'q_points')][1] += q2_w - q2_l
                    teams_info[teamW_index][findIndex(tI, 'q_points')][2] += q3_w - q3_l
                    teams_info[teamW_index][findIndex(tI, 'q_points')][3] += q4_w - q4_l
                    teams_info[teamW_index][findIndex(tI, 'total_pts_t')][0] += pts_w
                    teams_info[teamW_index][findIndex(tI, 'total_pts_a')][0] += pts_l

                    teams_info[teamL_index][findIndex(tI, 'q_points')][0] += q1_l - q1_w
                    teams_info[teamL_index][findIndex(tI, 'q_points')][1] += q2_l - q2_w
                    teams_info[teamL_index][findIndex(tI, 'q_points')][2] += q3_l - q3_w
                    teams_info[teamL_index][findIndex(tI, 'q_points')][3] += q4_l - q4_w
                    teams_info[teamL_index][findIndex(tI, 'total_pts_t')][1] += pts_l
                    teams_info[teamL_index][findIndex(tI, 'total_pts_a')][1] += pts_w

                    if (q1_w + q2_w > q1_l + q2_l) {
                        teams_info[teamW_index][findIndex(tI, 'q2_ahead')][0] += 1;
                        teams_info[teamL_index][findIndex(tI, 'q2_behind')][1] += 1;
                    } else if (q1_w + q2_w < q1_l + q2_l) {
                        teams_info[teamW_index][findIndex(tI, 'q2_behind')][0] += 1;
                        teams_info[teamL_index][findIndex(tI, 'q2_ahead')][1] += 1;
                    } else {
                        teams_info[teamW_index][findIndex(tI, 'q2_tied')][0] += 1;
                        teams_info[teamL_index][findIndex(tI, 'q2_tied')][1] += 1;
                    }

                    if (q1_w + q2_w + q3_w > q1_l + q2_l + q3_l) {
                        teams_info[teamW_index][findIndex(tI, 'q3_ahead')][0] += 1;
                        teams_info[teamL_index][findIndex(tI, 'q3_behind')][1] += 1;
                    } else if (q1_w + q2_w + q3_w < q1_l + q2_l + q3_l) {
                        teams_info[teamW_index][findIndex(tI, 'q3_behind')][0] += 1;
                        teams_info[teamL_index][findIndex(tI, 'q3_ahead')][1] += 1;
                    } else {
                        teams_info[teamW_index][findIndex(tI, 'q3_tied')][0] += 1;
                        teams_info[teamL_index][findIndex(tI, 'q3_tied')][1] += 1;
                    }

                    if (pts_w - pts_l <= 3) {
                        teams_info[teamW_index][findIndex(tI, 'more_less')][0][0] += 1;
                        teams_info[teamL_index][findIndex(tI, 'more_less')][0][1] += 1;
                    } else if (pts_w - pts_l >= 10) {
                        teams_info[teamW_index][findIndex(tI, 'more_less')][2][0] += 1;
                        teams_info[teamL_index][findIndex(tI, 'more_less')][2][1] += 1;
                    } else {
                        teams_info[teamW_index][findIndex(tI, 'more_less')][1][0] += 1;
                        teams_info[teamL_index][findIndex(tI, 'more_less')][1][1] += 1;
                    }
                });
                SortStandings(teams_info);
                if (league[lgue] == 'plg') {
                    games = 40;
                    po_t = 4;
                    show = 'showTr'
                    cal_start = 10;
                    cal_end = 4;
                } else if (league[lgue] == 't1') {
                    games = 28;
                    po_t = 4;
                    show = ''
                    cal_start = 9;
                    cal_end = 3;
                } else if (league[lgue] == 'sbl') {
                    games = 30;
                    po_t = 3;
                    show = ''
                    cal_start = 0;
                    cal_end = 3;
                } else if (league[lgue] == 'wsbl') {
                    games = 30;
                    po_t = 3;
                    show = 'showTr'
                    cal_start = 0;
                    cal_end = 3;
                }

                temp_w = (games / (teams_info.length - 1)) / 2;
				for (let i = 0; i < teams_info.length; i++) {
					stand_behind = 0;
					stand_ahead = 0;
					for (let j = 0; j < teams_info.length; j++) {
						if (i < j) {
							if (teams_info[i][2][0] > (games - teams_info[j][2][1])) {
								stand_ahead += 1;
							} else if (teams_info[i][2][0] == (games - teams_info[j][2][1])) {
								if (teams_info[i][findIndex(tI, 'matchup')][j][1] > temp_w) {
									stand_ahead += 1;
								} else if (teams_info[i][findIndex(tI, 'matchup')][j][1] == temp_w & teams_info[i][findIndex(tI, 'matchup')][j][2] == temp_w) {
									if (teams_info[i][findIndex(tI, 'matchup')][j][3] > 0) {
										stand_ahead += 1;
									}
								}
							}
						} else if (i > j) {
							if (teams_info[j][2][0] > (games - teams_info[i][2][1])) {
								stand_behind += 1;
							} else if (teams_info[j][2][0] == (games - teams_info[i][2][1])) {
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
					if ((stand_behind + stand_ahead + 1) == league_teams[league[lgue]]) teams_info[i][1] += 'p';
					if (stand_ahead >= (league_teams[league[lgue]] - po_t)) teams_info[i][1] += 'x';
					if (stand_behind >= po_t) teams_info[i][1] += 'o';
					if (teams_info[i][1] != '') {
						teams_info[i][1] = '- ' + teams_info[i][1];
					}

                    if(teams_info[i][1].includes('p')){
                        matchup_thead += `<th colspan = 2 style="width:80px">${teamName_short_CN[teams_info[i][0]]}</th>`
                    } else {
                        matchup_thead += `<th colspan = 2 style="width:110px">${teamName_short_CN[teams_info[i][0]]}</th>`
                    }
				}

                table.innerHTML += `
                <thead>
                    <th style="width:50px">排名</th>
                    <th style="width:120px">球隊</th>
                    <th style="width:50px">已賽</th>
                    <th style="width:50px">勝場</th>
                    <th style="width:50px">敗場</th>
                    <th style="width:60px">勝率</th>
                    <th style="width:50px">勝差</th>
                    ${matchup_thead}
                </thead>`;

                for (let i = 0; i < teams_info.length; i++) {
                    if (teams_info[i][findIndex(tI, 'ot')][0] + teams_info[i][findIndex(tI, 'ot')][1] == 0) teams_info[i][findIndex(tI, 'ot')] = ['', ''];
                    if (teams_info[i][findIndex(tI, 'q2_tied')][0] + teams_info[i][findIndex(tI, 'q2_tied')][1] == 0) teams_info[i][findIndex(tI, 'q2_tied')] = ['', ''];
                    if (teams_info[i][findIndex(tI, 'q3_tied')][0] + teams_info[i][findIndex(tI, 'q3_tied')][1] == 0) teams_info[i][findIndex(tI, 'q3_tied')] = ['', ''];

                    if (i == 0) {
                        no1_w = teams_info[0][2][0];
                        no1_l = teams_info[0][2][1];
                        teams_info[0][3] = "-"
                    } else {
                        teams_info[i][3] = ((no1_w - teams_info[i][2][0]) + (teams_info[i][2][1] - no1_l)) / 2
                    }
                    total_games = teams_info[i][2][0] + teams_info[i][2][1];


                    table_overall.innerHTML += `
                    <tr class="filterTr ${league[lgue]} ${show}">
                        <td class="borderR">${i + 1}</td>
                        <td class="textL">
                            ${team_name("short", '', teams_info[i][0], gender)}<a style="font-size:12px"><b>${teams_info[i][1]}</b></a>
                        </td>
                        <td>${teams_info[i][2][0] + teams_info[i][2][1]}</td>
                        <td>${teams_info[i][2][0]}</td>
                        <td>${teams_info[i][2][1]}</td>
                        <td>${((teams_info[i][2][0] / total_games) * 100).toFixed(0)}%</td>
                        <td>${teams_info[i][3]}</td>
                        <td class="borderR">${teams_info[i][4][0]}</td>
                        <td class="borderR">${teams_info[i][findIndex(tI, 'recent5')][0]}-${teams_info[i][findIndex(tI, 'recent5')][1]}</td>
                        <td>${teams_info[i][findIndex(tI, 'home_road')][0][0]}-${teams_info[i][findIndex(tI, 'home_road')][0][1]}</td>
                        <td>${teams_info[i][findIndex(tI, 'home_road')][1][0]}-${teams_info[i][findIndex(tI, 'home_road')][1][1]}</td>
                        <td class="borderR">${teams_info[i][findIndex(tI, 'ot')][0]}-${teams_info[i][findIndex(tI, 'ot')][1]}</td>
                        <td>${((teams_info[i][findIndex(tI, 'total_pts_t')][0] + teams_info[i][findIndex(tI, 'total_pts_t')][1]) / total_games).toFixed(1)}</td>
                        <td class="borderR">${((teams_info[i][findIndex(tI, 'total_pts_a')][0] + teams_info[i][findIndex(tI, 'total_pts_a')][1]) / total_games).toFixed(1)}</td>
                        <td>${(((teams_info[i][findIndex(tI, 'total_pts_t')][0] + teams_info[i][findIndex(tI, 'total_pts_t')][1])
                            - (teams_info[i][findIndex(tI, 'total_pts_a')][0] + teams_info[i][findIndex(tI, 'total_pts_a')][1])) / total_games).toFixed(1)}</td>
                    </tr>`

                    table_points.innerHTML += `
                    <tr class="filterTr ${league[lgue]} ${show}">
                        <td class="borderR">${i + 1}</td>
                        <td class="textL">
                            ${team_name("short", '', teams_info[i][0], gender)}<a style="font-size:12px"><b>${teams_info[i][1]}</b></a>
                        </td>
                        <td>${teams_info[i][2][0] + teams_info[i][2][1]}</td>
                        <td>${teams_info[i][2][0]}</td>
                        <td>${teams_info[i][2][1]}</td>
                        <td>${((teams_info[i][2][0] / total_games) * 100).toFixed(0)}%</td>
                        <td class="borderR">${teams_info[i][3]}</td>
                        <td>${((teams_info[i][findIndex(tI, 'total_pts_t')][0] + teams_info[i][findIndex(tI, 'total_pts_t')][1]) / total_games).toFixed(1)}</td>
                        <td class="borderR">${((teams_info[i][findIndex(tI, 'total_pts_a')][0] + teams_info[i][findIndex(tI, 'total_pts_a')][1]) / total_games).toFixed(1)}</td>
                        <td>${(teams_info[i][findIndex(tI, 'q_points')][0] / total_games).toFixed(1)}</td>
                        <td>${(teams_info[i][findIndex(tI, 'q_points')][1] / total_games).toFixed(1)}</td>
                        <td>${(teams_info[i][findIndex(tI, 'q_points')][2] / total_games).toFixed(1)}</td>
                        <td class="borderR">${(teams_info[i][findIndex(tI, 'q_points')][3] / total_games).toFixed(1)}</td>
                        <td>${(teams_info[i][findIndex(tI, 'total_pts_t')][0] / teams_info[i][2][0]).toFixed(1)}</td>
                        <td class="borderR">${(teams_info[i][findIndex(tI, 'total_pts_t')][1] / teams_info[i][2][1]).toFixed(1)}</td>
                        <td>${(teams_info[i][findIndex(tI, 'total_pts_a')][0] / teams_info[i][2][0]).toFixed(1)}</td>
                        <td>${(teams_info[i][findIndex(tI, 'total_pts_a')][1] / teams_info[i][2][1]).toFixed(1)}</td>
                        
                    </tr>`

                    table_ahead.innerHTML += `
                    <tr class="filterTr ${league[lgue]} ${show}">
                        <td class="borderR">${i + 1}</td>
                        <td class="textL">
                            ${team_name("short", '', teams_info[i][0], gender)}<a style="font-size:12px"><b>${teams_info[i][1]}</b></a>
                        </td>
                        <td>${teams_info[i][2][0] + teams_info[i][2][1]}</td>
                        <td>${teams_info[i][2][0]}</td>
                        <td>${teams_info[i][2][1]}</td>
                        <td>${((teams_info[i][2][0] / total_games) * 100).toFixed(0)}%</td>
                        <td class="borderR">${teams_info[i][3]}</td>
                        <td>${teams_info[i][findIndex(tI, 'q2_ahead')][0]}-${teams_info[i][findIndex(tI, 'q2_ahead')][1]}</td>
                        <td>${teams_info[i][findIndex(tI, 'q2_behind')][0]}-${teams_info[i][findIndex(tI, 'q2_behind')][1]}</td>
                        <td class="borderR">${teams_info[i][findIndex(tI, 'q2_tied')][0]}-${teams_info[i][findIndex(tI, 'q2_tied')][1]}</td>
                        <td>${teams_info[i][findIndex(tI, 'q3_ahead')][0]}-${teams_info[i][findIndex(tI, 'q3_ahead')][1]}</td>
                        <td>${teams_info[i][findIndex(tI, 'q3_behind')][0]}-${teams_info[i][findIndex(tI, 'q3_behind')][1]}</td>
                        <td class="borderR">${teams_info[i][findIndex(tI, 'q3_tied')][0]}-${teams_info[i][findIndex(tI, 'q3_tied')][1]}</td>
                        <td class="borderR">${teams_info[i][findIndex(tI, 'ot')][0]}-${teams_info[i][findIndex(tI, 'ot')][1]}</td>
                        <td>${teams_info[i][findIndex(tI, 'more_less')][0][0]}-${teams_info[i][findIndex(tI, 'more_less')][0][1]}</td>
                        <td>${teams_info[i][findIndex(tI, 'more_less')][2][0]}-${teams_info[i][findIndex(tI, 'more_less')][2][1]}</td>
                    </tr>`


                    match_standings = ""
                    for (let j = 0; j < teams_info.length; j++) {
                        if (j == i) {
                            teams_info[i][findIndex(tI, 'matchup')][j][1] = ""
                            teams_info[i][findIndex(tI, 'matchup')][j][2] = ""
                            teams_info[i][findIndex(tI, 'matchup')][j][3] = ""
                            match_standings += `<td colspan = 2>-</td>`
                        } else if(teams_info[i][1].includes('p') | teams_info[j][1].includes('p') | 
                            teams_info[i][findIndex(tI, 'matchup')][j][1] > temp_w | teams_info[i][findIndex(tI, 'matchup')][j][2] > temp_w){
                                match_standings += `
                                <td colspan=2>${teams_info[i][findIndex(tI, 'matchup')][j][1]}-${teams_info[i][findIndex(tI, 'matchup')][j][2]}</td>`

                        } else {
                            match_standings += `
                            <td class="textR">${teams_info[i][findIndex(tI, 'matchup')][j][1]}-${teams_info[i][findIndex(tI, 'matchup')][j][2]}</td>
                            <td class="textL">(${teams_info[i][findIndex(tI, 'matchup')][j][3]})</td>`
                        }
                    }
                    table.innerHTML += `
                    <tbody>
                        <tr>
                            <td class="borderR">${i + 1}</td>
                            <td class="textL">
                                ${team_name("short", '', teams_info[i][0], gender)}<a style="font-size:12px"><b>${teams_info[i][1]}</b></a>
                            </td>
                            <td>${teams_info[i][2][0] + teams_info[i][2][1]}</td>
                            <td>${teams_info[i][2][0]}</td>
                            <td>${teams_info[i][2][1]}</td>
                            <td>${((teams_info[i][2][0] / total_games) * 100).toFixed(0)}%</td>
                            <td class="borderR">${teams_info[i][3]}</td>
                            ${match_standings}
                        </tr>
                    </tbody>`


                    temp_cal_stand = ''
                    if (cal_start > 6) {
                        for (let c = cal_start; c < 12; c++) {
                            temp_cal_stand += `<td>${teams_info[i][findIndex(tI, 'cal')][c][0]}-${teams_info[i][findIndex(tI, 'cal')][c][1]}</td>`
                        }
                    }
                    for (let c = 0; c <= cal_end; c++) {
                        temp_cal_stand += `<td>${teams_info[i][findIndex(tI, 'cal')][c][0]}-${teams_info[i][findIndex(tI, 'cal')][c][1]}</td>`
                    }
                    table_calendar.innerHTML += `
                    <tr>
                        <td class="borderR">${i + 1}</td>
                        <td class="textL">
                            ${team_name("short", '', teams_info[i][0], gender)}<a style="font-size:12px"><b>${teams_info[i][1]}</b></a>
                        </td>
                        <td>${teams_info[i][2][0] + teams_info[i][2][1]}</td>
                        <td>${teams_info[i][2][0]}</td>
                        <td>${teams_info[i][2][1]}</td>
                        <td>${((teams_info[i][2][0] / total_games) * 100).toFixed(0)}%</td>
                        <td class="borderR">${teams_info[i][3]}</td>
                        <td>${teams_info[i][findIndex(tI, 'lunar')][0][0]}-${teams_info[i][findIndex(tI, 'lunar')][0][1]}</td>
                        <td class="borderR">${teams_info[i][findIndex(tI, 'lunar')][1][0]}-${teams_info[i][findIndex(tI, 'lunar')][1][1]}</td>
                        ${temp_cal_stand}
                    </tr>`
                }
                // console.log(teams_info);
            });
    }
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