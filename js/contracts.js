$(document).ready(function () {

	var genders = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item");
	var genderbtn = document.getElementById("genderbtn");
	var contracts = document.getElementById("contract-dropdown").getElementsByClassName("dropdown-item");
	var contractbtn = document.getElementById("contractbtn");

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
					add_team_dropdown('team-dropdown', 'men', 'all oversea');

				} else if (this.innerHTML == "女籃") {
					add_team_dropdown('team-dropdown', 'women', 'all oversea');
				}

				var teams = document.getElementById("team-dropdown").getElementsByClassName("dropdown-item");
				var teambtn = document.getElementById("teambtn");
				for (var i = 0; i < teams.length; i++) {
					teams[i].addEventListener("click", function () {
						var currentTeam = document.getElementById("team-dropdown").getElementsByClassName("active");
						if (currentTeam.length != 0) currentTeam[0].className = currentTeam[0].className.replace(" active", "");
						this.className += " active";
						teambtn.innerHTML = this.innerHTML;

						showContractsInfo();
					})
				}

				teams[0].click();
				contracts[0].click();
			}
		})
	}

	for (let i = 0; i < contracts.length; i++) {
		contracts[i].addEventListener("click", function () {
			var currentContract = document.getElementById("contract-dropdown").getElementsByClassName("dropdown-item active");
			currentContract[0].className = currentContract[0].className.replace(" active", "");
			this.className += " active";
			contractbtn.innerHTML = this.innerHTML;

			showContractsInfo();
		});
	}

	genders[0].click();
	genders[1].className = 'dropdown-item disabled';
	genders[1].innerHTML += ' (尚無資料)'
});
function showContractsInfo() {
	var currentGender = document.getElementById("gender-dropdown").getElementsByClassName("active");
	var filter_gender = currentGender[0].getAttribute('value');
	var currentTeam = document.getElementById("team-dropdown").getElementsByClassName("active");
	var filter_team = currentTeam[0].getAttribute('value');
	var currentContract = document.getElementById("contract-dropdown").getElementsByClassName("active");
	var filter_contract = currentContract[0].getAttribute('value');

	fetch('../data/players.csv')
		.then((response) => response.text())
		.then((result) => {

			lines = result.split('\n');
			lines = lines.slice(1);

			contracts_info = '';

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
					contract_note, contract_url,
					last_season_league, last_season_team, fa_gp, fa_ppg, fa_rpg, fa_apg,
					fa_status, fa_status_url

				] = infos;

				if (gender == filter_gender & team != 'fa' & (status == 'active' | status == 'away')) {
					showContract = 0;

					if (filter_contract == 'all') {
						showContract += 1;
					} else if (filter_contract == '1y' & (contract_years_left.includes('1+') | contract_years_left == '1')) {
						showContract += 1;
					} else if (filter_contract == 'resigned' & contract_filter.includes('resigned')) {
						showContract += 1;
					}

					if (filter_team == 'all') {
						showContract += 1;
					} else if (filter_team == 'oversea' & isOversea(team)) {
						showContract += 1;
					} else if (team == filter_team) {
						showContract += 1;
					}

					if (showContract == 2) {
						if (contract_filter.includes('trade')) {
							if (contract_season != '') contract_season = contract_season + '*';
							if (contract_years != '') contract_years = contract_years + '*';
							if (contract_years_left != '') contract_years_left = contract_years_left + '*';
						}

						if(contract_url != ''){
							years = `<i class="bi bi-link-45deg"></i><a href="${contract_url}" target="_blank">${contract_years}</a>`;
						}else{
							years = contract_years;
						}

						contracts_info += `
						<tr>
							<td class="${teamBG(league, team)} borderR">${teamName('short', league, team, 'img')}</td>
							<td class="borderR">${jersey_num}</td>
							<td class="borderR"><a href="${playerUrl(team, player_url)}" target="_blank">${name}</a></td>
							<td>${contract_season}</td>
							<td class="borderR">${years}</td>
							<td class="borderR">${contract_years_left}</td>
							<td>${contract_note}</td>
						</tr>`
					}
				}
			});

			contracts_tbody = document.getElementById('contracts_tbody');
			contracts_tbody.innerHTML = contracts_info;
		});
}