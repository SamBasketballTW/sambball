class Player {
    static player_id = 0;

    constructor(gender, name, league, last_team, last_team_order, new_team, new_team_order, player_url, pos, height, age,
        fa_status, fa_gp, fa_ppg, fa_rpg, fa_apg, filter = '') {

        this.player_id = Player.player_id++;
        this.gender = gender;
        this.name = name;
        this.league = league;
        this.last_team = last_team;
        this.last_team_order = last_team_order;
        this.new_team = new_team;
        this.new_team_order = new_team_order;
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
                    player1 = new Player();
                    allPlayers.push(player1);

                    player1.gender = gender;
                    player1.name = name;
                    player1.league = league;
                    player1.player_url = playerUrl(last_team, player_url);
                    player1.pos = pos;
                    player1.height = height;
                    player1.age = birthToAge(birth);
                    player1.fa_status = fa_status;
                    player1.fa_gp = fa_gp;
                    player1.fa_ppg = fa_ppg;
                    player1.fa_rpg = fa_rpg;
                    player1.fa_apg = fa_apg;

                    if(fa_status == '完成簽約'){
                        player1.filter += ' signed';
                        player1.last_team = last_team;
                        player1.new_team = team;
                    }else if(fa_status == '已續約'){
                        player1.filter += ' signed';
                        player1.last_team = team;
                        player1.new_team = team;
                    }else{
                        player1.filter += ' unsigned';
                        player1.new_team = '';
                        if(team != 'fa'){
                            player1.last_team = team;
                        }else{
                            player1.last_team = last_team;
                        }
                    }

                    if (isOversea(player1.last_team)) {
                        if (current_last_team != player1.last_team) {
                            oversea_last_team_order += 1;
                            current_last_team = player1.last_team;
                        }
                        player1.last_team_order = oversea_last_team_order;
                    } else {
                        player1.last_team_order = 0 + 1 + findTeam(player1.last_team).teamIndex();

                    }

                    if (player1.new_team != '') {
                        if (isOversea(player1.new_team)) {
                            if (current_team != player1.new_team) {
                                oversea_team_order += 1;
                                current_team = player1.new_team;
                            }
                            player1.new_team_order = oversea_team_order;
                        } else {
                            player1.new_team_order = oversea_team_order + 1 + findTeam(player1.new_team).teamIndex();

                        }
                    }else{
                        player1.new_team_order = 30;
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
                        <td class="${teamBG(p.league, p.new_team)} borderR" data-order="${p.new_team_order}">${teamName('full', p.league, p.new_team)}</td>
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