/* ==========================================================================
   PART 1: DATA REPOSITORIES & BACKEND INFRASTRUCTURE
   ========================================================================== */
let db = JSON.parse(localStorage.getItem("beads_db")) || [
    { number: "001", name: "Sophia Miller", beads: "Custom Letter Bracelet (Age: 9, Size: Medium)", price: "$5.00", status: "Shipped" },
    { number: "002", name: "Lucas Vance", beads: "Acrylic Round Bead Pack", price: "$0.50", status: "Pending" }
];
let shoppingCart = [], selectedColorText = "Ruby Red", selectedSubItemTitle = "", currentGlobalPrice = "$2.00";

let stockDB = JSON.parse(localStorage.getItem("beads_stock_db")) || [
    { name: "Acrylic Pastel Pink Beads", cat: "Loose Beads", qty: 450, alert: 100 },
    { name: "Alphabet Letter Blocks", cat: "Loose Beads", qty: 45, alert: 80 },
    { name: "Pre-cut Elastic Wire Strings", cat: "Bracelets", qty: 120, alert: 50 },
    { name: "Satin Ribbon Hanging Straps", cat: "Keychains", qty: 12, alert: 20 },
    { name: "Thick Canvas Art Sheets", cat: "Bookmarks", qty: 200, alert: 30 }
];

const braceletItemsList = [
    { name: "Alphabet Custom Name Bracelet", stock: "High", pic: "📿", info: "Custom name letters." },
    { name: "Rainbow Wave Striped Band", stock: "High", pic: "🌈", info: "Color wave patterns." },
    { name: "Friendly Flower Daisy Loop", stock: "Low", pic: "🌸", info: "Handmade daisy loops." },
    { name: "Glow-In-The-Dark Midnight Strip", stock: "Out", pic: "🔮", info: "Out of Stock neon spacers." }
];

const masterFullDatabase = {
    beads: { p: "$0.50", e: "🎨", tag: "Craft Packs", list: [{name:"Acrylic Pastel Mix Pack",stock:"High",pic:"🎨",info:"Soft mix."}, {name:"Alphabet Letter Blocks Box",stock:"Low",pic:"🔤",info:"Perfect for names."}, {name:"Gold Star Spacer Pack",stock:"Out",pic:"🌟",info:"Awaiting bench arrivals."}] },
    rings: { p: "$1.00", e: "💍", tag: "Bead Rings", list: [{name:"Mini Flower Accent Ring",stock:"High",pic:"💍",info:"Elastic beaded bands."}, {name:"Alphabet Single Letter Ring",stock:"High",pic:"🔤",info:"Custom initial band."}] },
    keychains: { p: "$3.00", e: "🔑", tag: "Keychains", list: [{name:"Backpack Name Hanging Strip",stock:"High",pic:"🔑",info:"Clips onto zippers securely."}, {name:"Lucky Charm Ribbon Loop",stock:"Low",pic:"🎗️",info:"Satin wire loop straps."}] },
    bookmarks: { p: "$4.00", e: "🔖", tag: "Paper Art", list: [{name:"Hand-Drawn Floral Art Marker",stock:"High",pic:"🔖",info:"Watercolor plants."}, {name:"Glitter Background Sky Shield",stock:"High",pic:"✨",info:"Sparkly background paint."}] },
    earrings: { p: "$6.00", e: "✨", tag: "Earrings", list: [{name:"Dangle Pearl Drops Set",stock:"High",pic:"✨",info:"Glass pearls on loops."}, {name:"Cute Pastel Star Studs",stock:"Out",pic:"⭐",info:"Sold out."}] },
    books: { p: "$7.00", e: "📚", tag: "Coloring Books", list: [{name:"Cute Animals Adventure Book",stock:"High",pic:"📚",info:"Perfect for crayons."}, {name:"Magical Unicorns Fantasy Book",stock:"High",pic:"🦄",info:"Sparkle sketches."}] },
    necklaces: { p: "$10.00", e: "👑", tag: "Necklaces", list: [{name:"Daisy Chain Choker String",stock:"High",pic:"👑",info:"Alternating flower strands."}, {name:"Princess Pearl Choker Trio",stock:"Low",pic:"📿",info:"Premium rows."}] },
    boxes: { p: "$20.00", e: "📦", tag: "Mega Trays", list: [{name:"Boutique Mega Craft Box",stock:"High",pic:"📦",info:"Full menu tray bundle."}] }
};

document.addEventListener("DOMContentLoaded", () => {
    const table = document.querySelector("#orders-table tbody"), modal = document.getElementById("category-modal");
    const cartList = document.getElementById("cart-list-container"), cartBox = document.getElementById("cart-dropdown-panel");
    const save = () => { localStorage.setItem("beads_db", JSON.stringify(db)); window.drawTable(); };

    window.checkUserLoginStatus = () => {
        let u = localStorage.getItem("beads_active_user") || "Customer", t = document.getElementById("user-status-display");
        if (t) t.innerHTML = u === "Customer" ? `Mode: <strong>Customer</strong>` : `Welcome, <strong style="color:var(--logo-pink);">${u}! ✨</strong>`;
    };
    window.triggerCustomerLoginPrompt = (e) => {
        if (e) e.preventDefault(); let n = prompt("👤 Enter name:");
        localStorage.setItem("beads_active_user", n && n.trim() ? n.trim() : "Customer");
        if (n) alert(`👋 Hello ${n.trim()}!`); window.checkUserLoginStatus();
    };
    window.triggerCustomerLogout = (e) => { if (e) e.preventDefault(); localStorage.setItem("beads_active_user", "Customer"); window.checkUserLoginStatus(); alert("Logged out."); };

    window.submitCeoRiddleGuess = () => {
        let gInput = document.getElementById("riddle-user-answer"), gVal = gInput ? gInput.value.trim() : "";
        if (!gVal) return alert("Type your guess first!");
        let u = localStorage.getItem("beads_active_user") || "Customer", dbList = JSON.parse(localStorage.getItem("beads_riddle_db")) || [];
        dbList.push({ user: u, answer: gVal, timestamp: new Date().toLocaleDateString() });
        localStorage.setItem("beads_riddle_db", JSON.stringify(dbList));
        alert(`🎉 Guess logged for ${u}!`); gInput.value = "";
    };

    window.drawTable = () => {
        if (!table) return; table.innerHTML = ""; let pnd = 0, rev = 0;
        db.forEach((item, idx) => {
            if (item.status === "Pending") pnd++; rev += parseFloat(item.price.replace("$", ""));
            let r = table.insertRow();
            r.innerHTML = `<td>#${item.number}</td><td>${item.name}</td><td>${item.beads}</td><td>${item.price}</td><td><span class="badge ${item.status==='Shipped'?'green':'yellow'}" onclick="flipStatus(${idx})">${item.status} 🔄</span></td>`;
        });
        if (document.getElementById("count-pending")) document.getElementById("count-pending").textContent = pnd;
        if (document.getElementById("count-revenue")) document.getElementById("count-revenue").textContent = "$" + rev.toFixed(2);
        
        let activeGuesses = JSON.parse(localStorage.getItem("beads_riddle_db")) || [];
        if (document.getElementById("count-riddle-guesses")) document.getElementById("count-riddle-guesses").textContent = activeGuesses.length;
    };
    window.flipStatus = (idx) => { db[idx].status = db[idx].status === "Pending" ? "Shipped" : "Pending"; save(); };

    window.drawRiddleTable = () => {
        let rTable = document.querySelector("#admin-riddle-table tbody");
        if (!rTable) return; rTable.innerHTML = "";
        let activeGuesses = JSON.parse(localStorage.getItem("beads_riddle_db")) || [];
        activeGuesses.forEach(g => {
            let row = rTable.insertRow();
            row.innerHTML = `<td><strong>${g.user}</strong></td><td><span style="color:var(--logo-pink); font-weight:bold;">${g.answer}</span></td><td>${g.timestamp}</td>`;
        });
    };

    window.clearWeeklyRiddleDatabaseLogs = () => {
        if (confirm("🗑️ Are you sure you want to clear all player guesses?")) {
            localStorage.removeItem("beads_riddle_db");
            alert("✨ Weekly riddle notebook wiped clean!");
            window.drawRiddleTable();
        }
    };
    if (document.getElementById("admin-riddle-table")) window.drawRiddleTable();
/* ==========================================================================
   PART 2: BEAD STOCK ENGINE, CART SYSTEMS & KEY ACCESS INFRASTRUCTURE
   ========================================================================== */
window.drawStockTable = () => {
    let sTable = document.querySelector("#stock-table tbody"); if (!sTable) return; sTable.innerHTML = "";
    let totalTypes = stockDB.length, lowWarnings = 0, totalPiecesCombined = 0;
    stockDB.forEach((item, idx) => {
        totalPiecesCombined += item.qty; let isLow = item.qty <= item.alert; if (isLow) lowWarnings++;
        sTable.insertRow().innerHTML = `<td><strong>${item.name}</strong></td><td><span class="badge green" style="background:#FFF; border:1px solid var(--logo-mint); color:var(--text-plum);">${item.cat}</span></td><td><span class="badge" style="background:var(--bg-mint); cursor:pointer;" onclick="editMaterialStockQuantity(${idx})">${item.qty} pcs ✏️</span></td><td><span class="badge ${isLow ? 'yellow' : 'green'}">${isLow ? '⚠️ Low Stock' : 'In Stock'}</span></td>`;
    });
    if (document.getElementById("total-items-count")) document.getElementById("total-items-count").textContent = totalTypes;
    if (document.getElementById("low-stock-count")) document.getElementById("low-stock-count").textContent = lowWarnings;
    if (document.getElementById("total-pieces-count")) document.getElementById("total-pieces-count").textContent = totalPiecesCombined;
};
window.editMaterialStockQuantity = (idx) => {
    let newQty = prompt(`✏️ Update stock for "${stockDB[idx].name}":`, stockDB[idx].qty);
    if (newQty && !isNaN(newQty)) { stockDB[idx].qty = parseInt(newQty); localStorage.setItem("beads_stock_db", JSON.stringify(stockDB)); window.drawStockTable(); }
};
function buildSeparateAmazonScreen() {
    let grid = document.getElementById("container-sub-products"); if (!grid || window.location.href.includes("bracelets.html")) return; grid.innerHTML = "";
    let t = window.activeCatalogPageKey || "beads", a = masterFullDatabase[t]; if (!a) return; currentGlobalPrice = a.p;
    a.list.forEach((v, idx) => {
        let btn = document.createElement("button"); btn.className = "sub-item-card-option" + (idx === 0 ? " active-item" : "");
        if (idx === 0) { selectedSubItemTitle = v.name; updateStockBadgeLabel(v.stock, v.pic); }
        btn.innerHTML = `<div class="product-mini-thumbnail">${v.pic}</div><div class="product-text-details"><h5>${v.name}</h5><p>${v.info}</p></div>`; grid.appendChild(btn);
        btn.onclick = (e) => { e.preventDefault(); document.querySelectorAll(".sub-item-card-option").forEach(c => c.classList.remove("active-item")); btn.classList.add("active-item"); selectedSubItemTitle = v.name; updateStockBadgeLabel(v.stock, v.pic); };
    });
}
function renderSeparateBraceletsScreen() {
    let grid = document.getElementById("container-sub-products"); if (!grid || !window.location.href.includes("bracelets.html")) return; grid.innerHTML = ""; currentGlobalPrice = "$5.00";
    braceletItemsList.forEach((v, idx) => {
        let btn = document.createElement("button"); btn.className = "sub-item-card-option" + (idx === 0 ? " active-item" : "");
        if (idx === 0) { selectedSubItemTitle = v.name; updateStockBadgeLabel(v.stock, v.pic); }
        btn.innerHTML = `<div class="product-mini-thumbnail">${v.pic}</div><div class="product-text-details"><h5>${v.name}</h5><p>${v.info}</p></div>`; grid.appendChild(btn);
        btn.onclick = (e) => { e.preventDefault(); document.querySelectorAll(".sub-item-card-option").forEach(c => c.classList.remove("active-item")); btn.classList.add("active-item"); selectedSubItemTitle = v.name; updateStockBadgeLabel(v.stock, v.pic); };
    });
}
function updateStockBadgeLabel(stockString, productPic) {
    let wrapper = document.getElementById("wrapper-stock-badge"), display = document.getElementById("big-item-emoji"); if (!wrapper || !display) return; wrapper.innerHTML = "";
    if (stockString === "Out") { display.textContent = "📿"; wrapper.innerHTML = `<span class="stock-badge-indicator red">🛑 Out of Stock</span>`; }
    else if (stockString === "Low") { display.textContent = "📿"; wrapper.innerHTML = `<span class="stock-badge-indicator yellow">⚠️ Low Stock</span>`; }
    else { display.textContent = productPic; }
}
window.selectRainbowBeadColor = (el, text) => { document.querySelectorAll(".color-matrix-node").forEach(n => n.classList.remove("selected-node")); el.classList.add("selected-node"); selectedColorText = text; };
window.addCustomAmazonItemToCart = () => {
    let w = document.getElementById("wrapper-stock-badge"); if (w && w.innerHTML.includes("Out of Stock")) return alert("🛑 Sorry! Out of stock!");
    if ((JSON.parse(localStorage.getItem("beads_settings_db")) || { storeStatus: "Open" }).storeStatus === "Closed") return alert("🛑 Shop Closed!");
    shoppingCart.push({ name: `${selectedSubItemTitle} (${selectedColorText})`, price: currentGlobalPrice }); window.drawCart(); if (cartBox) cartBox.classList.add("show-cart");
};
window.revealMoreCatalogCollections = () => {
    let g = document.getElementById("catalog-category-grid"); if (!g) return; if (document.getElementById("catalog-show-more-btn")) document.getElementById("catalog-show-more-btn").remove();
    [{ k: "bookmarks", e: "🔖", t: "Paper Bookmarks", p: "$4.00", url: "Amazon Pages/beads.html" }, { k: "earrings", e: "✨", t: "Earrings", p: "$6.00", url: "Amazon Pages/beads.html" }, { k: "books", e: "📚", t: "Coloring Books", p: "$7.00", url: "Amazon Pages/beads.html" }, { k: "bracelets", e: "💝", t: "Bracelets", p: "$5.00", url: "Amazon Pages/bracelets.html" }, { k: "necklaces", e: "👑", t: "Necklaces", p: "$10.00", url: "Amazon Pages/beads.html" }, { k: "boxes", e: "📦", t: "All-In-One Box", p: "$20.00", url: "Amazon Pages/beads.html" }].forEach(c => {
        let cd = document.createElement("div"); cd.className = "category-card"; cd.onclick = () => { if (c.k !== "bracelets") window.activeCatalogPageKey = c.k; window.location.href = c.url; };
        cd.innerHTML = `<div class="category-icon" style="height:90px;">${c.e}</div><div class="category-title">${c.t}</div><button class="open-btn">View Options (${c.p})</button>`; g.appendChild(cd);
    });
};
window.toggleCartDropdown = () => cartBox && cartBox.classList.toggle("show-cart");
window.removeItemFromCart = (idx) => { shoppingCart.splice(idx, 1); window.drawCart(); };
window.closeCategoryMenu = () => modal && modal.classList.remove("show-menu");
window.drawCart = () => {
    if (!cartList) return; cartList.innerHTML = ""; let tot = 0; if (document.getElementById("cart-counter-icon")) document.getElementById("cart-counter-icon").textContent = shoppingCart.length;
    if (shoppingCart.length === 0) { cartList.innerHTML = `<span style="color:var(--gray-text);font-size:12px;text-align:center;display:block;margin:10px 0;">Cart empty...</span>`; if (document.getElementById("cart-total-price")) document.getElementById("cart-total-price").textContent = "$0.00"; return; }
    shoppingCart.forEach((item, idx) => { tot += parseFloat(item.price.replace("$", "")); cartList.innerHTML += `<div class="cart-row"><strong>${item.name}</strong><br><span style="color:var(--logo-pink)">${item.price}</span><button class="remove-cart-item" onclick="removeItemFromCart(${idx})">✕</button></div>`; });
    if (document.getElementById("cart-total-price")) document.getElementById("cart-total-price").textContent = "$" + tot.toFixed(2);
};
window.checkoutShoppingCart = () => {
    if (!shoppingCart.length) return; let act = localStorage.getItem("beads_active_user") || "Customer", buy = act !== "Customer" ? act : prompt("Enter name:"), pay = document.getElementById("checkout-payment-type").value; if (!buy) return;
    db.push({ number: String(db.length + 1).padStart(3, "0"), name: buy, beads: shoppingCart.map(i => i.name).join(", "), price: document.getElementById("cart-total-price").textContent, status: "Pending" });
    shoppingCart = []; window.drawCart(); save(); alert(`🎉 Order logged for ${buy}!`);
};
const adminBtn = document.querySelector(".admin-dashed-btn"); if (adminBtn) { adminBtn.addEventListener("click", (e) => { e.preventDefault(); let pass = prompt("🔑 Enter Owner Passcode:"); if (pass === "beads9") { alert("✨ Welcome Owner."); window.location.href = "index.html"; } else if (pass !== null) alert("🛑 Access Denied!"); }); }
if(document.getElementById("add-order-btn")) {
    document.getElementById("add-order-btn").onclick = () => document.getElementById("popup-window").classList.add("show-popup");
    document.getElementById("close-modal-btn").onclick = () => document.getElementById("popup-window").classList.remove("show-popup");
    document.getElementById("save-order-btn").onclick = () => {
        let n = document.getElementById("input-name").value.trim(), a = document.getElementById("input-age").value.trim(), s = document.getElementById("input-size").value; if (!n) return alert("Add name!");
        db.push({ number: String(db.length+1).padStart(3,'0'), name: n, beads: `${document.getElementById("input-beads").value || "Jewelry"} (Age: ${a||'N/A'}, Size: ${s})`, price: document.getElementById("input-price").value, status: "Pending" }); document.getElementById("popup-window").classList.remove("show-popup"); save();
    };
}
buildSeparateAmazonScreen(); renderSeparateBraceletsScreen(); window.checkUserLoginStatus(); window.drawCart(); window.drawTable(); window.drawStockTable();
});
