$(document).ready(function () {

    var genders = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item");
    var genderbtn = document.getElementById("genderbtn");
    var fas = document.getElementById("fa-dropdown").getElementsByClassName("dropdown-item");
    var fabtn = document.getElementById("fabtn");

    for (var i = 0; i < genders.length; i++) {
        genders[i].addEventListener("click", function () {
            switch_gender = 0;
            if (this.className != "dropdown-item active") switch_gender = 1;

            var currentGender = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item active");
            currentGender[0].className = currentGender[0].className.replace(" active", "");
            this.className += " active";
            genderbtn.innerHTML = this.innerHTML;

            if (switch_gender == 1) {
                fas[2].click();
            }
        });
    }

    for (var i = 0; i < fas.length; i++) {
        fas[i].addEventListener("click", function () {
            var currentFA = document.getElementById("fa-dropdown").getElementsByClassName("dropdown-item active");
            currentFA[0].className = currentFA[0].className.replace(" active", "");
            this.className += " active";
            fabtn.innerHTML = this.innerHTML;

            showFAInfo();
        });
    }
    genders[0].click();
    genders[1].className = 'dropdown-item disabled';
    genders[1].innerHTML += ' (尚無資料)'
});
function showFAInfo() {
    currentGender = document.getElementById('gender-dropdown').getElementsByClassName('dropdown-item active');
    filter_gender = currentGender[0].getAttribute('value');
    currentFA = document.getElementById('fa-dropdown').getElementsByClassName('dropdown-item active');
    filter_fa = currentFA[0].getAttribute('value');

    fetch('../data/rosters.csv')
        .then((response) => response.text())
        .then((result) => {
            lines = result.split('\n');
            lines = lines.slice(1);

            fa_info = ''

            lines.forEach(line => {
                infos = line.split(',');

                let [
                    gender,
                    name,
                    jersey_num, league, team, player_url,
                    status,
                    identity,
                    rookie,
                    league_identity, position, height, weight, birth,
                    school,
                    acquired,
                    contract_filter, contract_season, contract_years, contract_years_left,
                    contract_note,
                    contract_link_title, contract_url,
                    fa_status, last_season_league, last_season_team, fa_gp, fa_ppg, fa_rpg, fa_apg

                ] = infos;

                if (gender == filter_gender & status == 'active' & fa_status != '') {
                    showFA = 0;

                    if (filter_fa == 'all') {
                        showFA = 1;

                    } else if (filter_fa == 'signed') {
                        if (fa_status == '完成簽約' | fa_status == '已續約') {
                            showFA = 1;
                        }
                    } else if (filter_fa == 'unsigned' & !(fa_status == '完成簽約' | fa_status == '已續約')) {
                        if (fa_status != '完成簽約' & fa_status != '已續約') {
                            showFA = 1;
                        }
                    }

                    if (showFA == 1) {
                        if (fa_status == '完成簽約' | fa_status == '已續約') {
                            new_league = league;
                            new_team = team;
                        } else {
                            new_league = '';
                            new_team = ''
                        }

                        fa_info += `
                        <tr>
                            <td><a style="text-decoration:underline; color:inherit" href="${playerUrl(new_team, player_url)}" target="_blank">${name}</a></td>
                            <td>${position}</td>
                            <td>${birthToAge(birth)}</td>
                            <td class="borderR">${height}</td>
                            <td>${fa_status}</td>
                            <td class="${teamBG(last_season_league, last_season_team)} borderR" data-order="${teamOrder(last_season_league, last_season_team)}">${teamName('full', last_season_league, last_season_team)}</td>
                            <td class="${teamBG(new_league, new_team)} borderR" data-order="${teamOrder(new_league, new_team)}">${teamName('full', new_league, new_team)}</td>
                            <td>${fa_gp}</td>
                            <td>${fa_ppg}</td>
                            <td>${fa_rpg}</td>
                            <td>${fa_apg}</td>              
                        </tr>`
                    }
                }
            })

            fa_table = document.getElementById('fa_table');
            fa_th_width_title = [[110, '球員'], [65, '位置'], [65, '年齡'], [65, '身高'],
            [165, '合約狀況'], [170, '2023-24 球隊'], [170, '新球隊'], [65, '出賽'],
            [65, 'PPG'], [65, 'RPG'], [65, 'APG']];

            thead_info = ''
            fa_th_width_title.forEach(th => {
                thead_info += `<th style="width:${th[0]}px">${th[1]}</th>`
            })
            fa_table.innerHTML = `
            <table id="fa_tb" class="table table-hover table-fix1">
                <thead>${thead_info}</thead>
                <tbody>${fa_info}</tbody>
            </table>`

            var dataTable = $('#fa_tb').DataTable({
                dom: 't',
                paging: false,
                scrollCollapse: true,
                info: false,
                ordering: true,
                order: [5, 'asc']
            });
        })
}