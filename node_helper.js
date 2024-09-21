const NodeHelper = require("node_helper");
const ParseMenu = require("./parsemenu.js");

const fs = require("fs");
const Log = require("logger");

module.exports = NodeHelper.create({
  start: function () {
    Log.log("Starting node helper ... for: " + this.name);
    this.isHelperActive = true;
  },

  stop: function () {
    this.isHelperActive = false;
  },

  socketNotificationReceived: function (notification, payload) {
    Log.log("Lunch HERE");
    if (notification === "MODULE_READY") {
        Log.info("lunchbox module ready");
    }
    this.parseMenus();
  },

  parseMenus: async function () {
    Log.log("Lunch parseMenus");

    const menu_html = await ParseMenu.getMenuHTMLToDisplay(this.path + "/menus/latest.html");

    this.sendSocketNotification("LUNCHBOX_MENU", {menu_html: menu_html});

    this.scheduleNextParseMenus();
  },

  scheduleNextParseMenus: function () {
    var _this = this;
    Log.log("schedule next parse menus");
    if (this.isHelperActive) {
      Log.log("2 schedule next parse menus");
      setTimeout(function () {
        Log.log("in timeout schedule next parse menus");
        _this.parseMenus();
      }, 60 * 1000);
    }
  },
});

