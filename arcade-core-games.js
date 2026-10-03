/* ==========================================================================
   ARCADE SUB-MODULE B: CLICK-ONLY CORE STAGES (arcade-core-games.js)
   ========================================================================== */
window.runCoreGames = (gameKey) => {
    // 1. BEAD POP
    if (gameKey === 'bubblePop') {
        let pops = 0, isLive = true;
        let overlay = window.createArcadeModal("🎈 Interactive Bead Pop!", "<div id='box' style='position:relative; width:100%; height:100%; overflow:hidden;'></div>", () => { isLive = false; });
        const arena = overlay.querySelector('#box');
        for (let i = 0; i < 5; i++) {
            let b = document.createElement('div');
            b.style = `position:absolute; width:40px; height:40px; border-radius:50%; background:${['#FF7FA5','#BCE7DC','#FFC93C','#4CACE0','#B47EEA'][i]}; text-align:center; line-height:40px; font-size:20px; cursor:pointer; left:${Math.random()*320}px; top:${Math.random()*240}px; transition:all 0.5s ease-out; font-weight:bold;`;
            b.textContent = "🔮"; arena.appendChild(b);
            let dance = setInterval(() => { if(!isLive) return clearInterval(dance); b.style.left=`${Math.random()*320}px`; b.style.top=`${Math.random()*240}px`; }, 550);
            b.onclick = () => { pops++; b.remove(); clearInterval(dance); if(pops===5) { window.awardKidsBadge('first_pop', window.globalBadgesDB.first_pop); overlay.remove(); } };
        }
    }
    // 2. CEO RIDDLE (NO TYPING - MULTIPLE CHOICE)
    else if (gameKey === 'riddle') {
        let overlay = window.createArcadeModal("🕵️ Riddle Choice Board", `
            <p style='margin:0 0 15px 0; font-weight:bold; text-align:center; font-size:14px;'>"I have a hole in the middle, and you string me onto wires to build custom bracelets. What am I?"</p>
            <button class='choice-btn' style='width:90%; padding:10px; margin:5px; background:var(--bg-mint); border:none; border-radius:10px; font-weight:bold; cursor:pointer;' onclick='alert("❌ Not quite! That holds the pieces!");'>⛓️ A Wire Lock</button>
            <button class='choice-btn' style='width:90%; padding:10px; margin:5px; background:var(--bg-mint); border:none; border-radius:10px; font-weight:bold; cursor:pointer;' id='correct-riddle'>🔮 A Colorful Bead</button>
            <button class='choice-btn' style='width:90%; padding:10px; margin:5px; background:var(--bg-mint); border:none; border-radius:10px; font-weight:bold; cursor:pointer;' onclick='alert("❌ Scissors cut strings!");'>✂️ Sharp Scissors</button>
        `);
        overlay.querySelector('#correct-riddle').onclick = () => { alert("🎉 Correct! You decoded the secret item!"); window.awardKidsBadge('riddle_cracker', window.globalBadgesDB.riddle_cracker); overlay.remove(); };
    }
    // 3. LUCKY CHARM
    else if (gameKey === 'mystery') {
        let opts = ["🌸 Handmade Daisy Loop", "🌈 Rainbow Strip Spacer", "🦄 Fantasy Unicorn Lock", "🌟 Golden Star Accent"];
        alert(`🎁 Clink... Pop! Today's recommended design charm is the: ${opts[Math.floor(Math.random()*opts.length)]}!`);
        window.awardKidsBadge('lucky_spinner', window.globalBadgesDB.lucky_spinner);
    }
    // 4. COLOR SORTER
    else if (gameKey === 'colorSort') {
        let overlay = window.createArcadeModal("🎨 Quick Color Sorter", `
            <p style='margin:0 0 15px 0; font-weight:bold; text-align:center;'>Drag your eyes here! Should the cute Bubblegum Pink Bead go into the Pink Box or Blue Box?</p>
            <div style='display:flex; gap:15px; width:100%; justify-content:center;'>
                <button id='sort-pink' style='padding:15px; background:#FF7FA5; border:none; color:#FFF; font-weight:bold; border-radius:12px; cursor:pointer;'>Pink Box 📦</button>
                <button style='padding:15px; background:#4CACE0; border:none; color:#FFF; font-weight:bold; border-radius:12px; cursor:pointer;' onclick='alert("❌ Oops, wrong box!")'>Blue Box 📦</button>
            </div>
        `);
        overlay.querySelector('#sort-pink').onclick = () => { alert("📦 Perfect match sorted!"); window.awardKidsBadge('matching_wizard', window.globalBadgesDB.matching_wizard); overlay.remove(); };
    }
    // 5. CHAIN MATCH (NO TYPING - SELECTOR)
    else if (gameKey === 'patternMatch') {
        let overlay = window.createArcadeModal("📐 Sequence Matcher", `
            <p style='margin:0 0 15px 0; font-weight:bold; text-align:center;'>What color missing bead finishes this loop chain pattern?</p>
            <div style='font-size:18px; margin-bottom:15px; font-weight:bold;'>🌸, 💎, 🌸, 💎, ____?</div>
            <div style='display:flex; gap:10px;'>
                <button id='pat-correct' style='padding:10px 20px; font-weight:bold; background:#FFF; border:2px solid #FF7FA5; border-radius:10px; cursor:pointer;'>🌸 Flower</button>
                <button style='padding:10px 20px; font-weight:bold; background:#FFF; border:2px solid #4CACE0; border-radius:10px; cursor:pointer;' onclick='alert("❌ Try again!")'>💎 Diamond</button>
            </div>
        `);
        overlay.querySelector('#pat-correct').onclick = () => { alert("🏆 Pattern verified perfectly!"); window.awardKidsBadge('pattern_pro', window.globalBadgesDB.pattern_pro); overlay.remove(); };
    }
};
