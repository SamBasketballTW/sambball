class team_rosters {

    constructor(gender = "", league = "", filter = "", coach = "", local_age_sum = 0, local_height_sum = 0, local_count = 0, import_count = 0){
        this.gender = gender;
        this.league = league;
        this.filter = filter;
        this.coach = coach;
        this.local_age_sum = local_age_sum;
        this.local_height_sum = local_height_sum;
        this.local_count = local_count;
        this.import_count = import_count;
    }

    avg(value){
        if(value == "age"){
            return (this.local_age_sum / this.local_count).toFixed(1);
        }else if(value = "height"){
            return (this.local_height_sum / this.local_count).toFixed(1);
        }
    }
}
$(document).ready(function () {

    tableCount = document.getElementById('r_count_tbody');
    table = document.getElementById('roster_tbody');
    tableOversea = document.getElementById('roster_oversea_tbody');
    table_movements_th = document.getElementById('roster_movements_thead')
    table_movements = document.getElementById('roster_movements_tbody')

    teams_info = [['men', 'oversea', 0,0,0,0],['women','oversea',0,0,0,0]]
    for (let i = 0; i < league_teams['plg']; i++) teams_info.push(['men',plg_teams[i + 1],0,0,0,0]);
    for (let i = 0; i < league_teams['t1']; i++) teams_info.push(['men',t1_teams[i + 1],0,0,0,0]);
    for (let i = 0; i < league_teams['sbl']; i++) teams_info.push(['men',sbl_teams[i + 1],0,0,0,0]);
    for (let i = 0; i < league_teams['wsbl']; i++) teams_info.push(['women',wsbl_teams[i + 1],0,0,0,0]);


    temp_info = [];
    temp_teams = [];
    temp_info.push(new team_rosters('men','oversea','oversea'));
    temp_info.push(new team_rosters('women','oversea','oversea'));
    for (let i = 1; i <= league_teams['plg']; i++){
        temp_info.push(new team_rosters('men','plg',plg_teams[i]));
        temp_teams.push(plg_teams[i]);
    }
    for (let i = 1; i <= league_teams['t1']; i++){
        temp_info.push(new team_rosters('men','t1',t1_teams[i]));
        temp_teams.push(t1_teams[i]);
    }
    for (let i = 1; i <= league_teams['sbl']; i++){
        temp_info.push(new team_rosters('men','sbl',sbl_teams[i]));
        temp_teams.push(sbl_teams[i]);
    }
    for (let i = 1; i <= league_teams['wsbl']; i++){
        temp_info.push(new team_rosters('women','wsbl',wsbl_teams[i]));
        temp_teams.push(wsbl_teams[i]);
    }

    fetch('../data/rosters.csv')
        .then((response) => response.text())
        .then((result) => {

            lines = result.split('\n');
            lines = lines.slice(2);

            team_coach_info = [];
            for (let i = 0; i < teams_info.length; i++) team_coach_info.push('');

            lines.forEach(player => {
                infos = player.split(',');
                info = ""
                infoOversea = ""
                infoCoach = ""
                infoCount = ""

                if (window.innerWidth <= 576) {
                    blankSpace = `<br>`
                } else {
                    blankSpace = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`
                }

                if (infos[0] != "" & infos[6] == "active" & infos[4] != "fa") {
                    if (infos[7] == "headCoach" | infos[7] == "coach") {

                        team_index = findIndex(teams_info, infos[4],1);
                        team_coach_info[team_index] += `${infos[9]}: ${infos[1]}`;

                        temp_team_i = 2 + findIndex(temp_teams,infos[4]);
                        temp_info[temp_team_i].coach = `${infos[9]}: ${infos[1]}`;

                    } else {
                        if (is_oversea(infos[3])) {
                            if (infos[0] == "men") team_index = 0;
                            if (infos[0] == "women") team_index = 1;
                            is_local = 1;
                            is_import = infos[7] != "local";

                            if (infos[0] == "men") temp_team_i = 0;
                            if (infos[0] == "women") temp_team_i = 1;
                            is_local = 1;
                            is_import = infos[7] != "local";
                        } else {
                            team_index = findIndex(teams_info, infos[4],1);
                            is_local = identity(infos[9]) == "local";
                            is_import = identity(infos[9]) == "import";

                            temp_team_i = 2 + findIndex(temp_teams,infos[4])
                        }

                        if (is_local) {
                            teams_info[team_index][2] += age(infos[13]);
                            teams_info[team_index][3] += parseInt(infos[11]);
                            teams_info[team_index][4] += 1;

                            temp_info[temp_team_i].local_age_sum += age(infos[13]);
                            temp_info[temp_team_i].local_height_sum += parseInt(infos[11]);
                            temp_info[temp_team_i].local_count += 1;
                        } else if (is_import) {
                            teams_info[team_index][5] += 1;

                            temp_info[temp_team_i].import_count += 1;
                        }

                        if (is_local | is_import | infos[9] == "註銷" | infos[9] == "未註冊") {
                            if (is_oversea(infos[3])) {
                                oversea_team = `<td class="borderR">${team_name("full", infos[3], infos[4])}</td>`;
                            } else {
                                oversea_team = ""
                            }
                            if (infos[5] == '') infos[5] = team_link[infos[4]];

                            if (infos[9] == "註銷" | infos[9] == "未註冊") {
                                infos[9] = `<a style="color:white">${infos[9]}</a>`
                            }

                            tempInfo = `
                                <tr class="filterTr ${infos[0]} ${filter_team(infos[3], infos[4])} ${bg_team(infos[3], infos[4])}" style="font-size:15px">
                                    ${oversea_team}
                                    <td class="borderR" data-order="${num_order(infos[2])}">${infos[2]}</td>
                                    <td><a style="text-decoration:underline;color:inherit" href="${infos[5]}" target="_blank">${infos[1]}</a></td>             
                                    <td data-order=${order[infos[9]]}>${infos[9]}</td>
                                    <td>${infos[10]}</td>
                                    <td>${infos[11]}</td>
                                    <td>${infos[12]}</td>
                                    <td>${age(infos[13])}</td>
                                    <td class="borderR">${infos[13]}</td>
                                    <td class="borderR textL" style="font-size:14px">${infos[14]}</td>
                                    <td class="textL" style="font-size:14px">${infos[15]}</td>
                                </tr>
                            `
                            if (is_oversea(infos[3])) {
                                infoOversea += tempInfo;
                            } else {
                                info += tempInfo;
                            }
                        }
                    }
                }

                table.innerHTML += info;
                tableOversea.innerHTML += infoOversea;
            });

            a_plg = [];
            h_plg = [];
            a_t1 = [];
            h_t1 = [];
            a_sbl = [];
            h_sbl = [];
            a_wsbl = [];
            h_wsbl = [];

            for (let i = 0; i < teams_info.length; i++) {
                teams_info[i].push((teams_info[i][2] / teams_info[i][4]).toFixed(1));
                teams_info[i].push((teams_info[i][3] / teams_info[i][4]).toFixed(1));

                if (i > 1) {
                    if (i < 2 + league_teams['plg']) {
                        // a_plg.push(teams_info[i][6])
                        // h_plg.push(teams_info[i][7])

                        a_plg.push(temp_info[i].avg("age"));
                        h_plg.push(temp_info[i].avg("height"));
                    } else if (i < 2 + league_teams['plg'] + league_teams['t1']) {
                        // a_t1.push(teams_info[i][6])
                        // h_t1.push(teams_info[i][7])

                        a_t1.push(temp_info[i].avg("age"));
                        h_t1.push(temp_info[i].avg("height"));
                    } else if (i < 2 + league_teams['plg'] + league_teams['t1'] + league_teams['sbl']) {
                        // a_sbl.push(teams_info[i][6])
                        // h_sbl.push(teams_info[i][7])

                        a_sbl.push(temp_info[i].avg("age"));
                        h_sbl.push(temp_info[i].avg("height"));
                    } else {
                        // a_wsbl.push(teams_info[i][6])
                        // h_wsbl.push(teams_info[i][7])

                        a_wsbl.push(temp_info[i].avg("age"));
                        h_wsbl.push(temp_info[i].avg("height"));
                    }
                }
            }

            a_plg = rankArray(a_plg);
            h_plg = rankArray(h_plg);
            a_t1 = rankArray(a_t1);
            h_t1 = rankArray(h_t1);
            a_sbl = rankArray(a_sbl);
            h_sbl = rankArray(h_sbl);
            a_wsbl = rankArray(a_wsbl);
            h_wsbl = rankArray(h_wsbl);
            rankA = a_plg.concat(a_t1, a_sbl, a_wsbl);
            rankH = h_plg.concat(h_t1, h_sbl, h_wsbl);

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

            teams_movement_info = [['men','oversea','','',''],['women','oversea','','','']];
            for (let i = 0; i < league_teams['plg']; i++) teams_movement_info.push(['men',plg_teams[i + 1],'','','']);
            for (let i = 0; i < league_teams['t1']; i++) teams_movement_info.push(['men',t1_teams[i + 1],'','','']);
            for (let i = 0; i < league_teams['sbl']; i++) teams_movement_info.push(['men',sbl_teams[i + 1],'','','']);
            for (let i = 0; i < league_teams['wsbl']; i++) teams_movement_info.push(['women',wsbl_teams[i + 1],'','','']);

            cur_cat = "";

            lines.forEach(player => {
                infos = player.split(',');
                info = ""

                if(infos[0] != ""){
                    if (infos[1] == 'oversea') {
                        if (infos[0] == 'men') team_index = 0
                        if (infos[0] == 'women') team_index = 1
                    } else {
                        team_index = findIndex(teams_movement_info, infos[1],1);
                    }

                    if (infos[2] == "extend" | infos[2] == "import extend") {
                        i = 2
                    } else if (infos[2] == "lost" | infos[2] == "lost loan" | infos[2] == "lost trade" | infos[2] == "import lost") {
                        i = 4
                    } else {
                        i = 3
                    }
                    if (cur_cat != infos[2]) {
                        cur_cat = infos[2];

                        if (infos[2] == "change") {
                            cat_name = "轉隊"
                        } else if (infos[2] == "merge") {
                            cat_name = "Via 合併"
                        } else if (infos[2] == "fa") {
                            cat_name = "Via 自由球員"
                        } else if (infos[2] == "trade") {
                            cat_name = "Via 交易"
                        } else if (infos[2] == "loan") {
                            cat_name = "Via 租借"
                        } else if (infos[2] == "keep") {
                            cat_name = "Via 保留名單"
                        } else if (infos[2] == "draft") {
                            cat_name = "Via 選秀"
                        } else if (infos[2] == "loan back") {
                            cat_name = "租借回歸"
                        } else if (infos[2] == "lost loan") {
                            cat_name = "Via 租借"
                        } else if (infos[2] == "lost trade") {
                            cat_name = "Via 交易"
                        } else if (infos[2] == "import extend") {
                            cat_name = "續留洋將"
                        } else if (infos[2] == "import") {
                            cat_name = "加盟洋將"
                        } else if (infos[2] == "import lost") {
                            cat_name = "離隊洋將"
                        }

                        if (infos[2] != "extend" & infos[2] != "lost") {
                            if (teams_movement_info[team_index][i] != "") {
                                teams_movement_info[team_index][i] += `<br>`
                            }
                            teams_movement_info[team_index][i] += `<a style="text-decoration:underline"><i>${cat_name}</i></a><br>`
                        }
                    }
                    teams_movement_info[team_index][i] += `${infos[3]}<br>`
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
                var team_dropdown = document.getElementById('team-dropdown');
                if (this.innerHTML == "男籃") {
                    team_dropdown.innerHTML = `
                    <li><a class="dropdown-item active" onclick="f('oversea')">
                        <img src="../asset/images/men/cba.png" alt="oversea" class="teamicon">CBA & 旅外</a></li>
                    <li><hr class="dropdown-divider"></li>`

                    add_team_dropdown('team-dropdown', 'men');

                } else if (this.innerHTML == "女籃") {
                    team_dropdown.innerHTML = `
                    <li><a class="dropdown-item active" onclick="f('oversea')">
                        <img src="../asset/images/women/wcba.png" alt="oversea" class="teamicon">WCBA & 旅外</a></li>
                    <li><hr class="dropdown-divider"></li>`

                    add_team_dropdown('team-dropdown', 'women');

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
function rankArray(array) {
    temp = [];
    for (let i = 0; i < array.length; i++) {
        count = 0;
        for (let j = 0; j < array.length; j++) {
            if (array[i] < array[j]) count += 1;
        }
        temp.push(count + 1);
    }
    return temp;
}
function updateTables() {
    tableCount = document.getElementById('r_count_tbody');

    tableCount.innerHTML = `
        <tr class="filterTr men oversea CBA-bg">
            <td>
                CBA:&nbsp;&nbsp;5&nbsp;&nbsp;人&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                日本:&nbsp;&nbsp;2&nbsp;&nbsp;人
            </td>
        </tr>
        <tr class="filterTr men oversea CBA-bg">
            <td>
                本土平均年齡:&nbsp;${teams_info[0][6]}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                本土平均身高:&nbsp;${teams_info[0][7]}
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
                本土平均年齡:&nbsp;${teams_info[1][6]}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                本土平均身高:&nbsp;${teams_info[1][7]}
            </td>
        </tr>`


    for (let i = 2; i < teams_info.length; i++) {
        if (coach_EN_name[teams_info[i][1]] != "" & window.innerWidth <= 600) {
            blank = `<br>`
        } else if (window.innerWidth <= 495) {
            blank = '<br>'
        } else {
            blank = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`
        }
        tableCount.innerHTML += `
        <tr class="filterTr ${teams_info[i][0]} ${teams_info[i][1]} ${teams_info[i][1]}-bg">
            <td>
                ${team_coach_info[i]}${coach_EN_name[teams_info[i][1]]}${blank}
                本土球員:&nbsp;&nbsp;${teams_info[i][4]}&nbsp;&nbsp;人&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                外籍球員:&nbsp;&nbsp;${teams_info[i][5]}&nbsp;&nbsp;人
            </td>
        </tr>`
        if (i < 2 + league_teams['plg']) {
            league = 'PLG'
        } else if (i < 2 + league_teams['plg'] + league_teams['t1']) {
            league = 'T1'
        } else if (i < 2 + league_teams['plg'] + league_teams['t1'] + league_teams['sbl']) {
            league = 'SBL'
        } else {
            league = 'WSBL'
        }
        age_league_rank = `(${league}第${rankA[i - 2]})`
        height_league_rank = `(${league}第${rankH[i - 2]})`

        if (window.innerWidth > 510) {
            blank = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`
        } else {
            blank = `<br>`
        }
        tableCount.innerHTML += `
        <tr class="filterTr ${teams_info[i][0]} ${teams_info[i][1]} ${teams_info[i][1]}-bg">
            <td>
                本土平均年齡:&nbsp;${teams_info[i][6]}&nbsp;${age_league_rank}${blank}
                本土平均身高:&nbsp;${teams_info[i][7]}&nbsp;${height_league_rank}
            </td>
        </tr>`
    }
    document.getElementById("team-dropdown").getElementsByClassName('active')[0].click();
}
function updateMovements() {
    table_movements.innerHTML = ""

    if (window.innerWidth <= 576) {
        table_movements_th.innerHTML = `<th>2024-25 球員異動</th>`

        for (let i = 0; i < teams_movement_info.length; i++) {
            if (teams_movement_info[i][2] == "") teams_movement_info[i][2] = "無 / 未知"
            if (teams_movement_info[i][3] == "") teams_movement_info[i][3] = "無"
            if (teams_movement_info[i][4] == "") teams_movement_info[i][4] = "無"

            table_movements.innerHTML += `
            <tr class="filterTr ${teams_movement_info[i][0]} ${teams_movement_info[i][1]}">
                <td class="textL">
                    <a style="text-decoration:underline; font-size:20px;"><b>Extension</b></a><br>${teams_movement_info[i][2]}
                </td>
            </tr>
            <tr class="filterTr ${teams_movement_info[i][0]} ${teams_movement_info[i][1]}">
                <td class="textL">
                    <a style="text-decoration:underline; font-size:20px;"><b>Signed</b></a><br>${teams_movement_info[i][3]}
                </td>
            </tr>
            <tr class="filterTr ${teams_movement_info[i][0]} ${teams_movement_info[i][1]}">
                <td class="textL">
                    <a style="text-decoration:underline; font-size:20px;"><b>Lost</b></a><br>${teams_movement_info[i][4]}
                </td>
            </tr>`
        }
    } else {
        table_movements_th.innerHTML = `
        <th style="font-size:18px"><b>Extension</b></th>
        <th style="font-size:18px"><b>Signed</b></th>
        <th style="font-size:18px"><b>Lost</b></th>`

        for (let i = 0; i < teams_movement_info.length; i++) {
            if (teams_movement_info[i][2] == "") teams_movement_info[i][2] = "<br>無 / 未知<br><br>"
            if (teams_movement_info[i][3] == "") teams_movement_info[i][3] = "<br>無<br><br>"
            if (teams_movement_info[i][4] == "") teams_movement_info[i][4] = "<br>無<br><br>"

            table_movements.innerHTML += `
            <tr class="filterTr ${teams_movement_info[i][0]} ${teams_movement_info[i][1]}">
                <td class="borderR textL">${teams_movement_info[i][2]}</td>
                <td class="borderR textL">${teams_movement_info[i][3]}</td>
                <td class="textL">${teams_movement_info[i][4]}</td>
            </tr>`
        }
    }
    document.getElementById("team-dropdown").getElementsByClassName('active')[0].click();
}
