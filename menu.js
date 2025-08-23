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
  }
}

module.exports = Menu
