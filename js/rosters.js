class Roster {
    constructor(gender, league, id,
        local_age_sum = 0, local_height_sum = 0, local_count = 0, import_count = 0) {
        this.gender = gender;
        this.league = league;
        this.id = id;
        this.local_age_sum = local_age_sum;
        this.local_height_sum = local_height_sum;
        this.local_count = local_count;
        this.import_count = import_count;
    }

    avg(value) {
        if (value == "age") {
            return (this.local_age_sum / this.local_count);
        } else if (value = "height") {
            return (this.local_height_sum / this.local_count);
        }
    }
}
class Movement {
    constructor(move, content = '') {
        this.move = move;
        this.content = content;
    }
}
$(document).ready(function () {

    var genders = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item");
    var genderbtn = document.getElementById("genderbtn");
    var move_check = document.getElementById("move_check").querySelector("input[type='checkbox']");

    for (var i = 0; i < genders.length; i++) {
        genders[i].addEventListener("click", function () {
            switch_gender = 0;
            if (this.className != "dropdown-item active") switch_gender = 1;

            var currentGender = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item active");
            currentGender[0].className = currentGender[0].className.replace(" active", "");
            this.className += " active";
            genderbtn.innerHTML = this.innerHTML;

            if (switch_gender == 1) {
                if (this.innerHTML == "男籃") {
                    add_team_dropdown('team-dropdown', 'men', 'oversea');

                } else if (this.innerHTML == "女籃") {
                    add_team_dropdown('team-dropdown', 'women', 'oversea');
                }

                var teams = document.getElementById("team-dropdown").getElementsByClassName("dropdown-item");
                var teambtn = document.getElementById("teambtn");
                for (var i = 0; i < teams.length; i++) {
                    teams[i].addEventListener("click", function () {
                        var currentTeam = document.getElementById("team-dropdown").getElementsByClassName("active");
                        if (currentTeam.length != 0) currentTeam[0].className = currentTeam[0].className.replace(" active", "");
                        this.className += " active";
                        teambtn.innerHTML = this.innerHTML;

                        showRosterInfo();

                        if (move_check.checked) {
                            showMovementsInfo();
                        }
                    })
                }
                teams[0].click();
            }
        });

        move_check.addEventListener("click", function () {

            if (move_check.checked) {
                showMovementsInfo();

            } else {
                r_movements_tb = document.getElementById('r_movements_tb');
                r_movements_tb.innerHTML = '';
            }
        })
    }
    genders[0].click();
});
function showRosterInfo() {
    var currentGender = document.getElementById("gender-dropdown").getElementsByClassName("active");
    var filter_gender = currentGender[0].getAttribute('value');
    var currentTeam = document.getElementById("team-dropdown").getElementsByClassName("active");
    var filter_team = currentTeam[0].getAttribute('value');

    fetch('../data/rosters.csv')
        .then((response) => response.text())
        .then((result) => {
            lines = result.split('\n');
            lines = lines.slice(1);

            roster_info = '';

            if (filter_team == 'oversea') {
                filter_league = '';
                allRosters = [new Roster(filter_gender, 'oversea', 'oversea')];

                if (filter_gender == 'men') {
                    oversea_count = [['CBA', 0], ['日本', 0]];
                } else if (filter_gender == 'women') {
                    oversea_count = [['WCBA', 0], ['韓國', 0]];
                }
            } else {
                filter_league = findTeam(filter_team).league;
                allRosters = [];
                allTeams.forEach(team => {
                    if (team.league == filter_league) {
                        allRosters.push(new Roster(team.gender, team.league, team.id));
                    }
                })
            }

            lines.forEach(line => {
                infos = line.split(',');

                let [
                    gender,
                    name,
                    jersey_num, league, team, player_url,
                    status,
                    identity,
                    rookie,
                    league_identity, position, height, weight, birth,
                    school,
                    acquired,
                    contract_filter, contract_season, contract_years, contract_years_left,
                    contract_note,
                    contract_link_title, contract_url,
                    fa_status, last_season_league, last_season_team, fa_gp, fa_ppg, fa_rpg, fa_apg

                ] = infos;

                if (gender == filter_gender & status == 'active' & team != 'fa') {
                    if (filter_team == 'oversea' & isOversea(team)) {

                        if (league.includes('CBA') | league.includes('日本') | league.includes('韓國')) {
                            oversea_count.forEach(o => {
                                if (league.includes(o[0])) {
                                    o[1] += 1;
                                }
                            })
                        } else {
                            oversea_count[oversea_count.length - 1][1] += 1;
                        }

                        allRosters[0].local_age_sum += birthToAge(birth);
                        allRosters[0].local_height_sum += parseInt(height);
                        allRosters[0].local_count += 1;

                        roster_info += `
                        <tr>
                            <td class="${teamBG(league, team)} borderR">
                                ${teamName('short', league, team)}
                            </td>
                            <td class="borderR" data-order="${numOrder(jersey_num)}">${jersey_num}</td>
                            <td class="borderR"><a style="text-decoration:underline;color:inherit"
                                href="${playerUrl(team, player_url)}" target="_blank">${name}</a>
                            </td>             
                            <td data-order=${order[league_identity]}>${league_identity}</td>
                            <td>${position}</td>
                            <td>${height}</td>
                            <td>${weight}</td>
                            <td>${birthToAge(birth)}</td>
                            <td class="borderR">${birth}</td>
                            <td class="borderR textL" style="font-size:14px">${school}</td>
                            <td class="textL" style="font-size:14px">${acquired}</td>
                        </tr>`

                    } else if (filter_team != 'oversea' & league == filter_league) {
                        allRosters.forEach(roster => {
                            if (roster.id == team) {
                                if (leagueIdFilter(league_identity) == 'local') {
                                    roster.local_age_sum += birthToAge(birth);
                                    roster.local_height_sum += parseInt(height);
                                    roster.local_count += 1;
                                } else {
                                    roster.import_count += 1;
                                }
                            }
                        })

                        if (team == filter_team) {
                            roster_info += `
                            <tr class="${teamBG(league, team)}">
                                <td class="borderR" data-order="${numOrder(jersey_num)}">${jersey_num}</td>
                                <td class="borderR"><a style="text-decoration:underline;color:inherit"
                                    href="${playerUrl(team, player_url)}" target="_blank">${name}</a></td>             
                                <td data-order=${order[league_identity]}>${league_identity}</td>
                                <td>${position}</td>
                                <td>${height}</td>
                                <td>${weight}</td>
                                <td>${birthToAge(birth)}</td>
                                <td class="borderR">${birth}</td>
                                <td class="borderR textL" style="font-size:14px">${school}</td>
                                <td class="textL" style="font-size:14px">${acquired}</td>
                            </tr>`
                        }
                    }
                }
            })

            roster_th_width_title = [[120, '球隊'], [60, '#'], [100, '球員'], [90, '聯盟身份'],
            [80, '位置'], [80, '身高'], [80, '體重'], [80, '年齡'], [120, '生日'], [210, '學校'],
            [235, '加入途徑']];

            long_blank = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'

            if (filter_team == 'oversea') {
                r_count_tb = document.getElementById('r_count_tb');
                count_info = ''
                oversea_count.forEach(o => {
                    if (o[0] == 'CBA' | o[0] == 'WCBA') {
                        count_info += `${o[0]}:&nbsp;&nbsp;${o[1]}&nbsp;&nbsp;人`
                    } else {
                        count_info += `${long_blank}${o[0]}:&nbsp;&nbsp;${o[1]}&nbsp;&nbsp;人`
                    }
                })
                r_count_tb.innerHTML = `
                <tr class="${oversea_count[0][0]}-bg"><td>${count_info}</td></tr>
                <tr class="${oversea_count[0][0]}-bg">
                    <td>
                        本土平均年齡:&nbsp;${allRosters[0].avg('age').toFixed(1)}${long_blank}
                        本土平均身高:&nbsp;${allRosters[0].avg('height').toFixed(1)}
                    </td>
                </tr>`

                roster_table = document.getElementById('roster_table');
                thead_info = ''
                roster_th_width_title.forEach(th => {
                    thead_info += `<th style="width:${th[0]}px">${th[1]}</th>`
                })
                roster_table.innerHTML = `
                <table id="roster_tb" class="table table-hover table-fixTeam">
                    <thead>${thead_info}</thead>
                    <tbody>${roster_info}</tbody>
                </table>`

            } else {
                r_count_tb = document.getElementById('r_count_tb');
                rank_age = 1;
                rank_height = 1;
                allRosters.forEach(roster => {
                    if (roster.id == filter_team) {
                        allRosters.forEach(roster2 => {
                            if (roster.avg('age') < roster2.avg('age')) rank_age += 1;
                            if (roster.avg('height') < roster2.avg('height')) rank_height += 1;
                        })
                    }
                })

                allRosters.forEach(roster => {
                    if (roster.id == filter_team) {
                        if (window.innerWidth <= 600) {
                            blank = '<br>';
                        } else {
                            blank = `${long_blank}|${long_blank}`
                        }
                        r_count_tb.innerHTML = `
                        <tr class="${roster.id}-bg">
                            <td>
                                ${findTeam(roster.id).coach}${blank}
                                本土球員:&nbsp;&nbsp;${roster.local_count}&nbsp;&nbsp;人&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                外籍球員:&nbsp;&nbsp;${roster.import_count}&nbsp;&nbsp;人
                            </td>
                        </tr>`
                        if (window.innerWidth <= 510) {
                            blank = '<br>'
                        } else {
                            blank = long_blank;
                        }
                        r_count_tb.innerHTML += `
                        <tr class="${roster.id}-bg">
                            <td>
                                本土平均年齡:&nbsp;${roster.avg('age').toFixed(1)}&nbsp;(${roster.league}第${rank_age})${blank}
                                本土平均身高:&nbsp;${roster.avg('height').toFixed(1)}&nbsp;(${roster.league}第${rank_height})
                            </td>
                        </tr>`
                    }
                })

                roster_table = document.getElementById('roster_table');
                thead_info = ''
                roster_th_width_title.forEach(th => {
                    if (th[1] != '球隊') {
                        thead_info += `<th style="width:${th[0]}px">${th[1]}</th>`
                    }
                })
                roster_table.innerHTML = `
                <table id="roster_tb" class="table table-hover table-fix2">
                    <thead><tr>${thead_info}</tr></thead>
                    <tbody>${roster_info}</tbody>
                </table>`
            }

            var dataTable = $('#roster_tb').DataTable({
                dom: 't',
                paging: false,
                scrollCollapse: true,
                info: false,
                ordering: true,
                order: [0, 'asc']
            });

        });
}
function showMovementsInfo() {
    var currentGender = document.getElementById("gender-dropdown").getElementsByClassName("active");
    var filter_gender = currentGender[0].getAttribute('value');
    var currentTeam = document.getElementById("team-dropdown").getElementsByClassName("active");
    var filter_team = currentTeam[0].getAttribute('value');

    fetch('../data/movements.csv')
        .then((response) => response.text())
        .then((result) => {
            lines = result.split('\n');
            lines = lines.slice(1);

            resigned = [];
            signed = [];
            lost = [];

            lines.forEach(player => {
                infos = player.split(',');

                let [
                    gender,
                    team,
                    move_id,
                    move,
                    player_name,
                    content,
                    none

                ] = infos;

                if (gender == filter_gender & team == filter_team & move_id != '') {
                    new_move = 1;

                    if (move_id == 'resigned') {
                        currentMove = resigned;
                    } else if (move_id == 'signed') {
                        currentMove = signed;
                    } else if (move_id == 'lost') {
                        currentMove = lost;
                    }

                    currentMove.forEach(m => {
                        if (m.move == move) {
                            new_move = 0;

                            m.content += player_name;
                            if (content != '') m.content += ` (${content})`;
                            m.content += '<br>';
                        }
                    })

                    if (new_move == 1) {
                        movement1 = new Movement(move);
                        currentMove.push(movement1);
                        if (move != '續約' & move != '離隊') {
                            movement1.content = `<a style="text-decoration:underline"><i>${move}</i></a><br>`;
                        }
                        movement1.content += player_name;
                        if (content != '') movement1.content += ` (${content})`;
                        movement1.content += '<br>';
                    }
                }
            })

            unknown = '無 / 未知';
            if (resigned.length > 0) {
                resigned_info = '';
                resigned.forEach(p => { resigned_info += p.content + '<br>' })
            } else {
                resigned_info = unknown
            }
            if (signed.length > 0) {
                signed_info = '';
                signed.forEach(p => { signed_info += p.content + '<br>' })
            } else {
                signed_info = unknown;
            }
            if (lost.length > 0) {
                lost_info = '';
                lost.forEach(p => { lost_info += p.content + '<br>' })
            } else {
                lost_info = unknown;
            }

            r_movements_tb = document.getElementById('r_movements_tb');
            movement_title = '2024-25 球員異動'
            if (window.innerWidth <= 576) {
                r_movements_tb.innerHTML = `
                <thead>
                    <tr>
                        <th style="font-size:18px">${movement_title}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="textL">
                            <a style="text-decoration:underline; font-size:20px;"><b>Re-Signed</b></a><br>${resigned_info}
                        </td>
                    </tr>
                    <tr>
                        <td class="textL">
                            <a style="text-decoration:underline; font-size:20px;"><b>Signed</b></a><br>${signed_info}
                        </td>
                    </tr>
                    <tr>
                        <td class="textL">
                            <a style="text-decoration:underline; font-size:20px;"><b>Lost</b></a><br>${lost_info}
                        </td>
                    </tr>
                </tbody>`

            } else {
                r_movements_tb.innerHTML = `
                <thead>
                    <tr>
                        <th colspan=3 style="font-size:18px"><b>${movement_title}</b></th>
                    </tr>
                    <tr>
                        <th style="font-size:18px"><b>Re-Signed</b></th>
                        <th style="font-size:18px"><b>Signed</b></th>
                        <th style="font-size:18px"><b>Lost</b></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="borderR textL">${resigned_info}</td>
                        <td class="borderR textL">${signed_info}</td>
                        <td class="textL">${lost_info}</td>
                    </tr>
                </tbody>`
            }
        });
}