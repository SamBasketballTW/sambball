
class PlayerCount {
    static id = 0;
    constructor(name, men_count = 0, women_count = 0) {
        this.id = 'college' + PlayerCount.id++;
        this.name = name;
        this.men_count = men_count;
        this.women_count = women_count;
    }
}
function findSchool(school) {
    for (let i = 0; i < allColleges.length; i++) {
        if (allColleges[i].name == school) {
            return allColleges[i]
        }
    }
    return -1;
}

allColleges = [new PlayerCount('旅外')];
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

            oversea_team_order = 0;
            current_team = '';

            lines.forEach(line => {
                infos = line.split(',');

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

                if (status == 'active' & identity != 'coach') {
                    filter = '';

                    if (isOversea(team)) {
						team_name = `<a style="font-size:12px">${teamName('short',league,team,'img')}`
					}else{
						team_name = `${teamName('short',league,team,'img')}`
					}
					
                    if (isOversea(team) & team != 'fa') {
                        if (current_team != team) {
                            oversea_team_order += 1;
                            current_team = team;
                        }
                        team_order = oversea_team_order;
                    } else if (team != 'fa') {
                        team_order = oversea_team_order + 1 + findTeam(team).teamIndex();
                    } else {
                        team_order = oversea_team_order + allTeams.length + 1;
                    }

                    if (last_team != '' & team != 'fa') {
                        filter += ' change';
                    }

                    if (!school.includes('HBL') & school != '-') {
                        if (school.includes(' ')) {
                            college = allColleges[0];
                            filter += ' ' + findSchool('旅外').id;
                        } else {
                            if (findSchool(school) == -1) {
                                allColleges.push(new PlayerCount(school));
                            }
                            college = findSchool(school);
                            filter += ' ' + findSchool(school).id;
                        }

                        if (gender == 'men') {
                            college.men_count += 1;
                        } else if (gender == 'women') {
                            college.women_count += 1;
                        }
                    }

                    former_team = ''
                    if (last_team != '') {
                        if (isOversea(last_team)) {
                            former_team = last_team;
                        } else {
                            former_team = teamName('short', '', last_team);
                        }
                    }

                    table.innerHTML += `
                    <tr class="filterTr ${gender} ${teamFilter(team)} ${identity} ${rookie} ${filter}">
                        <td class="borderR ${teamBG(league, team)}" data-order=${team_order}>${team_name}</td>
                        <td class="borderR" data-order=${numOrder(jersey_num)}>${jersey_num}</td>
                        <td class="borderR"><a style="text-decoration:underline;color:inherit" href="${playerUrl(team, player_url)}" target="_blank">${name}</a></td>
                        <td>${league_identity}</td>
                        <td>${pos}</td>
                        <td>${height}</td>
                        <td>${weight}</td>
                        <td>${birthToAge(birth)}</td>
                        <td class="borderR">${birth}</td>
                        <td class="borderR textL">${school}</td>
                        <td>${former_team}</td>                
                    </tr>`
                }
            });
            allColleges.sort((a, b) => a.name.localeCompare(b.name));

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

                    for (let j = 2024; j >= 2020; j--) {
                        player_dropdown.innerHTML += `<li><a class="dropdown-item" onclick="f('${j}Rookie')">${j}'新秀</a></li>`
                    }

                    school_dropdown.innerHTML = `
                    <li><a class="dropdown-item active" onclick="f('all')">全部學校</a></li>
					<li><a class="dropdown-item" onclick="f('${findSchool('旅外').id}')">旅外: ${findSchool('旅外').men_count} 人</a></li>`

                    allColleges.sort((a, b) => b.men_count - a.men_count);
                    for (let i = 0; i < allColleges.length; i++) {
                        if (allColleges[i].name != '旅外' & allColleges[i].men_count != 0) {
                            school_dropdown.innerHTML += `
                            <li><a class="dropdown-item" 
                            onclick="f('${allColleges[i].id}')">${allColleges[i].name}: ${allColleges[i].men_count} 人</a></li>`
                        }
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
					<li><a class="dropdown-item" onclick="f('college0')">旅外: ${findSchool('旅外').women_count} 人</a></li>`

                    allColleges.sort((a, b) => b.women_count - a.women_count);
                    for (let i = 0; i < allColleges.length; i++) {
                        if (allColleges[i].name != '旅外' & allColleges[i].women_count != 0) {
                            school_dropdown.innerHTML += `
                            <li><a class="dropdown-item" 
                            onclick="f('${allColleges[i].id}')">${allColleges[i].name}: ${allColleges[i].women_count} 人</a></li>`
                        }
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