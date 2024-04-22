$(document).ready(function () {
    fetch('../data/standings-plg.csv')
        .then((response) => response.text())
        .then((result) => {

            lines = result.split('\n');
            lines = lines.slice(2);

            table_overall = document.getElementById('overall_tbody');
            table_points = document.getElementById('points_tbody');
            table_ahead = document.getElementById('ahead_tbody');
            table = document.getElementById('plg_tb');
            table_calendar = document.getElementById('calendar_plg_tbody');

            rank = [];
            for (let i = 0; i < 6; i++) rank.splice(i, 0, plg_teamRank[i + 1]);

            matchup_thead = `
            <thead>
                <th style="width:50px">排名</th>
                <th style="width:115px">球隊</th>
                <th style="width:50px">已賽</th>
                <th style="width:50px">勝場</th>
                <th style="width:50px">敗場</th>
                <th style="width:60px">勝率</th>`
            for (let i = 0; i < rank.length; i++) matchup_thead += `<th style="width:70px">${short_teamName[rank[i]]}</td>`
            matchup_thead += `</thead>`
            table.innerHTML += matchup_thead


            for (let i = 0; i < rank.length; i++) {
                team = rank[i];
                w_l = [0, 0];
                gb = 0;
                streak = ["", 0];
                recent5 = [0, 0];
                home_road = [[0, 0], [0, 0]];
                ot = [0, 0];
                total_pts_a = [[0, 0], [0, 0]];
                q_points = [0, 0, 0, 0];
                q2_ahead = [0, 0];
                q2_behind = [0, 0];
                q2_tied = [0, 0];
                q3_ahead = [0, 0];
                q3_behind = [0, 0];
                q3_tied = [0, 0];
                more_less = [[0, 0], [0, 0], [0, 0]];
                lunar = [[0, 0], [0, 0]];
                cal = [];
                for (let i = 0; i < 12; i++) cal.push([0, 0]);
                matchup = [];
                for (let i = 0; i < rank.length; i++) matchup.push([rank[i], 0, 0]);

                lines.forEach(player => {
                    infos = player.split(',');
                    info = ""

                    gameDate = new Date(infos[2]);
                    lunarDate = new Date('2024/2/9');

                    if (infos[3] == team) {
                        q1 = parseInt(infos[5]);
                        q2 = parseInt(infos[6]);
                        q3 = parseInt(infos[7]);
                        q4 = parseInt(infos[8])
                        pts = parseInt(infos[10]);
                        q1_a = parseInt(infos[13]);
                        q2_a = parseInt(infos[14]);
                        q3_a = parseInt(infos[15]);
                        q4_a = parseInt(infos[16]);
                        pts_a = parseInt(infos[18]);

                        matchup[findIndex(rank, infos[11])][1] += 1;
                        w_l[0] += 1;

                        cal[gameDate.getMonth()][0] += 1;
                        if (gameDate < lunarDate) {
                            lunar[0][0] += 1;
                        } else {
                            lunar[1][0] += 1;
                        }

                        if (streak[0] == "") {
                            streak[0] = "W"
                            streak[1] += 1;
                        } else if (streak[0] == "W") {
                            streak[1] += 1;
                        } else if (streak[0] == "L") {
                            streak[0] = `L${streak[1]}`;
                        }

                        if (recent5[0] + recent5[1] < 5) recent5[0] += 1;

                        if (infos[4] == "home") {
                            home_road[0][0] += 1;
                        } else {
                            home_road[1][0] += 1;
                        }

                        if (infos[9] != "-") ot[0] += 1;

                        q_points[0] += q1
                        q_points[1] += q2
                        q_points[2] += q3
                        q_points[3] += q4
                        total_pts_a[0][0] += pts
                        total_pts_a[1][0] += pts_a

                        if (q1 + q2 > q1_a + q2_a) {
                            q2_ahead[0] += 1;
                        } else if (q1 + q2 < q1_a + q2_a) {
                            q2_behind[0] += 1;
                        } else {
                            q2_tied[0] += 1;
                        }

                        if (q1 + q2 + q3 > q1_a + q2_a + q3_a) {
                            q3_ahead[0] += 1;
                        } else if (q1 + q2 + q3 < q1_a + q2_a + q3_a) {
                            q3_behind[0] += 1;
                        } else {
                            q3_tied[0] += 1;
                        }

                        if (pts - pts_a <= 3) {
                            more_less[0][0] += 1
                        } else if (pts - pts_a >= 10) {
                            more_less[2][0] += 1
                        } else {
                            more_less[1][0] += 1
                        }

                    } else if (infos[11] == team) {
                        q1 = parseInt(infos[13]);
                        q2 = parseInt(infos[14]);
                        q3 = parseInt(infos[15]);
                        q4 = parseInt(infos[16])
                        pts = parseInt(infos[18]);
                        q1_a = parseInt(infos[5]);
                        q2_a = parseInt(infos[6]);
                        q3_a = parseInt(infos[7]);
                        q4_a = parseInt(infos[8]);
                        pts_a = parseInt(infos[10]);

                        matchup[findIndex(rank, infos[3])][2] += 1;
                        w_l[1] += 1;

                        cal[gameDate.getMonth()][1] += 1;
                        if (gameDate < lunarDate) {
                            lunar[0][1] += 1;
                        } else {
                            lunar[1][1] += 1;
                        }

                        if (streak[0] == "") {
                            streak[0] = "L"
                            streak[1] += 1;
                        } else if (streak[0] == "L") {
                            streak[1] += 1;
                        } else if (streak[0] == "W") {
                            streak[0] = `W${streak[1]}`
                        }

                        if (recent5[0] + recent5[1] < 5) recent5[1] += 1;

                        if (infos[12] == "home") {
                            home_road[0][1] += 1;
                        } else {
                            home_road[1][1] += 1;
                        }

                        if (infos[17] != "-") ot[1] += 1;

                        q_points[0] += q1
                        q_points[1] += q2
                        q_points[2] += q3
                        q_points[3] += q4
                        total_pts_a[0][1] += pts
                        total_pts_a[1][1] += pts_a

                        if (q1 + q2 > q1_a + q2_a) {
                            q2_ahead[1] += 1;
                        } else if (q1 + q2 < q1_a + q2_a) {
                            q2_behind[1] += 1;
                        } else {
                            q2_tied[1] += 1;
                        }

                        if (q1 + q2 + q3 > q1_a + q2_a + q3_a) {
                            q3_ahead[1] += 1;
                        } else if (q1 + q2 + q3 < q1_a + q2_a + q3_a) {
                            q3_behind[1] += 1;
                        } else {
                            q3_tied[1] += 1;
                        }

                        if (pts_a - pts <= 3) {
                            more_less[0][1] += 1
                        } else if (pts_a - pts >= 10) {
                            more_less[2][1] += 1
                        } else {
                            more_less[1][1] += 1
                        }

                    }
                });
                total_games = w_l[0] + w_l[1];

                if (team == rank[0]) {
                    no1 = [w_l[0], w_l[1]];
                    gb = "-"
                } else {
                    gb = ((no1[0] - w_l[0]) + (w_l[1] - no1[1])) / 2
                }

                if (ot[0] + ot[1] == 0) ot = ['', ''];
                if (q2_tied[0] + q2_tied[1] == 0) q2_tied = ['', ''];
                if (q3_tied[0] + q3_tied[1] == 0) q3_tied = ['', ''];

                table_overall.innerHTML += `
                <tr class="filterTr plg showTr">
                    <td class="borderR">${i + 1}</td>
                    <td class="textL">
                        <img src="../asset/images/men/${team}.png" alt="${team}" class="teamicon">
                        <b>${short_teamName[team]}<a style="font-size:12px">${playoff[team]}</a></b>
                    </td>
                    <td>${w_l[0] + w_l[1]}</td>
                    <td>${w_l[0]}</td>
                    <td>${w_l[1]}</td>
                    <td>${((w_l[0] / total_games) * 100).toFixed(0)}%</td>
                    <td>${gb}</td>
                    <td class="borderR">${streak[0]}</td>
                    <td class="borderR">${recent5[0]}-${recent5[1]}</td>
                    <td>${home_road[0][0]}-${home_road[0][1]}</td>
                    <td>${home_road[1][0]}-${home_road[1][1]}</td>
                    <td class="borderR">${ot[0]}-${ot[1]}</td>
                    <td>${((total_pts_a[0][0] + total_pts_a[0][1]) / total_games).toFixed(1)}</td>
                    <td>${((total_pts_a[1][0] + total_pts_a[1][1]) / total_games).toFixed(1)}</td>
                </tr>`

                table_points.innerHTML += `
                <tr class="filterTr plg showTr">
                    <td class="borderR">${i + 1}</td>
                    <td class="textL">
                        <img src="../asset/images/men/${team}.png" alt="${team}" class="teamicon">
                        <b>${short_teamName[team]}<a style="font-size:12px">${playoff[team]}</a></b>
                    </td>
                    <td>${w_l[0] + w_l[1]}</td>
                    <td>${w_l[0]}</td>
                    <td>${w_l[1]}</td>
                    <td class="borderR">${((w_l[0] / total_games) * 100).toFixed(0)}%</td>
                    <td>${((total_pts_a[0][0] + total_pts_a[0][1]) / total_games).toFixed(1)}</td>
                    <td class="borderR">${((total_pts_a[1][0] + total_pts_a[1][1]) / total_games).toFixed(1)}</td>
                    <td>${(q_points[0] / total_games).toFixed(1)}</td>
                    <td>${(q_points[1] / total_games).toFixed(1)}</td>
                    <td>${(q_points[2] / total_games).toFixed(1)}</td>
                    <td class="borderR">${(q_points[3] / total_games).toFixed(1)}</td>
                    <td>${(total_pts_a[0][0] / w_l[0]).toFixed(1)}</td>
                    <td class="borderR">${(total_pts_a[0][1] / w_l[1]).toFixed(1)}</td>
                    <td>${(total_pts_a[1][0] / w_l[0]).toFixed(1)}</td>
                    <td>${(total_pts_a[1][1] / w_l[1]).toFixed(1)}</td>
                </tr>`


                table_ahead.innerHTML += `
                <tr class="filterTr plg showTr">
                    <td class="borderR">${i + 1}</td>
                    <td class="textL">
                        <img src="../asset/images/men/${team}.png" alt="${team}" class="teamicon">
                        <b>${short_teamName[team]}<a style="font-size:12px">${playoff[team]}</a></b>
                    </td>
                    <td>${w_l[0] + w_l[1]}</td>
                    <td>${w_l[0]}</td>
                    <td>${w_l[1]}</td>
                    <td class="borderR">${((w_l[0] / total_games) * 100).toFixed(0)}%</td>
                    <td>${q2_ahead[0]}-${q2_ahead[1]}</td>
                    <td>${q2_behind[0]}-${q2_behind[1]}</td>
                    <td class="borderR">${q2_tied[0]}-${q2_tied[1]}</td>
                    <td>${q3_ahead[0]}-${q3_ahead[1]}</td>
                    <td>${q3_behind[0]}-${q3_behind[1]}</td>
                    <td class="borderR">${q3_tied[0]}-${q3_tied[1]}</td>
                    <td>${more_less[0][0]}-${more_less[0][1]}</td>
                    <td>${more_less[1][0]}-${more_less[1][1]}</td>
                    <td>${more_less[2][0]}-${more_less[2][1]}</td>
                </tr>`

                match_standings = ""
                for (let j = 0; j < rank.length; j++) {
                    if (j == i) {
                        matchup[j][1] = ""
                        matchup[j][2] = ""
                    }
                    match_standings += `<td>${matchup[j][1]}-${matchup[j][2]}`
                }
                table.innerHTML += `
                <tbody>
                    <tr>
                        <td class="borderR">${i + 1}</td>
                        <td class="textL">
                            <img src="../asset/images/men/${team}.png" alt="${team}" class="teamicon">
                            <b>${short_teamName[team]}<a style="font-size:12px">${playoff[team]}</a></b>
                        </td>
                        <td>${w_l[0] + w_l[1]}</td>
                        <td>${w_l[0]}</td>
                        <td>${w_l[1]}</td>
                        <td class="borderR">${((w_l[0] / total_games) * 100).toFixed(0)}%</td>
                        ${match_standings}
                    </tr>
                </tbody>`

                table_calendar.innerHTML += `
                <tr>
                    <td class="borderR">${i + 1}</td>
                    <td class="textL">
                        <img src="../asset/images/men/${team}.png" alt="${team}" class="teamicon">
                        <b>${short_teamName[team]}<a style="font-size:12px">${playoff[team]}</a></b>
                    </td>
                    <td>${w_l[0] + w_l[1]}</td>
                    <td>${w_l[0]}</td>
                    <td>${w_l[1]}</td>
                    <td class="borderR">${((w_l[0] / total_games) * 100).toFixed(0)}%</td>
                    <td>${lunar[0][0]}-${lunar[0][1]}</td>
                    <td class="borderR">${lunar[1][0]}-${lunar[1][1]}</td>
                    <td>${cal[10][0]}-${cal[10][1]}</td>
                    <td>${cal[11][0]}-${cal[11][1]}</td>
                    <td>${cal[0][0]}-${cal[0][1]}</td>
                    <td>${cal[1][0]}-${cal[1][1]}</td>
                    <td>${cal[2][0]}-${cal[2][1]}</td>
                    <td>${cal[3][0]}-${cal[3][1]}</td>
                    <td>${cal[4][0]}-${cal[4][1]}</td>
                </tr>`
            }
        });
});
