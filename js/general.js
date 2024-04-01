$(document).ready(function () {
    if(document.getElementById("index")){
    if (window.innerWidth <= 450) {
        document.getElementById("index").innerHTML = `&nbsp;&nbsp;<img src="../asset/images/logo.png" class="icon"> 首頁`
    } else if (window.innerWidth > 450) {
        document.getElementById("index").innerHTML = `&nbsp;&nbsp;<img src="../asset/images/logo.png" class="icon"> 山姆籃球 SamBasketballTW`
    }
    }

    footerBody = document.getElementById("footerContent");
    timeStamp = document.getElementById("timeStamp");
    timeStamp.innerHTML = `<b>更新日期: 2024.03.31</b>`
    footerBody.innerHTML = `
    <div class="container" style="padding:1.5rem;text-align:center;">
                    <a style="color:white;">
                        山姆籃球
                    </a>
                    <br>
                    <a style="color:white;"
                        href="https://www.instagram.com/sam_basketball_tw/">
                        <i class="bi bi-instagram" style="color:white; font-size: 18px;"></i>
                        sam_basketball_tw&nbsp;
                    </a>
                    <a style="color:white;"
                        href="mailto:sambasketballtw@gmail.com"> 
                        <i class="bi bi-envelope-open" style="color:white; font-size: 18px;"></i>
                        Gmail
                    </a>
                    <br>
                    <a style="color:white; font-size:12px;">All rights reserved © 2024</a>

    </div>`
});

coach_name = {
    "braves": "",
    "kings": " Ryan Marchand",
    "pilots": " Iurgi Caminos",
    "lioneers": " Milan Mitrović",
    "dreamers": " Jamie Pearlman",
    "steelers": "",

    "dea": "",
    "mars": "",
    "leopards": " Charles Dubé-Brais",
    "ghosthawks": " Raoul Korner",
    "aquas": " Branden Joyce",

    "beer":"",
    "trust":"",
    "yulon":"",
    "bll":"",

    "cathay":"",
    "power":"",
    "telecom":"",
    "taiyuen":"",
    "":""
}

gm_name = {
    "braves": "GM: 蔡承儒",
    "kings": "GM: 毛加恩",
    "pilots": "GM: 李忠恕",
    "lioneers": "GM: 張樹人",
    "dreamers": "GM: 韓駿鎧",
    "steelers": "GM: 高景炎",

    "dea": "GM: 劉志威",
    "mars": "GM: 林祐廷",
    "leopards": "執行長: 張建偉",
    "ghosthawks": "GM: 錢韋成",
    "aquas": "執行長: 李偉誠",

    "beer":"",
    "trust":"",
    "yulon":"",
    "bll":"",

    "cathay":"",
    "power":"",
    "telecom":"",
    "taiyuen":"",
    "":""
}

order = {
    "本土": 1,
    "華裔": 2,
    "外籍生": 3,
    "洋將": 4,
    "亞外": 5,

    "CBA": 1,
    "日本 B2": 2,
    "TAT": 3,
    "braves": 11,
    "kings": 12,
    "pilots": 13,
    "lioneers": 14,
    "dreamers": 15,
    "steelers": 16,

    "dea": 21,
    "mars": 22,
    "leopards": 23,
    "ghosthawks": 24,
    "aquas": 25,
    "herobears": 26,
    "suns": 27,

    "beer": 31,
    "trust": 32,
    "yulon": 33,
    "bll": 34,

    "WCBA": 1,
    "WKBL": 2,
    "葡萄牙PNB": 3,
    "cathay": 4,
    "power": 5,
    "telecom": 6,
    "taiyuen": 7,

    "fa":40
}
cn_teamName = {
    "braves": "臺北富邦勇士",
    "kings": "新北國王",
    "pilots": "桃園璞園領航猿",
    "lioneers": "新竹御頂攻城獅",
    "dreamers": "福爾摩沙夢想家",
    "steelers": "高雄17直播鋼鐵人",
    "dea": "新北中信特攻",
    "mars": "臺北戰神",
    "leopards": "台啤永豐雲豹",
    "ghosthawks": "臺南台鋼獵鷹",
    "aquas": "高雄全家海神",
    "beer": "台灣啤酒",
    "trust": "臺灣銀行", 
    "yulon": "裕隆納智捷",
    "bll": "彰化柏力力",

    "cathay": "國泰人壽",
    "taiyuen": "台元紡織",
    "power": "台灣電力",
    "telecom": "中華電信",

    "fa":"自由球員",

    "suns": "臺中太陽",
    "herobears": "台灣啤酒英熊",
    "": ""
}
short_teamName = {
    "braves": "勇士",
    "kings": "國王",
    "pilots": "領航猿",
    "lioneers": "攻城獅",
    "dreamers": "夢想家",
    "steelers": "鋼鐵人",
    "dea": "特攻",
    "mars": "戰神",
    "leopards": "雲豹",
    "ghosthawks": "獵鷹",
    "aquas": "海神",
    "beer": "台啤",
    "trust": "臺銀",
    "yulon": "裕隆",
    "bll": "柏力力",

    "cathay": "國泰",
    "taiyuen": "台元",
    "power": "台電",
    "telecom": "電信",

    "": ""
}