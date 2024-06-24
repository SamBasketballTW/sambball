$(document).ready(function () {
	table = document.getElementById('contracts_tbody');

	fetch('../data/rosters.csv')
		.then((response) => response.text())
		.then((result) => {

			lines = result.split('\n');
			lines = lines.slice(2);

			table = document.getElementById('contracts_tbody');

			lines.forEach(line => {
				infos = line.split(',');

				let [
					gender,
					name,
					jersey_num, league, team, player_url,
					status,
					identity,
					rookie,
					league_identity, pos, height, weight, birth,
					school,
					aquired,
					last_team,
					contract_filter, contract_season, contract_years, contract_years_left,
					contract_note,
					contract_link_title, contract_url,
					fa_status, fa_total_sec, fa_ppg, fa_rpg, fa_apg

				] = infos;

				if ((status == 'active' & team != 'fa') | status == 'loan') {
					filter = contract_filter;
					contract_link = '';

					if (isOversea(team)) {
						team_name = `<a style="font-size:12px">${teamName('short',league,team,'img')}`
					}else{
						team_name = `${teamName('short',league,team,'img')}`
					}

					if (filter.includes('trade')) {
						contract_season = '*' + contract_season + '*';
						contract_years = '*' + contract_years + '*';
						contract_years_left = '*' + contract_years_left + '*';
					}

					if (isOversea(team)) {
						filter += ' local';
					} else if (leagueIdFilter(league_identity) == 'import') {
						filter += ' import';
					} else if (leagueIdFilter(league_identity) == 'local') {
						filter += ' local';
					} else if (identity == 'coach') {
						filter += ' coach';
					} else {
						console.log(name);
						console.log(league_identity);
					}

					if (contract_years_left.includes('0')) {
						filter += ' 1y';
					}

					if (contract_url != '') {
						contract_link = `
						<a style="color:inherit; text-decoration:underline" href="${contract_url}" target="_blank">
							<i class="bi bi-link-45deg"></i>${contract_link_title}</a>`;
					}

					table.innerHTML += `
					<tr class="filterTr ${gender} ${teamFilter(team)} ${filter} ">
						<td class="${teamBG(league, team)} borderR">${team_name}</td>
						<td class="borderR">${jersey_num}</td>
						<td class="borderR"><a style="text-decoration:underline;color:inherit" href="${playerUrl(team, player_url)}" target="_blank">${name}</a></td>
						<td>${contract_season}</td>
						<td class="borderR">${contract_years}</td>
						<td class="borderR">${contract_years_left}</td>
						<td class="borderR">${contract_note}</td>
						<td>${contract_link}</td>
					</tr>`
				}
			});
			document.getElementById('gender-dropdown').getElementsByClassName('dropdown-item')[0].click();
		});

	add_team_dropdown("team-dropdown", "men", 'all', 'cba');

	var genders = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item");
	var genderbtn = document.getElementById("genderbtn");
	var teams = document.getElementById("team-dropdown").getElementsByClassName("dropdown-item");
	var contracts = document.getElementById("contract-dropdown").getElementsByClassName("dropdown-item");
	var teambtn = document.getElementById("teambtn");
	var contractbtn = document.getElementById("contractbtn");

	for (var i = 0; i < genders.length; i++) {
		genders[i].addEventListener("click", function () {
			var currentGender = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item active");
			currentGender[0].className = currentGender[0].className.replace(" active", "");
			this.className += " active";
			genderbtn.innerHTML = this.innerHTML;

			f('filter');
		});
	}

	for (let i = 0; i < teams.length; i++) {
		teams[i].addEventListener("click", function () {
			var currentTeam = document.getElementById("team-dropdown").getElementsByClassName("active");
			currentTeam[0].className = currentTeam[0].className.replace(" active", "");
			this.className += " active";
			teambtn.innerHTML = this.innerHTML;

			f('filter');
		});
	}

	for (let i = 0; i < contracts.length; i++) {
		contracts[i].addEventListener("click", function () {
			var currentContract = document.getElementById("contract-dropdown").getElementsByClassName("dropdown-item active");
			currentContract[0].className = currentContract[0].className.replace(" active", "");
			this.className += " active";
			contractbtn.innerHTML = this.innerHTML;

			f('filter');
		});
	}
});