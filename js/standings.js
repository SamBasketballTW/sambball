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

    for (let j = 0; j < all_rank.length; j++) {
        fetch(`../data/standings-${league[j]}.csv`)
            .then((response) => response.text())
            .then((result) => {

                lines = result.split('\n');
                lines = lines.slice(2);

                table_overall = document.getElementById('overall_tbody');
                table_points = document.getElementById('points_tbody');
                table_ahead = document.getElementById('ahead_tbody');
                table = document.getElementById(`${league[j]}_tb`);
                table_calendar = document.getElementById(`calendar_${league[j]}_tbody`);

                rank = all_rank[j];

                teams_info = [];
                for (let i = 0; i < rank.length; i++) {
                    team = rank[i];
                    w_l = [0, 0, "W-L"];
                    gb = 0;
                    streak = ["", 0];
                    recent5 = [0, 0, "recent5"];
                    if (league[j] == "sbl" | league[j] == "wsbl") {
                        home_road = [['', ''], ['', ''], "home_road"];
                    } else {
                        home_road = [[0, 0], [0, 0], "home_road"];
                    }
                    ot = [0, 0, "OT"];
                    total_pts_t = [0, 0, "Total Points"];
                    total_pts_a = [0, 0, "Total Points against"];
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

                    temp = [team, w_l, gb, streak, recent5, home_road, ot, q_points, total_pts_t, total_pts_a,
                        q2_ahead, q2_behind, q2_tied, q3_ahead, q3_behind, q3_tied, more_less, lunar, cal, matchup];
                    tI = ['team', 'w_l', 'gb', 'streak', 'recent5', 'home_road', 'ot', 'q_points', 'total_pts_t', 'total_pts_a',
                        'q2_ahead', 'q2_behind', 'q2_tied', 'q3_ahead', 'q3_behind', 'q3_tied', 'more_less', 'lunar', 'cal', 'matchup']
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
                    teams_info[teamW_index][1][0] += 1;
                    teams_info[teamL_index][1][1] += 1;
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
                    // recent5
                    if (teams_info[teamW_index][4][0] + teams_info[teamW_index][4][1] < 5) teams_info[teamW_index][4][0] += 1;
                    if (teams_info[teamL_index][4][0] + teams_info[teamL_index][4][1] < 5) teams_info[teamL_index][4][1] += 1;
                    // home-road
                    if (infos[4] == "home") teams_info[teamW_index][5][0][0] += 1;
                    if (infos[4] == "road") teams_info[teamW_index][5][1][0] += 1;
                    if (infos[12] == "home") teams_info[teamL_index][5][0][1] += 1;
                    if (infos[12] == "road") teams_info[teamL_index][5][1][1] += 1;
                    // ot
                    if (infos[9] != "-") teams_info[teamW_index][6][0] += 1;
                    if (infos[17] != "-") teams_info[teamL_index][6][1] += 1;
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
                SortStandings(teams_info, findIndex(tI, 'matchup'));

                matchup_thead = `
                <thead>
                    <th style="width:50px">排名</th>
                    <th style="width:115px">球隊</th>
                    <th style="width:50px">已賽</th>
                    <th style="width:50px">勝場</th>
                    <th style="width:50px">敗場</th>
                    <th style="width:60px">勝率</th>`

                for (let i = 0; i < rank.length; i++) matchup_thead += `<th style="width:70px">${teamName_short_CN[teams_info[i][0]]}</td>`
                table.innerHTML += matchup_thead + `</thead>`;

                for (let i = 0; i < rank.length; i++) {
                    if (teams_info[i][6][0] + teams_info[i][6][1] == 0) teams_info[i][6] = ['', ''];
                    if (teams_info[i][findIndex(tI, 'q2_tied')][0] + teams_info[i][findIndex(tI, 'q2_tied')][1] == 0) teams_info[i][findIndex(tI, 'q2_tied')] = ['', ''];
                    if (teams_info[i][findIndex(tI, 'q3_tied')][0] + teams_info[i][findIndex(tI, 'q3_tied')][1] == 0) teams_info[i][findIndex(tI, 'q3_tied')] = ['', ''];

                    if (i == 0) {
                        no1_w = teams_info[0][1][0];
                        no1_l = teams_info[0][1][1];
                        teams_info[0][2] = "-"
                    } else {
                        teams_info[i][2] = ((no1_w - teams_info[i][1][0]) + (teams_info[i][1][1] - no1_l)) / 2
                    }
                    total_games = teams_info[i][1][0] + teams_info[i][1][1];

                    if (league[j] == "plg") {
                        show = `showTr`
                        temp_cal_stand = `
                        <td>${teams_info[i][findIndex(tI, 'cal')][10][0]}-${teams_info[i][findIndex(tI, 'cal')][10][1]}</td>
                        <td>${teams_info[i][findIndex(tI, 'cal')][11][0]}-${teams_info[i][findIndex(tI, 'cal')][11][1]}</td>
                        <td>${teams_info[i][findIndex(tI, 'cal')][0][0]}-${teams_info[i][findIndex(tI, 'cal')][0][1]}</td>
                        <td>${teams_info[i][findIndex(tI, 'cal')][1][0]}-${teams_info[i][findIndex(tI, 'cal')][1][1]}</td>
                        <td>${teams_info[i][findIndex(tI, 'cal')][2][0]}-${teams_info[i][findIndex(tI, 'cal')][2][1]}</td>
                        <td>${teams_info[i][findIndex(tI, 'cal')][3][0]}-${teams_info[i][findIndex(tI, 'cal')][3][1]}</td>
                        <td>${teams_info[i][findIndex(tI, 'cal')][4][0]}-${teams_info[i][findIndex(tI, 'cal')][4][1]}</td>`
                    } else if (league[j] == "t1") {
                        show = ``
                        temp_cal_stand = `
                        <td>${teams_info[i][findIndex(tI, 'cal')][9][0]}-${teams_info[i][findIndex(tI, 'cal')][9][1]}</td>
                        <td>${teams_info[i][findIndex(tI, 'cal')][10][0]}-${teams_info[i][findIndex(tI, 'cal')][10][1]}</td>
                        <td>${teams_info[i][findIndex(tI, 'cal')][11][0]}-${teams_info[i][findIndex(tI, 'cal')][11][1]}</td>
                        <td>${teams_info[i][findIndex(tI, 'cal')][0][0]}-${teams_info[i][findIndex(tI, 'cal')][0][1]}</td>
                        <td>${teams_info[i][findIndex(tI, 'cal')][1][0]}-${teams_info[i][findIndex(tI, 'cal')][1][1]}</td>
                        <td>${teams_info[i][findIndex(tI, 'cal')][2][0]}-${teams_info[i][findIndex(tI, 'cal')][2][1]}</td>
                        <td>${teams_info[i][findIndex(tI, 'cal')][3][0]}-${teams_info[i][findIndex(tI, 'cal')][3][1]}</td>`
                    } else if (league[j] == "sbl") {
                        show = ``
                        temp_cal_stand = `
                        <td>${teams_info[i][findIndex(tI, 'cal')][0][0]}-${teams_info[i][findIndex(tI, 'cal')][0][1]}</td>
                        <td>${teams_info[i][findIndex(tI, 'cal')][1][0]}-${teams_info[i][findIndex(tI, 'cal')][1][1]}</td>
                        <td>${teams_info[i][findIndex(tI, 'cal')][2][0]}-${teams_info[i][findIndex(tI, 'cal')][2][1]}</td>
                        <td>${teams_info[i][findIndex(tI, 'cal')][3][0]}-${teams_info[i][findIndex(tI, 'cal')][3][1]}</td>`
                    } else if (league[j] == "wsbl") {
                        show = `showTr`
                        temp_cal_stand = `
                        <td>${teams_info[i][findIndex(tI, 'cal')][0][0]}-${teams_info[i][findIndex(tI, 'cal')][0][1]}</td>
                        <td>${teams_info[i][findIndex(tI, 'cal')][1][0]}-${teams_info[i][findIndex(tI, 'cal')][1][1]}</td>
                        <td>${teams_info[i][findIndex(tI, 'cal')][2][0]}-${teams_info[i][findIndex(tI, 'cal')][2][1]}</td>
                        <td>${teams_info[i][findIndex(tI, 'cal')][3][0]}-${teams_info[i][findIndex(tI, 'cal')][3][1]}</td>`
                    }

                    table_overall.innerHTML += `
                    <tr class="filterTr ${league[j]} ${show}">
                        <td class="borderR">${i + 1}</td>
                        <td class="textL">
                            ${team_name("short", '', teams_info[i][0], gender)}<a style="font-size:12px"><b>${playoff[teams_info[i][0]]}</a></b>
                        </td>
                        <td>${teams_info[i][1][0] + teams_info[i][1][1]}</td>
                        <td>${teams_info[i][1][0]}</td>
                        <td>${teams_info[i][1][1]}</td>
                        <td>${((teams_info[i][1][0] / total_games) * 100).toFixed(0)}%</td>
                        <td>${teams_info[i][2]}</td>
                        <td class="borderR">${teams_info[i][3][0]}</td>
                        <td class="borderR">${teams_info[i][4][0]}-${teams_info[i][4][1]}</td>
                        <td>${teams_info[i][5][0][0]}-${teams_info[i][5][0][1]}</td>
                        <td>${teams_info[i][5][1][0]}-${teams_info[i][5][1][1]}</td>
                        <td class="borderR">${teams_info[i][6][0]}-${teams_info[i][6][1]}</td>
                        <td>${((teams_info[i][findIndex(tI, 'total_pts_t')][0] + teams_info[i][findIndex(tI, 'total_pts_t')][1]) / total_games).toFixed(1)}</td>
                        <td>${((teams_info[i][findIndex(tI, 'total_pts_a')][0] + teams_info[i][findIndex(tI, 'total_pts_a')][1]) / total_games).toFixed(1)}</td>
                    </tr>`

                    table_points.innerHTML += `
                    <tr class="filterTr ${league[j]} ${show}">
                        <td class="borderR">${i + 1}</td>
                        <td class="textL">
                            <img src="../asset/images/${gender}/${teams_info[i][0]}.png" alt="${teams_info[i][0]}" class="teamicon">
                            <b>${teamName_short_CN[teams_info[i][0]]}<a style="font-size:12px">${playoff[teams_info[i][0]]}</a></b>
                        </td>
                        <td>${teams_info[i][1][0] + teams_info[i][1][1]}</td>
                        <td>${teams_info[i][1][0]}</td>
                        <td>${teams_info[i][1][1]}</td>
                        <td class="borderR">${((teams_info[i][1][0] / total_games) * 100).toFixed(0)}%</td>
                        <td>${((teams_info[i][findIndex(tI, 'total_pts_t')][0] + teams_info[i][findIndex(tI, 'total_pts_t')][1]) / total_games).toFixed(1)}</td>
                        <td class="borderR">${((teams_info[i][findIndex(tI, 'total_pts_a')][0] + teams_info[i][findIndex(tI, 'total_pts_a')][1]) / total_games).toFixed(1)}</td>
                        <td>${(teams_info[i][findIndex(tI, 'q_points')][0] / total_games).toFixed(1)}</td>
                        <td>${(teams_info[i][findIndex(tI, 'q_points')][1] / total_games).toFixed(1)}</td>
                        <td>${(teams_info[i][findIndex(tI, 'q_points')][2] / total_games).toFixed(1)}</td>
                        <td class="borderR">${(teams_info[i][findIndex(tI, 'q_points')][3] / total_games).toFixed(1)}</td>
                        <td>${(teams_info[i][findIndex(tI, 'total_pts_t')][0] / teams_info[i][1][0]).toFixed(1)}</td>
                        <td class="borderR">${(teams_info[i][findIndex(tI, 'total_pts_t')][1] / teams_info[i][1][1]).toFixed(1)}</td>
                        <td>${(teams_info[i][findIndex(tI, 'total_pts_a')][0] / teams_info[i][1][0]).toFixed(1)}</td>
                        <td>${(teams_info[i][findIndex(tI, 'total_pts_a')][1] / teams_info[i][1][1]).toFixed(1)}</td>
                    </tr>`

                    table_ahead.innerHTML += `
                    <tr class="filterTr ${league[j]} ${show}">
                        <td class="borderR">${i + 1}</td>
                        <td class="textL">
                            <img src="../asset/images/${gender}/${teams_info[i][0]}.png" alt="${teams_info[i][0]}" class="teamicon">
                            <b>${teamName_short_CN[teams_info[i][0]]}<a style="font-size:12px">${playoff[teams_info[i][0]]}</a></b>
                        </td>
                        <td>${teams_info[i][1][0] + teams_info[i][1][1]}</td>
                        <td>${teams_info[i][1][0]}</td>
                        <td>${teams_info[i][1][1]}</td>
                        <td class="borderR">${((teams_info[i][1][0] / total_games) * 100).toFixed(0)}%</td>
                        <td>${teams_info[i][findIndex(tI, 'q2_ahead')][0]}-${teams_info[i][findIndex(tI, 'q2_ahead')][1]}</td>
                        <td>${teams_info[i][findIndex(tI, 'q2_behind')][0]}-${teams_info[i][findIndex(tI, 'q2_behind')][1]}</td>
                        <td class="borderR">${teams_info[i][findIndex(tI, 'q2_tied')][0]}-${teams_info[i][findIndex(tI, 'q2_tied')][1]}</td>
                        <td>${teams_info[i][findIndex(tI, 'q3_ahead')][0]}-${teams_info[i][findIndex(tI, 'q3_ahead')][1]}</td>
                        <td>${teams_info[i][findIndex(tI, 'q3_behind')][0]}-${teams_info[i][findIndex(tI, 'q3_behind')][1]}</td>
                        <td class="borderR">${teams_info[i][findIndex(tI, 'q3_tied')][0]}-${teams_info[i][findIndex(tI, 'q3_tied')][1]}</td>
                        <td>${teams_info[i][findIndex(tI, 'more_less')][0][0]}-${teams_info[i][findIndex(tI, 'more_less')][0][1]}</td>
                        <td>${teams_info[i][findIndex(tI, 'more_less')][1][0]}-${teams_info[i][findIndex(tI, 'more_less')][1][1]}</td>
                        <td>${teams_info[i][findIndex(tI, 'more_less')][2][0]}-${teams_info[i][findIndex(tI, 'more_less')][2][1]}</td>
                    </tr>`

                    match_standings = ""
                    for (let j = 0; j < rank.length; j++) {
                        if (j == i) {
                            teams_info[i][findIndex(tI, 'matchup')][j][1] = ""
                            teams_info[i][findIndex(tI, 'matchup')][j][2] = ""
                        }
                        match_standings += `<td>${teams_info[i][findIndex(tI, 'matchup')][j][1]}-${teams_info[i][findIndex(tI, 'matchup')][j][2]}</td>`
                    }
                    table.innerHTML += `
                    <tbody>
                        <tr>
                            <td class="borderR">${i + 1}</td>
                            <td class="textL">
                                <img src="../asset/images/${gender}/${teams_info[i][0]}.png" alt="${teams_info[i][0]}" class="teamicon">
                                <b>${teamName_short_CN[teams_info[i][0]]}<a style="font-size:12px">${playoff[teams_info[i][0]]}</a></b>
                            </td>
                            <td>${teams_info[i][1][0] + teams_info[i][1][1]}</td>
                            <td>${teams_info[i][1][0]}</td>
                            <td>${teams_info[i][1][1]}</td>
                            <td class="borderR">${((teams_info[i][1][0] / total_games) * 100).toFixed(0)}%</td>
                            ${match_standings}
                        </tr>
                    </tbody>`

                    table_calendar.innerHTML += `
                    <tr>
                        <td class="borderR">${i + 1}</td>
                        <td class="textL">
                            <img src="../asset/images/${gender}/${teams_info[i][0]}.png" alt="${teams_info[i][0]}" class="teamicon">
                            <b>${teamName_short_CN[teams_info[i][0]]}<a style="font-size:12px">${playoff[teams_info[i][0]]}</a></b>
                        </td>
                        <td>${teams_info[i][1][0] + teams_info[i][1][1]}</td>
                        <td>${teams_info[i][1][0]}</td>
                        <td>${teams_info[i][1][1]}</td>
                        <td class="borderR">${((teams_info[i][1][0] / total_games) * 100).toFixed(0)}%</td>
                        <td>${teams_info[i][findIndex(tI, 'lunar')][0][0]}-${teams_info[i][findIndex(tI, 'lunar')][0][1]}</td>
                        <td class="borderR">${teams_info[i][findIndex(tI, 'lunar')][1][0]}-${teams_info[i][findIndex(tI, 'lunar')][1][1]}</td>
                        ${temp_cal_stand}
                    </tr>`
                }
            });
    }
});