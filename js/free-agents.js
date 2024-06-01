$(document).ready(function () {
    fetch('../data/rosters.csv')
        .then((response) => response.text())
        .then((result) => {

            lines = result.split('\n');
            lines = lines.slice(2);

            table = document.getElementById('roster_fa_tbody');

            lines.forEach(player => {
                infos = player.split(',');
                info = ""

                if (infos[17] != "") {
                    if (infos[4] == "fa") {
                        team = infos[16]
                    } else if (infos[6] == "active") {
                        team = infos[4]
                    } else {
                        team = infos[16]
                    }

                    info += `
                    <tr class="filterTr ${infos[0]}">
                        <td><a style="text-decoration:underline; color:inherit" href="${infos[5]}" target="_blank">${infos[1]}</a></td>
                        <td>${infos[10]}</td>
                        <td>${age(infos[13])}</td>
                        <td class="borderR">${infos[11]}</td>
                        <td>${infos[17]}</td>
                        <td class="${bg_team(infos[3], team)} borderR" data-order="${team_order(infos[3], team)}">${team_name("full", infos[3], team)}</td>
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
                order: [5, 'asc'],
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