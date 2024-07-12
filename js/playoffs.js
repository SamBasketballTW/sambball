class PlayoffGame {
    constructor(team1 = '', team2 = '', series, games_to_win, team1_wins, team2_wins, next_series = '', next_series_spot = 0) {
        this.team1 = team1;
        this.team2 = team2;
        this.series = series;
        this.games_to_win = games_to_win;
        this.team1_wins = team1_wins;
        this.team2_wins = team2_wins;
        this.next_series = next_series;
        this.next_series_spot = next_series_spot
    }
}
class PlayoffTeam {
    constructor(rank, team = '') {
        this.rank = rank;
        this.team = team;
    }
}
$(document).ready(function () {
    plg_rank1 = new PlayoffTeam(1, pilots);
    plg_rank2 = new PlayoffTeam(2, dreamers);
    plg_rank3 = new PlayoffTeam(3, kings);
    plg_rank4 = new PlayoffTeam(4, lioneers);

    t1_rank1 = new PlayoffTeam(1, dea);
    t1_rank2 = new PlayoffTeam(2, leopards);
    t1_rank3 = new PlayoffTeam(3, aquas);
    t1_rank4 = new PlayoffTeam(4, mars);

    sbl_rank1 = new PlayoffTeam(1, beer);
    sbl_rank2 = new PlayoffTeam(2, bank);
    sbl_rank3 = new PlayoffTeam(3, yulon);

    wsbl_rank1 = new PlayoffTeam(1, taiyuen);
    wsbl_rank2 = new PlayoffTeam(2, cathay);
    wsbl_rank3 = new PlayoffTeam(3, taipower);

    allGames = [
        plg_1_4 = new PlayoffGame(plg_rank1, plg_rank4, 'plg_1-4', 4, 4, 2, 'plg_finals', 1),
        plg_2_3 = new PlayoffGame(plg_rank2, plg_rank3, 'plg_2-3', 4, 2, 4, 'plg_finals', 2),
        plg_finals = new PlayoffGame('', '', 'plg_finals', 4, 1, 4),

        t1_1_4 = new PlayoffGame(t1_rank1, t1_rank4, 't1_1-4', 3, 2, 3, 't1_finals', 1),
        t1_2_3 = new PlayoffGame(t1_rank2, t1_rank3, 't1_2-3', 3, 3, 0, 't1_finals', 2),
        t1_finals = new PlayoffGame('', '', 't1_finals', 4, 0, 4),

        sbl_2_3 = new PlayoffGame(sbl_rank2, sbl_rank3, 'sbl_2-3', 2, 1, 2, 'sbl_finals', 2),
        sbl_finals = new PlayoffGame(sbl_rank1, '', 'sbl_finals', 3, 2, 3),

        wsbl_2_3 = new PlayoffGame(wsbl_rank2, wsbl_rank3, 'wsbl_2-3', 2, 2, 0, 'wsbl_finals', 2),
        wsbl_finals = new PlayoffGame(wsbl_rank1, '', 'wsbl_finals', 3, 1, 3)
    ]

    for (let i = 0; i < allGames.length; i++) {
        team1 = allGames[i].team1;
        team2 = allGames[i].team2;
        series = allGames[i].series;
        games_to_win = allGames[i].games_to_win;
        team1_wins = allGames[i].team1_wins;
        team2_wins = allGames[i].team2_wins;
        team1_result = '';
        team2_result = '';


        table = document.getElementById(series);

        if (allGames[i].next_series == '') {
            s = `冠軍賽`
        } else {
            s = `系列賽`
        }

        if (allGames[i].team1_wins == allGames[i].team2_wins) {
            result = `${s}平手`
        } else {
            lead = '領先';
            if (team1_wins > team2_wins) {
                if (team1_wins == games_to_win) {
                    team1_w = 'W';
                    team2_w = 'L';
                    lead = '贏下';
                    next_series = allGames[i].next_series;
                    spot = allGames[i].next_series_spot;

                    for (let j = i; j < allGames.length; j++) {
                        if (allGames[j].series == next_series) {
                            if (spot == 1) {
                                allGames[j].team1 = team1;
                            } else if (spot == 2) {
                                allGames[j].team2 = team1;
                            }
                        }
                    }
                    team1_result = 'W';
                    team2_result = 'L';
                }
                result = `${teamName('short', '', team1.team.id)} ${lead}${s}`;
            } else if (team2_wins > team1_wins) {
                if (team2_wins == games_to_win) {
                    team1_w = 'L';
                    team2_w = 'W';
                    lead = '贏下';
                    next_series = allGames[i].next_series;
                    spot = allGames[i].next_series_spot;

                    for (let j = i; j < allGames.length; j++) {
                        if (allGames[j].series == next_series) {
                            if (spot == 1) {
                                allGames[j].team1 = team2;
                            } else if (spot == 2) {
                                allGames[j].team2 = team2;
                            }
                        }
                    }
                    team1_result = 'L';
                    team2_result = 'W';
                }
                result = `${teamName('short', '', team2.team.id)} ${lead}${s}`;
            }

        }
        for (let j = 0; j < 2; j++) {
            if (j == 0) {
                currentTeam = team1;
                currentResult = team1_result;
            } else {
                currentTeam = team2;
                currentResult = team2_result;
            }

            if (currentTeam == '') {
                table.innerHTML += `<tr><td class="textL">未知</td></tr>`
            } else if (currentTeam.team == '') {
                table.innerHTML += `<tr><td class="textL">${currentTeam.rank} - 未知</td></tr>`
            } else {
                temp1 = '';
                temp2 = '';
                temp3 = '';
                if (currentResult == 'W') {
                    temp1 = 'style="border-right:5px solid black"'
                } else if (currentResult == "L") {
                    temp2 = 'style="color:#9d9a9a"'
                    temp3 = 'style="opacity:0.6"'
                }
                table.innerHTML += `
                <tr>
                    <td class="textL" ${temp1}>
                        <a href="${currentTeam.team.url}" target="_blank" ${temp2}>${currentTeam.rank} -
                            <img src="./asset/images/${currentTeam.team.gender}/${currentTeam.team.id}.png" alt="${currentTeam.team.id}"
                                class="teamicon" ${temp3}>${teamName('full', '', currentTeam.team.id)}</a>
                    </td>
                </tr>`
            }
        }
        table.innerHTML += `
        <tr>
            <td class="textL">${result} ${Math.max(team1_wins, team2_wins)}-${Math.min(team1_wins, team2_wins)}</td>
        </tr>`

    }
});