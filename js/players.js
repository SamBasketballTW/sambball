$(document).ready(function () {
    fetch('../data/rosters.csv')
        .then((response) => response.text())
        .then((result) => {

            lines = result.split('\n');
            lines = lines.slice(2);

            table = document.getElementById('players_tbody');

            men_uni = [];
            women_uni = [];
            us_uni = [0, 0];

            lines.forEach(player => {
                infos = player.split(',');
                info = ""

                if (infos[6] == "active" & infos[7] != "headCoach" & infos[7] != "coach") {
                    filter = '';
                    if (infos[16] != "" & infos[4] != "fa") filter += "change"

                    if (infos[4] == "fa") {
                        infos[16] = `${infos[3]} ${team_name("short", infos[3], infos[16])}`
                    }
                    if (infos[5] == '') infos[5] = team_link[infos[4]];

                    if (infos[1] == "安尼奎") {
                        infos[9] = `洋將`;
                    } else if (infos[1] == "海登") {
                        infos[9] = `亞外`;
                    } else if (infos[1] == "王振原") {
                        infos[9] = `本土`;
                    }

                    info += `
                    <tr class="filterTr ${infos[0]} ${filter_team(infos[3], infos[4])} ${infos[7]} ${infos[8]} ${school(infos[14])} ${filter}">
                        <td class="borderR ${bg_team(infos[3], infos[4])}" data-order=${team_order(infos[3], infos[4])}>
                            ${team_name("short", infos[3], infos[4], infos[0])}
                        </td>
                        <td class="borderR" data-order=${num_order(infos[2])}>${infos[2]}</td>
                        <td><a style="text-decoration:underline;color:inherit" href="${infos[5]}" target="_blank">${infos[1]}</a></td>
                        <td data-order=${order[infos[9]]}>${infos[9]}</td>
                        <td>${infos[10]}</td>
                        <td>${infos[11]}</td>
                        <td>${infos[12]}</td>
                        <td>${age(infos[13])}</td>
                        <td class="borderR">${infos[13]}</td>
                        <td class="borderR textL">${infos[14]}</td>
                        <td>${infos[16]}</td>                
                    </tr>`


                    if (school(infos[14]) != "") {
                        if (infos[0] == 'men') {
                            if (school(infos[14]) == 'college-us') {
                                us_uni[0] += 1;
                            } else {
                                temp_index = findIndex(men_uni, infos[14], 0);
                                if (temp_index == -1) {
                                    men_uni.push([infos[14], 1]);
                                } else if (temp_index > -1) {
                                    men_uni[temp_index][1] += 1;
                                }
                            }
                        } else if (infos[0] == 'women') {
                            if (school(infos[14]) == 'college-us') {
                                us_uni[1] += 1;
                            } else {
                                temp_index = findIndex(women_uni, infos[14], 0);
                                if (temp_index == -1) {
                                    women_uni.push([infos[14], 1]);
                                } else if (temp_index > -1) {
                                    women_uni[temp_index][1] += 1;
                                }
                            }
                        }
                    }
                }


                table.innerHTML += info;
            });

            console.log(men_uni);
            men_uni.sort();
            women_uni.sort();

            var dataTable = $('#players_tb').DataTable({
                dom: 't',
                paging: false,
                scrollCollapse: true,
                info: false,
                ordering: true,
                order: [0, 'asc'],
            });

            document.getElementById("gender-dropdown").getElementsByClassName('dropdown-item')[0].click();
        });

    var genders = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item");
    var genderbtn = document.getElementById("genderbtn");

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
                var player_dropdown = document.getElementById('player-dropdown');
                var school_dropdown = document.getElementById('school-dropdown');
                if (this.innerHTML == "男籃") {
                    team_dropdown.innerHTML = `
                    <li><a class="dropdown-item active" onclick="f('all')">
							<img src="../asset/images/logo_round.png" alt="all" class="teamicon">全部球隊</a></li>
                    <li><a class="dropdown-item" onclick="f('oversea')">
                        <img src="../asset/images/men/cba.png" alt="oversea" class="teamicon">CBA & 旅外</a></li>
                    <li><hr class="dropdown-divider"></li>`

                    add_team_dropdown('team-dropdown', 'men');

                    team_dropdown.innerHTML += `
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" onclick="f('fa')">自由球員</li>`

                    player_dropdown.innerHTML = `
                    <li><a class="dropdown-item active" onclick="f('all')">全部球員</a></li>
					<li><a class="dropdown-item" onclick="f('change')">換隊球員</a></li>
					<li><hr class="dropdown-divider"></li>`

                    for (let j = 2023; j >= 2020; j--) {
                        player_dropdown.innerHTML += `<li><a class="dropdown-item" onclick="f('${j}Rookie')">${j}'新秀</a></li>`
                    }

                    school_dropdown.innerHTML = `
                    <li><a class="dropdown-item active" onclick="f('all')">全部學校</a></li>
					<li><a class="dropdown-item" onclick="f('college-us')">旅外: ${us_uni[0]} 人</a></li>`

                    for (let i = 0; i < men_uni.length; i++) {
                        school_dropdown.innerHTML += `
                        <li><a class="dropdown-item" onclick="f('${school(men_uni[i][0])}')">${men_uni[i][0]}: ${men_uni[i][1]} 人</a></li>`
                    }

                } else if (this.innerHTML == "女籃") {
                    team_dropdown.innerHTML = `
                    <li><a class="dropdown-item active" onclick="f('all')">
							<img src="../asset/images/logo_round.png" alt="all" class="teamicon">全部球隊</a></li>
                    <li><a class="dropdown-item" onclick="f('oversea')">
                        <img src="../asset/images/women/wcba.png" alt="oversea" class="teamicon">WCBA & 旅外</a></li>
                    <li><hr class="dropdown-divider"></li>`

                    add_team_dropdown('team-dropdown', 'women');

                    player_dropdown.innerHTML = `
                    <li><a class="dropdown-item active" onclick="f('all')">全部球員</a></li>
					<li><a class="dropdown-item" onclick="f('change')">換隊球員</a></li>
					<li><hr class="dropdown-divider"></li>`

                    for (let j = 2023; j >= 2019; j--) {
                        player_dropdown.innerHTML += `<li><a class="dropdown-item" onclick="f('${j}Rookie')">${j + 1}'新秀</a></li>`
                    }

                    school_dropdown.innerHTML = `
                    <li><a class="dropdown-item active" onclick="f('all')">全部學校</a></li>
					<li><a class="dropdown-item" onclick="f('college-us')">旅外: ${us_uni[1]} 人</a></li>`

                    for (let i = 0; i < women_uni.length; i++) {
                        school_dropdown.innerHTML += `
                        <li><a class="dropdown-item" onclick="f('${school(women_uni[i][0])}')">${women_uni[i][0]}: ${women_uni[i][1]} 人</a></li>`
                    }

                }
                var teams = document.getElementById("team-dropdown").getElementsByClassName("dropdown-item");
                var players = document.getElementById("player-dropdown").getElementsByClassName("dropdown-item");
                var schools = document.getElementById("school-dropdown").getElementsByClassName("dropdown-item");
                var teambtn = document.getElementById("teambtn");
                var playerbtn = document.getElementById("playerbtn");
                var schoolbtn = document.getElementById("schoolbtn");
                for (let i = 0; i < teams.length; i++) {
                    teams[i].addEventListener("click", function () {
                        var currentTeam = document.getElementById("team-dropdown").getElementsByClassName("active");
                        currentTeam[0].className = currentTeam[0].className.replace(" active", "");
                        this.className += " active";
                        teambtn.innerHTML = this.innerHTML;

                        if(this.innerHTML == "自由球員"){
                            players[0].click();
                            schools[0].click();
                        }
                        f('filter');
                    });
                }
                for (let i = 0; i < players.length; i++) {
                    players[i].addEventListener("click", function () {
                        var currentPlayer = document.getElementById("player-dropdown").getElementsByClassName("active");
                        currentPlayer[0].className = currentPlayer[0].className.replace(" active", "");
                        this.className += " active";
                        playerbtn.innerHTML = this.innerHTML;

                        f('filter');
                    });
                }
                for (let i = 0; i < schools.length; i++) {
                    schools[i].addEventListener("click", function () {
                        var currentSchool = document.getElementById("school-dropdown").getElementsByClassName("active");
                        currentSchool[0].className = currentSchool[0].className.replace(" active", "");
                        this.className += " active";
                        schoolbtn.innerHTML = this.innerHTML;

                        f('filter');
                    });
                }
                teams[0].click();
                players[0].click();
                schools[0].click();
            }
        });
    }
});
function toggleCheckboxes() {
    var checkboxes = document.querySelectorAll('.form-check-input[type="checkbox"]');
    var checkSwitch = document.getElementById('checkSwitch');

    checkboxes.forEach(function (checkbox) {
        checkbox.checked = checkSwitch.checked;
        f('filter');
    });
}
function school(s) {
    if (s.includes("HBL") | s == "-") {
        return ""
    } else if (college[s] == undefined) {
        return "college-us"
    } else {
        return college[s]
    }
}
college = {
    "中州科大": "ccut",
    "中信學院": "ctbcbs",
    "中原大學": "cycu",
    "文化大學": "pccu",
    "世新大學": "shu",
    "北市大學": "utaipei",
    "佛光大學": "fgu",
    "宏國德霖": "hdut",
    "亞洲大學": "asiau",
    "明道大學": "mdu",
    "東南科大": "tungnanu",
    "虎尾科大": "nfu",
    "政治大學": "nccu",
    "首府大學": "shoufuu",
    "高雄師大": "nknu",
    "健行科大": "uch",
    "國立體大": "ntsu",
    "康寧大學": "ukn",
    "陽明交通": "nycu",
    "萬能科大": "vnu",
    "義守大學": "isu",
    "僑光科大": "ocu",
    "實踐大學": "usc",
    "彰化師大": "ncue",
    "臺北科大": "ntut",
    "臺灣科大": "ntust",
    "臺灣師大": "ntnu",
    "臺灣藝大": "ntua",
    "臺灣體大": "ntusport",
    "輔仁大學": "fjcu",
    "醒吾科大": "hwu"
}