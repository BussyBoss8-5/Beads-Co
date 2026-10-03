/* ==========================================================================
   ARCADE MINIS & BOARDS 13-20 (arcade-mini-games.js)
   ========================================================================== */
window.runMiniGames = (key) => {
    if (key === 'soundPop') {
        let seq = [['A','B','C'][Math.floor(Math.random()*3)], ['A','B','C'][Math.floor(Math.random()*3)], ['A','B','C'][Math.floor(Math.random()*3)]], user = [];
        let overlay = window.createArcadeModal("🎵 Memory Chimes", `<div id='st' style='font-weight:bold; margin-bottom:10px;'>Watch Simon-Says...</div><div style='display:flex; gap:10px;'><button class='play-btn' id='a'>A</button><button class='play-btn' style='background:#FFC93C;' id='b'>B</button><button class='play-btn' style='background:#4CACE0;' id='c'>C</button></div>`);
        const st = overlay.querySelector('#st');
        setTimeout(() => { st.textContent = "Repeat pattern now!"; }, 1500);
        ['a','b','c'].forEach(k => {
            overlay.querySelector('#'+k).onclick = () => {
                user.push(k.toUpperCase());
                if(user[user.length-1] !== seq[user.length-1]) { overlay.remove(); }
                else if(user.length === seq.length) { window.awardKidsBadge('music_maestro', window.globalBadgesDB.music_maestro); overlay.remove(); }
            };
        });
    }
    else if (key === 'mazeRunner') {
        let overlay = window.createArcadeModal("🌀 Corridor Maze", `<div id='m' style='width:300px; height:100px; background:#1D1128; position:relative;'><div style='width:260px; height:30px; background:var(--bg-mint); position:absolute; left:20px; top:35px;'></div><div id='s' style='width:25px; height:25px; background:#FF7FA5; position:absolute; left:20px; top:37px; cursor:pointer;'>S</div><div id='g' style='width:25px; height:25px; background:#39FF14; position:absolute; left:250px; top:37px;'>G</div></div>`);
        let track = false; overlay.querySelector('#s').onmouseenter = () => track = true;
        overlay.querySelector('#m').onmousemove = (e) => { if(track && e.target === overlay.querySelector('#m')) { track = false; alert("💥 Wall bump!"); } };
        overlay.querySelector('#g').onmouseenter = () => { if(track) { window.awardKidsBadge('speed_popper', window.globalBadgesDB.speed_popper); overlay.remove(); } };
    }
    else if (key === 'ticTacBead') {
        let b = Array(9).fill(""), active = true;
        const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        const checkWin = (mark) => lines.some(l => l.every(i => b[i] === mark));
        let overlay = window.createArcadeModal("🤖 Bot Tic-Tac-Toe", "<div id='t' style='display:grid; grid-template-columns:repeat(3,1fr); gap:6px; width:150px; height:150px;'></div>");
        for(let i=0; i<9; i++) {
            let c = document.createElement('button'); c.style="background:var(--bg-mint); font-weight:bold;"; c.textContent = ""; overlay.querySelector('#t').appendChild(c);
            c.onclick = () => {
                if(c.textContent !== "" || !active) return; b[i] = "X"; c.textContent = "🔮";
                if(checkWin("X")) { alert("🎉 You win!"); window.awardKidsBadge('tic_tac_champ', window.globalBadgesDB.tic_tac_champ); overlay.remove(); active=false; return; }
                let slots = b.map((v,idx) => v==="" ? idx : null).filter(v => v!==null);
                if(slots.length === 0) { alert("🤝 It's a draw!"); overlay.remove(); active=false; return; }
                let bot = slots[0]; b[bot] = "O"; overlay.querySelector('#t').children[bot].textContent = "🤖";
                if(checkWin("O")) { alert("🤖 The bot wins this time!"); overlay.remove(); active=false; return; }
                if(b.every(v => v !== "")) { alert("🤝 It's a draw!"); overlay.remove(); active=false; }
            };
        }
    }
    else if (key === 'hiddenGem') {
        let overlay = window.createArcadeModal("🔍 Chest Hunt", `<div id='r' style='display:flex; gap:10px;'></div>`);
        let lucky = Math.floor(Math.random()*3);
        for(let i=0; i<3; i++) {
            let c = document.createElement('button'); c.style="font-size:32px; cursor:pointer;"; c.textContent="📦"; overlay.querySelector('#r').appendChild(c);
            c.onclick = () => { if(i===lucky) { window.awardKidsBadge('first_pop', window.globalBadgesDB.first_pop); overlay.remove(); } else alert("💨 Empty compartment cell slot!"); };
        }
    }
    else if (key === 'wordScramble') {
        let overlay = window.createArcadeModal("🔤 Word Tray", `<div id='tb' style='font-size:20px; font-weight:bold; margin-bottom:10px;'>Typed: </div><div id='row'><button class='s-b'>B</button><button class='s-b'>E</button><button class='s-b'>A</button><button class='s-b'>D</button><button class='s-b'>S</button></div>`);
        let typed = ""; overlay.querySelectorAll('.s-b').forEach(btn => {
            btn.onclick = () => { typed += btn.textContent; overlay.querySelector('#tb').textContent = `Typed: ${typed}`; btn.style.display="none"; if(typed.length===5 && typed==="BEADS") { window.awardKidsBadge('riddle_cracker', window.globalBadgesDB.riddle_cracker); overlay.remove(); } };
        });
    }
    else if (key === 'pixelPainter') {
        let overlay = window.createArcadeModal("👾 Pixel Board", "<div id='px' style='display:grid; grid-template-columns:repeat(4,1fr); gap:4px;'></div><button class='play-btn' id='sub' style='margin-top:10px;'>Complete 🚀</button>");
        for(let i=0; i<16; i++) {
            let b = document.createElement('div'); b.style="background:#E5E5E5; width:35px; height:35px; cursor:pointer;"; overlay.querySelector('#px').appendChild(b);
            b.onclick = () => b.style.background = "var(--logo-pink)";
        }
        overlay.querySelector('#sub').onclick = () => { window.awardKidsBadge('pixel_picasso', window.globalBadgesDB.pixel_picasso); overlay.remove(); };
    }
    else if (key === 'gravityBead') {
        let overlay = window.createArcadeModal("🚀 Catch Loop", `<div style='width:100%; height:150px; position:relative;'><div id='fl' style='position:absolute; font-size:32px; cursor:pointer; left:150px; top:40px;'>🦄</div></div>`);
        overlay.querySelector('#fl').onclick = () => { window.awardKidsBadge('speed_catcher', window.globalBadgesDB.speed_catcher); overlay.remove(); };
    }
    else if (key === 'bossQuiz') {
        let overlay = window.createArcadeModal("👑 Studio Exam", `<p style='font-weight:bold; font-size:13px;'>Which connector string loops blocks together?</p><button class='play-btn' onclick='alert("❌ Wrong")'>⛓️ Gold Metal Links</button><button class='play-btn' id='ok-b' style='margin-top:5px;'>🧵 Elastic Wire String</button>`);
        overlay.querySelector('#ok-b').onclick = () => { window.awardKidsBadge('jewelry_boss', window.globalBadgesDB.jewelry_boss); overlay.remove(); };
    }
};
