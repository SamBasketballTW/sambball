$(document).ready(function () {
    men_html = document.getElementById("men_page");
    women_html = document.getElementById("women_page");

    tableCoach = document.getElementById('r_coach_tbody');
    tableCount = document.getElementById('r_count_tbody');
    table = document.getElementById('roster_tbody');
    tableOversea = document.getElementById('roster_oversea_tbody');

    if (men_html) {
        gender = "men"
        team_dropdown = 'team-dropdown_m';
        t_counts = [6, 5, 4];

        teams = [];
        for (let i = 0; i < t_counts[0]; i++) teams.splice(i, 0, plg_teamRank[i + 1]);
        for (let i = 0; i < t_counts[1]; i++) teams.splice(i + t_counts[0], 0, t1_teamRank[i + 1]);
        for (let i = 0; i < t_counts[2]; i++) teams.splice(i + t_counts[0] + t_counts[1], 0, sbl_teamRank[i + 1]);
        teams.splice(0, 0, 'oversea');
        teams.splice(teams.length, 0, 'mustang');

        tableCount.innerHTML += `
        <tr class="filterTr oversea CBA-bg">
            <td>
                CBA:&nbsp;&nbsp;5&nbsp;&nbsp;人&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                日本:&nbsp;&nbsp;1&nbsp;&nbsp;人&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                其他國家:&nbsp;&nbsp;1&nbsp;&nbsp;人
            </td>
        </tr>`

        teams_info = [];
        for (let i = 0; i < teams.length; i++) teams_info.splice(i, 0, [teams[i], 0, 0, 0, 0]);

    } else if (women_html) {
        gender = "women"
        team_dropdown = 'team-dropdown_w';
        t_counts = 4;
        teams = [];
        for (let i = 0; i < t_counts; i++) teams.splice(i, 0, wsbl_teamRank[i + 1]);
        teams.splice(0, 0, 'oversea');

        tableCount.innerHTML += `
        <tr class="filterTr oversea WCBA-bg">
            <td>
                WCBA:&nbsp;&nbsp;6&nbsp;&nbsp;人&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                WKBL:&nbsp;&nbsp;1&nbsp;&nbsp;人&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                其他國家:&nbsp;&nbsp;1&nbsp;&nbsp;人
            </td>
        </tr>`

        teams_info = [];
        for (let i = 0; i < teams.length; i++) teams_info.splice(i, 0, [teams[i], 0, 0, 0, 0]);
        console.log(teams_info)
    }

    fetch('../data/rosters.csv')
        .then((response) => response.text())
        .then((result) => {

            lines = result.split('\n');
            lines = lines.slice(2);

            if (window.innerWidth <= 576) {
                blank_space = `<br>`
            } else {
                blank_space = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`
            }


            lines.forEach(player => {
                infos = player.split(',');
                info = ""
                infoOversea = ""
                infoCoach = ""
                infoCount = ""

                if (infos[0] == gender & infos[6] == "active" & infos[4] != "fa") {
                    is_oversea = (infos[3] != "PLG" & infos[3] != "T1" & infos[3] != "SBL" & infos[3] != "WSBL" & infos[3] != "TAT") | infos[1] == "林胤軒";

                    if (infos[7] == "headCoach" | infos[7] == "coach") {
                        infoCoach += `
                        <tr class="filterTr ${infos[4]} ${infos[4]}-bg showTr">
                            <td>${infos[9]}: ${infos[1]}${coach_name[infos[4]]}${blank_space}${gm_name[infos[4]]}</td>
                        </tr>`

                    } else {
                        if (is_oversea) {
                            team_index = 0;
                            is_local = infos[7] == "local";
                            is_import = infos[7] != "local";
                        } else {
                            team_index = findIndex(teams, infos[4]);
                            is_local = (infos[9] == "本土" | infos[9] == "華裔" | infos[9] == "外籍生" | infos[9] == "特案外籍生");
                            is_import = (infos[9] == "洋將" | infos[9] == "亞外");
                        }

                        const birthday = new Date(infos[13]);
                        const today = new Date();
                        const diff = today - birthday
                        const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));

                        if (is_local) {
                            teams_info[team_index][1] += age;
                            teams_info[team_index][2] += parseInt(infos[11]);
                            teams_info[team_index][3] += 1;
                        } else if (is_import) {
                            teams_info[team_index][4] += 1;
                        }

                        number = infos[2];
                        if (infos[2] == "00") number = 100;

                        if (is_local | is_import | infos[9] == "註銷" | infos[9] == "未註冊") {
                            filter = `${infos[4]} ${infos[4]}-bg`;
                            oversea_team = "";
                            id_color = `${infos[9]}`;

                            if (is_oversea) {
                                filter = `oversea ${infos[3]}-bg`;
                                oversea_team = `<td class="borderR">${infos[3]} ${infos[4]}</td>`;
                            } else if (infos[9] == "註銷" | infos[9] == "未註冊") {
                                id_color = `<a style="color:white">${infos[9]}</a>`
                            }

                            tempInfo = `
                                <tr class="filterTr ${filter} showTr">
                                    ${oversea_team}
                                    <td class="borderR" data-order="${number}">${infos[2]}</td>
                                    <td><a style="text-decoration:underline;color:inherit" href="${infos[5]}" target="_blank">${infos[1]}</a></td>             
                                    <td data-order=${order[infos[9]]}>${id_color}</td>
                                    <td>${infos[10]}</td>
                                    <td>${infos[11]}</td>
                                    <td>${infos[12]}</td>
                                    <td>${age}</td>
                                    <td class="borderR">${infos[13]}</td>
                                    <td style="text-align:left">${infos[15]}</td>
                                </tr>
                            `
                            if (is_oversea) {
                                infoOversea += tempInfo;
                            } else {
                                info += tempInfo;
                            }
                        }
                    }
                }

                tableCoach.innerHTML += infoCoach;
                table.innerHTML += info;
                tableOversea.innerHTML += infoOversea;
            });
            if (men_html) {
                a_plg = [];
                h_plg = [];
                a_t1 = [];
                h_t1 = [];
                a_sbl = [];
                h_sbl = [];
            } else if (women_html) {
                a_wsbl = [];
                h_wsbl = [];
            }

            for (let i = 0; i < teams_info.length; i++) {
                teams_info[i].push((teams_info[i][1] / teams_info[i][3]).toFixed(1));
                teams_info[i].push((teams_info[i][2] / teams_info[i][3]).toFixed(1));
                if (i != 0) {
                    tableCount.innerHTML += `
                    <tr class="filterTr ${teams_info[i][0]} ${teams_info[i][0]}-bg showTr">
                        <td>
                            本土球員:&nbsp;&nbsp;${teams_info[i][3]}&nbsp;&nbsp;人&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            外籍球員:&nbsp;&nbsp;${teams_info[i][4]}&nbsp;&nbsp;人
                        </td>
                    </tr>`

                    if (men_html) {
                        if (i < 1 + t_counts[0]) {
                            a_plg.push(teams_info[i][5])
                            h_plg.push(teams_info[i][6])
                        } else if (i < 1 + t_counts[0] + t_counts[1]) {
                            a_t1.push(teams_info[i][5])
                            h_t1.push(teams_info[i][6])
                        } else if (i < 1 + t_counts[0] + t_counts[1] + t_counts[2]) {
                            a_sbl.push(teams_info[i][5])
                            h_sbl.push(teams_info[i][6])
                        }
                    } else if (women_html) {
                        if (i < 1 + t_counts) {
                            a_wsbl.push(teams_info[i][5])
                            h_wsbl.push(teams_info[i][6])
                        }
                    }

                }
            }
            if (men_html) {
                a_plg = rankArray(a_plg);
                h_plg = rankArray(h_plg);
                a_t1 = rankArray(a_t1);
                h_t1 = rankArray(h_t1);
                a_sbl = rankArray(a_sbl);
                h_sbl = rankArray(h_sbl);
                rankA = a_plg.concat(a_t1, a_sbl);
                rankH = h_plg.concat(h_t1, h_sbl);
            } else if (women_html) {
                rankA = rankArray(a_wsbl);
                rankH = rankArray(h_wsbl);
            }


            for (let i = 0; i < teams_info.length; i++) {
                if (men_html) {
                    if (i == 0) {
                        avg_filter = `oversea CBA-bg`
                        age_league_rank = ``
                        height_league_rank = ``
                    } else if (i == teams_info.length - 1) {
                        avg_filter = `${teams_info[i][0]} ${teams_info[i][0]}-bg`
                        age_league_rank = ``
                        height_league_rank = ``
                    } else {
                        avg_filter = `${teams_info[i][0]} ${teams_info[i][0]}-bg`
                        if (i < 1 + t_counts[0]) {
                            temp = 'PLG'
                        } else if (i < 1 + t_counts[0] + t_counts[1]) {
                            temp = 'T1'
                        } else {
                            temp = 'SBL'
                        }
                        age_league_rank = `(${temp}第${rankA[i - 1]})`
                        height_league_rank = `(${temp}第${rankH[i - 1]})`
                    }
                } else if (women_html) {
                    if (i == 0) {
                        avg_filter = `oversea WCBA-bg`
                        age_league_rank = ``
                        height_league_rank = ``
                    } else {
                        avg_filter = `${teams_info[i][0]} ${teams_info[i][0]}-bg`
                        age_league_rank = `(WSBL第${rankA[i - 1]})`
                        height_league_rank = `(WSBL第${rankH[i - 1]})`
                    }
                }
                tableCount.innerHTML += `
                    <tr class="filterTr ${avg_filter} showTr">
                        <td>
                            本土平均年齡:&nbsp;${teams_info[i][5]}&nbsp;${age_league_rank}${blank_space}
                            本土平均身高:&nbsp;${teams_info[i][6]}&nbsp;${height_league_rank}
                        </td>
                    </tr>`
            }

            var dataTable = $('#rosters_tb').DataTable({
                dom: 't',
                paging: false,
                scrollCollapse: true,
                info: false,
                ordering: true,
                order: [0, 'asc'],
            });

            var dataTable2 = $('#rosters_oversea_tb').DataTable({
                dom: 't',
                paging: false,
                scrollCollapse: true,
                info: false,
                ordering: true,
                order: [],
            });

            document.getElementById(team_dropdown).getElementsByClassName('dropdown-item')[1].click();
        });

    fetch('../data/movements.csv')
        .then((response) => response.text())
        .then((result) => {

            lines = result.split('\n');
            lines = lines.slice(2);

            table_th = document.getElementById('roster_movements_thead')
            table = document.getElementById('roster_movements_tbody')

            if (window.innerWidth <= 576) {
                table_th.innerHTML += `<th>2023-24 球員異動</th>`
            } else {
                table_th.innerHTML += `
                <th>續約 / 延長</th>
                <th>加盟</th>
                <th>離隊</th>`
            }

            textExtend = "";
            textAdd = "";
            textLost = "";
            cur_team = "oversea";
            cur_cat = "";

            lines.forEach(player => {
                infos = player.split(',');
                info = ""


                if (infos[0] == gender) {
                    if (cur_team != infos[1]) {
                        if (textExtend.startsWith('<br>')) textExtend = textExtend.slice(4);
                        if (textAdd.startsWith('<br>')) textAdd = textAdd.slice(4);
                        if (textLost.startsWith('<br>')) textLost = textLost.slice(4);

                        if (textExtend == "") textExtend = "無 / 未知"
                        if (textAdd == "") textAdd = "無"
                        if (textLost == "") textLost = "無"


                        if (window.innerWidth <= 576) {
                            info += `
                            <tr class="filterTr ${cur_team} showTr">
                                <td style="text-align:left"><a style="text-decoration:underline; font-size:20px;">續約 / 延長</a><br>${textExtend}</td>
                            </tr>
                            <tr class="filterTr ${cur_team} showTr">
                                <td style="text-align:left"><a style="text-decoration:underline; font-size:20px;">加盟</a><br>${textAdd}</td>
                            </tr>
                            <tr class="filterTr ${cur_team} showTr">
                                <td style="text-align:left"><a style="text-decoration:underline; font-size:20px;">離隊</a><br>${textLost}</td>
                            </tr>
                            
                            `
                        } else {
                            info += `
                            <tr class="filterTr ${cur_team} showTr">
                                <td class="borderR" style="text-align:left">${textExtend}</td>
                                <td class="borderR" style="text-align:left">${textAdd}</td>
                                <td style="text-align:left">${textLost}</td>
                            </tr>`
                        }
                        cur_team = infos[1];
                        cur_cat = "";
                        textExtend = "";
                        textAdd = "";
                        textLost = "";
                    }
                    if (cur_team == infos[1]) {
                        if (cur_cat != infos[2]) {
                            if (infos[2] == "extend") {
                                textExtend += `${infos[3]}<br>`
                            } else if (infos[2] == "change") {
                                textAdd += `<br><a style="text-decoration:underline"><i>轉隊</i></a><br>${infos[3]}<br>`
                            } else if (infos[2] == "merge") {
                                textAdd += `<br><a style="text-decoration:underline"><i>Via 合併</i></a><br>${infos[3]}<br>`
                            } else if (infos[2] == "fa") {
                                textAdd += `<br><a style="text-decoration:underline"><i>Via 自由球員</i></a><br>${infos[3]}<br>`
                            } else if (infos[2] == "trade") {
                                textAdd += `<br><a style="text-decoration:underline"><i>Via 交易</i></a><br>${infos[3]}<br>`
                            } else if (infos[2] == "keep") {
                                textAdd += `<br><a style="text-decoration:underline"><i>Via 保留名單</i></a><br>${infos[3]}<br>`
                            } else if (infos[2] == "loan") {
                                textAdd += `<br><a style="text-decoration:underline"><i>Via 租借</i></a><br>${infos[3]}<br>`
                            } else if (infos[2] == "draft") {
                                textAdd += `<br><a style="text-decoration:underline"><i>Via 選秀</i></a><br>${infos[3]}<br>`
                            } else if (infos[2] == "lost") {
                                textLost += `${infos[3]}<br>`
                            } else if (infos[2] == "lost loan") {
                                textLost += `<br><a style="text-decoration:underline"><i>Via 租借</i></a><br>${infos[3]}<br>`
                            } else if (infos[2] == "lost trade") {
                                textLost += `<br><a style="text-decoration:underline"><i>Via 交易</i></a><br>${infos[3]}<br>`
                            } else if (infos[2] == "import extend") {
                                textExtend += `<br><a style="text-decoration:underline"><i>續留洋將</i></a><br>${infos[3]}<br>`
                            } else if (infos[2] == "import") {
                                textAdd += `<br><a style="text-decoration:underline"><i>加盟洋將</i></a><br>${infos[3]}<br>`
                            } else if (infos[2] == "import lost") {
                                textLost += `<br><a style="text-decoration:underline"><i>離隊洋將</i></a><br>${infos[3]}<br>`
                            }

                            cur_cat = infos[2];
                        } else if (cur_cat == infos[2]) {
                            if (infos[2] == "extend" | infos[2] == "import extend") {
                                textExtend += `${infos[3]}<br>`
                            } else if (infos[2] == "lost" | infos[2] == "lost loan" | infos[2] == "lost trade" | infos[2] == "import lost") {
                                textLost += `${infos[3]}<br>`
                            } else {
                                textAdd += `${infos[3]}<br>`
                            }
                        }
                    }
                }

                table.innerHTML += info;
            });

            document.getElementById(team_dropdown).getElementsByClassName('dropdown-item')[1].click();
        });
});