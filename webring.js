/* Oring v5.0. Copyleft 🄯 ALL LEFTS RESERVED 🄯 Gray (https://loop.graycot.dev/).

    Oring is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.*/

// get member sites list
fetch("./sites.json")
.then(response => {
   return response.json();
})
.then(data => sites(data));

function sites(data) {
  // get sub.domain.TLD of referrer member site.
  var referrerURL = document.referrer;
  // Remove http(s) schemes and www. subdomain from URL.
  var referrerURLReplace = referrerURL.replace(/http(s)?(:)?(\/\/)?|(\/\/)?(www\.)?/g, "");

  // find referrer member site in member list.
  for (i = 0; i < data.webringSites.length; i++) {
    siteURLRaw = data.webringSites[i].siteURL;
    // Chop off everything past the TLD.
    siteURLMatch = siteURLRaw.match(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/igm, "");
    // Remove http(s) schemes and www. subdomain from URL.
    siteURLReplace = siteURLMatch[0].replace(/http(s)?(:)?(\/\/)?|(\/\/)?(www\.)?/g, "");

    if (referrerURLReplace.startsWith(siteURLReplace)) {
      var referrerIndex = i;
      var referrerSiteURL = data.webringSites[referrerIndex].siteURL;
      var referrerSiteName = data.webringSites[referrerIndex].siteName;
      break;
    }
  }
  // Detect whether visitor clicked the Previous, List, Home, Next, Random, or other link:
  const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
  });
  var value = params.action;

  // Execute redirect upon Previous, List, Home, Next, Random, or other actions
  if (value == 'prev' && referrerIndex !== undefined) {
      //find previous site in member list
      let previousIndex = (referrerIndex-1 < 0) ? data.webringSites.length-1 : referrerIndex-1;
      let previousSiteURL = data.webringSites[previousIndex].siteURL;
      window.location.href = previousSiteURL;
  } else if (value == 'next' && referrerIndex !== undefined) {
      //find next site in member list
      let nextIndex = (referrerIndex+1 >= data.webringSites.length) ? 0 : referrerIndex+1;
      let nextSiteURL = data.webringSites[nextIndex].siteURL;
      window.location.href = nextSiteURL;
  } else if (value == 'list' || value == 'home') {
    // get webring data
    fetch("./webring.json")
    .then(response => {
      return response.json();
    })
    .then(data => webring(data));

    // execute using webring data
    function webring(data) {
      // get webring data from webring.json
      var webringHome = data.webringInfo[0].webringHome;
      var webringMemberList = data.webringInfo[0].webringMemberList;

      if (value == 'list') {
        window.location.href = webringMemberList;
      } else if (value == 'home') {
        window.location.href = webringHome;
      } else {
        console.log("Error!");
      }
    }
  } else if (value == 'test') {
      console.log('test');
  } else {
      //In-case of value == undefined or referrerIndex is undefined, find random site in member list
      let randomIndex = Math.floor(Math.random() * (data.webringSites.length));
      let randomSiteURL = data.webringSites[randomIndex].siteURL;
      window.location.href = randomSiteURL;
  }
};
