$(document).ready(function () {

    var genders = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item");
    var genderbtn = document.getElementById("genderbtn");
    var trades = document.getElementById("trade-dropdown").getElementsByClassName("dropdown-item");
    var tradebtn = document.getElementById("tradebtn");

    for (var i = 0; i < genders.length; i++) {
        genders[i].addEventListener("click", function () {
            switch_gender = 0;
            if (this.className != "dropdown-item active") switch_gender = 1;

            var currentGender = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item active");
            currentGender[0].className = currentGender[0].className.replace(" active", "");
            this.className += " active";
            genderbtn.innerHTML = this.innerHTML;

            if (switch_gender == 1) {
                if (this.innerHTML == "男籃") {
                    add_team_dropdown('team-dropdown', 'men', 'all');

                } else if (this.innerHTML == "女籃") {
                    add_team_dropdown('team-dropdown', 'women', 'all');
                }

                var teams = document.getElementById("team-dropdown").getElementsByClassName("dropdown-item");
                var teambtn = document.getElementById("teambtn");
                for (var i = 0; i < teams.length; i++) {
                    teams[i].addEventListener("click", function () {
                        var currentTeam = document.getElementById("team-dropdown").getElementsByClassName("active");
                        if (currentTeam.length != 0) currentTeam[0].className = currentTeam[0].className.replace(" active", "");
                        this.className += " active";
                        teambtn.innerHTML = this.innerHTML;

                        showTradesInfo();
                    })
                }

                teams[0].click();
                trades[0].click();
            }
        });
    }

    for (var i = 0; i < trades.length; i++) {
        trades[i].addEventListener("click", function () {
            var currentTrade = document.getElementById("trade-dropdown").getElementsByClassName("active");
            currentTrade[0].className = currentTrade[0].className.replace(" active", "");
            this.className += " active";
            tradebtn.innerHTML = this.innerHTML;

            showTradesInfo();
        });
    }

    genders[0].click();
    genders[1].className = 'dropdown-item disabled';
    genders[1].innerHTML += ' (尚無資料)'
});
function showTradesInfo() {
    var currentGender = document.getElementById("gender-dropdown").getElementsByClassName("active");
    var filter_gender = currentGender[0].getAttribute('value');
    var currentTeam = document.getElementById("team-dropdown").getElementsByClassName("active");
    var filter_team = currentTeam[0].getAttribute('value');
    var currentTrade = document.getElementById("trade-dropdown").getElementsByClassName("active");
    var filter_trade = currentTrade[0].getAttribute('value');

    fetch('../data/trades.csv')
        .then((response) => response.text())
        .then((result) => {
            lines = result.split('\n');
            lines = lines.slice(1);

            currentSeason = '';
            trades_info = '';

            lines.forEach(line => {
                infos = line.split(',');

                let [
                    gender,
                    trade_teams,
                    trade_catagory,
                    season,
                    date,
                    off_season,
                    content,
                    futurePick_content,
                    content2

                ] = infos;


                if (gender == filter_gender) {
                    showTrade = 0;

                    if (filter_trade == 'all') {
                        if (filter_team == 'all') {
                            showTrade += 1;
                        } else if (trade_teams.includes(filter_team)) {
                            showTrade += 1;
                        }

                    } else if (filter_trade == 'draft' | filter_trade == 'player') {
                        if (trade_catagory.includes(filter_trade)) {
                            showTrade += 1;
                        }
                    } else if (filter_trade == 'futurePick') {
                        if (futurePick_content != '') {
                            showTrade += 1;
                        }
                    }

                    if (filter_team == 'all') {
                        showTrade += 1;
                    } else if (trade_teams.includes(filter_team)) {
                        showTrade += 1;
                    }

                    if (showTrade == 2) {
                        if (currentSeason != season) {
                            currentSeason = season;
                            trades_info += `
                            <tr>
                                <td colspan="3" style="font-size:18px; color:white; background-color:#1B1B1B">
                                    ${season} 賽季
                                </td>
                            </tr>`
                        }

                        if (futurePick_content != '') {
                            content += `<a style="color:red">${futurePick_content}</a>${content2}`
                        }

                        trades_info += `
                        <tr>
                            <td class="textR">${date}</td>
                            <td class="textL borderR">(${off_season})</td>
                            <td class="textL">${content}</td>
                        </tr>`
                    }
                }
            })

            if (trades_info == '') {
                if (filter_trade == 'futurePick') {
                    trades_info = `<tr><td colspan="3">無尚有未來選秀籤之交易</td>`
                } else if (filter_trade == 'draft') {
                    trades_info = `<tr><td colspan="3">無含有選秀籤之交易紀錄</td>`
                } else if (filter_trade == 'player') {
                    trades_info = `<tr><td colspan="3">無含有球員之交易紀錄</td>`
                } else {
                    trades_info = `<tr><td colspan="3">無交易紀錄</td>`
                }
            }

            trades_tbody = document.getElementById('trades_tbody');
            trades_tbody.innerHTML = trades_info;
        })
}