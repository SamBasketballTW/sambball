$(document).ready(function () {
    all_t = [
        ['plg', 1, 'pilots'],
        ['plg', 2, 'dreamers'],
        ['plg', 3, 'kings'],
        ['plg', 4, 'lioneers'],

        ['t1', 1, 'dea'],
        ['t1', 2, 'leopards'],
        ['t1', 3, 'aquas'],
        ['t1', 4, 'mars'],

        ['sbl', 1, 'beer'],
        ['sbl', 2, 'bank'],
        ['sbl', 3, 'yulon'],

        ['wsbl', 1, 'taiyuen'],
        ['wsbl', 2, 'cathay'],
        ['wsbl', 3, 'taipower']
    ]

    all_p = [
        ['plg', 1, 4, '1_4', 4, 4, 2, 'finals', 0],
        ['plg', 2, 3, '2_3', 4, 2, 3, 'finals', 1],
        ['plg', 0, 0, 'finals', 4, 0, 0],

        ['t1', 1, 4, '1_4', 3, 2, 3, 'finals', 0],
        ['t1', 2, 3, '2_3', 3, 3, 0, 'finals', 1],
        ['t1', 0, 0, 'finals', 4, 0, 4],


        ['sbl', 2, 3, '2_3', 2, 1, 2, 'finals', 1],
        ['sbl', 1, 0, 'finals', 2, 1, 2],

        ['wsbl', 2, 3, '2_3', 2, 2, 0, 'finals', 1],
        ['wsbl', 1, 0, 'finals', 2, 1, 2]

    ]
    plg_t = [
        [1, 'pilots'],
        [2, 'dreamers'],
        [3, 'kings'],
        [4, 'lioneers']
    ];
    plg_p = [
        [1, 4, 'plg_1_4', 4, 4, 2, 'plg_finals', 0],
        [2, 3, 'plg_2_3', 4, 2, 3, 'plg_finals', 1],
        [0, 0, 'plg_finals', 4, 0, 0]
    ];

    t1_t = [
        [1, 'dea'],
        [2, 'leopards'],
        [3, 'aquas'],
        [4, 'mars']
    ];
    t1_p = [
        [1, 4, 't1_1_4', 3, 2, 3, 't1_finals', 0],
        [2, 3, 't1_2_3', 3, 3, 0, 't1_finals', 1],
        [0, 0, 't1_finals', 4, 0, 4]
    ];

    sbl_t = [
        [1, 'beer'],
        [2, 'bank'],
        [3, 'yulon']
    ];

    sbl_p = [
        [2, 3, 'sbl_2_3', 2, 1, 2, 'sbl_finals', 1],
        [1, 0, 'sbl_finals', 2, 1, 2]
    ];

    wsbl_t = [
        [1, 'taiyuen'],
        [2, 'cathay'],
        [3, 'taipower']
    ];
    wsbl_p = [
        [2, 3, 'wsbl_2_3', 2, 2, 0, 'wsbl_finals', 1],
        [1, 0, 'wsbl_finals', 2, 1, 2]
    ];

    league = ['plg', 't1', 'sbl', 'wsbl'];
    all_t = [plg_t, t1_t, sbl_t, wsbl_t];
    all_p = [plg_p, t1_p, sbl_p, wsbl_p];

    for (let i = 0; i < league.length; i++) {
        if (league[i] == 'wsbl') {
            gender = 'women'
        } else {
            gender = 'men'
        }

        for (let j = 0; j < all_p[i].length; j++) {
            t1_rank = all_p[i][j][0]
            t2_rank = all_p[i][j][1]
            series = all_p[i][j][2];
            series_w = all_p[i][j][3];
            t1_s = all_p[i][j][4];
            t2_s = all_p[i][j][5];
            t1_w = '';
            t2_w = '';

            if (t1_rank != 0) {
                team1 = all_t[i][t1_rank - 1][1];
            }
            if (t2_rank != 0) {
                team2 = all_t[i][t2_rank - 1][1];
            }
            table = document.getElementById(series);

            if (series == 'finals') {
                s = `冠軍賽`
            } else {
                s = `系列賽`
            }

            if (t1_s == t2_s) {
                result = `${s}平手`
            } else {
                lead = '領先';
                if (t1_s > t2_s) {
                    if (t1_s == series_w) {
                        t1_w = 'W';
                        t2_w = 'L';
                        lead = '贏下';
                        if(series != 'finals'){

                            next_series = all_p[i][j][6];
                            next_series_spot = all_p[i][j][7];

                            for(let k=0;k<all_p[i].length;k++){
                                if(all_p[i][k][2] == next_series){
                                    all_p[i][k][next_series_spot] = t1_rank;
                                }
                            }
                        }
                    }
                    result = `${teamName_short_CN[team1]} ${lead}${s}`;
                } else if (t2_s > t1_s) {
                    if (t2_s == series_w) {
                        t1_w = 'L';
                        t2_w = 'W';
                        lead = '贏下';
                        if(series != 'finals'){

                            next_series = all_p[i][j][6];
                            next_series_spot = all_p[i][j][7];

                            for(let k=0;k<all_p[i].length;k++){
                                if(all_p[i][k][2] == next_series){
                                    all_p[i][k][next_series_spot] = t2_rank;
                                }
                            }
                        }
                    }
                    result = `${teamName_short_CN[team2]} ${lead}${s}`;
                }
            }
            teams = [team1, team2];
            ranks = [t1_rank, t2_rank];
            ws = [t1_w, t2_w];
            for (let k = 0; k < 2; k++) {

                if (ranks[k] == 0 & teams[k] == '') {
                    table.innerHTML += `<tr><td class="textL">${ranks[k]} - 未知</td></tr>`
                } else if (ranks[k] == 0) {
                    table.innerHTML += `<tr><td class="textL">未知</td></tr>`
                } else {
                    temp1 = '';
                    temp2 = '';
                    temp3 = '';
                    if (ws[k] == "W") {
                        temp1 = 'style="border-right:5px solid black"'
                    } else if (ws[k] == "L") {
                        temp2 = 'style="color:#9d9a9a"'
                        temp3 = 'style="opacity:0.6"'
                    }
                    table.innerHTML += `
                    <tr>
                        <td class="textL" ${temp1}>
                            <a href="${team_link[teams[k]]}" target="_blank" ${temp2}>${ranks[k]} -
                                <img src="./asset/images/${gender}/${teams[k]}.png" alt="${teams[k]}"
                                    class="teamicon" ${temp3}>${teamName_full_CN[teams[k]]}</a>
                        </td>
                    </tr>`
                }

            }
            table.innerHTML += `
            <tr>
                <td class="textL">${result} ${Math.max(t1_s, t2_s)}-${Math.min(t1_s, t2_s)}</td>
            </tr>`

        }
    }
});