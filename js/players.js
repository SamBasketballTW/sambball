
allSchools = [];
class School {
    constructor(id, name, men_count = 0, women_count = 0) {
        this.id = id;
        this.name = name;
        this.men_count = men_count;
        this.women_count = women_count;
    }

}
function findSchool(school) {
    for (let i = 0; i < allSchools.length; i++) {
        if (allSchools[i].name == school) {
            return allSchools[i]
        }
    }
    return -1;
}
allSchools = [new School('school0', '旅外')];
men_uni = [];
women_uni = [];
school_id = 1;
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

            oversea_order = 0;
            current_team = '';

            lines.forEach(player => {
                infos = player.split(',');
                info = ""

                if (infos[6] == "active" & infos[7] != "headCoach" & infos[7] != "coach") {
                    if (isOversea(infos[4]) & infos[4] != 'fa') {
                        if (current_team != infos[4]) {
                            oversea_order += 1;
                            current_team = infos[4];
                        }
                        team_order = oversea_order;
                    } else if (infos[4] != 'fa') {
                        team_order = oversea_order + findTeam(infos[4]).teamIndex() + 1;
                    } else {
                        team_order = oversea_order + allTeams.length + 1;
                    }

                    filter = '';
                    if (infos[16] != "" & infos[4] != "fa") filter += "change"

                    if (infos[4] == "fa") {
                        infos[16] = `${infos[3]} ${teamName("short", infos[3], infos[16])}`
                    }

                    if (infos[1] == "安尼奎") {
                        infos[9] = `洋將`;
                    } else if (infos[1] == "海登") {
                        infos[9] = `亞外`;
                    }

                    if (!infos[14].includes('HBL') & infos[14] != '-') {
                        if (infos[14].includes(' ')) {
                            school = findSchool('旅外');
                            school_filter = 'school0';
                        } else {
                            if (findSchool(infos[14]) == -1) {
                                allSchools.push(new School('school' + school_id, infos[14]));
                                school_id += 1;
                            }
                            school = findSchool(infos[14]);
                            school_filter = school.id;
                        }
                        if (infos[0] == 'men') {
                            school.men_count += 1;
                            if (!infos[14].includes(' ') & findIndex(men_uni, infos[14]) == -1) {
                                men_uni.push(infos[14]);
                            }
                        } else if (infos[0] == 'women') {
                            school.women_count += 1;
                            if (!infos[14].includes(' ') & findIndex(women_uni, infos[14]) == -1) {
                                women_uni.push(infos[14]);
                            }
                        }
                    } else {
                        school_filter = '';
                    }

                    info += `
                    <tr class="filterTr ${infos[0]} ${teamFilter(infos[4])} ${infos[7]} ${infos[8]} ${school_filter} ${filter}">
                        <td class="borderR ${teamBG(infos[3], infos[4])}" data-order=${team_order}>${teamName("short", infos[3], infos[4], 'img')}</td>
                        <td class="borderR" data-order=${numOrder(infos[2])}>${infos[2]}</td>
                        <td><a style="text-decoration:underline;color:inherit" href="${playerUrl(infos[4], infos[5])}" target="_blank">${infos[1]}</a></td>
                        <td>${infos[9]}</td>
                        <td>${infos[10]}</td>
                        <td>${infos[11]}</td>
                        <td>${infos[12]}</td>
                        <td>${birthToAge(infos[13])}</td>
                        <td class="borderR">${infos[13]}</td>
                        <td class="borderR textL">${infos[14]}</td>
                        <td>${infos[16]}</td>                
                    </tr>`
                }


                table.innerHTML += info;
            });
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

                    add_team_dropdown('team-dropdown', 'men', 'all', 'cba');

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
					<li><a class="dropdown-item" onclick="f('school0')">旅外: ${allSchools[0].men_count} 人</a></li>`

                    for (let i = 0; i < men_uni.length; i++) {
                        school = findSchool(men_uni[i])
                        school_dropdown.innerHTML += `
                        <li><a class="dropdown-item" onclick="f('${school.id}')">${school.name}: ${school.men_count} 人</a></li>`
                    }

                } else if (this.innerHTML == "女籃") {

                    add_team_dropdown('team-dropdown', 'women', 'all', 'wcba');

                    player_dropdown.innerHTML = `
                    <li><a class="dropdown-item active" onclick="f('all')">全部球員</a></li>
					<li><a class="dropdown-item" onclick="f('change')">換隊球員</a></li>
					<li><hr class="dropdown-divider"></li>`

                    for (let j = 2023; j >= 2019; j--) {
                        player_dropdown.innerHTML += `<li><a class="dropdown-item" onclick="f('${j}Rookie')">${j}'新秀</a></li>`
                    }

                    school_dropdown.innerHTML = `
                    <li><a class="dropdown-item active" onclick="f('all')">全部學校</a></li>
					<li><a class="dropdown-item" onclick="f('school0')">旅外: ${allSchools[0].women_count} 人</a></li>`

                    for (let i = 0; i < women_uni.length; i++) {
                        school = findSchool(women_uni[i])
                        school_dropdown.innerHTML += `
                        <li><a class="dropdown-item" onclick="f('${school.id}')">${school.name}: ${school.women_count} 人</a></li>`
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

                        if (this.innerHTML == "自由球員") {
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