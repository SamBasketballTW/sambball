$(document).ready(function () {
	fetch('../data/standings-plg.csv')
		.then((response) => response.text())
		.then((result) => {

			lines = result.split('\n');
			lines = lines.slice(2);

            table_overall = document.getElementById('overall_tbody');
            table_ahead = document.getElementById('ahead_tbody');
            table = document.getElementById('plg_tb');

            rank = ['dreamers','pilots','kings','lioneers','braves','steelers'];
            team_count = rank.length;
            temp = "";
            for(let i = 0;i<rank.length;i++) temp += `<th style="width:70px">${short_teamName[rank[i]]}</td>`

            table.innerHTML += `
            <thead>
                <th style="width:50px">排名</th>
                <th style="width:95px">球隊</th>
                <th style="width:50px">已賽</th>
                <th style="width:50px">勝場</th>
                <th style="width:50px">敗場</th>
                <th style="width:50px">勝率</th>
                <th style="width:50px">勝差</th>
                <th style="width:50px">連勝</th>
                ${temp}
            </thead>`
            

            for( let i=0; i<rank.length; i++){
                team = rank[i];
                w_l = [0,0];
                gb = 0;
                streak_count = 0;
                streak = "";
                recent5 = [0,0];
                home = [0,0];
                road = [0,0];
                ot = [0,0];
                total_ppg = [0,0];
                q2_ahead = [0,0];
                q2_behind = [0,0];
                q2_tied = [0,0];
                q3_ahead = [0,0];
                q3_behind = [0,0];
                q3_tied = [0,0];
                less3 = [0,0];
                more10 = [0,0];
                matchup = [];
                for( let i=0; i<rank.length; i++) matchup.push([rank[i],0,0]);
    
                lines.forEach(player => {
                    infos = player.split(',');
                    info = ""

                    if(infos[3] == team){
                        w_l[0] += 1;

                        if( infos[4] == "home"){
                            home[0] += 1;
                        }else{
                            road[0] += 1;
                        }

                        if(streak == ""){
                            streak = "W"
                            streak_count += 1;
                        }else if(streak == "W"){
                            streak_count += 1;
                        }else if(streak == "L"){
                            streak = `L${streak_count}`;
                        }

                        if( recent5[0]+recent5[1] < 5) recent5[0] += 1;

                        q2 = parseInt(infos[5])+parseInt(infos[6]);
                        q2_a = parseInt(infos[13])+parseInt(infos[14]);
                        q3 = q2 + parseInt(infos[7]);
                        q3_a = q2_a + parseInt(infos[15]);

                        points = parseInt(infos[10]);
                        points_a = parseInt(infos[18]);

                        if(infos[9] != "-") ot[0] += 1;

                        if( (points - points_a) <= 3 ){
                            less3[0] += 1
                        }else if( (points - points_a) >= 10 ){
                            more10[0] += 1
                        }

                        total_ppg[0] += points;
                        total_ppg[1] += points_a;

                        if( q2 > q2_a ){
                            q2_ahead[0] += 1;
                        }else if( q2 < q2_a ){
                            q2_behind[0] += 1;
                        }else{
                            q2_tied[0] += 1;
                        }

                        if( q3 > q3_a ){
                            q3_ahead[0] += 1;
                        }else if( q3 < q3_a ){
                            q3_behind[0] += 1;
                        }else{
                            q3_tied[0] += 1;
                        }

                        matchup[findRank(rank,infos[11])][1] += 1;
                    }else if(infos[11] == team){
                        w_l[1] += 1;

                        if( infos[12] == "home"){
                            home[1] += 1;
                        }else{
                            road[1] += 1;
                        }

                        if(streak == ""){
                            streak = "L"
                            streak_count += 1;
                        }else if(streak == "L"){
                            streak_count += 1;
                        }else if(streak == "W"){
                            streak = `W${streak_count}`
                        }

                        if( recent5[0]+recent5[1] < 5) recent5[1] += 1;

                        q2 = parseInt(infos[13])+parseInt(infos[14]);
                        q2_a = parseInt(infos[5])+parseInt(infos[6]);
                        q3 = q2 + parseInt(infos[15]);
                        q3_a = q2_a + parseInt(infos[7]);

                        points = parseInt(infos[18]);
                        points_a = parseInt(infos[10]);

                        if( infos[17] != "-") ot[1] += 1;

                        if( (points_a - points) <= 3 ){
                            less3[1] += 1
                        }else if( (points_a - points) >= 10 ){
                            more10[1] += 1
                        }

                        total_ppg[0] += points;
                        total_ppg[1] += points_a;

                        if( q2 > q2_a ){
                            q2_ahead[1] += 1;
                        }else if( q2 < q2_a ){
                            q2_behind[1] += 1;
                        }else{
                            q2_tied[1] += 1;
                        }

                        if( q3 > q3_a ){
                            q3_ahead[1] += 1;
                        }else if( q3 < q3_a ){
                            q3_behind[1] += 1;
                        }else{
                            q3_tied[1] += 1;
                        }

                        matchup[findRank(rank,infos[3])][2] += 1;
                    }

                });

                if(team == rank[0]){
                    no1 = [w_l[0],w_l[1]];
                    gb = "-"
                }else{
                    gb = ((no1[0] - w_l[0]) + (w_l[1] - no1[1]))/2
                }

                if(ot[0] == 0 & ot[1] == 0) ot = ['',''];
                if(q2_tied[0] == 0 & q2_tied[1] == 0) q2_tied = ['',''];
                if(q3_tied[0] == 0 & q3_tied[1] == 0) q3_tied = ['',''];
                if(less3[0] == 0 & less3[1] == 0) less3 = ['',''];
                if(more10[0] == 0 & more10[1] == 0) more10 = ['',''];


                table_overall.innerHTML += `
                <tr class="filterTr plg showTr">
                    <td class="borderR">${i+1}</td>
                    <td>
                        <img src="../asset/images/men/${team}.png" alt="${team}" class="teamicon">
                        <b>${short_teamName[team]}</b>
                    </td>
                    <td>${w_l[0]+w_l[1]}</td>
                    <td>${w_l[0]}</td>
                    <td>${w_l[1]}</td>
                    <td>${((w_l[0] / (w_l[0]+w_l[1]))*100).toFixed(0)}%</td>
                    <td>${gb}</td>
                    <td class="borderR">${streak}</td>
                    <td class="borderR">${recent5[0]}-${recent5[1]}</td>
                    <td>${home[0]}-${home[1]}</td>
                    <td>${road[0]}-${road[1]}</td>
                    <td class="borderR">${ot[0]}-${ot[1]}</td>
                    <td>${(total_ppg[0]/(w_l[0]+w_l[1])).toFixed(1)}</td>
                    <td>${(total_ppg[1]/(w_l[0]+w_l[1])).toFixed(1)}</td>
                </tr>`

                
                table_ahead.innerHTML += `
                <tr class="filterTr plg showTr">
                    <td class="borderR">${i+1}</td>
                    <td>
                        <img src="../asset/images/men/${team}.png" alt="${team}" class="teamicon">
                        <b>${short_teamName[team]}</b>
                    </td>
                    <td>${w_l[0]+w_l[1]}</td>
                    <td>${w_l[0]}</td>
                    <td>${w_l[1]}</td>
                    <td class="borderR">${((w_l[0] / (w_l[0]+w_l[1]))*100).toFixed(0)}%</td>
                    <td>${q2_ahead[0]}-${q2_ahead[1]}</td>
                    <td>${q2_behind[0]}-${q2_behind[1]}</td>
                    <td class="borderR">${q2_tied[0]}-${q2_tied[1]}</td>
                    <td>${q3_ahead[0]}-${q3_ahead[1]}</td>
                    <td>${q3_behind[0]}-${q3_behind[1]}</td>
                    <td class="borderR">${q3_tied[0]}-${q3_tied[1]}</td>
                    <td>${less3[0]}-${less3[1]}</td>
                    <td>${more10[0]}-${more10[1]}</td>
                </tr>`

                match_standings = ""
                for (let j =0; j<rank.length;j++){
                    if(j == i){
                        matchup[j][1] = ""
                        matchup[j][2] = ""
                    }
                    match_standings += `<td>${matchup[j][1]}-${matchup[j][2]}`
                }
                table.innerHTML += `
                <tbody>
                    <tr>
                        <td class="borderR">${i+1}</td>
                        <td>
                            <img src="../asset/images/men/${team}.png" alt="${team}" class="teamicon">
                            <b>${short_teamName[team]}</b>
                        </td>
                        <td>${w_l[0]+w_l[1]}</td>
                        <td>${w_l[0]}</td>
                        <td>${w_l[1]}</td>
                        <td>${((w_l[0] / (w_l[0]+w_l[1]))*100).toFixed(0)}%</td>
                        <td>${gb}</td>
                        <td class="borderR">${streak}</td>
                        ${match_standings}
                    </tr>
                </tbody>`
            }
            document.getElementById('league-dropdown').getElementsByClassName('dropdown-item')[0].click();

		});
        
});