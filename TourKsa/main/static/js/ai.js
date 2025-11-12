let userSelection = {
    category: "",
    city: "",
    subtype: ""
};
function sendChoice(category) {
    userSelection.category = category;
    addUserMsg(category);
    askCity();
}

function askCity() {
    addBotMsg("Great! Which city are you looking in?");
    showCityButtons();
}

function showCityButtons() {
    document.querySelector(".suggest-buttons").innerHTML = `
        <button onclick="chooseCity('Riyadh')">Riyadh</button>
        <button onclick="chooseCity('Jeddah')">Jeddah</button>
        <button onclick="chooseCity('Al Khobar')">Al Khobar</button>
        <button onclick="chooseCity('Abha')">Abha</button>
        <button onclick="chooseCity('AlUla')">AlUla</button>
    `;
}

function chooseCity(city) {
    userSelection.city = city;
    addUserMsg(city);
    askSubtype();
}

function askSubtype() {
    addBotMsg("Nice! What subtype do you prefer?");
    showSubtypeButtons();
}

function showSubtypeButtons() {
    let cat = userSelection.category;
    let subtypes = {
        "Restaurants": ["Italian", "Saudi", "Lebanese", "Japanese"],
        "Cafes": ["Quiet","Family Friendly", "Trendy", "Outdoor Seating"],
        "Nature": ["Park", "Hiking", "Viewpoint","Open Area"],
        "Family Activities": ["Theme Park", "Family Restaurant"],
        "Entertainment": ["Cinema", "Arcade", "Indoor Games", "Seasonal Events"]
    };

    const options = subtypes[cat] || [];

    document.querySelector(".suggest-buttons").innerHTML =
        options.map(op => `<button onclick="chooseSubtype('${op}')">${op}</button>`).join("");
}

function chooseSubtype(sub) {
    userSelection.subtype = sub;
    addUserMsg(sub);
    sendToAI();   
}
function addUserMsg(msg) {
    document.getElementById("chatBox").innerHTML += `<div class="user-msg">${msg}</div>`;
}

function addBotMsg(msg) {
    document.getElementById("chatBox").innerHTML += `<div class="bot-msg">${msg}</div>`;
}

function sendToAI() {
    addBotMsg("Searching for the best recommendations…");

    fetch("/ai/travel/", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(userSelection)
    })
    .then(res => res.json())
    .then(data => {
        try {
            const results = JSON.parse(data.reply);
            displayRecommendations(results);
        } catch {
            formatTextReply(data.reply);
        }
    })
    .catch(() => {
        addBotMsg("Error fetching results.");
    });
}
function displayRecommendations(recs) {
    const chatBox = document.getElementById("chatBox");
    chatBox.querySelectorAll(".recommendation-box").forEach(el => el.remove());
    let html = `
        <div class="bot-msg">
            <div class="recommendation-box">
                ${recs.map((r, i) => `
                    <div class="recommendation">
                        <h4>${i + 1}. ${r.name}</h4>
                        <p><b>Area:</b> ${r.area}</p>
                        <p><b>Reason:</b> ${r.reason}</p>
                    </div>
                `).join("")}
            </div>
        </div>`;
    chatBox.innerHTML += html;
    chatBox.scrollTop = chatBox.scrollHeight;
}

function formatTextReply(text) {
    const formatted = text
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/\*(.*?)\*/g, "<i>$1</i>");

    const lines = formatted.split(/\n(?=\d+\.)/g);
    let html = `<div class="bot-msg"><div class="recommendation-box">`;

    lines.forEach((item, i) => {
        const [title, ...details] = item.split("<br>");
        html += `
            <div class="recommendation">
                <h4>${title ? title.trim() : `Place ${i + 1}`}</h4>
                ${details.map(d => `<p>${d.trim()}</p>`).join("")}
            </div>`;
    });

    html += `</div></div>`;
    addBotMsg(html);
}

function restartChat() {
    userSelection = {
        category: "",
        city: "",
        subtype: ""
    };

    document.getElementById("chatBox").innerHTML =
        `<div class="bot-msg">Select what type of place you're looking for 👇</div>`;

    document.querySelector(".suggest-buttons").innerHTML = `
        <button onclick="sendChoice('Restaurants')">Restaurants</button>
        <button onclick="sendChoice('Cafes')">Cafes</button>
        <button onclick="sendChoice('Nature')">Nature</button>
        <button onclick="sendChoice('Family Activities')">Family Activities</button>
        <button onclick="sendChoice('Entertainment')">Entertainment</button>
    `;
}
