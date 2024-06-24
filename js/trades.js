$(document).ready(function () {
    fetch('../data/trades.csv')
        .then((response) => response.text())
        .then((result) => {

            lines = result.split('\n');
            lines = lines.slice(2);

            table = document.getElementById('trades_tbody');

            lines.forEach(trade => {
                infos = trade.split(',');

                let [
                    gender,
                    team_filter,
                    trade_filter,
                    date,
                    season,
                    content,
                    futurePick_content,
                    content2

                ] = infos;

                filter = '';
                if (team_filter.includes("index")) {
                    table.innerHTML += `
                        <tr class="filterTr ${gender} ${team_filter} ${trade_filter} player draft">
                            <td colspan="3" style="font-size:120%; background-color:#1B1B1B;">${content}</td>
                        </tr>`
                } else {
                    trade = content;
                    if (futurePick_content != '') {
                        trade += `<span style="color:red;"> ${futurePick_content} </span>${content2}`
                        filter += ' futurePick'
                    }

                    table.innerHTML += `
                        <tr class="filterTr ${gender} ${team_filter} ${trade_filter} ${filter}">
                            <td class="textR">${date}</td>
                            <td class="textL borderR">(${season})</td>
                            <td style="text-align:left;">${trade}</td>
                        </tr>`
                }
            });
            document.getElementById('gender-dropdown').getElementsByClassName('dropdown-item')[0].click();
        });


    add_team_dropdown("team-dropdown", "men", 'all');

    var genders = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item");
    var genderbtn = document.getElementById("genderbtn");
    var teams = document.getElementById("team-dropdown").getElementsByClassName("dropdown-item");
    var trades = document.getElementById("trade-dropdown").getElementsByClassName("dropdown-item");
    var teambtn = document.getElementById("teambtn");
    var tradebtn = document.getElementById("tradebtn");

    for (var i = 0; i < genders.length; i++) {
        genders[i].addEventListener("click", function () {
            var currentGender = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item active");
            currentGender[0].className = currentGender[0].className.replace(" active", "");
            this.className += " active";
            genderbtn.innerHTML = this.innerHTML;

            f('filter');
        });
    }

    for (var i = 0; i < teams.length; i++) {
        teams[i].addEventListener("click", function () {
            var currentTeam = document.getElementById("team-dropdown").getElementsByClassName("active");
            currentTeam[0].className = currentTeam[0].className.replace(" active", "");
            this.className += " active";
            teambtn.innerHTML = this.innerHTML;

            trades[0].click();
        });
    }

    for (var i = 0; i < trades.length; i++) {
        trades[i].addEventListener("click", function () {
            currentTrade = document.getElementById("trade-dropdown").getElementsByClassName("active");
            currentTrade[0].className = currentTrade[0].className.replace(" active", "");
            this.className += " active";
            tradebtn.innerHTML = this.innerHTML;

            f('filter');
        });
    }
});