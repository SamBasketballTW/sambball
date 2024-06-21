$(document).ready(function () {
    fetch('../data/trades.csv')
        .then((response) => response.text())
        .then((result) => {

            lines = result.split('\n');
            lines = lines.slice(2);

            table = document.getElementById('trades_tbody');

            lines.forEach(trade => {
                infos = trade.split(',');
                info = ""

                if (infos[1].includes("index")) {
                    info += `
                        <tr class="filterTr ${infos[0]} ${infos[1]} ${infos[2]} player draft">
                            <td colspan="3" style="font-size:120%; background-color:#1B1B1B;">${infos[5]}</td>
                        </tr>`
                } else {
                    trade = infos[5];
                    for (let i = 6; i < infos.length - 1; i += 2) {
                        if (infos[i] != "") {
                            trade += `<span style="color:red;"> ${infos[i]} </span>${infos[i + 1]}`;
                        }
                    }
                    filter = ''
                    if (infos[6] != "") filter += 'futurePick'

                    info += `
                        <tr class="filterTr ${infos[0]} ${infos[1]} ${infos[2]} ${filter}">
                            <td class="textR">${infos[3]}</td>
                            <td class="textL borderR">(${infos[4]})</td>
                            <td style="text-align:left;">${trade}</td>
                        </tr>`
                }

                table.innerHTML += info;
            });
            document.getElementById('gender-dropdown').getElementsByClassName('dropdown-item')[0].click();
        });


    add_team_dropdown("team-dropdown", "men",'all');

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