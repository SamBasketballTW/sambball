$(document).ready(function () {
    men_html = document.getElementById("men_page");
    women_html = document.getElementById("women_page");

    if (men_html) {
        gender = "men"
    } else if (women_html) {
        gender = "women"
    }

    fetch('../data/us-students.csv')
        .then((response) => response.text())
        .then((result) => {

            lines = result.split('\n');
            lines = lines.slice(2);

            tableC = document.getElementById('college_tbody');
            tableHS = document.getElementById('hs_tbody');

            lines.forEach(player => {
                infos = player.split(',');
                info = ""

                if (infos[0] == gender) {
                    if (infos[5] == "本土") {
                        filter = "local";
                    } else {
                        filter = "taiwanese";
                    }

                    info += `
                    <tr class="filterTr ${filter} showTr">
                        <td class="borderR">${infos[2]}</td>
                        <td class="borderR">${infos[3]}</td>
                        <td class="borderR textL">
                            <a href="https://www.instagram.com/${infos[4]}/" target="_blank">
                            <i class="bi bi-instagram"></i> ${infos[4]}</a>
                        </td>
                        <td>${infos[5]}</td>
                        <td>${infos[6]}</td>
                        <td class="borderR">${infos[8]}</td>
                        <td>${infos[9]}</td>
                        <td class="borderR">${infos[10]}</td>
                        <td>${infos[11]}</td>
                        <td>${infos[12]}</td>
                    </tr>`


                    if (infos[1] == "c") {
                        tableC.innerHTML += info;
                    } else if (infos[1] == "hs") {
                        tableHS.innerHTML += info;
                    }
                }
            });

            if(men_html){
                document.getElementById('us-btngroup').getElementsByClassName('btn')[1].click();
            }
        });
});