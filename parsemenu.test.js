/**
 * @jest-environment jest-environment-jsdom
 */

const { JSDOM } = require("jsdom");

describe("Tests", () => {
    const ParseMenu = require("./parsemenu.js");

    test('parse runs', async () => {
        let result = await ParseMenu.getMenuHTMLToDisplay("menus/2022-09-04.html", new Date(2022, 8, 5, 10));
        expect(result.length).toBeGreaterThan(100); // something long-ish
    });

    test("Parser finds 5 days in sample file and picks the right one", async () => {
        const test_document = (await JSDOM.fromFile("menus/2022-09-04.html")).window.document;

        var result = ParseMenu.parseDays(test_document);

        expect(result.length).toBe(5);

        var day_to_display_dom = ParseMenu.getDayToDisplay(result, new Date(2022, 8, 5, 10));
        let day_to_display_date = ParseMenu.parseDate(day_to_display_dom);

        expect(day_to_display_date).toStrictEqual([8,6]);
    })
    
    test('Day Container Date is recognized', async () => {
        const test_document = (await JSDOM.fromFile("menus/2022-09-04.html")).window.document;

        var result = ParseMenu.parseDate(test_document);

        expect(result).toStrictEqual([8, 5]);
    })

    test('Date conversion works', () => {
        var result = ParseMenu.convertTitleToDate("Monday 5th Sep");

        expect(result).toStrictEqual([8, 5]);

        var result = ParseMenu.convertTitleToDate("Wednesday 14th Nov");

        expect(result).toStrictEqual([10, 14]);

        var result = ParseMenu.convertTitleToDate("lekjfeklfjekljflke 31 December");

        expect(result).toStrictEqual([11, 31]);
    })

    test('Month conversion works', () => {
        var result = ParseMenu.convertMonthNameToNumber("Sep")

        expect(result).toBe(8);

        var result = ParseMenu.convertMonthNameToNumber("December")

        expect(result).toBe(11);
    })

    test("Display date is tomorrow if it's after 8am", () => {
        var result = ParseMenu.getDisplayMonthDate(new Date(2022, 10, 1, 10));

        expect(result).toStrictEqual([10, 2])

        var result = ParseMenu.getDisplayMonthDate(new Date(2023, 11, 31, 10));

        expect(result).toStrictEqual([0, 1])
    })

    test("Display date is today if it's before 8am", () => {
        var result = ParseMenu.getDisplayMonthDate(new Date(2022, 11, 31, 7, 30));

        expect(result).toStrictEqual([11, 31])
    })
})

