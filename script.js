"use strict";
const KEY = "nearaid.services.v1";
const $ = id => document.getElementById(id);
const form = $("serviceForm");
let services = [];
let locationPoint = null;
let editingId = null;

function readSaved() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(value) ? value.filter(item => item && item.id && item.name) : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}
services = readSaved();

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(services)); }
  catch (error) { $("locationStatus").textContent = "Could not save changes. Browser storage may be disabled or full."; return false; }
  return true;
}
function safe(value) {
  return String(value || "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function distance(a, b) {
  const rad = n => n * Math.PI / 180;
  const dLat = rad(b.latitude - a.latitude), dLon = rad(b.longitude - a.longitude);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}
function render() {
  const query = $("searchInput").value.trim().toLowerCase();
  const category = $("categoryFilter").value;
  const sort = $("sortSelect").value;
  const rows = services.filter(item => (category === "All" || item.category === category) &&
    [item.name, item.category, item.address, item.phone].some(value => String(value || "").toLowerCase().includes(query)))
    .map(item => ({...item, km: locationPoint ? distance(locationPoint, item) : null}));
  rows.sort((a,b) => sort === "name" ? a.name.localeCompare(b.name) : sort === "category" ? a.category.localeCompare(b.category) : a.km === null ? a.name.localeCompare(b.name) : b.km === null ? -1 : a.km-b.km);
  $("totalCount").textContent = services.length;
  $("visibleCount").textContent = rows.length;
  $("resultSummary").textContent = rows.length + (rows.length === 1 ? " result" : " results");
  $("emptyState").classList.toggle("visible", rows.length === 0);
  $("emptyState").querySelector("h3").textContent = services.length === 0 ? "No services saved yet" : "No matching services";
  $("emptyState").querySelector("p").textContent = services.length === 0 ? "Add a service to start building your personal directory." : "Try another search term or choose a different category.";
  const icons = {Hospital:"✚",Clinic:"⚕",Pharmacy:"＋",Police:"♜",Fire:"♨",Ambulance:"＋",Other:"⌖"};
  $("serviceList").innerHTML = rows.map(item => {
    const km = item.km === null ? "—" : item.km < 1 ? Math.round(item.km*1000)+" m" : item.km.toFixed(1)+" km";
    const call = item.phone ? '<a class="small-action" href="tel:'+safe(item.phone.replace(/[^+\d]/g,""))+'">Call</a>' : "";
    return '<article class="service-card"><div class="service-icon">'+(icons[item.category]||"⌖")+'</div><div class="service-info"><h4>'+safe(item.name)+'</h4><div class="service-meta"><span class="service-category">'+safe(item.category)+'</span><span>'+safe(item.address)+'</span></div><div class="service-actions">'+call+'<button class="small-action" data-edit="'+safe(item.id)+'" type="button">Edit</button><button class="small-action danger" data-delete="'+safe(item.id)+'" type="button">Delete</button></div></div><div class="service-distance">'+km+'<small>'+(item.km === null ? "Set location" : "Straight-line distance")+'</small></div></article>';
  }).join("");
}
function setLocation(latitude, longitude, source) {
  locationPoint = {latitude, longitude};
  $("locationLabel").textContent = latitude.toFixed(3)+", "+longitude.toFixed(3);
  $("locationStatus").textContent = "Location set using "+source+". Distances are approximate.";
  render();
}
$("locateBtn").addEventListener("click", () => {
  if (!navigator.geolocation) { $("locationStatus").textContent = "Geolocation is unavailable. Enter coordinates manually."; return; }
  $("locationStatus").textContent = "Requesting location permission…";
  navigator.geolocation.getCurrentPosition(
    position => setLocation(position.coords.latitude, position.coords.longitude, "browser geolocation"),
    error => $("locationStatus").textContent = error.code === 1 ? "Permission denied. Enter coordinates manually." : "Could not get location. Try again or enter coordinates manually.",
    {enableHighAccuracy:true, timeout:12000, maximumAge:60000}
  );
});
$("toggleFormBtn").addEventListener("click", () => {
  if (form.hidden) {
    editingId = null; form.reset(); $("toggleFormBtn").textContent = "＋ Add a service";
    form.querySelector(".form-heading h3").textContent = "Add a service";
    form.hidden = false; form.scrollIntoView({behavior:"smooth",block:"center"});
  } else { form.hidden = true; editingId = null; form.reset(); $("toggleFormBtn").textContent = "＋ Add a service"; form.querySelector(".form-heading h3").textContent = "Add a service"; }
});
$("closeFormBtn").addEventListener("click", () => {
  form.hidden = true; form.reset(); editingId = null; $("toggleFormBtn").textContent = "＋ Add a service"; form.querySelector(".form-heading h3").textContent = "Add a service";
});
form.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(form);
  const lat = Number(data.get("latitude")), lon = Number(data.get("longitude"));
  if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lon) || lon < -180 || lon > 180) { alert("Enter valid latitude and longitude."); return; }
  const updated = {id: editingId || "service-"+Date.now(),name:String(data.get("name")).trim(),category:String(data.get("category")),phone:String(data.get("phone")).trim(),address:String(data.get("address")).trim(),latitude:lat,longitude:lon};
  if (editingId) services = services.map(item => item.id === editingId ? updated : item);
  else services.push(updated);
  editingId = null;
  save(); form.reset(); form.hidden = true; $("toggleFormBtn").textContent = "＋ Add a service"; form.querySelector(".form-heading h3").textContent = "Add a service"; render();
});
$("manualLocationForm").addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget), lat = Number(data.get("latitude")), lon = Number(data.get("longitude"));
  if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lon) || lon < -180 || lon > 180) { alert("Enter valid coordinates."); return; }
  setLocation(lat, lon, "manual coordinates");
});
["searchInput","categoryFilter","sortSelect"].forEach(id => $(id).addEventListener(id === "searchInput" ? "input" : "change", render));
$("serviceList").addEventListener("click", event => {
  const remove = event.target.closest("[data-delete]"), edit = event.target.closest("[data-edit]");
  if (remove) {
    const item = services.find(row => row.id === remove.dataset.delete);
    if (item && confirm('Delete "'+item.name+'" from this browser?')) { services = services.filter(row => row.id !== item.id); save(); render(); }
  }
  if (edit) {
    const item = services.find(row => row.id === edit.dataset.edit);
    if (!item) return;
    ["name","category","phone","address","latitude","longitude"].forEach(key => form.elements[key].value = item[key] ?? "");
    editingId = item.id;
    form.querySelector(".form-heading h3").textContent = "Edit service";
    form.hidden = false; $("toggleFormBtn").textContent = "＋ Save edited service";
    form.scrollIntoView({behavior:"smooth",block:"center"}); render();
  }
});
render();
