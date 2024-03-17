$(document).ready(function () {
    men_html = document.getElementById("men_page");
    women_html = document.getElementById("women_page");

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
                            <td colspan="2" style="font-size:120%; background-color:#1B1B1B;">${infos[4]}</td>
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
                            <td class="borderR">${infos[2]} (${infos[3]})</td>
                            <td style="text-align:left;">${trade}</td>
                        </tr>`
                }

                table.innerHTML += info;
            });
        });
});