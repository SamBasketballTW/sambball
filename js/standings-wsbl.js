$(document).ready(function () {
	fetch('../data/standings-wsbl.csv')
		.then((response) => response.text())
		.then((result) => {

			lines = result.split('\n');
			lines = lines.slice(2);

            table_overall = document.getElementById('overall_tbody');
            table_points = document.getElementById('points_tbody');
            table_ahead = document.getElementById('ahead_tbody');
            table = document.getElementById('wsbl_tb');
            table_calendar = document.getElementById('calendar_wsbl_tbody');

            rank = ['taiyuen','cathay','telecom','power'];
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
                home = ['',''];
                road = ['',''];
                ot = [0,0];
                total_pts = [0,0];
                total_pa = [0,0];
                total_q1 = 0;
                total_q2 = 0;
                total_q3 = 0;
                total_q4 = 0;
                q2_ahead = [0,0];
                q2_behind = [0,0];
                q2_tied = [0,0];
                q3_ahead = [0,0];
                q3_behind = [0,0];
                q3_tied = [0,0];
                less3 = [0,0];
                more10 = [0,0];
                lunar = [ [0,0] , [0,0] ];
                cal = [];
                for( let i=0; i<12; i++) cal.push([0,0]);
                matchup = [];
                for( let i=0; i<rank.length; i++) matchup.push([rank[i],0,0]);
    
                lines.forEach(player => {
                    infos = player.split(',');
                    info = ""

                    var currentDate = new Date(infos[2]);
                    var lunarDate = new Date('2024/2/9');

                    if(infos[3] == team){
                        matchup[findRank(rank,infos[11])][1] += 1;
                        w_l[0] += 1;

                        cal[currentDate.getMonth()][0] += 1;
                        if(currentDate < lunarDate){
                            lunar[0][0] += 1;
                        }else{
                            lunar[1][0] += 1;
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

                        // if( infos[4] == "home"){
                        //     home[0] += 1;
                        // }else{
                        //     road[0] += 1;
                        // }

                        if(infos[9] != "-") ot[0] += 1;

                        total_q1 += parseInt(infos[5]) - parseInt(infos[13]);
                        total_q2 += parseInt(infos[6]) - parseInt(infos[14]);
                        total_q3 += parseInt(infos[7]) - parseInt(infos[15]);
                        total_q4 += parseInt(infos[8]) - parseInt(infos[16]);
                        total_pts[0] += parseInt(infos[10]);
                        total_pa[0] += parseInt(infos[18]);

                        q2 = parseInt(infos[5])+parseInt(infos[6]);
                        q2_a = parseInt(infos[13])+parseInt(infos[14]);
                        q3 = q2 + parseInt(infos[7]);
                        q3_a = q2_a + parseInt(infos[15]);

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

                        if( (parseInt(infos[10]) - parseInt(infos[18])) <= 3 ){
                            less3[0] += 1
                        }else if( (parseInt(infos[10]) - parseInt(infos[18])) >= 10 ){
                            more10[0] += 1
                        }



                    }else if(infos[11] == team){
                        matchup[findRank(rank,infos[3])][2] += 1;
                        w_l[1] += 1;

                        var currentDate = new Date(infos[2]);
                        var lunarDate = new Date('2024/2/9');
                        cal[currentDate.getMonth()][1] += 1;
                        if(currentDate < lunarDate){
                            lunar[0][1] += 1;
                        }else{
                            lunar[1][1] += 1;
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

                        // if( infos[12] == "home"){
                        //     home[1] += 1;
                        // }else{
                        //     road[1] += 1;
                        // }

                        if( infos[17] != "-") ot[1] += 1;

                        total_q1 += parseInt(infos[13]) - parseInt(infos[5]);
                        total_q2 += parseInt(infos[14]) - parseInt(infos[6]);
                        total_q3 += parseInt(infos[15]) - parseInt(infos[7]);
                        total_q4 += parseInt(infos[16]) - parseInt(infos[8]);
                        total_pts[1] += parseInt(infos[18]);
                        total_pa[1] += parseInt(infos[10]);

                        q2 = parseInt(infos[13])+parseInt(infos[14]);
                        q2_a = parseInt(infos[5])+parseInt(infos[6]);
                        q3 = q2 + parseInt(infos[15]);
                        q3_a = q2_a + parseInt(infos[7]);

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

                        if( (parseInt(infos[10]) - parseInt(infos[18])) <= 3 ){
                            less3[1] += 1
                        }else if( (parseInt(infos[10]) - parseInt(infos[18])) >= 10 ){
                            more10[1] += 1
                        }

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
                <tr class="filterTr wsbl showTr">
                    <td class="borderR">${i+1}</td>
                    <td style="text-align:left">
                        <img src="../asset/images/women/${team}.png" alt="${team}" class="teamicon">
                        <b>${short_teamName[team]}<a style="font-size:12px">${playoff[team]}</a></b>
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
                    <td>${( (total_pts[0]+total_pts[1]) / (w_l[0]+w_l[1]) ).toFixed(1)}</td>
                    <td>${( (total_pa[0]+total_pa[1]) / (w_l[0]+w_l[1]) ).toFixed(1)}</td>
                </tr>`

                table_points.innerHTML += `
                <tr class="filterTr wsbl showTr">
                    <td class="borderR">${i+1}</td>
                    <td style="text-align:left">
                        <img src="../asset/images/women/${team}.png" alt="${team}" class="teamicon">
                        <b>${short_teamName[team]}<a style="font-size:12px">${playoff[team]}</a></b>
                    </td>
                    <td>${w_l[0]+w_l[1]}</td>
                    <td>${w_l[0]}</td>
                    <td>${w_l[1]}</td>
                    <td class="borderR">${((w_l[0] / (w_l[0]+w_l[1]))*100).toFixed(0)}%</td>
                    <td>${( (total_pts[0]+total_pts[1]) / (w_l[0]+w_l[1]) ).toFixed(1)}</td>
                    <td class="borderR">${( (total_pa[0]+total_pa[1]) / (w_l[0]+w_l[1]) ).toFixed(1)}</td>
                    <td>${( total_q1 / (w_l[0]+w_l[1]) ).toFixed(1)}</td>
                    <td>${( total_q2 / (w_l[0]+w_l[1]) ).toFixed(1) }</td>
                    <td>${( total_q3 / (w_l[0]+w_l[1]) ).toFixed(1) }</td>
                    <td class="borderR">${(total_q4 / (w_l[0]+w_l[1]) ).toFixed(1) }</td>
                    <td>${( total_pts[0] / w_l[0] ).toFixed(1)}</td>
                    <td class="borderR">${( total_pts[1] / w_l[1] ).toFixed(1)}</td>
                    <td>${( total_pa[0] / w_l[0] ).toFixed(1)}</td>
                    <td>${( total_pa[1] / w_l[1] ).toFixed(1)}</td>
                </tr>`

                
                table_ahead.innerHTML += `
                <tr class="filterTr wsbl showTr">
                    <td class="borderR">${i+1}</td>
                    <td style="text-align:left">
                        <img src="../asset/images/women/${team}.png" alt="${team}" class="teamicon">
                        <b>${short_teamName[team]}<a style="font-size:12px">${playoff[team]}</a></b>
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
                        <td style="text-align:left">
                            <img src="../asset/images/women/${team}.png" alt="${team}" class="teamicon">
                            <b>${short_teamName[team]}<a style="font-size:12px">${playoff[team]}</a></b>
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

                table_calendar.innerHTML += `
                <tr class="filterTr wsbl showTr">
                    <td class="borderR">${i+1}</td>
                    <td style="text-align:left">
                        <img src="../asset/images/women/${team}.png" alt="${team}" class="teamicon">
                        <b>${short_teamName[team]}<a style="font-size:12px">${playoff[team]}</a></b>
                    </td>
                    <td>${w_l[0]+w_l[1]}</td>
                    <td>${w_l[0]}</td>
                    <td>${w_l[1]}</td>
                    <td class="borderR">${((w_l[0] / (w_l[0]+w_l[1]))*100).toFixed(0)}%</td>
                    <td>${lunar[0][0]}-${lunar[0][1]}</td>
                    <td class="borderR">${lunar[1][0]}-${lunar[1][1]}</td>
                    <td>${cal[0][0]}-${cal[0][1]}</td>
                    <td>${cal[1][0]}-${cal[1][1]}</td>
                    <td>${cal[2][0]}-${cal[2][1]}</td>
                    <td>${cal[3][0]}-${cal[3][1]}</td>
                </tr>`
            }
		});
});
