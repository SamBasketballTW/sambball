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

                if (infos[0] == gender & infos[6] == "active") {
                    is_oversea = (infos[3] != "PLG" & infos[3] != "T1" & infos[3] != "SBL" & infos[3] != "WSBL" & infos[3] != "");
                    is_local = (infos[9] == "本土" | infos[9] == "華裔" | infos[9] == "外籍生" | infos[9] == "特案外籍生");
                    is_import = (infos[9] == "洋將" | infos[9] == "亞外");


                    const birthday = new Date(infos[13]);
                    const today = new Date();
                    const diff = today - birthday
                    const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));

                    number = infos[2];
                    if (infos[2] == "00") number = 100;

                    if (is_oversea) {
                        is_local = true;
                        filter = "oversea";
                        bg = `${infos[3]}-bg`;
                        team_order = order[infos[3]];
                        team_name = `${infos[3]} ${infos[4]}`;
                        last_team = infos[16]
                    } else {
                        filter = infos[4];
                        bg = `${infos[4]}-bg`;
                        team_order = order[infos[4]];
                        team_name = `
                        <img src="../asset/images/${gender}/${infos[4]}.png" alt="${infos[4]}" class="teamicon">
                        <b>${cn_teamName[infos[4]]}</b>`
                        last_team = infos[16]

                        if( infos[4] == "fa"){
                            team_name = cn_teamName[infos[4]];
                            last_team = `${infos[3]} ${short_teamName[infos[16]]}`
                        }
                    }

                    if (infos[16] != "") filter += " change";


                    if (is_local | is_import | infos[9] == "註銷" | infos[9] == "未註冊" | infos[4] == "fa") {
                        identity = `${infos[9]}`
                        if(infos[1] == "布拉" | infos[1] == "布銳克曼" | infos[1] == "阿拉薩"){
                            identity = `洋將`;
                        }
                        console.log(team_order);

                        info += `
                        <tr class="filterTr ${filter} ${infos[7]} ${infos[8]} showTr">
                            <td class="borderR ${bg}" data-order=${team_order}>${team_name}</td>
                            <td class="borderR" data-order=${number}>${infos[2]}</td>
                            <td><a style="text-decoration:underline;color:inherit" href="${infos[5]}" target="_blank">${infos[1]}</a></td>
                            <td data-order=${order[infos[9]]}>${identity}</td>
                            <td>${infos[10]}</td>
                            <td>${infos[11]}</td>
                            <td>${infos[12]}</td>
                            <td>${age}</td>
                            <td class="borderR">${infos[13]}</td>
                            <td>${last_team}</td>
                            
                        </tr>`
                    }
                }


                table.innerHTML += info;
            });

            var dataTable = $('#players_tb').DataTable({
                dom: 't',
                paging: false,
                scrollCollapse: true,
                info: false,
                ordering: true,
                order: [0,'asc'],
            });
        });
});