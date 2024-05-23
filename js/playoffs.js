$(document).ready(function () {
    plg_t = [[1,'pilots',''],[2,'dreamers',''],[3,'kings',''],[4,'lioneers','']];
    plg_playoffs = [['1_4',1,0],['2_3',0,0]];
    plg_f = [];
    plg_finals = [0,0];

    t1_t = [[1,'dea',''],[2,'leopards',''],[3,'aquas',''],[4,'mars','']];
    t1_playoffs = [['1_4',2,3],['2_3',3,0]];
    t1_f = [[2,'leopards',''],[4,'mars','']];
    // t1_f = [];
    t1_finals = [0,0];

    sbl_t = [[2,'bank',''],[3,'yulon','']];
    sbl_playoffs = [['2_3',1,2]];
    sbl_f = [[1,'beer',''],[3,'yulon','']];
    // sbl_f = [[1,'beer','']];
    sbl_finals = [1,2];

    wsbl_t = [[2,'cathay',''],[3,'taipower','']];
    wsbl_playoffs = [['2_3',2,0]];
    wsbl_f = [[1,'taiyuen',''],[3,'cathay','']];
    // wsbl_f = [[1,'taiyuen','']];
    wsbl_finals = [1,2];

    league = ['plg','t1','sbl','wsbl'];
    all_t = [plg_t,t1_t,sbl_t,wsbl_t];
    all_p = [plg_playoffs,t1_playoffs,sbl_playoffs,wsbl_playoffs];
    win_p = [4,3,2,2];
    all_f = [plg_f,t1_f,sbl_f,wsbl_f];
    all_finals = [plg_finals,t1_finals,sbl_finals,wsbl_finals];
    win_f = [4,4,2,2];

    for(let i = 0;i<league.length;i++){
        if(league[i] == 'wsbl'){
            gender = 'women'
        }else{
            gender = 'men'
        }
        for(let j = 0;j<all_p[i].length;j++){
            table = document.getElementById(`${league[i]}_${all_p[i][j][0]}`);

            if(all_p[i][j][1] == all_p[i][j][2]){
                series = `系列賽平手`
            }else{
                if(all_p[i][j][1] > all_p[i][j][2]){
                    if(all_p[i][j][1] == win_p[i]){
                        all_t[i][j][2] = 'W';
                        all_t[i][(all_t[i].length-1)-j][2] = 'L';
                        lead = '贏下'

                        // if(all_f[i].length == 0){
                        //     all_f[i].splice(0,0,[all_t[i][j][0],all_t[i][j][1],'']);
                        // }else{
                        //     for(let k = 0; k <all_f[i].length;k++){
                        //         if(all_f[i][k][0] > all_p[i][j][0]){
                        //             all_f[i].splice(k,0,[all_t[i][j][0],all_t[i][j][1],'']);
                        //         }else if(k==all_f[i].length-1){
                        //             all_f[i].splice(k+1,0,[all_t[i][j][0],all_t[i][j][1],'']);
                        //         }
                        //     }
                        // }
                    }else{
                        lead = '領先'
                    }
                    team = all_t[i][j][1];
                }else if(all_p[i][j][1] < all_p[i][j][2]){
                    if(all_p[i][j][2] == win_p[i]){
                        all_t[i][j][2] = 'L';
                        all_t[i][(all_t[i].length-1)-j][2] = 'W';
                        lead = '贏下'

                        // if(all_f[i].length == 0){
                        //     all_f[i].splice(0,0,[all_t[i][(all_t[i].length-1)-j][0],all_t[i][(all_t[i].length-1)-j][1],'']);
                        // }else{
                        //     for(let k = 0; k <all_f[i].length;k++){
                        //         if(all_f[i][k][0] > all_p[i][(all_t[i].length-1)-j][0]){
                        //             all_f[i].splice(k,0,[all_t[i][(all_t[i].length-1)-j][0],all_t[i][(all_t[i].length-1)-j][1],'']);
                        //         }else if(k==all_f[i].length-1){
                        //             all_f[i].splice(k+1,0,[all_t[i][(all_t[i].length-1)-j][0],all_t[i][(all_t[i].length-1)-j][1],'']);
                        //         }
                        //     }
                        // }
                    }else{
                        lead = '領先'
                    }
                    team = all_t[i][(all_t[i].length-1)-j][1];
                }
                series = `${teamName_short_CN[team]} ${lead}系列賽`
            }
            table.innerHTML += `<td class="textL">${series} ${Math.max(all_p[i][j][1],all_p[i][j][2])}-${Math.min(all_p[i][j][1],all_p[i][j][2])}</td>`
        }
        for(let j = 0;j<all_t[i].length;j++){
            team = all_t[i][j][1];
            table = document.getElementById(`${league[i]}_${all_t[i][j][0]}`);

            if (team == '') {
                table.innerHTML = `<td class="textL">${all_t[i][j][0]} - 未知</td>`
            } else {
                temp1 = '';
                temp2 = '';
                temp3 = '';
                if (all_t[i][j][2] == "W") {
                    temp1 = `style="border-right:5px solid black"`
                } else if (all_t[i][j][2] == "L") {
                    temp2 = `style="color:#9d9a9a"`
                    temp3 = `style="opacity:0.6"`
                }
                table.innerHTML = `
                <td class="textL" ${temp1}>
                    <a href="${team_link[team]}" target="_blank" ${temp2}>${all_t[i][j][0]} -
                        <img src="./asset/images/${gender}/${team}.png" alt="${team}"
                            class="teamicon" ${temp3}>${teamName_full_CN[team]}</a>
                </td>`
            }
        }
    }
    for(let i = 0;i<league.length;i++){
        if(league[i] == 'wsbl'){
            gender = 'women'
        }else{
            gender = 'men'
        }
        table = document.getElementById(`${league[i]}_finals`);

        if(all_finals[i][0] == all_finals[i][1]){
            series = `冠軍賽平手`
        }else{
            if(all_finals[i][0] > all_finals[i][1]){
                if(all_finals[i][0] == win_f[i]){
                    all_f[i][0][2] = 'W';
                    all_f[i][1][2] = 'L';
                    lead = '贏下'
                }else{
                    lead = '領先'
                }
                team = all_f[i][0][1];
            }else if(all_finals[i][0] < all_finals[i][1]){
                if(all_finals[i][1] == win_f[i]){
                    all_f[i][0][2] = 'L';
                    all_f[i][1][2] = 'W';
                    lead = '贏下'
                }else{
                    lead = '領先'
                }
                team = all_f[i][1][1];
            }
                series = `${teamName_short_CN[team]} ${lead}冠軍賽`
            }
            table.innerHTML += `<td class="textL">${series} ${Math.max(all_finals[i][0],all_finals[i][1])}-${Math.min(all_finals[i][0],all_finals[i][1])}</td>`
        for(let j = 0;j<2;j++){
            if(all_f[i].length == 0){
                team = '';
            }else{
                team = all_f[i][j][1];
            }
            table = document.getElementById(`${league[i]}_finals_${j+1}`);

            if (team == '') {
                table.innerHTML = `<td class="textL">未知</td>`
            } else {
                temp1 = '';
                temp2 = '';
                temp3 = '';
                if (all_f[i][j][2] == "W") {
                    temp1 = `style="border-right:5px solid black"`
                } else if (all_f[i][j][2] == "L") {
                    temp2 = `style="color:#9d9a9a"`
                    temp3 = `style="opacity:0.6"`
                }
                table.innerHTML = `
                <td class="textL" ${temp1}>
                    <a href="${team_link[team]}" target="_blank" ${temp2}>${all_f[i][j][0]} -
                        <img src="./asset/images/${gender}/${team}.png" alt="${team}"
                            class="teamicon" ${temp3}>${teamName_full_CN[team]}</a>
                </td>`
            }
        }
    }
});