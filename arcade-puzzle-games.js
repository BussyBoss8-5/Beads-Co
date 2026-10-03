/* ==========================================================================
   ARCADE SUB-MODULE C: IMMERSIVE CLICK WORKSPACES (GAMES 6-12) (arcade-puzzle-games.js)
   ========================================================================== */
window.runPuzzleGames = (gameKey) => {
    // 6. BEAD COUNTER HUNT
    if (gameKey === 'beadCounting') {
        let count = 0;
        let overlay = window.createArcadeModal("🔢 Bead Counter Hunt", `<div id='cnt-score' style='font-size:16px; font-weight:800; color:#FF7FA5; margin-bottom:10px;'>Found: 0 / 5</div><div id='sub-arena' style='position:relative; width:340px; height:180px; background:#F8F9FA; border-radius:12px; overflow:hidden;'></div>`);
        const sub = overlay.querySelector('#sub-arena');
        for(let i=0; i<5; i++) {
            let s = document.createElement('div'); s.style = `position:absolute; font-size:24px; cursor:pointer; left:${Math.random()*300}px; top:${Math.random()*140}px;`; s.textContent = "⭐"; sub.appendChild(s);
            s.onclick = () => { count++; overlay.querySelector('#cnt-score').textContent = `Found: ${count} / 5`; s.remove(); if(count===5) { alert("🔢 Excellent counting!"); window.awardKidsBadge('matching_wizard', window.globalBadgesDB.matching_wizard); overlay.remove(); } };
        }
    }
    // 7. MEMORY GRID FLIPPER
    else if (gameKey === 'memoryMatch') {
        let clicked = null, matched = 0;
        let overlay = window.createArcadeModal("🧠 Memory Trays", "<div id='m-grid' style='display:grid; grid-template-columns:repeat(4,1fr); gap:10px; width:100%; height:100%; justify-items:center; align-content:center;'></div>");
        let deck = ["🌸","🌸","🌈","🌈","🦄","🦄","🌟","🌟"].sort(() => Math.random() - 0.5);
        deck.forEach((emoji) => {
            let card = document.createElement('button'); card.style = "width:65px; height:65px; background:var(--bg-mint); border:none; border-radius:12px; font-size:28px; cursor:pointer;"; card.textContent = "❓"; overlay.querySelector('#m-grid').appendChild(card);
            card.onclick = () => {
                if (card.textContent !== "❓") return; card.textContent = emoji;
                if (!clicked) { clicked = card; } else {
                    if (clicked.textContent === card.textContent) { matched += 2; clicked = null; if(matched===8) { alert("🧠 Mind Memory Master!"); window.awardKidsBadge('pattern_pro', window.globalBadgesDB.pattern_pro); overlay.remove(); } } 
                    else { setTimeout(() => { card.textContent = "❓"; clicked.textContent = "❓"; clicked = null; }, 500); }
                }
            };
        });
    }
    // 8. SPEED CLICKER
    else if (gameKey === 'speedClick') {
        let taps = 0;
        let overlay = window.createArcadeModal("⏱️ Speed Wire Winder", `<div id='prog' style='font-size:28px; font-weight:800; color:#FF7FA5; margin-bottom:15px;'>Taps: 0 / 10</div><button id='tap-action' style='padding:12px; background:var(--text-plum); color:#FFF; font-weight:bold; border:none; border-radius:12px; cursor:pointer; width:80%;'>WIND WIRE 🔄</button>`);
        overlay.querySelector('#tap-action').onclick = () => { taps++; overlay.querySelector('#prog').textContent = `Taps: ${taps} / 10`; if(taps === 10) { alert("⚡ Winding completed!"); window.awardKidsBadge('speed_popper', window.globalBadgesDB.speed_popper); overlay.remove(); } };
    }
    // 9. RAINBOW TRACER
    else if (gameKey === 'rainbowTrace') {
        let overlay = window.createArcadeModal("🌈 Rainbow Painter", `<div id='canvas-rows' style='display:flex; flex-direction:column; gap:6px; width:100%; height:180px;'><div style='flex:1; background:#E5E5E5; border-radius:6px; cursor:crosshair;' onmouseenter='this.style.background="#FF7FA5"'></div><div style='flex:1; background:#E5E5E5; border-radius:6px; cursor:crosshair;' onmouseenter='this.style.background="#FFC93C"'></div><div style='flex:1; background:#E5E5E5; border-radius:6px; cursor:crosshair;' onmouseenter='this.style.background="#4CACE0"'></div></div><button id='done-paint' style='margin-top:15px; padding:8px; width:100%; background:var(--text-plum); color:#FFF; border:none; border-radius:10px; cursor:pointer; font-weight:bold;'>Finish Painting ✨</button>`);
        overlay.querySelector('#done-paint').onclick = () => { alert("🌈 Stunning artwork!"); window.awardKidsBadge('first_pop', window.globalBadgesDB.first_pop); overlay.remove(); };
    }
    // 10. CHARM STACKER
    else if (gameKey === 'charmStacker') {
        let blocks = 0;
        let overlay = window.createArcadeModal("🏰 Block Stacker", `<div id='stack-area' style='width:100%; height:160px; background:#F8F9FA; border-radius:12px; display:flex; flex-direction:column-reverse; align-items:center; padding:10px; box-sizing:border-box;'></div><button id='drop-block' style='margin-top:15px; padding:10px; width:100%; background:#FF7FA5; color:#FFF; border:none; border-radius:10px; font-weight:bold; cursor:pointer;'>Stack Block 📦</button>`);
        overlay.querySelector('#drop-block').onclick = () => { if(blocks >= 4) return; blocks++; let box = document.createElement('div'); box.style = "width:60px; height:30px; background:var(--logo-yellow); text-align:center; line-height:30px; font-weight:800; border:2px solid #000;"; box.textContent = ["B","E","A","D"][blocks-1]; overlay.querySelector('#stack-area').appendChild(box); if(blocks === 4) { alert("🏰 Stacking complete!"); window.awardKidsBadge('pattern_pro', window.globalBadgesDB.pattern_pro); overlay.remove(); } };
    }
    // 12. STICKER STUDIO
    else if (gameKey === 'stickerBook') {
        let overlay = window.createArcadeModal("🧸 Sticker Studio Board", `<div id='canvas-pad' style='width:100%; height:200px; background:#FFF; border:2px dashed var(--logo-mint); position:relative; cursor:cell; border-radius:12px;'></div>`);
        overlay.querySelector('#canvas-pad').onclick = (e) => {
            let rect = e.target.getBoundingClientRect(); let st = document.createElement('div'); st.style = `position:absolute; font-size:24px; left:${e.clientX - rect.left - 12}px; top:${e.clientY - rect.top - 12}px;`; st.textContent = "🍬"; overlay.querySelector('#canvas-pad').appendChild(st);
            setTimeout(() => { alert("🧸 Creative artwork saved!"); window.awardKidsBadge('matching_wizard', window.globalBadgesDB.matching_wizard); overlay.remove(); }, 1200);
        };
    }
    // 11. JAR GUESSING SCALE (NO TYPING - INTERACTIVE SLIDER TWEAK)
    else if (gameKey === 'guessHowMany') {
        let overlay = window.createArcadeModal("🏺 Guessing Balance Jar", `
            <p style='margin:0 0 10px 0; font-size:13px; text-align:center;'>Slide the balancer handle to guess the count inside the container jar!</p>
            <input type='range' id='jar-slider' min='1' max='30' value='5' style='width:85%; margin:15px 0;'>
            <div id='slider-lbl' style='font-size:24px; font-weight:900; color:#FF7FA5;'>Value: 5</div>
            <button id='submit-guess' style='margin-top:15px; padding:10px; width:90%; background:var(--text-plum); color:#FFF; border:none; border-radius:10px; font-weight:bold; cursor:pointer;'>Lock In Choice 🔒</button>
        `);
        const slider = overlay.querySelector('#jar-slider');
        slider.oninput = () => { overlay.querySelector('#slider-lbl').textContent = `Value: ${slider.value}`; };
        overlay.querySelector('#submit-guess').onclick = () => {
            if(slider.value >= 10 && slider.value <= 20) { alert("🎉 Bullseye balance! You found the matching range!"); window.awardKidsBadge('lucky_spinner', window.globalBadgesDB.lucky_spinner); overlay.remove(); } 
            else { alert(`❌ Ooh, ${slider.value} is un-balanced! Drag the gauge slider to a value between 10 and 20!`); }
        };
    }
};
