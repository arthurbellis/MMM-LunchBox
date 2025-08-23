const Menu = {
  generateHTML: function (response, today = new Date()) {
    try {
      const menu = response.responseObject.response[0].menuDays[0].menuItems;
      console.log(menu);
      const menuItem = menu[0].baseProductName;
      return `<ul><li>${menuItem}</li></ul>`;
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
      console.log("checking dates...");
      console.log(menuDay.startDateUtc.slice(0,10));
      console.log(today.toISOString().slice(0,10));
      if (menuDay.startDateUtc.slice(0,10) === today.toISOString().slice(0,10)) {
        console.log('RETURNING SOMETHING');
        console.log(menuDay);
        toReturn = menuDay;
      }
    });
    return toReturn;
  }
}

module.exports = Menu
