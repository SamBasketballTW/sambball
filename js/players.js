$(document).ready(function () {
    men_html = document.getElementById("men_page");
    women_html = document.getElementById("women_page");

    if (men_html) {
        gender = "men"
    } else if (women_html) {
        gender = "women"
    }
    fetch('../data/rosters.csv')
        .then((response) => response.text())
        .then((result) => {

            lines = result.split('\n');
            lines = lines.slice(2);

            table = document.getElementById('players_tbody');


            lines.forEach(player => {
                infos = player.split(',');
                info = ""

                if (infos[0] == gender & infos[6] == "active" & infos[7] != "headCoach" & infos[7] != "coach") {
                    if (infos[16] == "") {
                        filter = ""
                    } else {
                        filter = "change"
                    }
                    if (infos[4] == "fa") {
                        infos[16] = `${infos[3]} ${team_name("short", infos[3], infos[16])}`
                    }
                    if (infos[5] == '') infos[5] = team_link[infos[4]];

                    if (infos[1] == "布拉" | infos[1] == "布銳克曼" | infos[1] == "阿拉薩" | infos[1] == "辛特力" | infos[1] == "夏普" | infos[1] == "安尼奎") {
                        infos[9] = `洋將`;
                    } else if (infos[1] == "海登") {
                        infos[9] = `亞外`;
                    } else if (infos[1] == "王振原") {
                        infos[9] = `本土`;
                    }

                    info += `
                    <tr class="filterTr ${filter_team(infos[3], infos[4])} ${infos[7]} ${infos[8]} ${school(infos[14])} ${filter} showTr">
                        <td class="borderR ${bg_team(infos[3], infos[4])}" data-order=${team_order(infos[3], infos[4])}>
                            ${team_name("short", infos[3], infos[4], gender)}
                        </td>
                        <td class="borderR" data-order=${num_order(infos[2])}>${infos[2]}</td>
                        <td><a style="text-decoration:underline;color:inherit" href="${infos[5]}" target="_blank">${infos[1]}</a></td>
                        <td data-order=${order[infos[9]]}>${infos[9]}</td>
                        <td>${infos[10]}</td>
                        <td>${infos[11]}</td>
                        <td>${infos[12]}</td>
                        <td>${age(infos[13])}</td>
                        <td class="borderR">${infos[13]}</td>
                        <td class="borderR textL">${infos[14]}</td>
                        <td>${infos[16]}</td>                
                    </tr>`
                }


                table.innerHTML += info;
            });

            var dataTable = $('#players_tb').DataTable({
                dom: 't',
                paging: false,
                scrollCollapse: true,
                info: false,
                ordering: true,
                order: [0, 'asc'],
            });


        });



    player_dropdown = document.getElementById("player-dropdown");

    if (men_html) {
        for (let i = 2023; i >= 2020; i--) {
            player_dropdown.innerHTML += `<li><a class="dropdown-item" onclick="f('${i}Rookie')">${i}'新秀</a></li>`
        }
    } else if (women_html) {
        for (let i = 2023; i >= 2019; i--) {
            player_dropdown.innerHTML += `<li><a class="dropdown-item" onclick="f('${i}Rookie')">${i + 1}'新秀</a></li>`
        }
    }
    var teams = document.getElementById("team-dropdown_" + gender).getElementsByClassName("dropdown-item");
    var players = document.getElementById("player-dropdown").getElementsByClassName("dropdown-item");
    var schools = document.getElementById("school-dropdown").getElementsByClassName("dropdown-item");
    var teambtn = document.getElementById("teambtn");
    var playerbtn = document.getElementById("playerbtn");
    var schoolbtn = document.getElementById("schoolbtn");

    for (let i = 0; i < teams.length; i++) {
        teams[i].addEventListener("click", function () {
            var currentTeam = document.getElementById("team-dropdown_" + gender).getElementsByClassName("active");
            currentTeam[0].className = currentTeam[0].className.replace(" active", "");
            this.className += " active";
            teambtn.innerHTML = this.innerHTML;

            f('filter');
        });
    }

    for (let i = 0; i < players.length; i++) {
        players[i].addEventListener("click", function () {
            var currentPlayer = document.getElementById("player-dropdown").getElementsByClassName("active");
            currentPlayer[0].className = currentPlayer[0].className.replace(" active", "");
            this.className += " active";
            playerbtn.innerHTML = this.innerHTML;

            f('filter');
        });
    }

    for (let i = 0; i < schools.length; i++) {
        schools[i].addEventListener("click", function () {
            var currentSchool = document.getElementById("school-dropdown").getElementsByClassName("active");
            currentSchool[0].className = currentSchool[0].className.replace(" active", "");
            this.className += " active";
            schoolbtn.innerHTML = this.innerHTML;

            f('filter');
        });
    }


});
function toggleCheckboxes() {
    var checkboxes = document.querySelectorAll('.form-check-input[type="checkbox"]');
    var checkSwitch = document.getElementById('checkSwitch');

    checkboxes.forEach(function (checkbox) {
        checkbox.checked = checkSwitch.checked;
        f('filter');
    });
}
function school(s) {
    if (s.includes("HBL") | s == "-") {
        return ""
    } else if (college[s] == undefined) {
        return "college-us"
    } else {
        return college[s]
    }
}
college = {
    "中州科大": "ccut",
    "中信學院": "ctbcbs",
    "中原大學": "cycu",
    "文化大學": "pccu",
    "世新大學": "shu",
    "北市大學": "utaipei",
    "佛光大學": "fgu",
    "宏國德霖": "hdut",
    "亞洲大學": "asiau",
    "明道大學": "mdu",
    "東南科大": "tungnanu",
    "虎尾科大": "nfu",
    "政治大學": "nccu",
    "首府大學": "shoufuu",
    "高雄師大": "nknu",
    "健行科大": "uch",
    "國立體大": "ntsu",
    "康寧大學": "ukn",
    "陽明交通": "nycu",
    "萬能科大": "vnu",
    "義守大學": "isu",
    "僑光科大": "ocu",
    "實踐大學": "usc",
    "彰化師大": "ncue",
    "臺北科大": "ntut",
    "臺灣科大": "ntust",
    "臺灣師大": "ntnu",
    "臺灣藝大": "ntua",
    "臺灣體大": "ntusport",
    "輔仁大學": "fjcu",
    "醒吾科大": "hwu"
}