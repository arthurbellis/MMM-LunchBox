Module.register("MMM-LunchBox", {
  requiresVersion: "2.1.0",

  // Define required scripts.
  getStyles: function () {
    return ["MMM-LunchBox.css"];
  },
  
  // Default module config.
  defaults: {
    empty_text: "No menu available",
  },

  start: function () {
    this.menu_html = "";
    this.sendSocketNotification("MODULE_READY");
  },

  // Override dom generator.
  getDom: function () {
    var wrapper = document.createElement("div");
    wrapper.innerHTML = this.menu_html;
    return wrapper;
  },

  socketNotificationReceived: function (notification, payload) {
    // Authentication done before any calendar is fetched
    if (notification === "LUNCHBOX_MENU") {
      this.menu_html = payload.menu_html;
      this.updateDom(this.config.animationSpeed);
      return;
    }
  },
});

