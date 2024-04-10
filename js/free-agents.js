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

                if (infos[0] == gender) {
                    is_oversea = (infos[3] != "PLG" & infos[3] != "T1" & infos[3] != "SBL" & infos[3] != "WSBL") | infos[1] == "林胤軒";

                    if (infos[17] != "") {
                        const birthday = new Date(infos[13]);
                        const today = new Date();
                        const diff = today - birthday
                        const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));

                        if (is_oversea) {
                            team_name = `${infos[3]} ${infos[16]}`;
                            team_order = order[infos[3]];
                        } else {
                            team_name = cn_teamName[infos[16]];
                            team_order = order[infos[16]];
                        }

                        info += `
                            <tr>
                                <td><a style="text-decoration:underline; color:inherit" href="${infos[5]}" target="_blank">${infos[1]}</a></td>
                                <td>${infos[10]}</td>
                                <td>${age}</td>
                                <td class="borderR">${infos[11]}</td>
                                <td>${infos[17]}</td>
                                <td class="${infos[16]}-bg borderR" data-order="${team_order}">${team_name}</td>
                                <td>${infos[18]}</td>
                                <td>${infos[19]}</td>
                                <td>${infos[20]}</td>                
                            </tr>`
                    }
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