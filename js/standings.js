$(document).ready(function () {
    men_html = document.getElementById("men_page");
    women_html = document.getElementById("women_page");

    if(men_html){
        gender = "men"
    }else if(women_html){
        gender = "women"
    }

	fetch('../data/standings.csv')
		.then((response) => response.text())
		.then((result) => {

			lines = result.split('\n');
			lines = lines.slice(2);

            table_overall = document.getElementById('overall_tbody');
            table_ahead = document.getElementById('ahead_tbody');
			table_plg = document.getElementById('plg_tb');
			table_t1 = document.getElementById('t1_tb');
			table_sbl = document.getElementById('sbl_tb');
			table_wsbl = document.getElementById('wsbl_tb');

			plg_rank = [];
			t1_rank = [];
			sbl_rank = [];
			wsbl_rank = [];

			infothead = `
			<th style="width:50px">排名</th>
			<th style="width:95px">球隊</th>
			<th style="width:50px">已賽</th>
			<th style="width:50px">勝場</th>
			<th style="width:50px">敗場</th>
			<th style="width:50px">勝率</th>
			<th style="width:50px">勝差</th>
			<th style="width:50px">連勝</th>`

			lines.forEach(player => {
				infos = player.split(',');
				info = ""
                info_overall = ""
                info_ahead = ""

				plg_standings_th = "";
				t1_standings_th = "";
				sbl_standings_th = "";
				wsbl_standings_th = "";

				plg_standings = ['-', '-', '-', '-', '-', '-'];
				t1_standings = ['-', '-', '-', '-', '-'];
				sbl_standings = ['-', '-', '-', '-'];
				wsbl_standings = ['-', '-', '-', '-'];
				standings = "";

                if(men_html){
                    is_league = (infos[0] == "plg" | infos[0] == "t1" | infos[0] == "sbl");
                    if (infos[0] == "plg_rank") {
                        plg_rank = [infos[1], infos[2], infos[3], infos[4], infos[5], infos[6]];
                        for (let i = 1; i < 7; i++) {
                            plg_standings_th += `<th style="width:70px">${short_teamName[infos[i]]}</th>`
                        }
                        table_plg.innerHTML += `<thead>${infothead}${plg_standings_th}</thead>`
                    } else if (infos[0] == "t1_rank") {
                        t1_rank = [infos[1], infos[2], infos[3], infos[4], infos[5]];
                        for (let i = 1; i < 6; i++) {
                            t1_standings_th += `<th style="width:70px">${short_teamName[infos[i]]}</th>`
                        }
                        table_t1.innerHTML += `<thead>${infothead}${t1_standings_th}</thead>`
                    } else if (infos[0] == "sbl_rank") {
                        sbl_rank = [infos[1], infos[2], infos[3], infos[4], infos[5]];
                        for (let i = 1; i < 5; i++) {
                            sbl_standings_th += `<th style="width:70px">${short_teamName[infos[i]]}</th>`
                        }
                        table_sbl.innerHTML += `<thead>${infothead}${sbl_standings_th}</thead>`
                    } else if (infos[0] == "plg") {
                        for (let i = 28; i < 43; i += 3) plg_standings.splice(findRank(plg_rank, infos[i]), 1, infos[i + 1] + "-" + infos[i + 2]);
                        for (let i = 0; i < 6; i++) standings += `<td>${plg_standings[i]}</td>`;

                    } else if (infos[0] == "t1") {
                        for (let i = 28; i < 40; i += 3) t1_standings.splice(findRank(t1_rank, infos[i]), 1, infos[i + 1] + "-" + infos[i + 2]);
                        for (let i = 0; i < 5; i++) standings += `<td>${t1_standings[i]}</td>`;

                    } else if (infos[0] == "sbl") {
                        for (let i = 28; i < 37; i += 3) sbl_standings.splice(findRank(sbl_rank, infos[i]), 1, infos[i + 1] + "-" + infos[i + 2]);
                        for (let i = 0; i < 4; i++) standings += `<td>${sbl_standings[i]}</td>`;

                    }
                }else if(women_html){
                    is_league = (infos[0] == "wsbl");
                    if (infos[0] == "wsbl_rank") {
                        wsbl_rank = [infos[1], infos[2], infos[3], infos[4], infos[5]];
                        for (let i = 1; i < 5; i++) {
                            wsbl_standings_th += `<th style="width:70px">${short_teamName[infos[i]]}</th>`
                        }
                        table_wsbl.innerHTML += `<thead>${infothead}${wsbl_standings_th}</thead>`
                    } else if (infos[0] == "wsbl") {
                        for (let i = 28; i < 37; i += 3) wsbl_standings.splice(findRank(wsbl_rank, infos[i]), 1, infos[i + 1] + "-" + infos[i + 2]);
                        for (let i = 0; i < 4; i++) standings += `<td>${wsbl_standings[i]}</td>`;
                    }
                }

				if (is_league) {
                        info_overall += `
                        <tbody>
                            <tr class="filterTr ${infos[0]} showTr">
                                <td class="borderR">${infos[1]}</td>
                                <td>
                                    <img src="../asset/images/${gender}/${infos[2]}.png" alt="${infos[2]}" class="teamicon">
                                    <b>${short_teamName[infos[2]]}</b>
                                </td>
                                <td>${infos[3]}</td>
                                <td>${infos[4]}</td>
                                <td>${infos[5]}</td>
                                <td>${infos[6]}</td>
                                <td>${infos[7]}</td>
                                <td class="borderR">${infos[8]}</td>
                                <td class="borderR">${infos[9]}</td>
                                <td>${infos[15]}</td>
                                <td>${infos[16]}</td>
                                <td class="borderR">${infos[17]}</td>
                                <td>${(infos[24]/infos[3]).toFixed(1)}</td>
                                <td>${(infos[25]/infos[3]).toFixed(1)}</td>
                            </tr>
                        </tbody>`

                        info_ahead += `
                        <tbody>
                            <tr class="filterTr ${infos[0]} showTr">
                                <td class="borderR">${infos[1]}</td>
                                <td>
                                    <img src="../asset/images/${gender}/${infos[2]}.png" alt="${infos[2]}" class="teamicon">
                                    <b>${short_teamName[infos[2]]}</b>
                                </td>
                                <td>${infos[3]}</td>
                                <td>${infos[4]}</td>
                                <td>${infos[5]}</td>
                                <td class="borderR">${infos[6]}</td>
                                <td>${infos[18]}</td>
                                <td>${infos[19]}</td>
                                <td class="borderR">${infos[20]}</td>
                                <td>${infos[21]}</td>
                                <td>${infos[22]}</td>
                                <td class="borderR">${infos[23]}</td>
                                <td>${infos[26]}</td>
                                <td>${infos[27]}</td>
                            </tr>
                        </tbody>`

                        info += `
                        <tbody>
                            <tr>
                                <td class="borderR">${infos[1]}</td>
                                <td>
                                    <img src="../asset/images/${gender}/${infos[2]}.png" alt="${infos[2]}" class="teamicon">
                                    <b>${short_teamName[infos[2]]}</b>
                                </td>
                                <td>${infos[3]}</td>
                                <td>${infos[4]}</td>
                                <td>${infos[5]}</td>
                                <td>${infos[6]}</td>
                                <td>${infos[7]}</td>
                                <td class="borderR">${infos[8]}</td>
                                ${standings}
                            </tr>
                        </tbody>`
                    table_overall.innerHTML += info_overall;
                    table_ahead.innerHTML += info_ahead;

                    if(men_html){
                        if(infos[0] == "plg"){
                            table_plg.innerHTML += info;
                        }else if(infos[0] == "t1"){
                            table_t1.innerHTML += info;
                        }else if(infos[0] == "sbl"){
                            table_sbl.innerHTML += info;
                        }
                    }else if(women_html){
                        if(infos[0] == "wsbl"){
                            table_wsbl.innerHTML += info;
                        }
                    }
					
				}
			});
            if(men_html){
                document.getElementById('league-dropdown').getElementsByClassName('dropdown-item')[0].click();
            }
		});

});