$(document).ready(function () {
    men_html = document.getElementById("men_page");
    women_html = document.getElementById("women_page");

    if(men_html){
        gender = "men"
        team_dropdown = 'team-dropdown_m';
        teams = ['braves','kings','pilots','lioneers','dreamers','steelers',
                'dea','mars','leopards','ghosthawks','aquas',
                'beer','trust','yulon','bll'];

        temp1 = "CBA"
        temp2 = `
        CBA:&nbsp;&nbsp;5&nbsp;&nbsp;人&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        日本 B2:&nbsp;&nbsp;1&nbsp;&nbsp;人`

    }else if(women_html){
        gender = "women"
        team_dropdown = 'team-dropdown_w';
        teams= ['cathay','power','telecom','taiyuen']

        temp1 = "WCBA"

        temp2 = `
        CBA:&nbsp;&nbsp;6&nbsp;&nbsp;人&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        WKBL:&nbsp;&nbsp;1&nbsp;&nbsp;人&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        其他國家:&nbsp;&nbsp;1&nbsp;&nbsp;人`

    }

    fetch('../../data/rosters.csv')
        .then((response) => response.text())
        .then((result) => {

            lines = result.split('\n');
            lines = lines.slice(2);

            tableCoach = document.getElementById('r_coach_tbody');
            tableCount = document.getElementById('r_count_tbody');
            table = document.getElementById('roster_tbody');
            tableOversea = document.getElementById('roster_oversea_tbody');


            cur_team = "oversea";
            c_team = 1;
            c_local = 0;
            c_import = 0;
            sum_H = 0;
            sum_A = 0;
            var avgH = [];
            var avgA = [];
            var rH = [];
            var rA = [];

            tableCount.innerHTML += `<tr class="filterTr oversea ${temp1}-bg showTr"><td>${temp2}</td></tr>`


            lines.forEach(player => {
                infos = player.split(',');
                info = ""
                infoOversea = ""
                infoCoach = ""
                infoCount = ""

                if(infos[0] == gender & infos[6] == "active"){
                    is_oversea = (infos[3] != "PLG" & infos[3] != "T1" & infos[3] != "SBL" & infos[3] != "WSBL" & infos[3] != "");
                    is_local = (infos[9] == "本土" | infos[9] == "華裔" | infos[9] == "外籍生" | infos[9] == "特案外籍生");
                    is_import = (infos[9] == "洋將" | infos[9] == "亞外");


                    const birthday = new Date(infos[13]);
                    const today = new Date();
                    const diff = today - birthday
                    const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));

                    if(infos[7] == "headCoach" | infos[7] == "coach") {
                        infoCoach += `<td class="filterTd ${infos[4]} ${infos[4]}-bg showTd">${infos[9]}: ${infos[1]}</td>`
                    }else if(infos[7] == "GM"){
                        infoCoach += `<td class="filterTd ${infos[4]} ${infos[4]}-bg borderL showTd">${infos[9]}: ${infos[1]}</td>`
                    }else {
                        if(is_oversea){
                            same_team = true;
                            is_local = true;
                        }else{
                            same_team = (cur_team == infos[4]);
                        }

                        if(same_team){
                            if(is_local){
                                c_local += 1;
                                sum_H += parseInt(infos[11]);
                                sum_A += age;
                            }else if(is_import){
                                c_import += 1;
                            }
                        }else{
                            if(cur_team == "oversea"){
                                infoCount += `
                                <tr class="filterTr oversea ${temp1}-bg showTr">
                                    <td>
                                        平均年齡:&nbsp;&nbsp;${(sum_A/c_local).toFixed(1)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        平均身高:&nbsp;&nbsp;${(sum_H/c_local).toFixed(1)}
                                    </td>
                                </tr>`
                            }else{
                                infoCount += `
                                <tr class="filterTr ${cur_team} ${cur_team}-bg showTr">
                                    <td>
                                        本土球員:&nbsp;&nbsp;${c_local}&nbsp;&nbsp;人&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        外籍球員:&nbsp;&nbsp;${c_import}&nbsp;&nbsp;人
                                    </td>
                                </tr>`

                                avgH.push((sum_H / c_local).toFixed(1));
                                avgA.push((sum_A / c_local).toFixed(1));
                                c_team += 1;
                            }
                            cur_team = infos[4];
                            c_local = 0;
                            c_import = 0;
                            sum_H = 0;
                            sum_A = 0;
                            if(is_local){
                                c_local += 1;
                                sum_H += parseInt(infos[11]);
                                sum_A += age;
                            }else if(is_import){
                                c_import += 1;
                            }
                        }
                    }

                    number = infos[2];
                    if(infos[2] == "00") number = 100;

                    if (is_local | is_import | infos[9] == "註銷") {
                        if(is_oversea){
                            filter = `oversea ${infos[3]}-bg`;
                            temp = `<td class="borderR">${infos[3]} ${infos[4]}</td>`;
                        }else if(infos[9] == "註銷"){
                            filter = `${infos[4]}`
                            temp = "";
                        }else{
                            filter = `${infos[4]} ${infos[4]}-bg`;
                            temp = "";
                        }
                        tempInfo = `
                            <tr class="filterTr ${filter} showTr">
                                ${temp}
                                <td class="borderR" data-order="${number}">${infos[2]}</td>
                                <td><a style="text-decoration:underline;color:inherit" href="${infos[5]}" target="_blank">${infos[1]}</a></td>             
                                <td data-order=${order[infos[9]]}>${infos[9]}</td>
                                <td>${infos[10]}</td>
                                <td>${infos[11]}</td>
                                <td>${infos[12]}</td>
                                <td>${age}</td>
                                <td class="borderR">${infos[13]}</td>
                                <td style="text-align:left">${infos[15]}</td>
                            </tr>
                        `
                        if(is_oversea){
                            infoOversea += tempInfo;
                        }else{
                            info += tempInfo;
                        }
                    }
                }

                tableCoach.innerHTML += infoCoach;
                tableCount.innerHTML += infoCount;
                table.innerHTML += info;
                tableOversea.innerHTML += infoOversea;
            });


            if(men_html){
                h_PLG = avgH.slice(0,6);
                h_T1 = avgH.slice(6,11);
                h_SBL = avgH.slice(11);
                a_PLG = avgA.slice(0,6);
                a_T1 = avgA.slice(6,11);
                a_SBL = avgA.slice(11);

                var rh_PLG = [];
                var ra_PLG = [];
                var rh_T1 = [];
                var ra_T1 = [];
                var rh_SBL = [];
                var ra_SBL = [];

                avg_data = [h_PLG,h_T1,h_SBL,a_PLG,a_T1,a_SBL];
                rate_data = [rh_PLG,rh_T1,rh_SBL,ra_PLG,ra_T1,ra_SBL];
            }else if(women_html){
                avg_data = [avgH,avgA];
                rate_data = [rH,rA];
            }


            for(let i = 0; i < avg_data.length; i++){
                var indexes = avg_data[i].map(function(_, index) {return index;} ).sort(function(a, b) {
                    return avg_data[i][b] - avg_data[i][a];
                });
                for (var j = 0; j < indexes.length; j++) rate_data[i][indexes[j]] = j + 1;
            }

            if(men_html){
                rH = rh_PLG.concat(rh_T1,rh_SBL);
                rA = ra_PLG.concat(ra_T1,ra_SBL);
            }
      
            if(window.innerWidth <= 576){
                blank_space = `<br>`
            }else{
                blank_space = `&nbsp;&nbsp;&nbsp;`
            }

            for(let i=0;i<teams.length;i++){
                if(men_html){
                    if(i<6){
                        temp1 = "PLG"
                    }else if(i<11){
                        temp1 = "T1"
                    }else if(i<16){
                        temp1 = "SBL"
                    }
                }else if(women_html){
                    temp1 = ""
                }

                tableCount.innerHTML += `
                <tr class="filterTr ${teams[i]} ${teams[i]}-bg showTr">
                    <td>
                        本土平均年齡:&nbsp;${avgA[i]}&nbsp;(${temp1}第${rA[i]})${blank_space}
                        本土平均身高:&nbsp;${avgH[i]}&nbsp;(${temp1}第${rH[i]})
                    </td>
                </tr>
                `
            }

            var dataTable = $('#rosters_tb').DataTable({
                dom: 't',
                paging: false,
                scrollCollapse: true,
                info: false,
                ordering: true,
                order: [],
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
    
    fetch('../../data/movements.csv')
        .then((response) => response.text())
        .then((result) => {

            lines = result.split('\n');
            lines = lines.slice(2);
 
            table_th = document.getElementById('roster_movements_thead')
            table = document.getElementById('roster_movements_tbody')

            if(window.innerWidth <= 576){
                table_th.innerHTML += `<th>2023-24 球員異動</th>`
            }else{
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


                if(infos[0] == gender){
                    if(cur_team != infos[1]){
                        if(textExtend.startsWith('<br>')) textExtend = textExtend.slice(4);
                        if(textAdd.startsWith('<br>')) textAdd = textAdd.slice(4);
                        if(textLost.startsWith('<br>')) textLost = textLost.slice(4);

                        if(textExtend == "") textExtend = "無 / 未知"
                        if(textAdd == "") textAdd = "無"
                        if(textLost == "") textLost = "無"

                        
                        if(window.innerWidth <= 576){
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
                        }else{
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
                    if(cur_team == infos[1]){
                        if(cur_cat != infos[2]){
                            if(infos[2] == "extend"){
                                textExtend += `${infos[3]}<br>`
                            }else if(infos[2] == "change"){
                                textAdd += `<br><a style="text-decoration:underline"><i>轉隊</i></a><br>${infos[3]}<br>`
                            }else if(infos[2] == "merge"){
                                textAdd += `<br><a style="text-decoration:underline"><i>Via 合併</i></a><br>${infos[3]}<br>`
                            }else if(infos[2] == "fa"){
                                textAdd += `<br><a style="text-decoration:underline"><i>Via 自由球員</i></a><br>${infos[3]}<br>`
                            }else if(infos[2] == "trade"){
                                textAdd += `<br><a style="text-decoration:underline"><i>Via 交易</i></a><br>${infos[3]}<br>`
                            }else if(infos[2] == "keep"){
                                textAdd += `<br><a style="text-decoration:underline"><i>Via 保留名單</i></a><br>${infos[3]}<br>`               
                            }else if(infos[2] == "loan"){
                                textAdd += `<br><a style="text-decoration:underline"><i>Via 租借</i></a><br>${infos[3]}<br>`
                            }else if(infos[2] == "draft"){
                                textAdd += `<br><a style="text-decoration:underline"><i>Via 選秀</i></a><br>${infos[3]}<br>`                 
                            }else if(infos[2] == "lost"){
                                textLost += `${infos[3]}<br>`
                            }else if(infos[2] == "lost loan"){
                                textLost += `<br><a style="text-decoration:underline"><i>Via 租借</i></a><br>${infos[3]}<br>`
                            }else if(infos[2] == "lost trade"){
                                textLost += `<br><a style="text-decoration:underline"><i>Via 交易</i></a><br>${infos[3]}<br>`
                            }else if(infos[2] == "import extend"){
                                textExtend += `<br><a style="text-decoration:underline"><i>續留洋將</i></a><br>${infos[3]}<br>`
                            }else if(infos[2] == "import"){
                                textAdd += `<br><a style="text-decoration:underline"><i>加盟洋將</i></a><br>${infos[3]}<br>`
                            }else if(infos[2] == "import lost"){
                                textLost += `<br><a style="text-decoration:underline"><i>離隊洋將</i></a><br>${infos[3]}<br>`
                            }

                            cur_cat = infos[2];
                        }else if(cur_cat == infos[2]){
                            if(infos[2] == "extend" | infos[2] == "import extend"){
                                textExtend += `${infos[3]}<br>`
                            }else if(infos[2] == "lost" | infos[2] == "lost loan" | infos[2] == "lost trade" | infos[2] == "import lost"){
                                textLost += `${infos[3]}<br>`
                            }else{
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