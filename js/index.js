$(document).ready(function () {
	plg_rank = ['dreamers','pilots','kings','lioneers','braves','steelers'];
	t1_rank = ['dea','aquas','leopards','mars','ghosthawks'];
	sbl_rank = ['beer','trust','yulon','bll'];
	wsbl_rank = ['taiyuen','cathay','telecom','power'];
	rank = [plg_rank,t1_rank,sbl_rank,wsbl_rank];
    team_count = [plg_rank.length , t1_rank.length , sbl_rank.length , wsbl_rank.length];
	league = ['plg','t1','sbl','wsbl'];

	for(let j=0;j<4;j++){
		fetch(`../data/standings-${league[j]}.csv`)
			.then((response) => response.text())
			.then((result) => {

				lines = result.split('\n');
				lines = lines.slice(2);

				table = document.getElementById(`${league[j]}_tbody`)
				
				for( let i=0; i<team_count[j]; i++){
					team = rank[j][i];
					w_l = [0,0];
					gb = 0;
					streak_count = 0;
					streak = "";
		
					lines.forEach(player => {
						infos = player.split(',');
						info = ""

						if(league[j] == "wsbl"){
							gender = "women"
						}else{
							gender = "men"
						}

						if(infos[3] == team){
							w_l[0] += 1;
							if(streak == ""){
								streak = "W"
								streak_count += 1;
							}else if(streak == "W"){
								streak_count += 1;
							}else if(streak == "L"){
								streak = `L${streak_count}`;
							}
						}else if(infos[11] == team){
							w_l[1] += 1;
							if(streak == ""){
								streak = "L"
								streak_count += 1;
							}else if(streak == "L"){
								streak_count += 1;
							}else if(streak == "W"){
								streak = `W${streak_count}`
							}
						}

					});

					if(team == rank[j][0]){
						no1 = [w_l[0],w_l[1]];
						gb = "-"
					}else{
						gb = ((no1[0] - w_l[0]) + (w_l[1] - no1[1]))/2
					}
					table.innerHTML += `
					<tr>
						<td class="borderR">${i+1}</td>
						<td style="font-size:15px; text-align:left">
							<img src="../asset/images/${gender}/${team}.png" alt="${team}" class="teamicon">
							<b>${cn_teamName[team]}</b>
						</td>
						<td>${w_l[0]+w_l[1]}</td>
						<td>${w_l[0]}</td>
						<td>${w_l[1]}</td>
						<td>${((w_l[0] / (w_l[0]+w_l[1]))*100).toFixed(0)}%</td>
						<td>${gb}</td>
						<td>${streak}</td>
					</tr>`
				}

			});
	}
	
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

			if (count == 0) {
				text += `今天沒有球員生日，祝你有美好的一天！`
			} else if (count == 1) {
				text += `，祝他生日快樂！`
			} else if (count > 1) {
				text += `，祝他們生日快樂！`
			}

			table_bday.innerHTML += text;
		})
        
});
