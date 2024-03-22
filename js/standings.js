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
                    if (infos[0] == "plg_rank") {
                        plg_rank = [infos[1], infos[2], infos[3], infos[4], infos[5], infos[6]];
                        for (let i = 1; i < 7; i++) {
                            plg_standings_th += `<th style="width:70px">${shorts[infos[i]]}</th>`
                        }
                        table_plg.innerHTML += `<thead>${infothead}${plg_standings_th}</thead>`
                    } else if (infos[0] == "t1_rank") {
                        t1_rank = [infos[1], infos[2], infos[3], infos[4], infos[5]];
                        for (let i = 1; i < 6; i++) {
                            t1_standings_th += `<th style="width:70px">${shorts[infos[i]]}</th>`
                        }
                        table_t1.innerHTML += `<thead>${infothead}${t1_standings_th}</thead>`
                    } else if (infos[0] == "sbl_rank") {
                        sbl_rank = [infos[1], infos[2], infos[3], infos[4], infos[5]];
                        for (let i = 1; i < 5; i++) {
                            sbl_standings_th += `<th style="width:70px">${shorts[infos[i]]}</th>`
                        }
                        table_sbl.innerHTML += `<thead>${infothead}${sbl_standings_th}</thead>`
                    } 

                    if (infos[0] == "plg") {
                        for (let i = 9; i < 24; i += 3) plg_standings.splice(findRank(plg_rank, infos[i]), 1, infos[i + 1] + "-" + infos[i + 2]);
                        for (let i = 0; i < 6; i++) standings += `<td>${plg_standings[i]}</td>`;

                    } else if (infos[0] == "t1") {
                        for (let i = 9; i < 21; i += 3) t1_standings.splice(findRank(t1_rank, infos[i]), 1, infos[i + 1] + "-" + infos[i + 2]);
                        for (let i = 0; i < 5; i++) standings += `<td>${t1_standings[i]}</td>`;

                    } else if (infos[0] == "sbl") {
                        for (let i = 9; i < 18; i += 3) sbl_standings.splice(findRank(sbl_rank, infos[i]), 1, infos[i + 1] + "-" + infos[i + 2]);
                        for (let i = 0; i < 4; i++) standings += `<td>${sbl_standings[i]}</td>`;

                    }
                }else if(women_html){
                    if (infos[0] == "wsbl_rank") {
                        wsbl_rank = [infos[1], infos[2], infos[3], infos[4], infos[5]];
                        for (let i = 1; i < 5; i++) {
                            wsbl_standings_th += `<th style="width:70px">${shorts[infos[i]]}</th>`
                        }
                        table_wsbl.innerHTML += `<thead>${infothead}${wsbl_standings_th}</thead>`
                    }

                    if (infos[0] == "wsbl") {
                        for (let i = 9; i < 18; i += 3) wsbl_standings.splice(findRank(wsbl_rank, infos[i]), 1, infos[i + 1] + "-" + infos[i + 2]);
                        for (let i = 0; i < 4; i++) standings += `<td>${wsbl_standings[i]}</td>`;
                    }
                }

				if (infos[0] == "plg" | infos[0] == "t1" | infos[0] == "sbl" | infos[0] == "wsbl") {
					info += `
					<tbody>
						<tr>
							<td class="borderR">${infos[1]}</td>
							<td>
								<img src="../asset/images/${gender}/${infos[2]}.png" alt="${infos[2]}" class="teamicon">
								<b>${shorts[infos[2]]}</b>
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
		});

});