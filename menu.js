const Menu = {
  generateHTML: async function (response, today = new Date()) {
    try {
      const menu = response.responseObject.response[0].menuDays[0].menuItems;
      console.log('TESTETEST');
      console.log(menu);
      const menuItem = menu[0].baseProductName;
      return `<ul><li>${menuItem}</li></ul>`;
    } catch (error) {
      console.log('Failed to parse response json:');
      console.log(response);
      return `failed to parse`;
    }
  }
}

module.exports = Menu
