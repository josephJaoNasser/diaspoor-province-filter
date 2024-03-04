var ALL_MEMBERS_OPTION = "Alle provincies";
var provinces = [ALL_MEMBERS_OPTION];

document.addEventListener("pages-loaded", () => {
  setTimeout(() => {
    var PAGE_DATA = [];

    var TEAM_CONTAINER_CLASS = "izpyn";
    var PROVINCE_SELECT_CLASS = "province-select";

    var provinceSelectEl = document.getElementById(PROVINCE_SELECT_CLASS);
    var provinceLoadingEl = document.getElementById("loading-province-option");

    var apiUrl = `https://www.uptodateconnect.com/api/v1/site-builder/meta-details?siteId=205af1b5760a7f1174416688abd4bdfa&label=Coach%20team&limit=10&offset=0&order=priority&pageId=4217576633343274274`;

    function renderTeamMember(member) {
      let html = "";
      html += `<li class="post__item _lbl-team">
<div class="post__inner">
  <div class="post__media">
    <div class="post__img-container"><a href="${
      member.bloggerPageUrl
    }" class="post__img-link"><img
          class="post__img" loading="lazy" alt="${
            member.metadata.title || member.name
          }"
          src="${member.metadata.pageImage || member.metadata.image}"
          data-src="${member.metadata.pageImage || member.metadata.image}"
          onerror="this.onerror=null;this.src=window.defaultImage;"></a>
    </div>
  </div>
  <div class="post__meta">
    <div class="post__title-container"><a href="${
      member.bloggerPageUrl
    }" class="post__title-link">
        <h3 class="post__title">${member.metadata.title || member.name}</h3>
      </a></div>`;

      if (member.locationPageMeta) {
        const memberProvinces = [];

        for (const key in member.locationPageMeta.province) {
          if (member.locationPageMeta.province[key]) {
            memberProvinces.push(key);
          }
        }

        html += `<div class="post__desc-container">
        <p class="post__desc">${memberProvinces.join(", ")}</p>
      </div>`;
      }
      html += `
  </div>
</div>
<div class="post__outer"></div>
</li>`;

      return html;
    }

    function setProvincesOptions(teamData = []) {
      for (var i = 0; i < teamData.length; i++) {
        const locationPageMeta = teamData[i].locationPageMeta;
        if (!locationPageMeta || !locationPageMeta.province) {
          continue;
        }

        let { province } = locationPageMeta;
        for (const key in province) {
          if (!provinces.includes(key)) {
            console.log(key);
            provinces.push(key);
          }
        }
      }

      provinces = provinces.sort((a, b) => a - b);

      for (var i = 0; i < provinces.length; i++) {
        if (!provinceSelectEl.querySelector(`#${provinces[i]}`)) {
          var provinceOption = document.createElement("option");
          provinceOption.id = provinces[i];
          provinceOption.value = provinces[i];
          provinceOption.innerText = provinces[i];
          provinceSelectEl.appendChild(provinceOption);
        }
      }
    }

    function filterTeamMembers(provinceName) {
      var html =
        '<ul class="post post--template post--2-col post--recommendation-style">';
      if (provinceName === ALL_MEMBERS_OPTION) {
        PAGE_DATA.forEach((member) => {
          html += renderTeamMember(member);
        });
      } else {
        PAGE_DATA.forEach((member) => {
          const { province } = member.locationPageMeta;
          const memberProvinces = Object.keys(province).filter(
            (key) => province[key]
          );

          if (province && memberProvinces.includes(provinceName)) {
            html += renderTeamMember(member);
          }
        });
      }

      html += "</ul>";
      $(`#${TEAM_CONTAINER_CLASS}`).html(html);
    }

    function handleProvinceChange(e) {
      var newProvince = e.target.value;
      filterTeamMembers(newProvince);
    }

    provinceSelectEl.addEventListener("change", handleProvinceChange);

    fetch(apiUrl)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Failed to fetch data");
        }
      })
      .then((data) => {
        PAGE_DATA = data.payload.results;
        setProvincesOptions(data.payload.results);
        filterTeamMembers(ALL_MEMBERS_OPTION);
        provinceLoadingEl.remove();
      });
  }, 500);
});
