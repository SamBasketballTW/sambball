class PlayerCount {
    constructor(id, filter, men_count = 0, women_count = 0) {
        this.id = id;
        this.filter = filter;
        this.men_count = men_count;
        this.women_count = women_count;
    }
}

$(document).ready(function () {

    allColleges = [new PlayerCount('旅外', 'school0')];
    allRookies = [];
    for (let i = 2024; i >= 2019; i--) allRookies.push(new PlayerCount(i + 'Rookie', i + 'Rookie'));

    fetch('../data/rosters.csv')
        .then((response) => response.text())
        .then((result) => {

            lines = result.split('\n');
            lines = lines.slice(1);

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

                if (status == 'active' & identity != 'coach' & team != 'fa') {
                    if (rookie != '') {
                        currentRookie = findCount(allRookies, rookie);
                        if (gender == 'men') {
                            currentRookie.men_count += 1;
                        } else if (gender == 'women') {
                            currentRookie.women_count += 1;
                        }
                    }

                    if (!school.includes('HBL') & school != '-') {
                        if (school.includes(' ')) {
                            currentCollege = findCount(allColleges, '旅外');
                        } else {
                            if (findCount(allColleges, school) == -1) allColleges.push(new PlayerCount(school, 'school' + allColleges.length));
                            currentCollege = findCount(allColleges, school);
                        }

                        if (gender == 'men') {
                            currentCollege.men_count += 1;
                        } else if (gender == 'women') {
                            currentCollege.women_count += 1;
                        }
                    }
                }
            })
            genders[0].click();
        })

    var genders = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item");
    var genderbtn = document.getElementById("genderbtn");
    var checkSwitch = document.getElementById("checkSwitch");
    var checkboxes = document.querySelectorAll('.form-check-input[type="checkbox"]');

    for (var i = 0; i < genders.length; i++) {
        genders[i].addEventListener("click", function () {
            switch_gender = 0;
            if (this.className != "dropdown-item active") switch_gender = 1;

            var currentGender = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item active");
            currentGender[0].className = currentGender[0].className.replace(" active", "");
            this.className += " active";
            genderbtn.innerHTML = this.innerHTML;

            if (switch_gender == 1) {

                var rookie_dropdown = document.getElementById('rookie-dropdown');
                var school_dropdown = document.getElementById('school-dropdown');

                rookie_dropdown.innerHTML = `
                <li><a class="dropdown-item active" value="all">全部新秀</a></li>
				<li><hr class="dropdown-divider"></li>`

                if (this.innerHTML == "男籃") {

                    add_team_dropdown('team-dropdown', 'men', 'all oversea');

                    allRookies.forEach(r => {
                        if (parseInt(r.id) >= 2020) {
                            rookie_dropdown.innerHTML += `<li><a class="dropdown-item" value="${r.id}">${parseInt(r.id)}'新秀: ${r.men_count} 人</a></li>`
                        }
                    })

                    school_dropdown.innerHTML = `
                    <li><a class="dropdown-item active" value="all">全部學校</a></li>
                    <li><a class="dropdown-item" value="school0">旅外: ${findCount(allColleges, '旅外').men_count} 人`

                    allColleges.sort((a, b) => b.men_count - a.men_count);
                    allColleges.forEach(c => {
                        if (c.id != '旅外' & c.men_count != 0) {
                            school_dropdown.innerHTML += `
                            <li><a class="dropdown-item" value="${c.filter}">${c.id}: ${c.men_count} 人`
                        }
                    })


                } else if (this.innerHTML == "女籃") {

                    add_team_dropdown('team-dropdown', 'women', 'all oversea');

                    allRookies.forEach(r => {
                        rookie_dropdown.innerHTML += `<li><a class="dropdown-item" value="${r.id}">${parseInt(r.id)}'新秀: ${r.women_count} 人</a></li>`
                    })

                    school_dropdown.innerHTML = `
                    <li><a class="dropdown-item active" value="all">全部學校</a></li>
                    <li><a class="dropdown-item" value="school0">旅外: ${findCount(allColleges, '旅外').women_count} 人`

                    allColleges.sort((a, b) => b.women_count - a.women_count);
                    allColleges.forEach(c => {
                        if (c.id != '旅外' & c.women_count != 0) {
                            school_dropdown.innerHTML += `
                            <li><a class="dropdown-item" value="${c.filter}">${c.id}: ${c.women_count} 人`
                        }
                    })
                }

                var teams = document.getElementById("team-dropdown").getElementsByClassName("dropdown-item");
                var teambtn = document.getElementById("teambtn");
                var rookies = document.getElementById("rookie-dropdown").getElementsByClassName("dropdown-item");
                var rookiebtn = document.getElementById("rookiebtn");
                var schools = document.getElementById("school-dropdown").getElementsByClassName("dropdown-item");
                var schoolbtn = document.getElementById("schoolbtn");

                for (let i = 0; i < teams.length; i++) {
                    teams[i].addEventListener("click", function () {
                        var currentTeam = document.getElementById("team-dropdown").getElementsByClassName("active");
                        currentTeam[0].className = currentTeam[0].className.replace(" active", "");
                        this.className += " active";
                        teambtn.innerHTML = this.innerHTML;

                        showPlayersInfo();
                    });
                }
                for (let i = 0; i < rookies.length; i++) {
                    rookies[i].addEventListener("click", function () {
                        var currentRookie = document.getElementById("rookie-dropdown").getElementsByClassName("active");
                        currentRookie[0].className = currentRookie[0].className.replace(" active", "");
                        this.className += " active";
                        rookiebtn.innerHTML = this.innerHTML;

                        showPlayersInfo();
                    });
                }
                for (let i = 0; i < schools.length; i++) {
                    schools[i].addEventListener("click", function () {
                        var currentSchool = document.getElementById("school-dropdown").getElementsByClassName("active");
                        currentSchool[0].className = currentSchool[0].className.replace(" active", "");
                        this.className += " active";
                        schoolbtn.innerHTML = this.innerHTML;

                        showPlayersInfo();
                    });
                }
                teams[0].click();
                rookies[0].click();
                schools[0].click();
            }
        })

    }

    checkSwitch.addEventListener("click", function () {
        checkboxes.forEach(function (checkbox) {
            checkbox.checked = checkSwitch.checked;
        });

        showPlayersInfo();
    })

    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener("click", function () {
            showPlayersInfo();
        })
    }
});
function showPlayersInfo() {
    var currentGender = document.getElementById("gender-dropdown").getElementsByClassName("active");
    var filter_gender = currentGender[0].getAttribute('value');
    var currentTeam = document.getElementById("team-dropdown").getElementsByClassName("active");
    var filter_team = currentTeam[0].getAttribute('value');
    var currentRookie = document.getElementById("rookie-dropdown").getElementsByClassName("active");
    var filter_rookie = currentRookie[0].getAttribute('value');
    var currentSchool = document.getElementById("school-dropdown").getElementsByClassName("active");
    var filter_school = currentSchool[0].getAttribute('value');
    filter_identities = [];
    var checkboxes = document.querySelectorAll('.form-check-input:not(#checkSwitch)');
    checkboxes.forEach(c => {
        if (c.checked) filter_identities.push(c.getAttribute('value'));
    })

    fetch('../data/rosters.csv')
        .then((response) => response.text())
        .then((result) => {

            lines = result.split('\n');
            lines = lines.slice(1);

            players_info = ''
            player_count = 0;
            fa_count = 0;

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

                if (gender == filter_gender & status == 'active' & identity != 'coach') {
                    showPlayer = 0;
                    if (filter_team == 'all') {
                        showPlayer += 1;
                    } else if (filter_team == 'oversea' & isOversea(team)) {
                        showPlayer += 1;
                    } else if (team == filter_team) {
                        showPlayer += 1;
                    }

                    if (filter_rookie == 'all') {
                        showPlayer += 1;
                    } else if (rookie == filter_rookie) {
                        showPlayer += 1;
                    }

                    if (filter_school == 'all') {
                        showPlayer += 1;
                    } else if (filter_school == 'school0' & !school.includes('HBL') & school.includes(' ')) {
                        showPlayer += 1;
                    } else if (findCount(allColleges, school) != -1 & findCount(allColleges, school).filter == filter_school) {
                        showPlayer += 1;
                    }

                    filter_identities.forEach(f => {
                        if (identity == f) showPlayer += 1;
                    })

                    if (showPlayer == 4) {
                        if (team == 'fa') {
                            fa_count += 1;
                        } else {
                            player_count += 1;
                        }

                        players_info += `
                        <tr>
                            <td class="borderR ${teamBG(league, team)}" data-order=${teamOrder(league, team)}>${teamName('short', league, team, 'img')}</td>
                            <td class="borderR" data-order=${numOrder(jersey_num)}>${jersey_num}</td>
                            <td class="borderR"><a style="text-decoration:underline;color:inherit" href="${playerUrl(team, player_url)}" target="_blank">${name}</a></td>
                            <td data-order=${order[league_identity]}>${league_identity}</td>
                            <td>${position}</td>
                            <td>${height}</td>
                            <td>${weight}</td>
                            <td>${birthToAge(birth)}</td>
                            <td class="borderR">${birth}</td>
                            <td class="textL">${school}</td>
                        </tr>`
                    }
                }
            })
            player_th_width_title = [[120, '球隊'], [60, '#'], [100, '球員'],
            [90, '聯盟身份'], [80, '位置'], [80, '身高'], [80, '體重'],
            [80, '年齡'], [120, '生日'], [220, '學校']];

            thead_info = '';
            player_th_width_title.forEach(th => {
                thead_info += `<th style="width:${th[0]}px">${th[1]}</th>`
            })

            player_count_tb = document.getElementById('player_count_tb');
            player_count_tb.innerHTML = `<tr><td style="font-size:18px">現役球員: ${player_count}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;自由球員: ${fa_count}</td></tr>`
            players_table = document.getElementById('players_table');
            players_table.innerHTML = `
            <table id="players_tb" class="table table-hover table-fixTeam">
                <thead>${thead_info}</thead>
                <tbody>${players_info}</tbody>
            </table>
            `
            var dataTable = $('#players_tb').DataTable({
                dom: 't',
                paging: false,
                scrollCollapse: true,
                info: false,
                ordering: true,
            });

        })
}
function findCount(list, value) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].id == value) {
            return list[i]
        }
    }
    return -1;
}