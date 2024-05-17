$(document).ready(function () {
    table_plg_1_4 = document.getElementById("plg_1_4");
    table_plg_2_3 = document.getElementById("plg_2_3");
    table_plg_finals = document.getElementById("plg_finals");
    table_t1_1_4 = document.getElementById("t1_1_4");
    table_t1_2_3 = document.getElementById("t1_2_3");
    table_t1_finals = document.getElementById("t1_finals");
    table_sbl_2_3 = document.getElementById("sbl_2_3");
    table_sbl_finals = document.getElementById("sbl_finals");
    table_wsbl_2_3 = document.getElementById("wsbl_2_3");
    table_wsbl_finals = document.getElementById("wsbl_finals");

    plg_teams = ['', '', 'kings', ''];
    plg_w_l = ['', '', '', ''];
    table_plg_1_4.innerHTML = `<td class="textL">系列賽 0-0</td>`
    table_plg_2_3.innerHTML = `<td class="textL">系列賽 0-0</td>`
    plg_finals_1 = ['', ''];
    plg_finals_2 = ['', ''];
    table_plg_finals.innerHTML = `<td class="textL">冠軍賽 0-0</td>`

    t1_teams = ['dea', 'leopards', 'aquas', 'mars'];
    t1_w_l = ['l', 'w', 'l', 'w'];
    table_t1_1_4.innerHTML = `<td class="textL">戰神 贏下系列賽 3-2</td>`
    table_t1_2_3.innerHTML = `<td class="textL">雲豹 贏下系列賽 3-0</td>`
    t1_finals_1 = ['leopards', ''];
    t1_finals_2 = ['mars', ''];
    table_t1_finals.innerHTML = `<td class="textL">冠軍賽 0-0</td>`

    sbl_teams = ['beer', 'bank', 'yulon'];
    sbl_w_l = ['l', 'l', 'w'];
    table_sbl_2_3.innerHTML = `<td class="textL">裕隆 贏下系列賽 2-1</td>`
    sbl_finals_1 = ['yulon', 'w'];
    table_sbl_finals.innerHTML = `<td class="textL">裕隆 贏下冠軍賽 2-1</td>`

    wsbl_teams = ['taiyuen', 'cathay', 'taipower'];
    wsbl_w_l = ['l', 'w', 'l'];
    table_wsbl_2_3.innerHTML = `<td class="textL">國泰 贏下系列賽 2-0</td>`
    wsbl_finals_1 = ['cathay', 'w'];
    table_wsbl_finals.innerHTML = `<td class="textL">國泰 贏下冠軍賽 2-1</td>`


    all_teams = [plg_teams, t1_teams, sbl_teams, wsbl_teams];
    all_w_l = [plg_w_l, t1_w_l, sbl_w_l, wsbl_w_l];
    all_finals = [[plg_finals_1, plg_finals_2], [t1_finals_1, t1_finals_2], [sbl_finals_1], [wsbl_finals_1]];
    league = ['plg', 't1', 'sbl', 'wsbl'];

    for (let i = 0; i < 4; i++) {
        if (league[i] == 'wsbl') {
            gender = "women";
        } else {
            gender = "men";
        }
        for (let j = 0; j < po_teams[league[i]]; j++) {
            table = document.getElementById(`${league[i]}_${j + 1}`);

            if (all_teams[i][j] == '') {
                table.innerHTML = `<td class="textL">${j + 1} - 未知</td>`
            } else {
                temp1 = '';
                temp2 = '';
                temp3 = '';
                if (all_w_l[i][j] == "w") {
                    temp1 = `style="border-right:5px solid black"`
                } else if (all_w_l[i][j] == "l") {
                    temp2 = `style="color:#9d9a9a"`
                    temp3 = `style="opacity:0.6"`
                }
                table.innerHTML = `
                <td class="textL" ${temp1}>
					<a href="${team_link[all_teams[i][j]]}" target="_blank" ${temp2}>${j + 1} -
						<img src="./asset/images/${gender}/${all_teams[i][j]}.png" alt="${all_teams[i][j]}"
							class="teamicon" ${temp3}>${teamName_full_CN[all_teams[i][j]]}</a>
				</td>`
            }
        }
    }
    for (let i = 0; i < 4; i++) {
        if (league[i] == 'wsbl') {
            gender = "women";
        } else {
            gender = "men";
        }
        for (let j = 0; j < all_finals[i].length; j++) {
            table = document.getElementById(`${league[i]}_finals_${j + 1}`);

            if (all_finals[i][j][0] == '') {
                table.innerHTML = `<td class="textL">未知</td>`
            } else {
                index = findIndex(all_teams[i], all_finals[i][j][0]) + 1;

                temp1 = '';
                temp2 = '';
                temp3 = '';
                if (all_finals[i][j][1] == "w") {
                    temp1 = `style="border-right:5px solid black"`
                } else if (all_finals[i][j][1] == "l") {
                    temp2 = `style="color:#9d9a9a"`
                    temp3 = `style="opacity:0.6"`
                }
                table.innerHTML = `
                <td class="textL" ${temp1}>
					<a href="${team_link[all_finals[i][0]]}" target="_blank" ${temp2}>${index} -
						<img src="./asset/images/${gender}/${all_finals[i][j][0]}.png" alt="${all_finals[i][j][0]}"
							class="teamicon" ${temp3}>${teamName_full_CN[all_finals[i][j][0]]}</a>
				</td>`
            }
        }
    }
});