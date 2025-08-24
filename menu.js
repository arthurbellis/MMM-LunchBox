const Menu = {
  generateHTML: function (response, today = new Date()) {
    try {
      const menuDay = Menu._getMenuDay(response, today);
      var toReturn = "<h1>ASIJ Cafeteria, Monday, Aug 25</h1>\n<ul>\n";

      if (menuDay === null) {
        return 'No menu today.';
      }

      menuDay.menuItems.forEach((menuItem) => {
        toReturn += `<li>\n`;
        toReturn += `  <span>${menuItem.baseProductName}</span>\n`;
        toReturn += `  <img src="https://asij.lunchtab.app/api/v1/images/product/${menuItem.imageName}" />\n`;
        toReturn += `</li>\n`;
      });

      toReturn += "</ul>\n";

      return toReturn;
    } catch (error) {
      console.log('Failed to parse response json:');
      console.log(error);
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
  },

  // generate API URL to retrieve data for today
  generateAPIURL: function (apiEndpoint = 'https://asij.lunchtab.app/api/v1/salesbusinesstypes/1/publishedmenus/1', today = new Date()) {
    return `${apiEndpoint}${Menu._getAPIParams(today)}`;
  },

  // generate time in UTC, for beginning of day in Japan
  _getTodayString: function (today = new Date()) {
    const midnightToday = new Date(today.setHours(0, 0, 0, 0));
    return midnightToday.toISOString();
  },

  // generate time in UTC, for beginning of day in Japan
  _getNextDayString: function (today = new Date()) {
    const midnightToday = new Date(today.setHours(0, 0, 0, 0));

    const midnightNextDay = new Date(midnightToday);

    midnightNextDay.setDate(midnightToday.getDate() + 2);
    return midnightNextDay.toISOString();
  },

  // returns API parameters as a CGI parameters string, with
  // the parameter values properly encoded
  // example: "?one=...&two=..."
  _getAPIParams: function (today = new Date()) {
    const startUtc = encodeURIComponent(Menu._getTodayString(today));
    const endUtc = encodeURIComponent(Menu._getNextDayString(today));
    return `?startDateTimeUtc=${startUtc}&endDateTimeUtc=${endUtc}`; 
  }
}

module.exports = Menu
