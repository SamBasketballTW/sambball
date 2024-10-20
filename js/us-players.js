$(document).ready(function () {

    var genders = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item");
    var genderbtn = document.getElementById("genderbtn");
    var identities = document.getElementById("identity-btngroup").getElementsByClassName("btn btn-light");

    for (var i = 0; i < genders.length; i++) {
        genders[i].addEventListener("click", function () {
            switch_gender = 0;
            if (this.className != "dropdown-item active") switch_gender = 1;

            var currentGender = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item active");
            currentGender[0].className = currentGender[0].className.replace(" active", "");
            this.className += " active";
            genderbtn.innerHTML = this.innerHTML;

            if (switch_gender == 1) {
                identities[0].click();
            }
        })
    }

    for (let i = 0; i < identities.length; i++) {
        identities[i].addEventListener("click", function () {
            var currentIdentity = document.getElementsByClassName("btn btn-light active");
            currentIdentity[0].className = currentIdentity[0].className.replace(" active", "");
            this.className += " active";

            showPlayers();
        });
    }
    genders[0].click();
});
function showPlayers() {
    var currentGender = document.getElementById("gender-dropdown").getElementsByClassName("active");
    var filter_gender = currentGender[0].getAttribute('value');
    var currentIdentity = document.getElementById("identity-btngroup").getElementsByClassName("active");
    var filter_identity = currentIdentity[0].getAttribute('value');

    fetch('../data/us-players.csv')
        .then((response) => response.text())
        .then((result) => {
            lines = result.split('\n');
            lines = lines.slice(1);

            players_info = '';

            lines.forEach(line => {
                infos = line.split(',');

                let [
                    gender,
                    school,
                    position,
                    player_name,
                    instagram,
                    identity,
                    height,
                    birth,
                    year,
                    jersey_num,
                    college_name,
                    division,
                    conference

                ] = infos;

                if (gender == filter_gender & school == 'c') {
                    showPlayer = 0;
                    if (filter_identity == 'all') {
                        showPlayer = 1;
                    } else if (filter_identity == 'local' & identity == '本土') {
                        showPlayer = 1;
                    } else if (filter_identity == 'taiwanese' & identity != '本土') {
                        showPlayer = 1;
                    }

                    if (showPlayer == 1) {
                        players_info += `
                        <tr >
                            <td class="borderR">${position}</td>
                            <td class="borderR">${player_name}</td>
                            <td class="borderR textL">
                                <i class="bi bi-instagram"></i><a href="https://www.instagram.com/${instagram}/" target="_blank"> ${instagram}</a>
                            </td>
                            <td>${identity}</td>
                            <td>${height}</td>
                            <td class="borderR">${year}</td>
                            <td>${jersey_num}</td>
                            <td class="borderR">${college_name}</td>
                            <td>${division}</td>
                            <td>${conference}</td>
                        </tr>`
                    }
                }
            })

            college_tbody = document.getElementById('college_tbody');
            college_tbody.innerHTML = players_info;
        })
}