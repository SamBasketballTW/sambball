$(document).ready(function () {
    fetch('../data/rosters.csv')
        .then((response) => response.text())
        .then((result) => {

            lines = result.split('\n');
            lines = lines.slice(2);

            table = document.getElementById('roster_fa_tbody');

            oversea_team_order = 0;
            current_team = '';

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

                if (team == 'fa') {
                    if (isOversea(last_team)) {
                        if (current_team != last_team) {
                            oversea_team_order += 1;
                            current_team = last_team;
                        }
                        team_order = oversea_team_order;
                    } else {
                        team_order = oversea_team_order + 1 + findTeam(last_team).teamIndex();
                    }

                    table.innerHTML += `
                    <tr class="filterTr ${gender}">
                        <td><a style="text-decoration:underline; color:inherit" href="${playerUrl(team, player_url)}" target="_blank">${name}</a></td>
                        <td>${pos}</td>
                        <td>${birthToAge(birth)}</td>
                        <td class="borderR">${height}</td>
                        <td>${fa_status}</td>
                        <td class="${teamBG(league, last_team)} borderR" data-order="${team_order}">${teamName('full', league, last_team)}</td>
                        <td data-order="${fa_total_sec}">${secToTime(fa_total_sec)}</td>
                        <td>${fa_ppg}</td>
                        <td>${fa_rpg}</td>
                        <td>${fa_apg}</td>              
                    </tr>`
                }
            })

            var dataTable = $('#fa_tb').DataTable({
                dom: 't',
                paging: false,
                scrollCollapse: true,
                info: false,
                ordering: true,
                order: [],
            });
            document.getElementById('gender-dropdown').getElementsByClassName('dropdown-item')[0].click();
        });

    var genders = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item");
    var genderbtn = document.getElementById("genderbtn");

    for (var i = 0; i < genders.length; i++) {
        genders[i].addEventListener("click", function () {
            var currentGender = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item active");
            currentGender[0].className = currentGender[0].className.replace(" active", "");
            this.className += " active";
            genderbtn.innerHTML = this.innerHTML;

            f('filter');
        });
    }
});