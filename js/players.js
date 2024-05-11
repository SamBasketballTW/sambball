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

            table = document.getElementById('players_tbody');


            lines.forEach(player => {
                infos = player.split(',');
                info = ""

                if (infos[0] == gender & infos[6] == "active" & infos[7] != "headCoach" & infos[7] != "coach") {
                    if (infos[16] == "") {
                        filter = ""
                    } else {
                        filter = "change"
                    }
                    if (infos[4] == "fa") {
                        infos[16] = `${infos[3]} ${team_name("short", infos[3], infos[16])}`
                    }
                    if (infos[5] == '') infos[5] = team_link[infos[4]];

                    if (infos[1] == "布拉" | infos[1] == "布銳克曼" | infos[1] == "阿拉薩" | infos[1] == "辛特力" | infos[1] == "夏普" | infos[1] == "安尼奎") {
                        infos[9] = `洋將`;
                    } else if (infos[1] == "海登") {
                        infos[9] = `亞外`;
                    } else if (infos[1] == "王振原") {
                        infos[9] = `本土`;
                    }

                    info += `
                    <tr class="filterTr ${filter_team(infos[3], infos[4])} ${infos[7]} ${infos[8]} ${school(infos[14])} ${filter} showTr">
                        <td class="borderR ${bg_team(infos[3], infos[4])}" data-order=${team_order(infos[3], infos[4])}>
                            ${team_name("short", infos[3], infos[4], gender)}
                        </td>
                        <td class="borderR" data-order=${num_order(infos[2])}>${infos[2]}</td>
                        <td><a style="text-decoration:underline;color:inherit" href="${infos[5]}" target="_blank">${infos[1]}</a></td>
                        <td data-order=${order[infos[9]]}>${infos[9]}</td>
                        <td>${infos[10]}</td>
                        <td>${infos[11]}</td>
                        <td>${infos[12]}</td>
                        <td>${age(infos[13])}</td>
                        <td class="borderR">${infos[13]}</td>
                        <td class="borderR textL">${infos[14]}</td>
                        <td>${infos[16]}</td>                
                    </tr>`
                }


                table.innerHTML += info;
            });

            var dataTable = $('#players_tb').DataTable({
                dom: 't',
                paging: false,
                scrollCollapse: true,
                info: false,
                ordering: true,
                order: [0, 'asc'],
            });


        });
});