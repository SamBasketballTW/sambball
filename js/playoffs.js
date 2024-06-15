$(document).ready(function () {
    all_p = [
        ['plg', 1, 4, '1_4', 4, 4, 2, 'finals', 1],
        ['plg', 2, 3, '2_3', 4, 2, 4, 'finals', 2],
        ['plg', 0, 0, 'finals', 4, 1, 2],

        ['t1', 1, 4, '1_4', 3, 2, 3, 'finals', 1],
        ['t1', 2, 3, '2_3', 3, 3, 0, 'finals', 2],
        ['t1', 0, 0, 'finals', 4, 0, 4],

        ['sbl', 2, 3, '2_3', 2, 1, 2, 'finals', 2],
        ['sbl', 1, 0, 'finals', 3, 2, 3],

        ['wsbl', 2, 3, '2_3', 2, 2, 0, 'finals', 2],
        ['wsbl', 1, 0, 'finals', 3, 1, 3]
    ]
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


    for (let i = 0; i < all_p.length; i++) {
        league = all_p[i][0];
        t1_rank = all_p[i][1];
        t2_rank = all_p[i][2];
        series = all_p[i][3];
        series_w = all_p[i][4];
        t1_s = all_p[i][5];
        t2_s = all_p[i][6];
        t1_w = '';
        t2_w = '';

        if (league == 'plg') {
            team1_i = t1_rank - 1;
            team2_i = t2_rank - 1;
            gender = "men"
        } else if (league == 't1') {
            team1_i = t1_rank + 3;
            team2_i = t2_rank + 3;
            gneder = "men"
        } else if (league == 'sbl') {
            team1_i = t1_rank + 7;
            team2_i = t2_rank + 7;
            gender = "men"
        } else if (league == 'wsbl') {
            team1_i = t1_rank + 10;
            team2_i = t2_rank + 10;
            gender = "women"
        }

        if (t1_rank != 0) team1 = all_t[team1_i][2]
        if (t2_rank != 0) team2 = all_t[team2_i][2]

        table = document.getElementById(league + '_' + series);

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
                    if (series != 'finals') {
                        next_series = all_p[i][7];
                        spot = all_p[i][8];

                        for (let j = i; j < all_p.length; j++) {
                            if (all_p[j][0] == league & all_p[j][3] == next_series) {
                                all_p[j][spot] = t1_rank;
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
                    if (series != 'finals') {
                        next_series = all_p[i][7];
                        spot = all_p[i][8];

                        for (let j = i; j < all_p.length; j++) {
                            if (all_p[j][0] == league & all_p[j][3] == next_series) {
                                all_p[j][spot] = t2_rank;
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
        for (let j = 0; j < 2; j++) {

            if (teams[j] == '') {
                table.innerHTML += `<tr><td class="textL">${ranks[j]} - 未知</td></tr>`
            } else if (ranks[j] == 0) {
                table.innerHTML += `<tr><td class="textL">未知</td></tr>`
            } else {
                temp1 = '';
                temp2 = '';
                temp3 = '';
                if (ws[j] == "W") {
                    temp1 = 'style="border-right:5px solid black"'
                } else if (ws[j] == "L") {
                    temp2 = 'style="color:#9d9a9a"'
                    temp3 = 'style="opacity:0.6"'
                }
                table.innerHTML += `
                    <tr>
                        <td class="textL" ${temp1}>
                            <a href="${team_link[teams[j]]}" target="_blank" ${temp2}>${ranks[j]} -
                                <img src="./asset/images/${gender}/${teams[j]}.png" alt="${teams[j]}"
                                    class="teamicon" ${temp3}>${teamName_full_CN[teams[j]]}</a>
                        </td>
                    </tr>`
            }

        }
        table.innerHTML += `
            <tr>
                <td class="textL">${result} ${Math.max(t1_s, t2_s)}-${Math.min(t1_s, t2_s)}</td>
            </tr>`

    }
});