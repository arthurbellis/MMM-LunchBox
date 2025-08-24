const Menu = {
  generateHTML: function (response, today = new Date()) {
    try {
      const menuDay = Menu._getMenuDay(response, today);
      var toReturn = "<ul>\n";

      menuDay.menuItems.forEach((menuItem) => {
        toReturn += `<li>${menuItem.baseProductName}</li>\n`;
      });

      toReturn += "</ul>\n";

      return toReturn;
    } catch (error) {
      console.log('Failed to parse response json:');
      console.log(response);
      return `failed to parse`;
    }
  },

  _getAllMenuDays: function (response) {
    try {
      const weeks = response.responseObject.response;
      var menuDays = [];
      weeks.forEach((week) => {
        week.menuDays.forEach((menuDay) => {
          menuDays.push(menuDay);
        });
      });
      return menuDays;
    } catch (error) {
      console.log('Failed to parse response json:');
      console.log(response);
      return [];
    }
  },

  _getMenuDay: function (response, today = new Date()) {
    const menuDays = Menu._getAllMenuDays(response);
    var toReturn = null;
    menuDays.forEach((menuDay) => {
      // assume API response is in UTC, and we're in JST
      if (menuDay.startDateUtc.slice(0,10) === today.toISOString().slice(0,10)) {
        toReturn = menuDay;
      }
    });
    return toReturn;
  }
}

module.exports = Menu
