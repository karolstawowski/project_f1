import {
  findCountryCodeByNationality,
  findCountryNameByNationality,
  findCountryCodeByCountryName,
} from "./countryCodes";
import { getDataFromStorage } from "./storeDataLocally";
import { reverseDateOrder } from "./functions";
import { listenToResize } from "./resizingListener";
import { listenToSidebarSwitch } from "./sidebarSwitchListener";
import { createSidebarButtons } from "./createSidebarButtons";
import { changeSidebarButtonsBackgroundColor } from "./colorSidebarButtons";
import { colorDefaultButtons } from "./colorSelectedButtonsByDef";
import { generateTable } from "./generateTable";
import { updateLanguageContent, changeSeasonname } from "./changeLanguage";
import * as elements from "./variables/documentElements";
import * as colors from "./variables/colors";

let selectedMainButton = "races";
let yearGlobal = 2021;
let language = "pl";

// Fire on start
listenToResize();
listenToSidebarSwitch();
createSidebarButtons();
colorDefaultButtons();
updateLanguageContent(yearGlobal, language);
getRaces(language, 2021);

const buttons = document.querySelectorAll("button[fetch-button]");

highlightSidebarButton(document.getElementById(yearGlobal));

// On-click language buttons
elements.en.addEventListener("click", () => {
  if (language === "pl") {
    language = "en";
    generateTable(selectedMainButton, yearGlobal, language);
    updateLanguageContent(yearGlobal, language);
  }
});
elements.pl.addEventListener("click", () => {
  if (language === "en") {
    language = "pl";
    generateTable(selectedMainButton, yearGlobal, language);
    updateLanguageContent(yearGlobal, language);
  }
});

// On-click sidebar buttons
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    yearGlobal = button.id;
    // Light up selected button
    highlightSidebarButton(document.getElementById(yearGlobal));
    // Display data based on button selected in main div
    generateTable(selectedMainButton, yearGlobal, language);
    // Change season year
    changeSeasonname(yearGlobal, language);
    // Color other, not selected buttons
    buttons.forEach((otherButtons) => {
      otherButtons.style.backgroundColor = colors.sidebarButtonNotSelectedColor;
    });
    button.style.backgroundColor = colors.sidebarButtonSelectedColor;
  });
});

// Hightlight sidebar buttons
function highlightSidebarButton(button) {
  buttons.forEach((otherButtons) => {
    otherButtons.addEventListener("mouseover", () => {
      otherButtons.style.backgroundColor = colors.sidebarButtonHighlightedColor;
    }),
      otherButtons.addEventListener("mouseout", () => {
        otherButtons.style.backgroundColor =
          colors.sidebarButtonNotSelectedColor;
      });
  });
  button.addEventListener("mouseover", () => {
    button.style.backgroundColor =
      colors.sidebarButtonSelectedAndHighlightedColor;
  }),
    button.addEventListener("mouseout", () => {
      button.style.backgroundColor = colors.sidebarButtonSelectedColor;
    });
}

//
// Get and set races
//

export async function getRaces(lang, selectedYear) {
  let innerContent = "";
  innerContent += `<table><thead id="theadRaces"><tr>`;
  if (lang === "en") {
    innerContent += `
    <th> Round </th>
    <th> Country </th>
    <th> Grand Prix </th>
    <th> Circuit </th>
    <th> Date </th>`;
  } else if (lang === "pl") {
    innerContent += `
    <th> Runda </th>
    <th> Kraj </th>
    <th> Grand Prix </th>
    <th> Nazwa toru </th>
    <th> Data </th>`;
  }
  innerContent += `</tr></thead>`;
  const data = await getDataFromStorage(selectedYear + "Races", selectedYear);
  for (const element of data["MRData"].RaceTable.Races) {
    innerContent += `<tr>
            <td style="min-width: 20px;"> ${element.round} </td>
            <td title="${
              element.Circuit.Location.country
            }" style="min-width: 60px;"> <img class="flag" src="https://www.countryflags.io/${findCountryCodeByCountryName(
      element.Circuit.Location.country
    )}/shiny/64.png" alt="${element.Circuit.Location.country}"> </td>
            <td style="min-width: 220px;"> ${element.raceName} </td>
            <td style="min-width: 280px;"> ${element.Circuit.circuitName} </td>
            <td style="min-width: 100px;"> ${reverseDateOrder(
              element.date
            )} </td>
        </tr>`;
  }
  innerContent += "</table>";
  document.getElementById("main-content").innerHTML = innerContent;
}

// On-click main button #races
const buttonRaces = document.getElementById("races");
buttonRaces.addEventListener("click", function () {
  getRaces(language, yearGlobal);
  changeSidebarButtonsBackgroundColor((selectedMainButton = "races"));
});

//
// Get and set drivers
//

export async function getDrivers(lang, selectedYear) {
  let innerContent = "";
  innerContent += `<table>
        <thead id="theadDrivers"><tr>`;
  if (lang === "en") {
    innerContent += `
          <th> Position </th>
          <th> Driver </th>
          <th> Country </th>
          <th> Team </th>
          <th> Points </th>`;
  } else if (lang === "pl") {
    innerContent += `
      <th> Pozycja </th>
      <th> Kierowca </th>
      <th> Kraj </th>
      <th> Zespół </th>
      <th> Ilość punktów </th>`;
  }

  innerContent += `</tr></thead>`;
  const data = await getDataFromStorage(
    selectedYear + "Drivers",
    selectedYear + "/driverStandings"
  );
  for (const element of data["MRData"].StandingsTable.StandingsLists[0]
    .DriverStandings) {
    innerContent += `<tr>
            <td> ${element.position} </td>
            <td style="min-width: 180px;"> ${element.Driver.givenName} ${
      element.Driver.familyName
    } </td>
            <td title="${findCountryNameByNationality(
              element.Driver.nationality
            )}" style="min-width: 60px;"> <img class="flag" src="https://www.countryflags.io/${findCountryCodeByNationality(
      element.Driver.nationality
    )}/shiny/64.png" alt="${element.Driver.nationality}"> </td>
            <td style="min-width: 120px;"> ${element.Constructors[0].name} </td>
            <td style="min-width: 130px;"> ${element.points} </td>
        </tr>`;
  }
  innerContent += "</table>";
  document.getElementById("main-content").innerHTML = innerContent;
}

// On-click main button #driverChampionship
const buttonDrivers = document.getElementById("driverChampionship");
buttonDrivers.addEventListener("click", function () {
  getDrivers(language, yearGlobal);
  changeSidebarButtonsBackgroundColor(
    (selectedMainButton = "driverChampionship")
  );
});

//
// Get and set constructors
//

export async function getConstructors(lang, selectedYear) {
  let innerContent = "";
  innerContent += `<table style="max-height: 380px;">
        <thead id="theadConstructors"><tr>`;
  if (lang === "en") {
    innerContent += `<th> Position </th>
<th> Constructor </th>
<th> Country </th>
<th> Points </th>`;
  } else if (lang === "pl") {
    innerContent += `<th> Pozycja </th>
    <th> Zespół </th>
    <th> Kraj </th>
    <th> Ilość punktów </th>`;
  }

  innerContent += `</tr></thead>`;
  const data = await getDataFromStorage(
    selectedYear + "Constructors",
    selectedYear + "/constructorStandings"
  );
  for (const element of data["MRData"].StandingsTable.StandingsLists[0]
    .ConstructorStandings) {
    innerContent += `<tr>
            <td> ${element.position} </td>
            <td> ${element.Constructor.name} </td>
            <td title="${findCountryNameByNationality(
              element.Constructor.nationality
            )}"> <img class="flag" src="https://www.countryflags.io/${findCountryCodeByNationality(
      element.Constructor.nationality
    )}/shiny/64.png" alt="${element.Constructor.nationality}"> </td>
            <td style="min-width: 120px"> ${element.points} </td>
        </tr>`;
  }
  innerContent += "</table>";

  document.getElementById("main-content").innerHTML = innerContent;
}

// On-click main button #constructorChampionship
const buttonConstructors = document.getElementById("constructorChampionship");
buttonConstructors.addEventListener("click", function () {
  getConstructors(language, yearGlobal);
  changeSidebarButtonsBackgroundColor(
    (selectedMainButton = "constructorChampionship")
  );
});

// Highlight navbar buttons
const navbarButtons = [buttonRaces, buttonConstructors, buttonDrivers];
buttonRaces.addEventListener("mouseover", () => {
  if (selectedMainButton === "races") {
    buttonRaces.style.background = colors.mainButtonSelectedAndHighlightedColor;
  } else buttonRaces.style.background = colors.mainButtonHighlightedColor;
  buttonRaces.style.transition = "background-color 0.1s ease-in";
});

buttonConstructors.addEventListener("mouseover", () => {
  if (selectedMainButton === "constructorChampionship") {
    buttonConstructors.style.backgroundColor =
      colors.mainButtonSelectedAndHighlightedColor;
  } else
    buttonConstructors.style.backgroundColor =
      colors.mainButtonHighlightedColor;
  buttonConstructors.style.transition = "background-color 0.1s ease-in";
});

buttonDrivers.addEventListener("mouseover", () => {
  if (selectedMainButton === "driverChampionship") {
    buttonDrivers.style.backgroundColor =
      colors.mainButtonSelectedAndHighlightedColor;
  } else
    buttonDrivers.style.backgroundColor = colors.mainButtonHighlightedColor;
  buttonDrivers.style.transition = "background-color 0.1s ease-in";
});

navbarButtons.forEach((button) =>
  button.addEventListener("mouseout", () => {
    button.style.backgroundColor = colors.mainButtonNotSelectedColor;
    if (selectedMainButton == "races") {
      buttonRaces.style.backgroundColor = colors.mainButtonSelectedColor;
    } else if (selectedMainButton == "driverChampionship") {
      buttonDrivers.style.backgroundColor = colors.mainButtonSelectedColor;
    } else if (selectedMainButton == "constructorChampionship") {
      buttonConstructors.style.backgroundColor = colors.mainButtonSelectedColor;
    }
  })
);
