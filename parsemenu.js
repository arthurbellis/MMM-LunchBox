const { JSDOM } = require("jsdom");

const ParseMenu = {
  getMenuHTMLToDisplay: async function (filename, today = new Date()) {
    const dom = await JSDOM.fromFile(filename);

    const menu_day_doms = this.parseDays(dom.window.document);

    const day_to_display_dom = this.getDayToDisplay(menu_day_doms, today);
    
    return day_to_display_dom.innerHTML;
  },

  // returns an array of day doms
  parseDays: function (menu_page_dom) {
    const menu_container = menu_page_dom.querySelector("div.menu-items-container")

    const menu_day_doms = menu_container.querySelectorAll(":scope div.day-container");

    return menu_day_doms;
  },

  getDayToDisplay: function (menu_day_doms, today = new Date()) {
    const month_date_to_display = this.getDisplayMonthDate(today);

    let day_to_display_dom = undefined;

    menu_day_doms.forEach((menu_day_dom) => {
      const date_of_menu = this.parseDate(menu_day_dom);

      if (
        date_of_menu[0] == month_date_to_display[0]
        && date_of_menu[1] == month_date_to_display[1]
      ) {
        day_to_display_dom = menu_day_dom;
      }
    })

    return day_to_display_dom
  },

  parseDate: function (day_container_dom) {
    const day_name = day_container_dom.querySelector("div.day-name h2.alt-title").textContent

    const month_date = this.convertTitleToDate(day_name);

    return month_date;
  },

  convertTitleToDate: function (date_string) {
    const rx = /^\w+ (\d+)\w* (\w+)$/;
    const matches = rx.exec(date_string);

    const day_of_month = parseInt(matches[1]);

    const month_num = this.convertMonthNameToNumber(matches[2]);

    const month_and_day = [month_num, day_of_month];

    return month_and_day;
  },

  convertMonthNameToNumber: function (month_string) {
    const month_prefixes = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];

    const month_prefix = month_string.slice(0,3).toLowerCase();

    return month_prefixes.findIndex((e) => e === month_prefix);
  },

  getDisplayMonthDate: function (today = new Date()) {
    var display_date = new Date(today.valueOf());
    
    if (today.getHours() >= 8) {
      display_date.setDate(display_date.getDate() + 1);
    }

    return [display_date.getMonth(), display_date.getDate()]
  }
}

module.exports = ParseMenu
