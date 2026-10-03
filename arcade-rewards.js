/* ==========================================================================
   ARCADE SUB-MODULE A: EXPANDED REWARDS SYSTEM (arcade-rewards.js)
   ========================================================================== */
window.globalBadgesDB = {
    first_pop: { title: "Bead Popper Cadet", icon: "🎈", xp: 10 },
    speed_popper: { title: "Laser Reflexes", icon: "⚡", xp: 25 },
    riddle_cracker: { title: "Puzzle Detective", icon: "🕵️", xp: 20 },
    lucky_spinner: { title: "Charm Collector", icon: "🦄", xp: 15 },
    pattern_pro: { title: "Pattern Architect", icon: "📐", xp: 30 },
    matching_wizard: { title: "Color Wizard", icon: "🎨", xp: 30 },
    
    // NEW UNIQUE BADGES ADDED TO THE SHELF
    music_maestro: { title: "Chime Composer", icon: "🎵", xp: 20 },
    tic_tac_champ: { title: "Bot Crusher AI", icon: "🤖", xp: 35 },
    pixel_picasso: { title: "8-Bit Designer", icon: "👾", xp: 40 },
    speed_catcher: { title: "Gravity Master", icon: "🚀", xp: 25 },
    jewelry_boss: { title: "Boutique Tycoon", icon: "👑", xp: 100 }
};

window.refreshArcadeTrophies = () => {
    const displayElement = document.getElementById("trophy-shelf-display");
    if (!displayElement) return; displayElement.innerHTML = "";
    
    // Core fix: grab cumulative progress array out of persistent storage safely
    let unlocked = JSON.parse(localStorage.getItem("kids_unlocked_badges")) || [];
    
    Object.keys(window.globalBadgesDB).forEach(key => {
        let b = window.globalBadgesDB[key]; 
        let gotIt = unlocked.includes(key); // Check if this specific item key exists in array
        let slot = document.createElement("div"); 
        slot.className = "mini-badge-slot";
        
        slot.innerHTML = `
            <div style="font-size:36px; filter:${gotIt ? 'none' : 'grayscale(100%) opacity(30%)'};">${b.icon}</div>
            <div style="font-size:11px; font-weight:800; color:${gotIt ? 'var(--text-plum)' : 'var(--gray-text)'}; text-align:center;">${b.title}</div>
            <div style="font-size:10px; font-weight:bold; background:${gotIt ? 'var(--logo-yellow)' : '#E5E5E5'}; padding:2px 6px; border-radius:8px; margin-top:2px;">+${b.xp} XP</div>
        `;
        displayElement.appendChild(slot);
    });
};

window.awardKidsBadge = (key, badgeData) => {
    let unlocked = JSON.parse(localStorage.getItem("kids_unlocked_badges")) || [];
    
    // FIX: Only drop out early if the user has ALREADY unlocked this specific individual badge
    if (unlocked.includes(key)) return; 
    
    unlocked.push(key);
    localStorage.setItem("kids_unlocked_badges", JSON.stringify(unlocked));
    window.refreshArcadeTrophies();
    
    let toast = document.createElement("div");
    toast.style = "position:fixed; bottom:30px; right:30px; background:#1D1128; border:3px solid #FF7FA5; color:#FFF; padding:15px 20px; border-radius:16px; z-index:100000; font-family:sans-serif; display:flex; align-items:center; gap:12px;";
    toast.innerHTML = `<span style='font-size:30px;'>${badgeData.icon}</span> <div><b style='color:#FFC93C;'>🏆 BADGE EARNED!</b><br>${badgeData.title}</div>`;
    document.body.appendChild(toast); 
    setTimeout(() => toast.remove(), 3500);
};

window.createArcadeModal = (title, contentHTML, onQuit = () => {}) => {
    let overlay = document.createElement('div');
    overlay.style = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(29,17,40,0.85); z-index:99999; display:flex; flex-direction:column; justify-content:center; align-items:center; color:#FFF; font-family:sans-serif;";
    overlay.innerHTML = `
        <h2 style='margin-bottom:10px; color:#FFC93C; font-weight:800;'>${title}</h2>
        <div id='arena' style='position:relative; width:400px; height:340px; background:#FFF; border-radius:24px; border:4px solid #FF7FA5; color:#1D1128; padding:20px; box-sizing:border-box; display:flex; flex-direction:column; align-items:center; justify-content:center;'>${contentHTML}</div>
        <button id='quit' style='margin-top:15px; padding:8px 16px; border-radius:8px; border:none; background:#FF7FA5; color:#FFF; font-weight:bold; cursor:pointer;'>Quit Game</button>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('#quit').onclick = () => { onQuit(); overlay.remove(); };
    return overlay;
};
