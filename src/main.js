const ipInput = document.getElementById("ip");
const form = document.getElementById("search-ip");
const errorMsg = document.querySelector(".error-msg");
const ipDisplay = document.querySelector(".ip > span");
const locationDisplay = document.querySelector(".location > span");
const timezoneDisplay = document.querySelector(".timezone > span");
const ispDisplay = document.querySelector(".isp > span");

function setMap(lat, lng) {
    const container = L.DomUtil.get('map');
  if (container != null) {
    container._leaflet_id = null;
  }
  let map = L.map("map").setView(
    [lat, lng],
    17
  );
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  if(lat !== 0 && lng !== 0) {
    L.popup()
    .setLatLng([lat, lng])
    .setContent("The IP points to this location")
    .openOn(map);
  } else {
    L.popup()
    .setLatLng([lat, lng])
    .setContent("This IP and Location is not found")
    .openOn(map);
  }
}

async function traceIp(validIp) {
  errorMsg.classList.contains("visible") &&
    errorMsg.classList.remove("visible");
  const response = await fetch(
    `https://geo.ipify.org/api/v2/country,city?apiKey=${
      import.meta.env.VITE_IPIFY_API
    }&ipAddress=${validIp || ""}`
  );
  const result = await response.json();
  console.log(result)
  ipDisplay.textContent = result.ip;
  ispDisplay.textContent = result.isp || "Not Found";
  locationDisplay.textContent = (result.location.lat === 0 && result.location.lng === 0) ? 'Not Found' : `${result.location.city}, ${result.location.region} ${result.location.postalCode || ''}`;
  timezoneDisplay.textContent = result.location.timezone ? `UTC ${result.location.timezone}` : 'Not Found';
  setMap(result.location.lat, result.location.lng);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = ipInput.value;
  const ipAddress = input.trim();
  //IPv4 and IPv6 regex patterns
  const ipv4Pattern =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Pattern =
    /^(([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4}|:)|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|(2[0-4][0-9]|[01]?[0-9][0-9]?))|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|(2[0-4][0-9]|[01]?[0-9][0-9]?)))))$/;
  ipv4Pattern.test(ipAddress) || ipv6Pattern.test(ipAddress)
    ? traceIp(ipAddress)
    : errorMsg.classList.add("visible");
});

traceIp();
