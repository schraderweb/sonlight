(function () {
  "use strict";

  var cities = [
    { name: "Traverse City", lat: 44.7631, lng: -85.6206 },
    { name: "Cadillac", lat: 44.2519, lng: -85.4012 },
    { name: "Kalkaska", lat: 44.7342, lng: -85.1759 },
    { name: "Frankfort", lat: 44.6336, lng: -86.2348 },
    { name: "Charlevoix", lat: 45.3181, lng: -85.2584 },
    { name: "Suttons Bay", lat: 44.9736, lng: -85.6512 },
    { name: "Petoskey", lat: 45.3736, lng: -84.9553 },
    { name: "Mackinaw City", lat: 45.7775, lng: -84.7278 },
    { name: "Grayling", lat: 44.6614, lng: -84.7148 },
    { name: "Gaylord", lat: 45.0275, lng: -84.6748 },
    { name: "Manistee", lat: 44.2442, lng: -86.3240 },
    { name: "Onekama", lat: 44.3628, lng: -86.2115 },
    { name: "Bear Lake", lat: 44.4250, lng: -86.1365 },
    { name: "Interlochen", lat: 44.6442, lng: -85.7673 },
    { name: "Elk Rapids", lat: 44.8969, lng: -85.4165 },
    { name: "Fife Lake", lat: 44.5742, lng: -85.3464 },
    { name: "Harbor Springs", lat: 45.4314, lng: -84.9923 },
    { name: "Glen Arbor", lat: 44.9017, lng: -85.9851 },
    { name: "Leland", lat: 45.0231, lng: -85.7595 },
    { name: "Empire", lat: 44.8128, lng: -86.0598 },
    { name: "Lake Ann", lat: 44.7292, lng: -85.8429 },
    { name: "Torch Lake", lat: 44.9370, lng: -85.3000 }
  ];

  var business = {
    name: "Sonlight Services Inc",
    lat: 44.7631,
    lng: -85.6206,
    googleUrl: "https://www.google.com/search?q=Sonlight+Services+Inc"
  };

  function cross(o, a, b) {
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  }

  function convexHull(points) {
    var sorted = points.slice().sort(function (a, b) {
      return a[0] === b[0] ? a[1] - b[1] : a[0] - b[0];
    });

    if (sorted.length < 3) {
      return sorted;
    }

    var lower = [];
    var i;
    for (i = 0; i < sorted.length; i++) {
      while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], sorted[i]) <= 0) {
        lower.pop();
      }
      lower.push(sorted[i]);
    }

    var upper = [];
    for (i = sorted.length - 1; i >= 0; i--) {
      while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], sorted[i]) <= 0) {
        upper.pop();
      }
      upper.push(sorted[i]);
    }

    upper.pop();
    lower.pop();
    return lower.concat(upper);
  }

  function initMap(el) {
    var map = L.map(el, {
      scrollWheelZoom: false
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    var hullInput = [];
    cities.forEach(function (city) {
      hullInput.push([city.lng, city.lat]);
    });

    var hull = convexHull(hullInput).map(function (point) {
      return [point[1], point[0]];
    });

    var outline = L.polygon(hull, {
      color: "#fab702",
      weight: 3,
      fillColor: "#fab702",
      fillOpacity: 0.2
    }).addTo(map);

    L.marker([business.lat, business.lng])
      .addTo(map)
      .bindPopup(
        '<strong>' + business.name + '</strong><br><a href="' +
          business.googleUrl +
          '" target="_blank" rel="noopener">View on Google</a>'
      );

    outline.bindPopup("Approximate Sonlight Services coverage outline.");
    map.fitBounds(outline.getBounds().pad(0.08));
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (typeof L === "undefined") {
      return;
    }

    var maps = document.querySelectorAll(".service-area-map");
    if (!maps.length) {
      return;
    }

    maps.forEach(function (el) {
      initMap(el);
    });
  });
})();
