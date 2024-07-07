class Players {
    static player_id = 0;

    constructor(gender, name, league, last_team, last_team_order, team, team_order, player_url, pos, height, age,
        fa_status, fa_gp, fa_ppg, fa_rpg, fa_apg, filter = '') {

        this.player_id = Players.player_id++;
        this.gender = gender;
        this.name = name;
        this.league = league;
        this.last_team = last_team;
        this.last_team_order = last_team_order;
        this.team = team;
        this.team_order = team_order;
        this.player_url = player_url;
        this.pos = pos;
        this.height = height;
        this.age = age;
        this.fa_status = fa_status;
        this.fa_gp = fa_gp;
        this.fa_ppg = fa_ppg;
        this.fa_rpg = fa_rpg;
        this.fa_apg = fa_apg;
        this.filter = filter;
    }
}
allPlayers = [];

$(document).ready(function () {
    fetch('../data/rosters.csv')
        .then((response) => response.text())
        .then((result) => {

            lines = result.split('\n');
            lines = lines.slice(2);

            table = document.getElementById('roster_fa_tbody');

            oversea_team_order = 0;
            current_team = '';
            oversea_last_team_order = 0;
            current_last_team = '';

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
                    fa_status, fa_gp, fa_ppg, fa_rpg, fa_apg

                ] = infos;

                if (fa_status != '') {
                    player = new Players();
                    allPlayers.push(player);

                    player.gender = gender;
                    player.name = name;
                    player.league = league;
                    player.player_url = playerUrl(last_team, player_url);
                    player.pos = pos;
                    player.height = height;
                    player.age = birthToAge(birth);
                    player.fa_status = fa_status;
                    player.fa_gp = fa_gp;
                    player.fa_ppg = fa_ppg;
                    player.fa_rpg = fa_rpg;
                    player.fa_apg = fa_apg;

                    if (team != 'fa') {
                        if (last_team == '') {
                            player.last_team = team;
                            player.team = '';
                            player.filter += ' unsigned';
                        } else {
                            player.last_team = last_team;
                            player.team = team;
                            player.filter += ' signed';
                        }
                    } else {
                        player.last_team = last_team;
                        player.team = '';
                        player.filter += ' unsigned';
                    }

                    if (isOversea(player.last_team)) {
                        if (current_last_team != player.last_team) {
                            oversea_last_team_order += 1;
                            current_last_team = player.last_team;
                        }
                        player.last_team_order = oversea_last_team_order;
                    } else {
                        player.last_team_order = 0 + 1 + findTeam(player.last_team).teamIndex();

                    }

                    if (player.team != '') {
                        if (isOversea(player.team)) {
                            if (current_team != player.team) {
                                oversea_team_order += 1;
                                current_team = player.team;
                            }
                            player.team_order = oversea_team_order;
                        } else {
                            player.team_order = oversea_team_order + 1 + findTeam(player.team).teamIndex();

                        }
                    }
                }
            })
            allPlayers.forEach(p => {
                table.innerHTML += `
                    <tr class="filterTr ${p.gender} ${p.filter}">
                        <td><a style="text-decoration:underline; color:inherit" href="${p.player_url}" target="_blank">${p.name}</a></td>
                        <td>${p.pos}</td>
                        <td>${p.age}</td>
                        <td class="borderR">${p.height}</td>
                        <td>${p.fa_status}</td>
                        <td class="${teamBG(p.league, p.last_team)} borderR" data-order="${p.last_team_order}">${teamName('full', p.league, p.last_team)}</td>
                        <td class="${teamBG(p.league, p.team)} borderR" data-order="${p.team_order}">${teamName('full', p.league, p.team)}</td>
                        <td>${p.fa_gp}</td>
                        <td>${p.fa_ppg}</td>
                        <td>${p.fa_rpg}</td>
                        <td>${p.fa_apg}</td>              
                    </tr>`
            })

            var dataTable = $('#fa_tb').DataTable({
                dom: 't',
                paging: false,
                scrollCollapse: true,
                info: false,
                ordering: true,
                order: [5, 'asc']
            });
            document.getElementById('gender-dropdown').getElementsByClassName('dropdown-item')[0].click();
            document.getElementById('fa-dropdown').getElementsByClassName('dropdown-item')[2].click();
        });

    var genders = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item");
    var genderbtn = document.getElementById("genderbtn");
    var fas = document.getElementById("fa-dropdown").getElementsByClassName("dropdown-item");
    var fabtn = document.getElementById("fabtn");

    for (var i = 0; i < genders.length; i++) {
        genders[i].addEventListener("click", function () {
            var currentGender = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item active");
            currentGender[0].className = currentGender[0].className.replace(" active", "");
            this.className += " active";
            genderbtn.innerHTML = this.innerHTML;

            f('filter');
        });
    }

    for (var i = 0; i < fas.length; i++) {
        fas[i].addEventListener("click", function () {
            var currentFA = document.getElementById("fa-dropdown").getElementsByClassName("dropdown-item active");
            currentFA[0].className = currentFA[0].className.replace(" active", "");
            this.className += " active";
            fabtn.innerHTML = this.innerHTML;

            f('filter');
        });
    }
});