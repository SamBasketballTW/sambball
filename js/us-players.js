$(document).ready(function () {
    fetch('../data/us-players.csv')
        .then((response) => response.text())
        .then((result) => {

            lines = result.split('\n');
            lines = lines.slice(2);

            tableC = document.getElementById('college_tbody');
            tableHS = document.getElementById('hs_tbody');

            lines.forEach(player => {
                infos = player.split(',');
                info = ""

                if (infos[5] == "本土") {
                    filter = "local";
                } else {
                    filter = "taiwanese";
                }

                info += `
                    <tr class="filterTr ${infos[0]} ${filter}">
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
            });
            document.getElementById('gender-dropdown').getElementsByClassName('dropdown-item')[0].click();
        });

    var genders = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item");
    var genderbtn = document.getElementById("genderbtn");
    var btns = document.getElementById("us-btngroup").getElementsByClassName("btn");

    for (var i = 0; i < genders.length; i++) {
        genders[i].addEventListener("click", function () {
            switch_gender = 0;
            if (this.className != "dropdown-item active") {
                switch_gender = 1;
            }
            var currentGender = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item active");
            currentGender[0].className = currentGender[0].className.replace(" active", "");
            this.className += " active";
            genderbtn.innerHTML = this.innerHTML;

            if (switch_gender == 1) {
                btns[0].className = "btn btn-light active"
                btns[1].className = "btn btn-light"
                btns[2].className = "btn btn-light"

                if (this.innerHTML == "男籃") {
                    btns[1].click();
                } else if (this.innerHTML == "女籃") {
                    btns[0].click();
                }
            }
        });
    }


    for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function () {
            var currentBtn = document.getElementsByClassName("btn btn-light active");
            currentBtn[0].className = currentBtn[0].className.replace(" active", "");
            this.className += " active";

            f('filter');
        });
    }
});