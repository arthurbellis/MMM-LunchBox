/**
 * @jest-environment jest-environment-jsdom
 */

const fs = require('fs');

const sampleApiResponse = {
          "status": "success",
          "isSuccessful": true,
          "responseObject": {
            "response": [
              {
                "startDateUtc": "2025-08-17T15:00:00.000Z",
                "endDateUtc": "2025-08-24T14:59:59.999Z",
                "menuDays": [
                  {
                    "startDateUtc": "2025-08-17T15:00:00.000Z",
                    "menuItems": [
                      {
                        "baseProductName": "Philly Cheesesteak Sandwich",
                        "imageName": "08dda4dd-3e24-2b23-3e24-194801000000.webp",
                      },
                      {
                        "baseProductName": "Panzanella",
                        "imageName": "08dda4dd-3d7e-684e-3e24-194801000000.webp",
                      }
                    ]
                  },
                  {
                    "startDateUtc": "2025-08-18T15:00:00.000Z",
                    "menuItems": [
                      {
                        "baseProductName": "test menu 2",
                        "imageName": "08dda4dd-3e24-2b23-3e24-194801000000.webp",
                      },
                      {
                        "baseProductName": "test menu 3",
                        "imageName": "08dda4dd-3d7e-684e-3e24-194801000000.webp",
                      }
                    ]
                  }
                ]
              }
            ],
            "isPaged": false,
            "pagingInfo": {
              "pageNo": 1,
              "pageSize": 1,
              "totalRecordCount": 1,
              "totalPageCount": 1,
              "hasNextPage": false
            }
          }
        };

describe("Tests", () => {
  const Menu = require("./menu.js");

  test('generate menu html runs', () => {
    let result = Menu.generateHTML({}, new Date(2022, 8, 5, 10));
    expect(result.length).toBeGreaterThan(10); // something long-ish
  });

  test('collapse menuDays into flat list', () => {
    const result = Menu._getAllMenuDays(sampleApiResponse);
    expect(result.length).toBe(2);
  });

  test('getMenuDay can pick the right date', () => {
    const result = Menu._getMenuDay(sampleApiResponse, new Date(2025, 7, 18));
    expect(result).toBeInstanceOf(Object);
    expect(result.menuItems[0].baseProductName).toBe("Philly Cheesesteak Sandwich");
  });

  test('getMenuDay returns null when date not found', () => {
    const result = Menu._getMenuDay(sampleApiResponse, new Date(2025, 0, 1));
    expect(result).toBeNull();
  });

  test('generateHTML shows right food', () => {
    const result = Menu.generateHTML(sampleApiResponse, new Date(2025, 7, 18));
    expect(result).toContain('Philly Cheesesteak Sandwich');
  });

  test('generateHTML shows nothing for wrong date', () => {
    const result = Menu.generateHTML(sampleApiResponse, new Date(2025, 0, 1));
    expect(result).not.toContain('Philly Cheesesteak Sandwich');
  });
})
