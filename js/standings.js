class Standings {
    constructor(id, playoff = '', w = 0, l = 0, gb = '', streak = '', streak_count = 0, matchup = [],
        recent5 = new WL, home = new WL, road = new WL, ot = new WL, total_pts = new WL, total_pts_against = new WL,
        q_points = [0, 0, 0, 0], q2_ahead = new WL, q2_behind = new WL, q2_tied = new WL,
        q3_ahead = new WL, q3_behind = new WL, q3_tied = new WL, less_3 = new WL, more_10 = new WL,
        lunar_before = new WL, lunar_after = new WL, cal = []) {
        this.id = id;
        this.playoff = playoff;
        this.w = w;
        this.l = l;
        this.gb = gb;
        this.streak = streak;
        this.streak_count = streak_count;
        this.matchup = matchup;
        this.recent5 = recent5;
        this.home = home;
        this.road = road;
        this.ot = ot;
        this.total_pts = total_pts;
        this.total_pts_against = total_pts_against;
        this.q_points = q_points;
        this.q2_ahead = q2_ahead;
        this.q2_behind = q2_behind;
        this.q2_tied = q2_tied;
        this.q3_ahead = q3_ahead;
        this.q3_behind = q3_behind;
        this.q3_tied = q3_tied;
        this.less_3 = less_3;
        this.more_10 = more_10;
        this.lunar_before = lunar_before;
        this.lunar_after = lunar_after;
        this.cal = cal;
    }
}
class Matchup {
    constructor(id, w = 0, l = 0, win_pts = 0, show_win_pts = 'show') {
        this.id = id;
        this.w = w;
        this.l = l;
        this.win_pts = win_pts;
        this.show_win_pts = show_win_pts;
    }
}
class WL {
    constructor(w = 0, l = 0) {
        this.w = w;
        this.l = l;
    }
}

$(document).ready(function () {
    league = ['plg', 't1', 'sbl', 'wsbl'];
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

                table_overall = document.getElementById('overall_tbody');
                table_points = document.getElementById('points_tbody');
                table_ahead = document.getElementById('ahead_tbody');
                table_matchup = document.getElementById(`${league[lg]}_tb`);
                table_calendar = document.getElementById(`calendar_tbody`);

                stand_info = [];
                matchup_thead = `
                <th style="width:50px">排名</th>
                <th style="width:120px">球隊</th>
                <th style="width:50px">已賽</th>
                <th style="width:50px">勝場</th>
                <th style="width:50px">敗場</th>
                <th style="width:60px">勝率</th>
                <th style="width:50px">勝差</th>`;
                show = ''
                if (league[lg] == 'plg') {
                    teams = plg_teams;
                    games = 40;
                    po_teams = 4;
                    show = 'showTr'
                } else if (league[lg] == 't1') {
                    teams = t1_teams;
                    games = 28;
                    po_teams = 4;
                } else if (league[lg] == 'sbl') {
                    teams = sbl_teams;
                    games = 30;
                    po_teams = 3;
                } else if (league[lg] == 'wsbl') {
                    teams = wsbl_teams;
                    games = 30;
                    po_teams = 3;
                }

                for (let i = 0; i < teams.length; i++) stand_info.push(new Standings(teams[i]));

                for (let i = 0; i < stand_info.length; i++) {
                    for (let j = 0; j < teams.length; j++) {
                        stand_info[i].matchup.push(new Matchup(teams[j]));
                    }
                    for (let j = 0; j < 12; j++) {
                        stand_info[i].cal.push(new WL);
                    }
                }
                lines.forEach(line => {
                    infos = line.split(',');

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

                    gameDate = new Date(date);
                    lunarDate = new Date('2024/2/9');

                    teamW_index = teams.indexOf(teamW);
                    teamL_index = teams.indexOf(teamL);

                    teamW_q1 = parseInt(teamW_q1);
                    teamW_q2 = parseInt(teamW_q2);
                    teamW_q3 = parseInt(teamW_q3);
                    teamW_q4 = parseInt(teamW_q4);
                    teamW_pts = parseInt(teamW_pts);
                    teamL_q1 = parseInt(teamL_q1);
                    teamL_q2 = parseInt(teamL_q2);
                    teamL_q3 = parseInt(teamL_q3);
                    teamL_q4 = parseInt(teamL_q4);
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

                    if (stand_info[teamW_index].recent5.w + stand_info[teamW_index].recent5.l < 5) {
                        stand_info[teamW_index].recent5.w += 1;
                    }
                    if (stand_info[teamL_index].recent5.w + stand_info[teamL_index].recent5.l < 5) {
                        stand_info[teamL_index].recent5.l += 1;
                    }

                    if (teamW_home_road == "home") {
                        stand_info[teamW_index].home.w += 1;
                        stand_info[teamL_index].road.l += 1;
                    } else if (teamL_home_road == "home") {
                        stand_info[teamW_index].road.w += 1;
                        stand_info[teamL_index].home.l += 1;
                    }

                    if (teamW_ot != '-' & teamL_ot != '-') {
                        stand_info[teamW_index].ot.w += 1;
                        stand_info[teamL_index].ot.l += 1;
                    }

                    stand_info[teamW_index].matchup[teamL_index].w += 1;
                    stand_info[teamL_index].matchup[teamW_index].l += 1;
                    stand_info[teamW_index].matchup[teamW_index].win_pts += teamW_pts - teamL_pts
                    stand_info[teamW_index].matchup[teamL_index].win_pts += teamW_pts - teamL_pts
                    stand_info[teamL_index].matchup[teamW_index].win_pts += teamL_pts - teamW_pts

                    stand_info[teamW_index].cal[gameDate.getMonth()].w += 1;
                    stand_info[teamL_index].cal[gameDate.getMonth()].l += 1;

                    if (gameDate < lunarDate) {
                        stand_info[teamW_index].lunar_before.w += 1;
                        stand_info[teamL_index].lunar_before.l += 1;
                    } else {
                        stand_info[teamW_index].lunar_after.w += 1;
                        stand_info[teamL_index].lunar_after.l += 1;
                    }

                    stand_info[teamW_index].q_points[0] += teamW_q1 - teamL_q1;
                    stand_info[teamW_index].q_points[1] += teamW_q2 - teamL_q2;
                    stand_info[teamW_index].q_points[2] += teamW_q3 - teamL_q3;
                    stand_info[teamW_index].q_points[3] += teamW_q4 - teamL_q4;
                    stand_info[teamW_index].total_pts.w += teamW_pts;
                    stand_info[teamW_index].total_pts_against.w += teamL_pts;

                    stand_info[teamL_index].q_points[0] += teamL_q1 - teamW_q1;
                    stand_info[teamL_index].q_points[1] += teamL_q2 - teamW_q2;
                    stand_info[teamL_index].q_points[2] += teamL_q3 - teamW_q3;
                    stand_info[teamL_index].q_points[3] += teamL_q4 - teamW_q4;
                    stand_info[teamL_index].total_pts.l += teamL_pts;
                    stand_info[teamL_index].total_pts_against.l += teamW_pts;

                    if (teamW_q1 + teamW_q2 > teamL_q1 + teamL_q2) {
                        stand_info[teamW_index].q2_ahead.w += 1;
                        stand_info[teamL_index].q2_behind.l += 1;
                    } else if (teamW_q1 + teamW_q2 < teamL_q1 + teamL_q2) {
                        stand_info[teamW_index].q2_behind.w += 1;
                        stand_info[teamL_index].q2_ahead.l += 1;
                    } else {
                        stand_info[teamW_index].q2_tied.w += 1;
                        stand_info[teamL_index].q2_tied.l += 1;
                    }

                    if (teamW_q1 + teamW_q2 + teamW_q3 > teamL_q1 + teamL_q2 + teamL_q3) {
                        stand_info[teamW_index].q3_ahead.w += 1;
                        stand_info[teamL_index].q3_behind.l += 1;
                    } else if (teamW_q1 + teamW_q2 + teamW_q3 < teamL_q1 + teamL_q2 + teamL_q3) {
                        stand_info[teamW_index].q3_behind.w += 1;
                        stand_info[teamL_index].q3_ahead.l += 1;
                    } else {
                        stand_info[teamW_index].q3_tied.w += 1;
                        stand_info[teamL_index].q3_tied.l += 1;
                    }

                    if (teamW_pts - teamL_pts <= 3) {
                        stand_info[teamW_index].less_3.w += 1;
                        stand_info[teamL_index].less_3.l += 1;
                    } else if (teamW_pts - teamL_pts >= 10) {
                        stand_info[teamW_index].more_10.w += 1;
                        stand_info[teamL_index].more_10.l += 1;
                    }

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
                            if (stand_info[i].w > (games - stand_info[j].l) | stand_info[i].matchup[j].w > temp_w | stand_info[i].matchup[j].l > temp_w) {
                                stand_info[i].matchup[j].show_win_pts = '';
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
                            if (stand_info[j].w > (games - stand_info[i].l) | stand_info[i].matchup[j].w > temp_w | stand_info[i].matchup[j].l > temp_w) {
                                stand_info[i].matchup[j].show_win_pts = '';
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
                    show_win_pts = 0;
                    for (let j = 0; j < stand_info.length; j++) {
                        if (i != j & stand_info[j].matchup[i].show_win_pts == 'show') {
                            show_win_pts = 1;
                        }
                    }
                    if (show_win_pts == 1) {
                        width = 110;
                    } else {
                        width = 80;
                    }
                    matchup_thead += `<th colspan="2" style="width:${width}px">${teamName('short', '', stand_info[i].id)}</th>`
                }
                table_matchup.innerHTML += `<thead>${matchup_thead}</thead>`;

                for (let i = 0; i < stand_info.length; i++) {
                    if (stand_info[i].ot.w + stand_info[i].ot.l == 0) {
                        stand_info[i].ot.w = '';
                        stand_info[i].ot.l = '';
                    }
                    if (stand_info[i].q2_tied.w + stand_info[i].q2_tied.l == 0) {
                        stand_info[i].q2_tied.w = '';
                        stand_info[i].q2_tied.l = '';
                    }
                    if (stand_info[i].q3_tied.w + stand_info[i].q3_tied.l == 0) {
                        stand_info[i].q3_tied.w = '';
                        stand_info[i].q3_tied.l = '';
                    }
                    for (let j = 0; j < 12; j++) {
                        if (stand_info[i].cal[j].w + stand_info[i].cal[j].l == 0) {
                            stand_info[i].cal[j].w = '';
                            stand_info[i].cal[j].l = '';
                        }
                    }
                    if (i == 0) {
                        no1_w = stand_info[0].w;
                        no1_l = stand_info[0].l;
                        stand_info[0].gb = "-"
                    } else {
                        stand_info[i].gb = ((no1_w - stand_info[i].w) + (stand_info[i].l - no1_l)) / 2
                    }
                    total_games = stand_info[i].w + stand_info[i].l;

                    table_overall.innerHTML += `
                    <tr class="filterTr ${league[lg]} ${show}">
                        <td class="borderR">${i + 1}</td>
                        <td class="textL">
                            ${teamName('short', '', stand_info[i].id, 'img')}<a style="font-size:12px"><b>${stand_info[i].playoff}</b></a>
                        </td>
                        <td>${total_games}</td>
                        <td>${stand_info[i].w}</td>
                        <td>${stand_info[i].l}</td>
                        <td>${((stand_info[i].w / total_games) * 100).toFixed(0)}%</td>
                        <td>${stand_info[i].gb}</td>
                        <td class="borderR">${stand_info[i].streak}</td>
                        <td class="borderR">${stand_info[i].recent5.w}-${stand_info[i].recent5.l}</td>
                        <td>${stand_info[i].home.w}-${stand_info[i].home.l}</td>
                        <td>${stand_info[i].road.w}-${stand_info[i].road.l}</td>
                        <td class="borderR">${stand_info[i].ot.w}-${stand_info[i].ot.l}</td>
                        <td>${((stand_info[i].total_pts.w + stand_info[i].total_pts.l) / total_games).toFixed(1)}</td>
                        <td class="borderR">${((stand_info[i].total_pts_against.w + stand_info[i].total_pts_against.l) / total_games).toFixed(1)}</td>
                        <td>${(((stand_info[i].total_pts.w + stand_info[i].total_pts.l)
                            - (stand_info[i].total_pts_against.w + stand_info[i].total_pts_against.l)) / total_games).toFixed(1)}</td>
                    </tr>`

                    table_points.innerHTML += `
                    <tr class="filterTr ${league[lg]} ${show}">
                        <td class="borderR">${i + 1}</td>
                        <td class="textL">
                            ${teamName('short', '', stand_info[i].id, 'img')}<a style="font-size:12px"><b>${stand_info[i].playoff}</b></a>
                        </td>
                        <td>${total_games}</td>
                        <td>${stand_info[i].w}</td>
                        <td>${stand_info[i].l}</td>
                        <td>${((stand_info[i].w / total_games) * 100).toFixed(0)}%</td>
                        <td class="borderR">${stand_info[i].gb}</td>
                        <td>${((stand_info[i].total_pts.w + stand_info[i].total_pts.l) / total_games).toFixed(1)}</td>
                        <td class="borderR">${((stand_info[i].total_pts_against.w + stand_info[i].total_pts_against.l) / total_games).toFixed(1)}</td>
                        <td>${(stand_info[i].q_points[0] / total_games).toFixed(1)}</td>
                        <td>${(stand_info[i].q_points[1] / total_games).toFixed(1)}</td>
                        <td>${(stand_info[i].q_points[2] / total_games).toFixed(1)}</td>
                        <td class="borderR">${(stand_info[i].q_points[3] / total_games).toFixed(1)}</td>
                        <td>${(stand_info[i].total_pts.w / stand_info[i].w).toFixed(1)}</td>
                        <td class="borderR">${(stand_info[i].total_pts.l / stand_info[i].l).toFixed(1)}</td>
                        <td>${(stand_info[i].total_pts_against.w / stand_info[i].w).toFixed(1)}</td>
                        <td>${(stand_info[i].total_pts_against.l / stand_info[i].l).toFixed(1)}</td>     
                    </tr>`

                    table_ahead.innerHTML += `
                    <tr class="filterTr ${league[lg]} ${show}">
                        <td class="borderR">${i + 1}</td>
                        <td class="textL">
                            ${teamName('short', '', stand_info[i].id, 'img')}<a style="font-size:12px"><b>${stand_info[i].playoff}</b></a>
                        </td>
                        <td>${total_games}</td>
                        <td>${stand_info[i].w}</td>
                        <td>${stand_info[i].l}</td>
                        <td>${((stand_info[i].w / total_games) * 100).toFixed(0)}%</td>
                        <td class="borderR">${stand_info[i].gb}</td>
                        <td>${stand_info[i].q2_ahead.w}-${stand_info[i].q2_ahead.l}</td>
                        <td>${stand_info[i].q2_behind.w}-${stand_info[i].q2_behind.l}</td>
                        <td class="borderR">${stand_info[i].q2_tied.w}-${stand_info[i].q2_tied.l}</td>
                        <td>${stand_info[i].q3_ahead.w}-${stand_info[i].q3_ahead.l}</td>
                        <td>${stand_info[i].q3_behind.w}-${stand_info[i].q3_behind.l}</td>
                        <td class="borderR">${stand_info[i].q3_tied.w}-${stand_info[i].q3_tied.l}</td>
                        <td class="borderR">${stand_info[i].ot.w}-${stand_info[i].ot.l}</td>
                        <td>${stand_info[i].less_3.w}-${stand_info[i].less_3.l}</td>
                        <td>${stand_info[i].more_10.w}-${stand_info[i].more_10.l}</td>
                    </tr>`

                    match_standings = ""
                    for (let j = 0; j < stand_info.length; j++) {
                        if (j == i) {
                            match_standings += `
                            <td colspan="2"><img src="./asset/images/logo_round.png" alt="all" class="teamicon"></a></td>`
                        } else if (stand_info[i].matchup[j].show_win_pts == 'show') {
                            match_standings += `
                            <td class="textR">${stand_info[i].matchup[j].w}-${stand_info[i].matchup[j].l}</td>
                            <td class="textL">(${stand_info[i].matchup[j].win_pts})</td>`
                        } else {
                            match_standings += `
                            <td colspan="2">${stand_info[i].matchup[j].w}-${stand_info[i].matchup[j].l}</td>`
                        }
                    }
                    table_matchup.innerHTML += `
                    <tbody>
                        <tr>
                            <td class="borderR">${i + 1}</td>
                            <td class="textL">
                                ${teamName('short', '', stand_info[i].id, 'img')}<a style="font-size:12px"><b>${stand_info[i].playoff}</b></a>
                            </td>
                            <td>${total_games}</td>
                            <td>${stand_info[i].w}</td>
                            <td>${stand_info[i].l}</td>
                            <td>${((stand_info[i].w / total_games) * 100).toFixed(0)}%</td>
                            <td class="borderR">${stand_info[i].gb}</td>
                            ${match_standings}
                        </tr>
                    </tbody>`


                    table_calendar.innerHTML += `
                    <tr class="filterTr ${league[lg]} ${show}">
                        <td class="borderR">${i + 1}</td>
                        <td class="textL">
                            ${teamName('short', '', stand_info[i].id, 'img')}<a style="font-size:12px"><b>${stand_info[i].playoff}</b></a>
                        </td>
                        <td>${total_games}</td>
                        <td>${stand_info[i].w}</td>
                        <td>${stand_info[i].l}</td>
                        <td>${((stand_info[i].w / total_games) * 100).toFixed(0)}%</td>
                        <td class="borderR">${stand_info[i].gb}</td>
                        <td>${stand_info[i].lunar_before.w}-${stand_info[i].lunar_before.l}</td>
                        <td class="borderR">${stand_info[i].lunar_after.w}-${stand_info[i].lunar_after.l}</td>
                        <td>${stand_info[i].cal[9].w}-${stand_info[i].cal[9].l}</td>
                        <td>${stand_info[i].cal[10].w}-${stand_info[i].cal[10].l}</td>
                        <td>${stand_info[i].cal[11].w}-${stand_info[i].cal[11].l}</td>
                        <td>${stand_info[i].cal[0].w}-${stand_info[i].cal[0].l}</td>
                        <td>${stand_info[i].cal[1].w}-${stand_info[i].cal[1].l}</td>
                        <td>${stand_info[i].cal[2].w}-${stand_info[i].cal[2].l}</td>
                        <td>${stand_info[i].cal[3].w}-${stand_info[i].cal[3].l}</td>
                        <td>${stand_info[i].cal[4].w}-${stand_info[i].cal[4].l}</td>
                    </tr>`
                }

            });
    }

    var leagues = document.getElementById("league-dropdown").getElementsByClassName("dropdown-item");
    var standings = document.getElementById("standing-dropdown").getElementsByClassName("dropdown-item");
    var leaguebtn = document.getElementById("leaguebtn");
    var standingbtn = document.getElementById("standingbtn");
    var tables = document.getElementsByClassName("filterTb");

    for (var i = 0; i < leagues.length; i++) {
        leagues[i].addEventListener("click", function () {
            var currentLeague = document.getElementById("league-dropdown").getElementsByClassName("active");
            currentLeague[0].className = currentLeague[0].className.replace(" active", "");
            this.className += " active";
            leaguebtn.innerHTML = this.innerHTML;

            var currentStanding = document.getElementById("standing-dropdown").getElementsByClassName("active");
            currentStanding[0].click();
        });
    }

    for (var i = 0; i < standings.length; i++) {
        standings[i].addEventListener("click", function () {
            currentStanding = document.getElementById("standing-dropdown").getElementsByClassName("active");
            currentStanding[0].className = currentStanding[0].className.replace(" active", "");
            this.className += " active";
            standingbtn.innerHTML = this.innerHTML

            var currentTable = document.getElementsByClassName("showTb");
            currentTable[0].className = currentTable[0].className.replace(" showTb", "");
            if (this.innerHTML == standings[0].innerHTML) {
                tables[0].className += " showTb";
            } else if (this.innerHTML == standings[1].innerHTML) {
                tables[1].className += " showTb";
            } else if (this.innerHTML == standings[2].innerHTML) {
                tables[2].className += " showTb";
            } else if (this.innerHTML == standings[4].innerHTML) {
                tables[3].className += " showTb";
            } else if (this.innerHTML == standings[3].innerHTML) {
                if (leaguebtn.innerHTML == leagues[0].innerHTML) {
                    tables[4].className += " showTb";
                } else if (leaguebtn.innerHTML == leagues[1].innerHTML) {
                    tables[5].className += " showTb";
                } else if (leaguebtn.innerHTML == leagues[2].innerHTML) {
                    tables[6].className += " showTb";
                } else if (leaguebtn.innerHTML == leagues[3].innerHTML) {
                    tables[7].className += " showTb";
                }
            }

            f('filter');
        });
    }
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