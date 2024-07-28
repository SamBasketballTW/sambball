$(document).ready(function () {
    fetch('../data/us-players.csv')
        .then((response) => response.text())
        .then((result) => {

            lines = result.split('\n');
            lines = lines.slice(2);

            lines.forEach(line => {
                infos = line.split(',');

                let [
                    gender,
                    college_or_hs,
                    pos,
                    name,
                    instagram,
                    identity,
                    height,
                    birth,
                    class_of,
                    jersey_num,
                    school,
                    division,
                    conference

                ] = infos;

                if (college_or_hs == "c") {
                    table = document.getElementById('college_tbody');
                } else if (college_or_hs == "hs") {
                    table = document.getElementById('hs_tbody');
                }

                if (identity == "本土") {
                    filter = "local";
                } else {
                    filter = "taiwanese";
                }

                if (college_or_hs == "c") {
                    table.innerHTML += `
                    <tr class="filterTr ${gender} ${filter}">
                        <td class="borderR">${pos}</td>
                        <td class="borderR">${name}</td>
                        <td class="borderR textL">
                            <a href="https://www.instagram.com/${instagram}/" target="_blank">
                            <i class="bi bi-instagram"></i> ${instagram}</a>
                        </td>
                        <td>${identity}</td>
                        <td>${height}</td>
                        <td class="borderR">${class_of}</td>
                        <td>${jersey_num}</td>
                        <td class="borderR">${school}</td>
                        <td>${division}</td>
                        <td>${conference}</td>
                    </tr>`
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

                btns[0].click();
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