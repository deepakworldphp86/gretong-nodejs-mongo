const configArr = require('./config-array');

module.exports = {
    getMenuHtml: function () {
        var adminMenus = configArr.adminMenus();
        var logo = configArr.logoArray();
        var menuHtml = '';

        for (var i = 0; i < adminMenus.length; ++i) {

            var keys = Object.keys(adminMenus[i]);
            var size = configArr.sizeOfObject(adminMenus[i][keys]);
            ///console.log(size);
            var childArr = adminMenus[i][keys];
            var childArrKeys = Object.keys(childArr);
            var childArrValues = Object.values(childArr);

            var menuHtml = menuHtml + '<li class="has-subnav">';
            menuHtml = menuHtml + '<a href="/admin/' + keys + '">';
            menuHtml = menuHtml + '<i class="' + logo[i] + '" aria-hidden="true"></i>';
            menuHtml = menuHtml + '<span class="nav-text">';
            menuHtml = menuHtml + keys;
            menuHtml = menuHtml + '</span>';
            menuHtml = menuHtml + '<i class="icon-angle-right"></i><i class="icon-angle-down"></i>';
            menuHtml = menuHtml + '</a>';
            menuHtml = menuHtml + '<ul>';
            for (var k = 0; k < size; k++) {
                //console.log(k);
                //console.log(childArrKeys[k]);
                //console.log(childArrKeys[k]);

                menuHtml = menuHtml + '<li>';
                menuHtml = menuHtml + '<a class="subnav-text" href="/admin/' + childArrValues[k] + '">';
                menuHtml = menuHtml + childArrKeys[k];
                menuHtml = menuHtml + '</a>';
                menuHtml = menuHtml + '</li>';


            }
            menuHtml = menuHtml + '</ul>';
            menuHtml = menuHtml + '</li>';
        }
        
        return menuHtml;

    }

};

