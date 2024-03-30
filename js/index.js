$(document).ready(function () {

	fetch('./data/standings.csv')
		.then((response) => response.text())
		.then((result) => {

			lines = result.split('\n');
			lines = lines.slice(2);

			table_plg = document.getElementById('plg_tbody');
			table_t1 = document.getElementById('t1_tbody');
			table_sbl = document.getElementById('sbl_tbody');
			table_wsbl = document.getElementById('wsbl_tbody');


			lines.forEach(player => {
				infos = player.split(',');
				info = ""

				if(infos[0] == "plg" | infos[0] == "t1" | infos[0] == "sbl"){
					gender = "men";
				} else if( infos[0] == "wsbl"){
					gender = "women";
				}
				if(infos[0] == "plg" | infos[0] == "t1" | infos[0] == "sbl" | infos[0] == "wsbl" ){
					info += `
						<tbody>
							<tr>
								<td class="borderR">${infos[1]}</td>
								<td style="font-size:15px; text-align:left">
									<img src="../asset/images/${gender}/${infos[2]}.png" alt="${infos[2]}" class="teamicon">
									<b>${cn_teamName[infos[2]]}</b>
								</td>
								<td>${infos[3]}</td>
								<td>${infos[4]}</td>
								<td>${infos[5]}</td>
								<td>${infos[6]}</td>
								<td>${infos[7]}</td>
								<td>${infos[8]}</td>
							</tr>
						</tbody>`

						if (infos[0] == "plg") {
							table_plg.innerHTML += info;
						} else if (infos[0] == "t1") {
							table_t1.innerHTML += info;
						} else if (infos[0] == "sbl") {
							table_sbl.innerHTML += info;
						} else if (infos[0] == "wsbl") {
							table_wsbl.innerHTML += info;
						}
				}
			});
		});

	table_bday = document.getElementById('birthday_td');

	fetch('./data/rosters.csv')
		.then((response) => response.text())
		.then((result) => {

			lines = result.split('\n');
			lines = lines.slice(2);

			count = 0;
			text = "";

			lines.forEach(player => {
				infos = player.split(',');

				const today = new Date();
				const sam = new Date('10/11');
				if (count == 0 && sam.getDate() == today.getDate() && sam.getMonth() == today.getMonth()) {
					text += `今天是 山姆 的生日`
					count += 1;
				}

				if (infos[6] == "active") {
					const birthday = new Date(infos[13]);
					const diff = today - birthday
					const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));

					if (birthday.getDate() == today.getDate() && birthday.getMonth() == today.getMonth()) {
						team_name = cn_teamName[infos[4]];
						if (infos[3] != "PLG" & infos[3] != "T1" & infos[3] != "SBL" & infos[3] != "WSBL") {
							team_name = `${infos[3]} ${infos[4]}`;
						}
						if (count == 0) {
							text += `今天是 ${team_name}-${infos[1]} ${age}歲生日`
						} else {
							text += `、${team_name}-${infos[1]} ${age}歲生日`;
						}
						count += 1;
					}
				}

			});
			if (window.innerWidth <= 576) {
                blank = '<br>'
            } else {
                blank = '，'
            }

			if (count == 0) {
				text += `今天沒有球員生日，祝你有美好的一天！`
			} else if (count == 1) {
				text += `${blank}祝他生日快樂！`
			} else if (count > 1) {
				text += `${blank}祝他們生日快樂！`
			}

			table_bday.innerHTML += text;
		})
});