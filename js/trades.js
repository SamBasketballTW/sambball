$(document).ready(function () {
    men_html = document.getElementById("men_page");
    women_html = document.getElementById("women_page");

    if (men_page) {
        gender = "men";
    } else if (women_page) {
        gender = "women";
    }

    fetch('../data/trades.csv')
        .then((response) => response.text())
        .then((result) => {

            lines = result.split('\n');
            lines = lines.slice(2);

            table = document.getElementById('trades_tbody');

            lines.forEach(trade => {
                infos = trade.split(',');
                info = ""

                if (infos[0].includes("index")) {
                    info += `
                        <tr class="filterTr ${infos[0]} player draft showTr">
                            <td colspan="3" style="font-size:120%; background-color:#1B1B1B;">${infos[4]}</td>
                        </tr>`
                } else {
                    trade = infos[4];
                    for (let i = 5; i < infos.length - 1; i += 2) {
                        if (infos[i] != "") {
                            trade += `<span style="color:red;"> ${infos[i]} </span>${infos[i + 1]}`;
                        }
                    }

                    info += `
                        <tr class="filterTr ${infos[0]} ${infos[1]} showTr">
                            <td class="textR">${infos[2]}</td>
                            <td class="textL borderR">(${infos[3]})</td>
                            <td style="text-align:left;">${trade}</td>
                        </tr>`
                }

                table.innerHTML += info;
            });
        });

    var teams = document.getElementById("team-dropdown_" + gender).getElementsByClassName("dropdown-item");
    var trades = document.getElementById("trade-dropdown").getElementsByClassName("dropdown-item");
    var teambtn = document.getElementById("teambtn");
    var tradebtn = document.getElementById("tradebtn");

    for (var i = 0; i < teams.length; i++) {
        teams[i].addEventListener("click", function () {
            var currentTeam = document.getElementById("team-dropdown_" + gender).getElementsByClassName("active");
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