/* ==========================================================================
   BEADS & CO. - OPTIMIZED & DEBUGGED SCRIPT CONTROLLER
   ========================================================================== */

let currentActiveDiscountMultiplier = 1.0;
let db = JSON.parse(localStorage.getItem("beads_db")) || [
    { number: "001", name: "Sophia Miller", beads: "Custom Letter Bracelet (Age: 9, Size: Medium)", price: "$5.00", status: "Shipped" },
    { number: "002", name: "Lucas Vance", beads: "Acrylic Round Bead Pack", price: "$0.50", status: "Pending" }
];
let shoppingCart = [], selectedColorText = "Ruby Red", selectedThemeColorText = "Bubblegum Pink", selectedSubItemTitle = "", currentGlobalPrice = "$2.00";

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
const looseBeadsItemsList = [{ name: "Acrylic Pastel Pink Beads", stock: "Low", pic: "🎨", info: "Soft pastel shades." }, { name: "Alphabet Letter Blocks", stock: "High", pic: "🔤", info: "Perfect for names." }, { name: "Gold Star Spacer Pack", stock: "Out", pic: "🌟", info: "Awaiting bench arrivals." }];
const ringsItemsList = [{ name: "Mini Flower Accent Ring", stock: "Low", pic: "🎨", info: "Color wave patterns." }, { name: "Initial Letter Ring", stock: "High", pic: "🔤", info: "Custom initial band." }];
const keychainsItemsList = [{ name: "Backpack Name Hanging Strip", stock: "High", pic: "🔑", info: "Clips onto zippers securely." }, { name: "Lucky Charm Ribbon Loop", stock: "Low", pic: "🎗️", info: "Satin wire loop straps." }];
const bookmarksItemsList = [{ name: "Hand-Drawn Floral Art Marker", stock: "High", pic: "🔖", info: "Watercolor plants." }, { name: "Glitter Background Sky Shield", stock: "High", pic: "✨", info: "Sparkly background paint." }];
const earringsItemsList = [{ name: "Dangle Pearl Drops Set", stock: "High", pic: "✨", info: "Glass pearls on loops." }, { name: "Cute Pastel Star Studs", stock: "Out", pic: "⭐", info: "Sold out." }];
const booksItemsList = [{ name: "Cute Animals Adventure Book", stock: "High", pic: "📚", info: "Perfect for crayons." }, { name: "Magical Unicorns Fantasy Book", stock: "High", pic: "🦄", info: "Sparkle sketches." }];
const necklacesItemsList = [{ name: "Daisy Chain Choker String", stock: "High", pic: "👑", info: "Alternating flower strands." }, { name: "Princess Pearl Choker Trio", stock: "Low", pic: "📿", info: "Premium rows." }];
const boxesItemsList = [{ name: "Boutique Mega Craft Box", stock: "High", pic: "📦", info: "Full menu tray bundle." }];

const masterFullDatabase = {
    beads: { p: "$0.50", e: "🎨", tag: "Craft Packs", list: [{name:"Acrylic Pastel Mix Pack",stock:"High",pic:"🎨",info:"Soft mix."}, {name:"Alphabet Letter Blocks Box",stock:"Low",pic:"🔤",info:"Perfect for names."}, {name:"Gold Star Spacer Pack",stock:"Out",pic:"🌟",info:"Awaiting bench arrivals."}] },
    rings: { p: "$1.00", e: "💍", tag: "Bead Rings", list: [{name:"Mini Flower Accent Ring",stock:"Low",pic:"💍",info:"Elastic beaded bands."}, {name:"Initial Letter Ring",stock:"High",pic:"🔤",info:"Custom initial band."}] },
    keychains: { p: "$3.00", e: "🔑", tag: "Keychains", list: [{name:"Backpack Name Hanging Strip",stock:"High",pic:"🔑",info:"Clips onto zippers securely."}, {name:"Lucky Charm Ribbon Loop",stock:"High",pic:"🎗️",info:"Satin wire loop straps."}] },
    bookmarks: { p: "$4.00", e: "🔖", tag: "Paper Art", list: [{name:"Hand-Drawn Floral Art Marker",stock:"High",pic:"🔖",info:"Watercolor plants."}, {name:"Glitter Background Sky Shield",stock:"High",pic:"✨",info:"Sparkly background paint."}] },
    earrings: { p: "$6.00", e: "✨", tag: "Earrings", list: [{name:"Dangle Pearl Drops Set",stock:"High",pic:"✨",info:"Glass pearls on loops."}, {name:"Cute Pastel Star Studs",stock:"Out",pic:"⭐",info:"Sold out."}] },
    books: { p: "$7.00", e: "📚", tag: "Coloring Books", list: [{name:"Cute Animals Adventure Book",stock:"High",pic:"📚",info:"Perfect for crayons."}, {name:"Magical Unicorns Fantasy Book",stock:"High",pic:"🦄",info:"Sparkle sketches."}] },
    necklaces: { p: "$10.00", e: "👑", tag: "Necklaces", list: [{name:"Daisy Chain Choker String",stock:"High",pic:"👑",info:"Alternating flower strands."}, {name:"Princess Pearl Choker Trio",stock:"Low",pic:"📿",info:"Premium rows."}] },
    boxes: { p: "$20.00", e: "📦", tag: "Mega Trays", list: [{name:"Boutique Mega Craft Box",stock:"High",pic:"📦",info:"Full menu tray bundle."}] }
};

const siteThemePresets = {
    rubyRed: { bg: "#FDEBEC", mint: "#F5C2C7", pink: "#E63946", yellow: "#FFC93C" },
    tangerineOrange: { bg: "#FFEEE0", mint: "#FFD2AD", pink: "#FB8B24", yellow: "#FFC93C" },
    sunnyGold: { bg: "#FFF6DF", mint: "#FFE29A", pink: "#FF9F1C", yellow: "#FFC93C" },
    emeraldGreen: { bg: "#E7F7EE", mint: "#B7E4C7", pink: "#2E9E5B", yellow: "#FFC93C" },
    skyBlue: { bg: "#E3F0FA", mint: "#BFE0F5", pink: "#4CACE0", yellow: "#FFC93C" },
    indigoNight: { bg: "#EAEAF9", mint: "#C6C6ED", pink: "#4B4E9E", yellow: "#FFD166" },
    violetBloom: { bg: "#F1E8FB", mint: "#D9C2F0", pink: "#8E44AD", yellow: "#FFD166" },
    roseBlush: { bg: "#FFF0F3", mint: "#FFC2D1", pink: "#FF6F9D", yellow: "#FFC93C" },
    mintBreeze: { bg: "#E2F5F0", mint: "#BCE7DC", pink: "#2EC4B6", yellow: "#FFC93C" },
    lavenderDream: { bg: "#F1E8FB", mint: "#D9C2F0", pink: "#B47EEA", yellow: "#FFD166" },
    peachyCream: { bg: "#FDECE3", mint: "#FBD1BE", pink: "#FF8B6A", yellow: "#FFC93C" },
    charcoalChic: { bg: "#ECECEE", mint: "#C7C7CE", pink: "#3A3A45", yellow: "#FFC93C" },
    tealDeep: { bg: "#E0F5F5", mint: "#A9E0DE", pink: "#128C87", yellow: "#FFC93C" },
    coralReef: { bg: "#FFEDE8", mint: "#FFC2B2", pink: "#FF6F52", yellow: "#FFC93C" },
    plumBerry: { bg: "#F3E8F0", mint: "#DCB8D4", pink: "#8E3B6B", yellow: "#FFD166" },
    sandyBeige: { bg: "#FBF3E7", mint: "#EBD9B4", pink: "#C08A4E", yellow: "#FFC93C" },
    slateGray: { bg: "#EAEDF0", mint: "#C4CCD4", pink: "#546578", yellow: "#FFD166" },
    sunsetGradient: { bg: "linear-gradient(135deg, #FFEEE0 0%, #FFD6E8 100%)", mint: "#FFD2AD", pink: "linear-gradient(135deg, #FB8B24, #FF6F9D)", yellow: "#FFC93C" },
    oceanGradient: { bg: "linear-gradient(135deg, #E3F0FA 0%, #E2F5F0 100%)", mint: "#BFE0F5", pink: "linear-gradient(135deg, #4CACE0, #2EC4B6)", yellow: "#FFC93C" },
    auroraGradient: { bg: "linear-gradient(135deg, #F1E8FB 0%, #E2F5F0 50%, #FFF6DF 100%)", mint: "#D9C2F0", pink: "linear-gradient(135deg, #8E44AD, #2EC4B6)", yellow: "#FFD166" },
    berryGradient: { bg: "linear-gradient(135deg, #FDEBEC 0%, #F1E8FB 100%)", mint: "#F5C2C7", pink: "linear-gradient(135deg, #E63946, #8E44AD)", yellow: "#FFC93C" },
    goldenHourGradient: { bg: "linear-gradient(135deg, #FFF6DF 0%, #FFEEE0 100%)", mint: "#FFE29A", pink: "linear-gradient(135deg, #FF9F1C, #FB8B24)", yellow: "#FFC93C" },
    midnightGradient: { bg: "linear-gradient(135deg, #EAEAF9 0%, #ECECEE 100%)", mint: "#C6C6ED", pink: "linear-gradient(135deg, #4B4E9E, #3A3A45)", yellow: "#FFD166" },
    cottonCandyMix: { bg: "linear-gradient(135deg, #FFF0F3 0%, #E3F0FA 100%)", mint: "#FFC2D1", pink: "#FF7FA5", yellow: "#4CACE0" },
    neonTracerMix: { bg: "#1D1128", mint: "#3A3A45", pink: "#39FF14", yellow: "#00F0FF" },
    vintagePastelMix: { bg: "#FBF3E7", mint: "#EBD9B4", pink: "#E63946", yellow: "#2EC4B6" },
    cyberpunkBeadMix: { bg: "linear-gradient(45deg, #12042C, #2E0854)", mint: "#FF007F", pink: "#7B2CBF", yellow: "#00F0FF" },
    tropicalSorbetMix: { bg: "linear-gradient(135deg, #FFEDE8 0%, #FFF6DF 100%)", mint: "#FFC2B2", pink: "#FF6F52", yellow: "#FF9F1C" }
};
const siteThemeMeta = {
rubyRed: { name: "Ruby Red", desc: "Bold & cheerful crimson accents." }, tangerineOrange: { name: "Tangerine Orange", desc: "Warm citrus energy." }, sunnyGold: { name: "Sunny Gold", desc: "Bright golden sunshine tones." }, emeraldGreen: { name: "Emerald Green", desc: "Fresh garden-inspired green." }, skyBlue: { name: "Sky Blue", desc: "Cool breezy blue skies." }, indigoNight: { name: "Indigo Night", desc: "Deep twilight indigo hues." }, violetBloom: { name: "Violet Bloom", desc: "Rich blooming violet shades." }, roseBlush: { name: "Rose Blush", desc: "Soft romantic pink blush." }, mintBreeze: { name: "Mint Breeze", desc: "Cool refreshing teal mint." }, lavenderDream: { name: "Lavender Dream", desc: "Dreamy pastel lavender." }, peachyCream: { name: "Peachy Cream", desc: "Sweet creamy peach tones." }, charcoalChic: { name: "Charcoal Chic", desc: "Sleek modern neutral dark." }, tealDeep: { name: "Teal Deep", desc: "Deep oceanic teal shade." }, coralReef: { name: "Coral Reef", desc: "Vibrant tropical coral." }, plumBerry: { name: "Plum Berry", desc: "Rich juicy plum berry." }, sandyBeige: { name: "Sandy Beige", desc: "Warm earthy sandy neutral." }, slateGray: { name: "Slate Gray", desc: "Cool modern slate gray." }, sunsetGradient: { name: "Sunset Glow", desc: "Orange fading into pink." }, oceanGradient: { name: "Ocean Wave", desc: "Blue blending into teal." }, auroraGradient: { name: "Aurora Sky", desc: "Purple, mint & gold blend." }, berryGradient: { name: "Berry Mix", desc: "Red fading into violet." }, goldenHourGradient: { name: "Golden Hour", desc: "Warm orange sunset glow." }, midnightGradient: { name: "Midnight Fade", desc: "Indigo fading into charcoal." }, cottonCandyMix: { name: "Cotton Candy Mix", desc: "Sweet blended swirls of pastel pink and blue skies." }, neonTracerMix: { name: "Neon Tracer Mix", desc: "High-contrast dark studio style with glowing active accents." }, vintagePastelMix: { name: "Vintage Pastel Mix", desc: "Classic nostalgic tones balanced with warm earthy charm." }, cyberpunkBeadMix: { name: "Cyberpunk Bead Mix", desc: "Futuristic neon-on-dark aesthetic with magenta and cyan glows." }, tropicalSorbetMix: { name: "Tropical Sorbet Mix", desc: "Warm coral and golden citrus swirls for a sunny island vibe." }
};
let lastAppliedSiteTheme = null;
document.addEventListener("DOMContentLoaded", () => {
const table = document.querySelector("#orders-table tbody"), modal = document.getElementById("category-modal");
const cartBox = document.getElementById("cart-dropdown-panel");
const save = () => { localStorage.setItem("beads_db", JSON.stringify(db)); drawTable(); };
/* ==========================================================================
RESPONSIVE MOBILE ENGINE INITIALIZATION
========================================================================== */
const initResponsiveEngine = () => {
const pageWrapper = document.querySelector(".whole-page") || document.querySelector(".shop-split-page");
const sidebar = document.querySelector(".sidebar");
const mainContent = document.querySelector(".main-content") || document.querySelector(".shop-scroll-view");
if (!pageWrapper || !sidebar) return;
if (document.getElementById("mobile-menu-hamburger-trigger")) return;
const menuToggleBtn = document.createElement("button");
menuToggleBtn.id = "mobile-menu-hamburger-trigger";
menuToggleBtn.className = "mobile-nav-toggle";
menuToggleBtn.innerHTML = `<span>☰</span> Studio Menu`;
if (mainContent) {
pageWrapper.insertBefore(menuToggleBtn, mainContent);
}
menuToggleBtn.addEventListener("click", (e) => {
e.stopPropagation();
sidebar.classList.toggle("mobile-open");
});
if (mainContent) {
mainContent.addEventListener("click", () => {
if (sidebar.classList.contains("mobile-open")) {
sidebar.classList.remove("mobile-open");
}
});
}
};
initResponsiveEngine();
window.addEventListener("resize", () => {
const sidebar = document.querySelector(".sidebar");
if (window.innerWidth > 768 && sidebar && sidebar.classList.contains("mobile-open")) {
sidebar.classList.remove("mobile-open");
}
});
/* ==========================================================================
TAB INTERFACES & CUSTOMIZER OPERATIONS
========================================================================== */
window.switchCustomizerTab = (tabName) => {
const colPage = document.getElementById("customizer-page-colors"), layPage = document.getElementById("customizer-page-layouts");
const colBtn = document.getElementById("tab-btn-colors"), layBtn = document.getElementById("tab-btn-layouts");
if (!colPage || !layPage || !colBtn || !layBtn) return;
colPage.style.display = tabName === "colors" ? "block" : "none";
layPage.style.display = tabName === "colors" ? "none" : "block";
colBtn.className = tabName === "colors" ? "customizer-tab-active" : "customizer-tab-inactive";
layBtn.className = tabName === "colors" ? "customizer-tab-inactive" : "customizer-tab-active";
};
window.applyLayoutSetting = (type, mode) => {
const root = document.documentElement;
if (type === "font") {
if (mode === "bubblegum") root.style.setProperty("--main-font", "'Comfortaa', 'Fredoka', sans-serif");
if (mode === "minimal") root.style.setProperty("--main-font", "'Inter', 'Segoe UI', sans-serif");
if (mode === "pixel") root.style.setProperty("--main-font", "'Courier New', monospace");
}
if (type === "shape") {
root.style.setProperty("--card-radius", mode === "bubbly" ? "30px" : "0px");
root.style.setProperty("--button-radius", mode === "bubbly" ? "20px" : "0px");
document.querySelectorAll(".category-card, .number-box, .table-box").forEach(el => {
el.style.border = mode === "brutal" ? "3px solid var(--text-plum)" : "none";
el.style.boxShadow = mode === "brutal" ? "6px 6px 0px var(--text-plum)" : "none";
});
}
if (type === "motion") {
root.style.setProperty("--transition-speed", mode === "static" ? "0s" : "0.25s");
document.body.classList.toggle("disable-animations", mode === "static");
}
};
window.toggleThemeCustomizer = () => { let p = document.getElementById("theme-customize-panel"); if (p) p.classList.toggle("show-panel"); };
function paintTheme(t) {
const root = document.documentElement;
root.style.setProperty("--bg-mint", t.bg);
if (t.bg.includes("gradient")) root.style.setProperty("--text-plum", "#1D1128");
root.style.setProperty("--logo-mint", t.mint);
root.style.setProperty("--logo-pink", t.pink);
root.style.setProperty("--logo-yellow", t.yellow);
}
function updateThemeLabel(key) {
let label = document.getElementById("theme-current-label"); if (!label) return;
label.innerHTML = key && siteThemeMeta[key] ? `Current: <strong>${siteThemeMeta[key].name}</strong>` : `Current: <strong>Default</strong>`;
}
window.applySiteTheme = (key) => {
let t = siteThemePresets[key]; if (!t) return; paintTheme(t);
lastAppliedSiteTheme = key; localStorage.setItem("beads_active_theme", key);
document.querySelectorAll(".theme-swatch-option").forEach(s => s.classList.toggle("active-swatch", s.dataset.theme === key));
updateThemeLabel(key);
};
window.resetSiteTheme = () => {
["--bg-mint", "--logo-mint", "--logo-pink", "--logo-yellow"].forEach(v => document.documentElement.style.removeProperty(v));
lastAppliedSiteTheme = null; localStorage.removeItem("beads_active_theme");
document.querySelectorAll(".theme-swatch-option").forEach(s => s.classList.remove("active-swatch"));
updateThemeLabel(null);
};
let savedTheme = localStorage.getItem("beads_active_theme");
if (savedTheme && siteThemePresets[savedTheme]) window.applySiteTheme(savedTheme);
/* ==========================================================================
USER SIGN IN & RIDDLE HANDLERS
========================================================================== */
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
/* ==========================================================================
ADMIN CONSOLE DATA AGGREGATIONS
========================================================================== */
window.drawTable = () => {
if (!table) return; table.innerHTML = ""; let pnd = 0, rev = 0;
db.forEach((item, idx) => {
if (item.status === "Pending") pnd++; rev += parseFloat(item.price.replace("$", ""));
table.insertRow().innerHTML = `<td>#${item.number}</td><td>${item.name}</td><td>${item.beads}</td><td>${item.price}</td><td><span class="badge ${item.status==='Shipped'?'green':'yellow'}" onclick="flipStatus(${idx})">${item.status} 🔄</span></td>`;
});
if (document.getElementById("count-pending")) document.getElementById("count-pending").textContent = pnd;
if (document.getElementById("count-revenue")) document.getElementById("count-revenue").textContent = "$" + rev.toFixed(2);
let activeGuesses = JSON.parse(localStorage.getItem("beads_riddle_db")) || [];
if (document.getElementById("count-riddle-guesses")) document.getElementById("count-riddle-guesses").textContent = activeGuesses.length;
};
window.flipStatus = (idx) => { db[idx].status = db[idx].status === "Pending" ? "Shipped" : "Pending"; save(); };
window.drawRiddleTable = () => {
let rTable = document.querySelector("#admin-riddle-table tbody"); if (!rTable) return; rTable.innerHTML = "";
(JSON.parse(localStorage.getItem("beads_riddle_db")) || []).forEach(g => {
rTable.insertRow().innerHTML = `<td><strong>${g.user}</strong></td><td><span style="color:var(--logo-pink); font-weight:bold;">${g.answer}</span></td><td>${g.timestamp}</td>`;
});
};
window.clearWeeklyRiddleDatabaseLogs = () => {
if (confirm("🗑️ Are you sure you want to clear all player guesses?")) {
localStorage.removeItem("beads_riddle_db"); alert("✨ Weekly riddle notebook wiped clean!"); window.drawRiddleTable();
}
};
if (document.getElementById("admin-riddle-table")) window.drawRiddleTable();
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
window.triggerSettingsSave = () => {
let statusEl = document.getElementById("setting-store-status"), taxEl = document.getElementById("setting-tax-rate"), feeEl = document.getElementById("setting-delivery-fee");
if (!statusEl) return;
let settings = { storeStatus: statusEl.value, taxRate: parseFloat(taxEl.value) || 0, deliveryFee: parseFloat((feeEl.value || "0").replace("$", "")) || 0 };
localStorage.setItem("beads_settings_db", JSON.stringify(settings));
alert("✨ Settings saved!");
};
(() => {
let saved = JSON.parse(localStorage.getItem("beads_settings_db")); if (!saved) return;
let statusEl = document.getElementById("setting-store-status"), taxEl = document.getElementById("setting-tax-rate"), feeEl = document.getElementById("setting-delivery-fee");
if (statusEl) statusEl.value = saved.storeStatus || "Open";
if (taxEl && saved.taxRate) taxEl.value = saved.taxRate;
if (feeEl && saved.deliveryFee) feeEl.value = "$" + saved.deliveryFee.toFixed(2);
})();
window.editMaterialStockQuantity = (idx) => {
let newQty = prompt(`✏️ Update stock for "${stockDB[idx].name}":`, stockDB[idx].qty);
if (newQty && !isNaN(newQty)) { stockDB[idx].qty = parseInt(newQty); localStorage.setItem("beads_stock_db", JSON.stringify(stockDB)); window.drawStockTable(); }
};
/* ==========================================================================
CATALOG DISPLAY INTERFACE LAYERS
========================================================================== */
function renderScreenTemplate(condition, list, price) {
let grid = document.getElementById("container-sub-products"); if (!grid || !condition) return; grid.innerHTML = "";
currentGlobalPrice = price;
list.forEach((v, idx) => {
let btn = document.createElement("button"); btn.className = "sub-item-card-option" + (idx === 0 ? " active-item" : "");
if (idx === 0) { selectedSubItemTitle = v.name; updateStockBadgeLabel(v.stock, v.pic); }
btn.innerHTML = `<div class="product-mini-thumbnail">${v.pic}</div><div class="product-text-details"><h5>${v.name}</h5><p>${v.info}</p></div>`; grid.appendChild(btn);
btn.onclick = (e) => { e.preventDefault(); document.querySelectorAll(".sub-item-card-option").forEach(c => c.classList.remove("active-item")); btn.classList.add("active-item"); selectedSubItemTitle = v.name; updateStockBadgeLabel(v.stock, v.pic); };
});
}
const checkUrl = (file) => window.location.href.includes(file);
const hasAnyPage = ["bracelets", "beadrings", "keychains", "bookmarks", "earrings", "coloringbooks", "megaboxes", "necklaces"].some(checkUrl);
window.buildSeparateAmazonScreen = () => {
if (hasAnyPage) return; let t = window.activeCatalogPageKey || "beads", a = masterFullDatabase[t]; if (a) renderScreenTemplate(true, a.list, a.p);
};
window.renderSeparateBraceletsScreen = () => renderScreenTemplate(checkUrl("bracelets.html"), braceletItemsList, "$5.00");
window.renderSeparateRingsScreen = () => renderScreenTemplate(checkUrl("beadrings.html"), ringsItemsList, "$1.00");
window.renderSeparateKeychainsScreen = () => renderScreenTemplate(checkUrl("keychains.html"), keychainsItemsList, "$3.00");
window.renderSeparateBookmarksScreen = () => renderScreenTemplate(checkUrl("bookmarks.html"), bookmarksItemsList, "$4.00");
window.renderSeparateEarringsScreen = () => renderScreenTemplate(checkUrl("earrings.html"), earringsItemsList, "$6.00");
window.renderSeparateBooksScreen = () => renderScreenTemplate(checkUrl("coloringbooks.html"), booksItemsList, "$7.00");
window.renderSeparateNecklacesScreen = () => renderScreenTemplate(checkUrl("necklaces.html"), necklacesItemsList, "$10.00");
window.renderSeparateBoxesScreen = () => renderScreenTemplate(checkUrl("megaboxes.html"), boxesItemsList, "$20.00");
function updateStockBadgeLabel(stockString, productPic) {
let wrapper = document.getElementById("wrapper-stock-badge"), display = document.getElementById("big-item-emoji"); if (!wrapper || !display) return;
display.textContent = productPic; wrapper.innerHTML = stockString === "Out" ? `<span class="stock-badge-indicator red">🛑 Out of Stock</span>` : stockString === "Low" ? `<span class="stock-badge-indicator yellow">⚠️ Low Stock</span>` : "";
}
window.selectRainbowBeadColor = (el, text) => { document.querySelectorAll(".color-matrix-node").forEach(n => n.classList.remove("selected-node")); el.classList.add("selected-node"); selectedColorText = text; };
/* ==========================================================================
CART & CHECKOUT ECOSYSTEM
========================================================================== */
window.addCustomAmazonItemToCart = () => {
let w = document.getElementById("wrapper-stock-badge"); if (w && w.innerHTML.includes("Out of Stock")) return alert("🛑 Sorry! Out of stock!");
if ((JSON.parse(localStorage.getItem("beads_settings_db")) || { storeStatus: "Open" }).storeStatus === "Closed") return alert("🛑 Shop Closed!");
shoppingCart.push({ name: `${selectedSubItemTitle} (${selectedColorText})`, price: currentGlobalPrice }); window.drawCart(); if (cartBox) cartBox.classList.add("show-cart");
};
window.selectBeadPageColor = (el, text) => { document.querySelectorAll(".color-choice-badge").forEach(n => n.classList.remove("active-color")); el.classList.add("active-color"); selectedThemeColorText = text; };
window.addCustomProductToCart = (name, price) => {
if ((JSON.parse(localStorage.getItem("beads_settings_db")) || { storeStatus: "Open" }).storeStatus === "Closed") return alert("🛑 Shop Closed!");
shoppingCart.push({ name: `${name} (${selectedThemeColorText})`, price: price }); window.drawCart(); if (cartBox) cartBox.classList.add("show-cart");
};
window.revealMoreCatalogCollections = () => {
let g = document.getElementById("catalog-category-grid"); if (!g) return; if (document.getElementById("catalog-show-more-btn")) document.getElementById("catalog-show-more-btn").remove();
[
{ k: "bookmarks", e: "🔖", t: "Paper Bookmarks", p: "$4.00", url: "Amazon Pages/bookmarks.html" }, { k: "earrings", e: "✨", t: "Earrings", p: "$6.00", url: "Amazon Pages/earrings.html" }, { k: "books", e: "📚", t: "Coloring Books", p: "$7.00", url: "Amazon Pages/coloringbooks.html" }, { k: "bracelets", e: "💝", t: "Bracelets", p: "$5.00", url: "Amazon Pages/bracelets.html" }, { k: "necklaces", e: "👑", t: "Necklaces", p: "$10.00", url: "Amazon Pages/necklaces.html" }, { k: "boxes", e: "📦", t: "All-In-One Box", p: "$20.00", url: "Amazon Pages/megaboxes.html" }
].forEach(c => {
let cd = document.createElement("div"); cd.className = "category-card"; cd.onclick = () => { if (c.k !== "bracelets") window.activeCatalogPageKey = c.k; window.location.href = c.url; };
cd.innerHTML = `<div class="category-icon" style="height:90px;">${c.e}</div><div class="category-title">${c.t}</div><button class="open-btn">View Options (${c.p})</button>`; g.appendChild(cd);
});
};
window.toggleCartDropdown = () => cartBox && cartBox.classList.toggle("show-cart");
window.removeItemFromCart = (idx) => { shoppingCart.splice(idx, 1); window.drawCart(); };
window.closeCategoryMenu = () => modal && modal.classList.remove("show-menu");
window.drawCart = () => {
const cartList = document.getElementById("cart-list-container"); if (!cartList) return; cartList.innerHTML = "";
let subtotal = 0; if (document.getElementById("cart-counter-icon")) document.getElementById("cart-counter-icon").textContent = shoppingCart.length;
if (shoppingCart.length === 0) {
cartList.innerHTML = `<span style="color:var(--gray-text);font-size:12px;text-align:center;display:block;margin:10px 0;">Cart empty...</span>`;
if (document.getElementById("cart-total-price")) document.getElementById("cart-total-price").textContent = "$0.00";
currentActiveDiscountMultiplier = 1.0; let msg = document.getElementById("coupon-alert-msg"); if(msg) msg.style.display = "none"; return;
}
shoppingCart.forEach((item, idx) => {
subtotal += parseFloat(item.price.replace("$", ""));
cartList.innerHTML += `<div class="cart-row"><strong>${item.name}</strong><br><span style="color:var(--logo-pink)">${item.price}</span><button class="remove-cart-item" onclick="removeItemFromCart(${idx})">✕</button></div>`;
});
if (document.getElementById("cart-total-price")) {
let settings = JSON.parse(localStorage.getItem("beads_settings_db")) || { taxRate: 0, deliveryFee: 0 };
let discounted = subtotal * currentActiveDiscountMultiplier;
let withTax = discounted + (discounted * ((settings.taxRate || 0) / 100));
let grandTotal = withTax + (settings.deliveryFee || 0);
document.getElementById("cart-total-price").textContent = "$" + grandTotal.toFixed(2);
}
};
window.checkoutShoppingCart = () => {
if (!shoppingCart.length) return;
let act = localStorage.getItem("beads_active_user") || "Customer", buy = act !== "Customer" ? act : prompt("Enter Customer Name:"), phoneNum = prompt("Enter Customer Phone Number (Optional):") || "N/A";
if (!buy) return;
let orderNum = String(db.length + 1).padStart(3, "0"), currentTotal = document.getElementById("cart-total-price").textContent, itemsListText = shoppingCart.map(i => i.name).join(", ");
db.push({ number: orderNum, name: buy, beads: itemsListText, price: currentTotal, status: "Pending" }); shoppingCart = []; window.drawCart(); save();
let printWindow = window.open("", "_blank");
printWindow.document.write(`<html><head><title>Order Receipt #${orderNum}</title><style>body { font-family: 'Segoe UI', sans-serif; background: #FFF; padding: 20px; color: #1D1128; } .receipt-half { background: #E2F5F0; padding: 25px; border-radius: 12px; margin-bottom: 20px; position: relative; } .logo-placeholder { font-weight: bold; color: #FF7FA5; font-size: 18px; margin-bottom: 10px; } .order-tag { position: absolute; top: 20px; right: 20px; background: #FF7FA5; color: #FFF; padding: 8px 14px; border-radius: 12px; font-weight: bold; } .fields { font-size: 15px; margin-top: 10px; line-height: 1.8; } .tear-line { border-top: 2px dashed #7A757F; margin: 30px 0; text-align: center; color: #7A757F; font-size: 12px; font-weight: bold; }</style></head><body> <div class="receipt-half"><div class="logo-placeholder">Beads & Co. (Merchant Copy)</div><div class="order-tag">Order # ${orderNum}</div><div class="fields"><strong>Name:</strong> ${buy}<br><strong>Phone:</strong> ${phoneNum}<br><br><strong>Items to Assemble:</strong><br> ${itemsListText}</div></div><div class="tear-line">✂️ DETACH HERE FOR CUSTOMER RECEIPT ✂️</div><div class="receipt-half"><div class="logo-placeholder">Beads & Co. (Customer Copy)</div><div class="order-tag">Order # ${orderNum}</div><div class="fields"><strong>Items Bought:</strong><br> ${itemsListText}<br><br><strong>Website:</strong> beadsandco.com &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Total Price Paid:</strong> ${currentTotal}</div></div><script>window.print();<\/script></body></html>`);
printWindow.document.close(); alert(`🎉 Order #${orderNum} logged successfully for ${buy}! Receipt popup triggered.`);
};
/* ==========================================================================
PASSPORTS & MODAL FORM TRIGGERS
========================================================================== */
const adminBtn = document.querySelector(".admin-dashed-btn"); if (adminBtn) { adminBtn.addEventListener("click", (e) => { e.preventDefault(); let pass = prompt("🔑 Enter Owner Passcode:"); if (pass === "beads9") { alert("✨ Welcome Owner."); window.location.href = window.location.href.includes("Amazon Pages/") ? "../admin.html" : "admin.html"; } else if (pass !== null) alert("🛑 Access Denied!"); }); }
if(document.getElementById("add-order-btn")) {
document.getElementById("add-order-btn").onclick = () => document.getElementById("popup-window").classList.add("show-popup");
document.getElementById("close-modal-btn").onclick = () => document.getElementById("popup-window").classList.remove("show-popup");
document.getElementById("save-order-btn").onclick = () => {
let n = document.getElementById("input-name").value.trim(), a = document.getElementById("input-age").value.trim(), s = document.getElementById("input-size").value; if (!n) return alert("Add name!");
db.push({ number: String(db.length+1).padStart(3,'0'), name: n, beads: `${document.getElementById("input-beads").value || "Jewelry"} (Age: ${a||'N/A'}, Size: ${s})`, price: document.getElementById("input-price").value, status: "Pending" }); document.getElementById("popup-window").classList.remove("show-popup"); save();
};
}
// Core initial execution setup
window.buildSeparateAmazonScreen();
window.renderSeparateBraceletsScreen();
window.renderSeparateRingsScreen();
window.renderSeparateKeychainsScreen();
window.renderSeparateBookmarksScreen();
window.renderSeparateEarringsScreen();
window.renderSeparateBooksScreen();
window.renderSeparateNecklacesScreen();
window.renderSeparateBoxesScreen();
window.checkUserLoginStatus();
window.drawCart();
window.drawTable();
window.drawStockTable();
});
/* ==========================================================================
BOUTIQUE REWARDS WHEEL LOGIC MODULE
========================================================================== */
window.toggleRewardsWheel = () => { const overlay = document.getElementById("rewards-wheel-overlay"); if (overlay) overlay.style.display = overlay.style.display === "flex" ? "none" : "flex"; };
let rewardWheelIsSpinning = false;
document.addEventListener("DOMContentLoaded", () => {
const spinTrigger = document.getElementById("wheel-spin-trigger"), canvasWheel = document.getElementById("spinning-wheel-canvas"), labelsWheel = document.getElementById("wheel-labels");
if (!spinTrigger || !canvasWheel || !labelsWheel) return;
spinTrigger.onclick = () => {
if (rewardWheelIsSpinning) return;
let activeDateString = new Date().toLocaleDateString(); if (localStorage.getItem("adult_last_wheel_spin_date") === activeDateString) return alert("⏰ Daily limit reached! Your boutique reward voucher is locked for today. Come back tomorrow for a new spin! ✨");
rewardWheelIsSpinning = true; spinTrigger.style.cursor = "not-allowed";
let forceRotationDegrees = Math.floor(2160 + Math.random() * 2160);
canvasWheel.style.transform = labelsWheel.style.transform = `rotate(${forceRotationDegrees}deg)`;
setTimeout(() => {
rewardWheelIsSpinning = false; spinTrigger.style.cursor = "pointer";
let parsedOffset = (360 - (forceRotationDegrees % 360)) % 360, promotionalClaim = "";
if (parsedOffset < 45) promotionalClaim = "🎟️ 10% OFF YOUR TOTAL CART! Use code: SHOP10";
else if (parsedOffset < 90) promotionalClaim = "🎁 FREE MYSTERY BUNDLE UPGRADE! A custom accent piece will be added to your tray slots.";
else if (parsedOffset < 135) promotionalClaim = "🎟️ 20% OFF PREMIUM SEED SELECTIONS! Use code: BEAD20";
else if (parsedOffset < 180) promotionalClaim = "🛒 BUY ONE GET ONE 50% OFF ON NECKLACES! Applied on next item entry.";
else if (parsedOffset < 225) promotionalClaim = "🎟️ 5% COZY CART DISCOUNT! Use code: CHILL5";
else if (parsedOffset < 270) promotionalClaim = "🚚 FREE EXPRESS SHIPPING! Standard delivery parameters waived at checkout.";
else if (parsedOffset < 315) promotionalClaim = "🎟️ 15% OFF SAVINGS INVOICE VOUCHER! Use code: CRAFT15";
else promotionalClaim = "💝 FREE DESIGNER CHARM ADD-ON! A luxury polished daisy or star loop spacer included.";
localStorage.setItem("adult_last_wheel_spin_date", activeDateString);
alert(`🎉 Congratulations!\n\nYou unlocked an exclusive boutique perk:\n\n${promotionalClaim}\n\nMake sure to note down any promo coupon codes to apply them inside your cart dropdown tray! ✨`);
window.toggleRewardsWheel();
}, 4000);
};
});
window.applyCartPromoCode = () => {
const inputField = document.getElementById("cart-coupon-input"), msgLabel = document.getElementById("coupon-alert-msg"); if (!inputField || !msgLabel) return;
let enteredCode = inputField.value.trim().toUpperCase(); if (!enteredCode) { msgLabel.style.display = "block"; msgLabel.style.color = "orange"; msgLabel.textContent = "Please enter a code first!"; return; }
if (shoppingCart.length === 0) { msgLabel.style.display = "block"; msgLabel.style.color = "orange"; msgLabel.textContent = "Add items to your cart first!"; return; }
const discountMap = { "SHOP10": { m: 0.90, t: "🎟️ Code Applied: 10% Off Storewide!" }, "CRAFT15": { m: 0.85, t: "🎟️ Code Applied: 15% Off Your Invoice!" }, "BEAD20": { m: 0.80, t: "🎟️ Code Applied: 20% Off Bulk Beads!" }, "CHILL5": { m: 0.95, t: "🎟️ Code Applied: 5% Off Cozy Discount!" } };
if (discountMap[enteredCode]) { currentActiveDiscountMultiplier = discountMap[enteredCode].m; msgLabel.textContent = discountMap[enteredCode].t; msgLabel.style.color = "#1E6B57"; }
else { currentActiveDiscountMultiplier = 1.0; msgLabel.textContent = "❌ Invalid coupon combination code!"; msgLabel.style.color = "#E63946"; }
msgLabel.style.display = "block"; window.drawCart();
};