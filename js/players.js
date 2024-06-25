class Players {
    static player_id = 0;

    constructor(gender, name, league, team, team_order, jersey_num, player_url,
        identity, rookie, league_identity, pos, height, weight, birth, age, school, last_team, filter = '') {

        this.player_id = Players.player_id++;
        this.gender = gender;
        this.name = name;
        this.league = league;
        this.team = team;
        this.team_order = team_order;
        this.jersey_num = jersey_num;
        this.player_url = player_url;
        this.identity = identity;
        this.rookie = rookie;
        this.league_identity = league_identity;
        this.pos = pos;
        this.height = height;
        this.weight = weight;
        this.birth = birth;
        this.age = age;
        this.school = school;
        this.last_team = last_team;
        this.filter = filter;
    }
}
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
allPlayers = [];
allColleges = [new PlayerCount('旅外')];
$(document).ready(function () {
    fetch('../data/rosters.csv')
        .then((response) => response.text())
        .then((result) => {

            lines = result.split('\n');
            lines = lines.slice(2);

            table = document.getElementById('players_tbody');

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
                    acquired,
                    last_team,
                    contract_filter, contract_season, contract_years, contract_years_left,
                    contract_note,
                    contract_link_title, contract_url,
                    fa_status, fa_total_sec, fa_ppg, fa_rpg, fa_apg

                ] = infos;

                if (status == 'active' & identity != 'coach') {
                    player = new Players();
                    allPlayers.push(player);

                    player.gender = gender;
                    player.name = name;
                    player.league = league;
                    player.team = team;
                    player.jersey_num = jersey_num;
                    player.player_url = playerUrl(team,player_url);
                    player.identity = identity;
                    player.rookie = rookie;
                    player.league_identity = league_identity;
                    player.pos = pos;
                    player.height = height;
                    player.weight = weight;
                    player.birth = birth;
                    player.age = birthToAge(birth);
                    player.school = school;
                    player.last_team = teamName('short','',last_team);

                    if (isOversea(team) & team != 'fa') {
                        if (current_team != team) {
                            oversea_team_order += 1;
                            current_team = team;
                        }
                        player.team_order = oversea_team_order;
                    } else if (team != 'fa') {
                        player.team_order = oversea_team_order + 1 + findTeam(team).teamIndex();
                    } else {
                        player.team_order = oversea_team_order + allTeams.length + 1;
                    }

                    if (last_team != '' & team != 'fa') {
                        player.filter += ' change';
                    }

                    if (!school.includes('HBL') & school != '-') {
                        if (school.includes(' ')) {
                            college = allColleges[0];
                            player.filter += ` ${findSchool('旅外').id}`;
                        } else {
                            if (findSchool(school) == -1) {
                                allColleges.push(new PlayerCount(school));
                            }
                            college = findSchool(school);
                            player.filter += ` ${findSchool(school).id}`;
                        }

                        if (gender == 'men') {
                            college.men_count += 1;
                        } else if (gender == 'women') {
                            college.women_count += 1;
                        }
                    }
                }
            });
            allColleges.sort((a, b) => a.name.localeCompare(b.name));

            allPlayers.forEach(p => {
				if (isOversea(p.team)) {
					team_name = `<a style="font-size:12px">${teamName('short', p.league, p.team, 'img')}`
				} else {
					team_name = `${teamName('short', p.league, p.team, 'img')}`
				}

				table.innerHTML += `
                    <tr class="filterTr ${p.gender} ${teamFilter(p.team)} ${p.identity} ${p.rookie} ${p.filter}">
                        <td class="borderR ${teamBG(p.league, p.team)}" data-order=${p.team_order}>${team_name}</td>
                        <td class="borderR" data-order=${numOrder(p.jersey_num)}>${p.jersey_num}</td>
                        <td class="borderR"><a style="text-decoration:underline;color:inherit" href="${p.player_url}" target="_blank">${p.name}</a></td>
                        <td data-order=${order[p.league_identity]}>${p.league_identity}</td>
                        <td>${p.pos}</td>
                        <td>${p.height}</td>
                        <td>${p.weight}</td>
                        <td>${p.age}</td>
                        <td class="borderR">${p.birth}</td>
                        <td class="borderR textL">${p.school}</td>
                        <td>${p.last_team}</td>                
                    </tr>`
			});

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