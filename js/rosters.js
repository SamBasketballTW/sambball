class Rosters {
    constructor(gender, league, id, coach = "", coach_EN = "",
        local_age_sum = 0, local_height_sum = 0, local_count = 0, import_count = 0, age_rank = 0, height_rank = 0) {
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
    constructor(gender, id, extension = [], signed = [], lost = []) {
        this.gender = gender;
        this.id = id;
        this.extension = extension;
        this.signed = signed;
        this.lost = lost;
    }
}
class MovementContent {
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
    moves_info = [];
    moves_info.push(new Movements('men', 'oversea'));
    moves_info.push(new Movements('women', 'oversea'));

    for (let i = 0; i < allTeams.length; i++) {
        rosters_info.push(new Rosters(allTeams[i].gender, allTeams[i].league, allTeams[i].id));
        moves_info.push(new Movements(allTeams[i].gender, allTeams[i].id))
    }

    fetch('../data/rosters.csv')
        .then((response) => response.text())
        .then((result) => {

            lines = result.split('\n');
            lines = lines.slice(2);

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
                    if (isOversea(infos[4])) {
                        if (infos[0] == "men") team_index = 0;
                        if (infos[0] == "women") team_index = 1;
                    } else {
                        team_index = 2 + findTeam(infos[4]).teamIndex();
                    }

                    if (infos[7] == "headCoach" | infos[7] == "coach") {

                        rosters_info[team_index].coach = `${infos[9]}: ${infos[1]}`
                        rosters_info[team_index].coach_EN = findTeam(rosters_info[team_index].id).coach_EN;

                    } else {
                        if (isOversea(infos[4])) {
                            is_local = 1;
                            is_import = infos[7] != "local";
                        } else {
                            is_local = identity(infos[9]) == "local";
                            is_import = identity(infos[9]) == "import";
                        }

                        if (is_local) {
                            rosters_info[team_index].local_age_sum += birthToAge(infos[13]);
                            rosters_info[team_index].local_height_sum += parseInt(infos[11]);
                            rosters_info[team_index].local_count += 1;

                        } else if (is_import) {
                            rosters_info[team_index].import_count += 1;

                        }

                        if (is_local | is_import | infos[9] == "註銷" | infos[9] == "未註冊") {
                            if (isOversea(infos[4])) {
                                oversea_team = `<td class="borderR">${infos[3]} ${infos[4]}</td>`;
                            } else {
                                oversea_team = ""
                            }

                            if (infos[9] == "註銷" | infos[9] == "未註冊") {
                                infos[9] = `<a style="color:white">${infos[9]}</a>`
                            }

                            tempInfo = `
                                <tr class="filterTr ${infos[0]} ${teamFilter(infos[4])} ${teamBG(infos[3], infos[4])}" style="font-size:15px">
                                    ${oversea_team}
                                    <td class="borderR" data-order="${numOrder(infos[2])}">${infos[2]}</td>
                                    <td><a style="text-decoration:underline;color:inherit" href="${playerUrl(infos[4], infos[5])}" target="_blank">${infos[1]}</a></td>             
                                    <td>${infos[9]}</td>
                                    <td>${infos[10]}</td>
                                    <td>${infos[11]}</td>
                                    <td>${infos[12]}</td>
                                    <td>${birthToAge(infos[13])}</td>
                                    <td class="borderR">${infos[13]}</td>
                                    <td class="borderR textL" style="font-size:14px">${infos[14]}</td>
                                    <td class="textL" style="font-size:14px">${infos[15]}</td>
                                </tr>
                            `
                            if (isOversea(infos[4])) {
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

            for (let i = 2; i < rosters_info.length; i++) {
                rank_age = 0;
                rank_height = 0;
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
                rosters_info[i].age_rank = rank_age + 1;
                rosters_info[i].height_rank = rank_height + 1;
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
                info = ""

                if (infos[0] != "") {
                    if (infos[1] == 'oversea') {
                        if (infos[0] == 'men') team_index = 0
                        if (infos[0] == 'women') team_index = 1
                    } else {
                        team_index = 2 + findTeam(infos[1]).teamIndex();
                    }


                    if (infos[2] == 'extend' | infos[2] == 'import extend') {
                        move = moves_info[team_index].extension;
                    } else if (infos[2] == 'lost' | infos[2] == "lost loan" | infos[2] == "lost trade" | infos[2] == "import lost" | infos[2] == 'loan end') {
                        move = moves_info[team_index].lost;
                    } else {
                        move = moves_info[team_index].signed;
                    }

                    new_move = 0;
                    for (let i = 0; i < move.length; i++) {
                        if (move[i].move == infos[2]) {
                            move[i].content += `${infos[3]}<br>`;
                            new_move = 1;
                        }
                    }
                    if (new_move == 0) {
                        temp = '';
                        content = '';

                        if (infos[2] == "change") {
                            temp = "轉隊"
                        } else if (infos[2] == "merge") {
                            temp = "Via 合併"
                        } else if (infos[2] == "fa") {
                            temp = "Via 自由球員"
                        } else if (infos[2] == "trade") {
                            temp = "Via 交易"
                        } else if (infos[2] == "keep") {
                            temp = "Via 保留名單"
                        } else if (infos[2] == "draft") {
                            temp = "Via 選秀"
                        } else if (infos[2] == "loan") {
                            temp = "Via 租借"
                        } else if (infos[2] == "loan back") {
                            temp = "租借回歸"
                        } else if (infos[2] == "lost loan") {
                            temp = "Via 租借"
                        } else if (infos[2] == 'loan end') {
                            temp = '租借結束'
                        } else if (infos[2] == "lost trade") {
                            temp = "Via 交易"
                        } else if (infos[2] == "import extend") {
                            temp = "續留洋將"
                        } else if (infos[2] == "import") {
                            temp = "加盟洋將"
                        } else if (infos[2] == "import lost") {
                            temp = "離隊洋將"
                        }
                        if (temp != '') {
                            content += `<a style="text-decoration:underline"><i>${temp}</i></a><br>`;
                        }
                        content += `${infos[3]}<br>`

                        move.push(new MovementContent(infos[2], content));
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

        for (let i = 0; i < moves_info.length; i++) {
            extension = '';
            signed = '';
            lost = '';
            if (moves_info[i].extension.length > 0) {
                for (let j = 0; j < moves_info[i].extension.length; j++) {
                    extension += moves_info[i].extension[j].content;
                }
            } else {
                extension = '無 / 未知'
            }
            if (moves_info[i].signed.length > 0) {
                for (let j = 0; j < moves_info[i].signed.length; j++) {
                    signed += moves_info[i].signed[j].content;
                }
            } else {
                signed = '無 / 未知'
            }
            if (moves_info[i].lost.length > 0) {
                for (let j = 0; j < moves_info[i].lost.length; j++) {
                    lost += moves_info[i].lost[j].content;
                }
            } else {
                lost = '無 / 未知'
            }
            table_movements.innerHTML += `
            <tr class="filterTr ${moves_info[i].gender} ${moves_info[i].id}">
                <td class="textL">
                    <a style="text-decoration:underline; font-size:20px;"><b>Extension</b></a><br>${extension}
                </td>
            </tr>
            <tr class="filterTr ${moves_info[i].gender} ${moves_info[i].id}">
                <td class="textL">
                    <a style="text-decoration:underline; font-size:20px;"><b>Signed</b></a><br>${signed}
                </td>
            </tr>
            <tr class="filterTr ${moves_info[i].gender} ${moves_info[i].id}">
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

        for (let i = 0; i < moves_info.length; i++) {
            extension = '';
            signed = '';
            lost = '';
            if (moves_info[i].extension.length > 0) {
                for (let j = 0; j < moves_info[i].extension.length; j++) {
                    extension += moves_info[i].extension[j].content;
                }
            } else {
                extension = '<br>無 / 未知<br><br>'
            }
            if (moves_info[i].signed.length > 0) {
                for (let j = 0; j < moves_info[i].signed.length; j++) {
                    signed += moves_info[i].signed[j].content;
                }
            } else {
                signed = '<br>無 / 未知<br><br>'
            }
            if (moves_info[i].lost.length > 0) {
                for (let j = 0; j < moves_info[i].lost.length; j++) {
                    lost += moves_info[i].lost[j].content;
                }
            } else {
                lost = '<br>無 / 未知<br><br>'
            }

            table_movements.innerHTML += `
            <tr class="filterTr ${moves_info[i].gender} ${moves_info[i].id}">
                <td class="borderR textL">${extension}</td>
                <td class="borderR textL">${signed}</td>
                <td class="textL">${lost}</td>
            </tr>`
        }
    }
    document.getElementById("team-dropdown").getElementsByClassName('active')[0].click();
}
