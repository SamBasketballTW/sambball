$(document).ready(function () {
    men_html = document.getElementById("men_page");
    women_html = document.getElementById("women_page");

    if (men_html) {
        gender = "men"
    } else if (women_html) {
        gender = "women"
    }

    fetch('../data/rosters.csv')
        .then((response) => response.text())
        .then((result) => {

            lines = result.split('\n');
            lines = lines.slice(2);

            table = document.getElementById('roster_fa_tbody');

            lines.forEach(player => {
                infos = player.split(',');
                info = ""

                if (infos[0] == gender & infos[17] != "") {
                    if(infos[4] == "fa") {
                        team = infos[16]
                    } else if(infos[6] == "active"){
                        team = infos[4]
                    } else {
                        team = infos[16]
                    }

                    info += `
                    <tr>
                        <td><a style="text-decoration:underline; color:inherit" href="${infos[5]}" target="_blank">${infos[1]}</a></td>
                        <td>${infos[10]}</td>
                        <td>${age(infos[13])}</td>
                        <td class="borderR">${infos[11]}</td>
                        <td>${infos[17]}</td>
                        <td class="${bg_team(infos[3], team)} borderR" data-order="${team_order(infos[3], team)}">${full_team(infos[3], team)}</td>
                        <td>${infos[18]}</td>
                        <td>${infos[19]}</td>
                        <td>${infos[20]}</td>                
                    </tr>`
                }

                table.innerHTML += info;
            })

            var dataTable = $('#fa_tb').DataTable({
                dom: 't',
                paging: false,
                scrollCollapse: true,
                info: false,
                ordering: true,
                order: [5,'asc'],
            });

        });
});