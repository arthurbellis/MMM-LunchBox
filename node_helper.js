const NodeHelper = require("node_helper");
const Log = require("logger");
const Menu = require("./menu.js");

const API_ENDPOINT = 'https://asij.lunchtab.app/api/v1/salesbusinesstypes/1/publishedmenus/1';

module.exports = NodeHelper.create({
  start: function () {
    Log.log("Starting node helper for: " + this.name);
    this.isHelperActive = true;
  },

  stop: function () {
    this.isHelperActive = false;
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "MODULE_READY") {
      Log.info("LunchBox module ready, fetching initial menu.");
      this.fetchAndProcessMenu();
    }
  },

  fetchAndProcessMenu: async function () {
    Log.log("Fetching menu data.");

    const apiUrl = Menu.generateAPIURL(API_ENDPOINT);
    
    try {
      const { default: fetch } = await import('node-fetch');
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const menuJson = await response.json();
      
      const menuHtml = Menu.generateHTML(menuJson);
      
      this.sendSocketNotification("LUNCHBOX_MENU", { menu_html: menuHtml });
    } catch (error) {
      Log.error("Error fetching or processing menu:", error);

      const errorHtml = `<div class="error">Failed to load menu. Please check logs.</div>`;
      this.sendSocketNotification("LUNCHBOX_MENU", { menu_html: errorHtml });
    }

    this.scheduleNextFetch();
  },

  /*
  generateMenuHtml: function (menuJson) {
    // TODO: Replace this with logic based on the actual JSON structure.
    // This is a placeholder based on a hypothetical structure.
    // Assuming JSON is an array of objects like: { date: "2025-08-23", items: ["Soup", "Salad"] }
    
    let html = '<div class="menu-container">';
    
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // YYYY-MM-DD

    const todaysMenu = menuJson.find(day => day.date === todayString);

    if (todaysMenu && todaysMenu.items) {
      html += `<h2>Menu for ${today.toLocaleDateString()}</h2>`;
      html += "<ul>";
      todaysMenu.items.forEach(item => {
        html += `<li>${item}</li>`;
      });
      html += "</ul>";
    } else {
      html += `<p>${this.defaults.empty_text || "No menu available for today."}</p>`;
    }

    html += '</div>';
    return html;
  },
  */

  scheduleNextFetch: function () {
    if (this.isHelperActive) {
      setTimeout(() => {
        this.fetchAndProcessMenu();
      }, 6 * 60 * 60 * 1000); // Fetch every 6 hours
    }
  },
});

