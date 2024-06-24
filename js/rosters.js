class Rosters {
    constructor(gender, league, id, coach = "", coach_EN = "",
        local_age_sum = 0, local_height_sum = 0, local_count = 0, import_count = 0, age_rank = 0, height_rank = 0,
        extension = [], signed = [], lost = []) {
        this.gender = gender;
        this.league = league;
        this.id = id;
        this.coach = coach;
        this.coach_EN = coach_EN;
        this.local_age_sum = local_age_sum;
        this.local_height_sum = local_height_sum;
        this.local_count = local_count;
        this.import_count = import_count;
        this.age_rank = age_rank;
        this.height_rank = height_rank;
        this.extension = extension;
        this.signed = signed;
        this.lost = lost;
    }

    avg(value) {
        if (value == "age") {
            return (this.local_age_sum / this.local_count).toFixed(1);
        } else if (value = "height") {
            return (this.local_height_sum / this.local_count).toFixed(1);
        }
    }
}
class Movements {
    constructor(move, content = '') {
        this.move = move;
        this.content = content;
    }
}
$(document).ready(function () {

    tableCount = document.getElementById('r_count_tbody');
    table = document.getElementById('roster_tbody');
    tableOversea = document.getElementById('roster_oversea_tbody');
    table_movements_th = document.getElementById('roster_movements_thead')
    table_movements = document.getElementById('roster_movements_tbody')

    rosters_info = [];
    rosters_info.push(new Rosters('men', 'oversea', 'oversea'));
    rosters_info.push(new Rosters('women', 'oversea', 'oversea'));

    for (let i = 0; i < allTeams.length; i++) {
        rosters_info.push(new Rosters(allTeams[i].gender, allTeams[i].league, allTeams[i].id));
    }

    fetch('../data/rosters.csv')
        .then((response) => response.text())
        .then((result) => {

            lines = result.split('\n');
            lines = lines.slice(2);

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

                if (status == "active" & team != "fa") {
                    if (identity == "coach") {
                        rosters_info[team_index].coach = `${league_identity}: ${name}`
                        rosters_info[team_index].coach_EN = findTeam(rosters_info[team_index].id).coach_EN;
                    } else {
                        if (isOversea(team)) {
                            table = document.getElementById('roster_oversea_tbody');

                            if (gender == "men") {
                                team_index = 0;
                            } else if (gender == "women") {
                                team_index = 1;
                            }
                            is_local = 1;
                            is_import = 0;
                            oversea_team = `<td class="borderR">${league} ${team}</td>`;
                        } else {
                            table = document.getElementById('roster_tbody');

                            team_index = 2 + findTeam(team).teamIndex();
                            is_local = leagueIdFilter(league_identity) == "local";
                            is_import = leagueIdFilter(league_identity) == "import";
                            oversea_team = '';
                        }

                        if (is_local | is_import) {
                            if (is_local) {
                                rosters_info[team_index].local_age_sum += birthToAge(birth);
                                rosters_info[team_index].local_height_sum += parseInt(height);
                                rosters_info[team_index].local_count += 1;

                            } else if (is_import) {
                                rosters_info[team_index].import_count += 1;
                            }

                            if (name == '安尼奎') {
                                league_identity = `<a style="color:white">${league_identity}</a>`
                            }

                            table.innerHTML += `
                            <tr class="filterTr ${gender} ${teamFilter(team)} ${teamBG(league, team)}" style="font-size:15px">
                                ${oversea_team}
                                <td class="borderR" data-order="${numOrder(jersey_num)}">${jersey_num}</td>
                                <td><a style="text-decoration:underline;color:inherit" href="${playerUrl(team, player_url)}" target="_blank">${name}</a></td>             
                                <td>${league_identity}</td>
                                <td>${pos}</td>
                                <td>${height}</td>
                                <td>${weight}</td>
                                <td>${birthToAge(birth)}</td>
                                <td class="borderR">${birth}</td>
                                <td class="borderR textL" style="font-size:14px">${school}</td>
                                <td class="textL" style="font-size:14px">${aquired}</td>
                            </tr>`
                        }
                    }
                }
            });

            for (let i = 2; i < rosters_info.length; i++) {
                rank_age = 1;
                rank_height = 1;
                for (let j = 2; j < rosters_info.length; j++) {
                    if (rosters_info[i].league == rosters_info[j].league) {
                        if (rosters_info[i].avg('age') < rosters_info[j].avg('age')) {
                            rank_age += 1;
                        }
                        if (rosters_info[i].avg('height') < rosters_info[j].avg('height')) {
                            rank_height += 1;
                        }
                    }
                }
                rosters_info[i].age_rank = rank_age;
                rosters_info[i].height_rank = rank_height;
            }

            var dataTable = $('#rosters_tb').DataTable({
                dom: 't',
                paging: false,
                scrollCollapse: true,
                info: false,
                ordering: true,
                order: [0, 'asc'],
            });

            var dataTable2 = $('#rosters_oversea_tb').DataTable({
                dom: 't',
                paging: false,
                scrollCollapse: true,
                info: false,
                ordering: true,
                order: [],
            });

            updateTables();
            document.getElementById("gender-dropdown").getElementsByClassName('dropdown-item')[0].click();
        });

    fetch('../data/movements.csv')
        .then((response) => response.text())
        .then((result) => {

            lines = result.split('\n');
            lines = lines.slice(5);

            lines.forEach(player => {
                infos = player.split(',');

                let [
                    gender,
                    team,
                    move,
                    content
                ] = infos;

                if (move != "") {
                    if (team == 'oversea') {
                        if (gender == 'men') team_index = 0
                        if (gender == 'women') team_index = 1
                    } else {
                        team_index = 2 + findTeam(team).teamIndex();
                    }

                    if (move.includes('extend')) {
                        current_move = rosters_info[team_index].extension;
                    } else if (move.includes('lost') | move == 'loan end') {
                        current_move = rosters_info[team_index].lost;
                    } else {
                        current_move = rosters_info[team_index].signed;
                    }

                    new_move = 1;
                    for (let i = 0; i < current_move.length; i++) {
                        if (current_move[i].move == move) {
                            current_move[i].content += `${content}<br>`;
                            new_move = 0;
                        }
                    }
                    if (new_move == 1) {
                        move_title = '';
                        move_content = '';

                        if (move == "change") {
                            move_title = "轉隊"
                        } else if (move == "merge") {
                            move_title = "Via 合併"
                        } else if (move == "fa") {
                            move_title = "Via 自由球員"
                        } else if (move == "trade") {
                            move_title = "Via 交易"
                        } else if (move == "keep") {
                            move_title = "Via 保留名單"
                        } else if (move == "draft") {
                            move_title = "Via 選秀"
                        } else if (move == "loan") {
                            move_title = "Via 租借"
                        } else if (move == "loan back") {
                            move_title = "租借回歸"
                        } else if (move == "lost loan") {
                            move_title = "Via 租借"
                        } else if (move == 'loan end') {
                            move_title = '租借結束'
                        } else if (move == "lost trade") {
                            move_title = "Via 交易"
                        } else if (move == "import extend") {
                            move_title = "續留洋將"
                        } else if (move == "import") {
                            move_title = "加盟洋將"
                        } else if (move == "import lost") {
                            move_title = "離隊洋將"
                        }
                        if (move_title != '') {
                            move_content += `<a style="text-decoration:underline"><i>${move_title}</i></a><br>`;
                        }
                        move_content += `${content}<br>`

                        current_move.push(new Movements(move, move_content));
                    }
                }
            });
            updateMovements();
            document.getElementById("gender-dropdown").getElementsByClassName('dropdown-item')[0].click();
        });

    window.addEventListener('resize', updateTables);
    window.addEventListener('resize', updateMovements);

    var genders = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item");
    var genderbtn = document.getElementById("genderbtn");
    var roster_tbs = document.getElementsByClassName("filterTb");
    var move_check = document.getElementById("move_check").querySelector("input[type='checkbox']");

    for (var i = 0; i < genders.length; i++) {
        genders[i].addEventListener("click", function () {
            switch_gender = 0;
            if (this.className != "dropdown-item active") {
                switch_gender = 1;
            }
            var currentGender = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item active");
            currentGender[0].className = currentGender[0].className.replace(" active", "");
            this.className += " active";
            genderbtn.innerHTML = this.innerHTML;

            if (switch_gender == 1) {
                if (this.innerHTML == "男籃") {
                    add_team_dropdown('team-dropdown', 'men', '', 'cba');

                } else if (this.innerHTML == "女籃") {
                    add_team_dropdown('team-dropdown', 'women', '', 'wcba');

                }
                var teams = document.getElementById("team-dropdown").getElementsByClassName("dropdown-item");
                var teambtn = document.getElementById("teambtn");
                for (var i = 0; i < teams.length; i++) {
                    teams[i].addEventListener("click", function () {
                        if (this.innerHTML.includes("旅外")) {
                            roster_tbs[1].className = roster_tbs[1].className.replace(" showTb", "");
                            roster_tbs[2].className += " showTb";
                        } else if (roster_tbs[2].className.includes("showTb")) {
                            roster_tbs[2].className = roster_tbs[2].className.replace(" showTb", "");
                            roster_tbs[1].className += " showTb";
                        }
                        var currentTeam = document.getElementById("team-dropdown").getElementsByClassName("dropdown-item active");
                        currentTeam[0].className = currentTeam[0].className.replace(" active", "");
                        this.className += " active";
                        teambtn.innerHTML = this.innerHTML;

                        f('filter');
                    });
                }
                teams[1].click();
            }
        });
    }

    move_check.addEventListener("click", function () {
        if (move_check.checked) {
            roster_tbs[0].className += " showTb";
        } else {
            roster_tbs[0].className = roster_tbs[0].className.replace(" showTb", "");
        }
    });
});
function updateTables() {

    tableCount.innerHTML = `
        <tr class="filterTr men oversea CBA-bg">
            <td>
                CBA:&nbsp;&nbsp;5&nbsp;&nbsp;人&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                日本:&nbsp;&nbsp;3&nbsp;&nbsp;人
            </td>
        </tr>
        <tr class="filterTr men oversea CBA-bg">
            <td>
                本土平均年齡:&nbsp;${rosters_info[0].avg('age')}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                本土平均身高:&nbsp;${rosters_info[0].avg('height')}
            </td>
        </tr>
        <tr class="filterTr women oversea WCBA-bg">
            <td>
                WCBA:&nbsp;&nbsp;6&nbsp;&nbsp;人&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                WKBL:&nbsp;&nbsp;1&nbsp;&nbsp;人&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                其他:&nbsp;&nbsp;1&nbsp;&nbsp;人
            </td>
        </tr>
        <tr class="filterTr women oversea WCBA-bg">
            <td>
            本土平均年齡:&nbsp;${rosters_info[1].avg('age')}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            本土平均身高:&nbsp;${rosters_info[1].avg('height')}
            </td>
        </tr>`


    for (let i = 2; i < rosters_info.length; i++) {
        if (rosters_info[i].coach_EN != "" & window.innerWidth <= 600) {
            blank = `<br>`
        } else if (window.innerWidth <= 495) {
            blank = '<br>'
        } else {
            blank = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`
        }
        tableCount.innerHTML += `
        <tr class="filterTr ${rosters_info[i].gender} ${rosters_info[i].id} ${rosters_info[i].id}-bg">
            <td>
                ${rosters_info[i].coach}${rosters_info[i].coach_EN}${blank}
                本土球員:&nbsp;&nbsp;${rosters_info[i].local_count}&nbsp;&nbsp;人&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                外籍球員:&nbsp;&nbsp;${rosters_info[i].import_count}&nbsp;&nbsp;人
            </td>
        </tr>`
        if (window.innerWidth > 510) {
            blank = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`
        } else {
            blank = `<br>`
        }
        tableCount.innerHTML += `
        <tr class="filterTr ${rosters_info[i].gender} ${rosters_info[i].id} ${rosters_info[i].id}-bg">
            <td>
                本土平均年齡:&nbsp;${rosters_info[i].avg('age')}&nbsp;(${rosters_info[i].league.toUpperCase()}第${rosters_info[i].age_rank})${blank}
                本土平均身高:&nbsp;${rosters_info[i].avg('height')}&nbsp;(${rosters_info[i].league.toUpperCase()}第${rosters_info[i].height_rank})
            </td>
        </tr>`
    }
    document.getElementById("team-dropdown").getElementsByClassName('active')[0].click();
}
function updateMovements() {
    table_movements.innerHTML = ""


    if (window.innerWidth <= 576) {
        table_movements_th.innerHTML = `<th>2024-25 球員異動</th>`

        for (let i = 0; i < rosters_info.length; i++) {
            extension = '';
            signed = '';
            lost = '';
            if (rosters_info[i].extension.length > 0) {
                for (let j = 0; j < rosters_info[i].extension.length; j++) {
                    extension += rosters_info[i].extension[j].content;
                }
            } else {
                extension = '無 / 未知'
            }
            if (rosters_info[i].signed.length > 0) {
                for (let j = 0; j < rosters_info[i].signed.length; j++) {
                    signed += rosters_info[i].signed[j].content;
                }
            } else {
                signed = '無 / 未知'
            }
            if (rosters_info[i].lost.length > 0) {
                for (let j = 0; j < rosters_info[i].lost.length; j++) {
                    lost += rosters_info[i].lost[j].content;
                }
            } else {
                lost = '無 / 未知'
            }
            table_movements.innerHTML += `
            <tr class="filterTr ${rosters_info[i].gender} ${rosters_info[i].id}">
                <td class="textL">
                    <a style="text-decoration:underline; font-size:20px;"><b>Extension</b></a><br>${extension}
                </td>
            </tr>
            <tr class="filterTr ${rosters_info[i].gender} ${rosters_info[i].id}">
                <td class="textL">
                    <a style="text-decoration:underline; font-size:20px;"><b>Signed</b></a><br>${signed}
                </td>
            </tr>
            <tr class="filterTr ${rosters_info[i].gender} ${rosters_info[i].id}">
                <td class="textL">
                    <a style="text-decoration:underline; font-size:20px;"><b>Lost</b></a><br>${lost}
                </td>
            </tr>`
        }
    } else {
        table_movements_th.innerHTML = `
        <th style="font-size:18px"><b>Extension</b></th>
        <th style="font-size:18px"><b>Signed</b></th>
        <th style="font-size:18px"><b>Lost</b></th>`

        for (let i = 0; i < rosters_info.length; i++) {
            extension = '';
            signed = '';
            lost = '';
            if (rosters_info[i].extension.length > 0) {
                for (let j = 0; j < rosters_info[i].extension.length; j++) {
                    extension += rosters_info[i].extension[j].content;
                }
            } else {
                extension = '<br>無 / 未知<br><br>'
            }
            if (rosters_info[i].signed.length > 0) {
                for (let j = 0; j < rosters_info[i].signed.length; j++) {
                    signed += rosters_info[i].signed[j].content;
                }
            } else {
                signed = '<br>無 / 未知<br><br>'
            }
            if (rosters_info[i].lost.length > 0) {
                for (let j = 0; j < rosters_info[i].lost.length; j++) {
                    lost += rosters_info[i].lost[j].content;
                }
            } else {
                lost = '<br>無 / 未知<br><br>'
            }

            table_movements.innerHTML += `
            <tr class="filterTr ${rosters_info[i].gender} ${rosters_info[i].id}">
                <td class="borderR textL">${extension}</td>
                <td class="borderR textL">${signed}</td>
                <td class="textL">${lost}</td>
            </tr>`
        }
    }
    document.getElementById("team-dropdown").getElementsByClassName('active')[0].click();
}
