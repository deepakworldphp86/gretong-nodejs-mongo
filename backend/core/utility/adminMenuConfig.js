module.exports = {
    arrayCategory: function () {
        var arrays = [
            {key: 'sales', value: 'Sales'},
            { key: 'catalog', value: 'Catalog' },
            //{key: 'customers', value: 'Customers'},
            //{key: 'marketing', value: 'Marketing'},
            { key: 'quiz', value: 'Quiz' },
            //{key: 'content', value: 'Content'},
            //{key: 'reports', value: 'Reports'},
            //{key: 'stores', value: 'Stores'},
            //{key: 'system', value: 'System'}

        ];
        return arrays;
    },
    logoArray: function () {
        var arrays = [
            'fa fa-cogs',
            'fa fa-check-square-o nav_icon',
            // 'fa fa-file-text-o nav_icon',
            // 'fa fa-bar-chart nav_icon',
            // 'icon-font nav-icon',
            // 'icon-font nav-icon',
            // 'icon-table nav-icon',
            // 'fa fa-map-marker',
            // 'fa fa-exclamation-triangle',
            'fa fa-list-ul'

        ]
        return arrays;
    },
    adminMenus: function () {

        var arrays = [
             {'sales': {orders: 'orders/list/1'}},
            { 'catalog': { product: 'product/list/1', category: 'category/list/0/1' } },
            // {'customers': {allcustomer: 'customer/list', nowonline: 'customer/online'}},
            // {'marketing': {catalogrule: 'promotion/catalog', cartrule: 'promotion/cart'}},
            { 'quiz': { quiz: 'quiz/list/1' } },
            // {'content': {pages: 'pages/cms', blocks: 'pages/block'}},
            // {'reports': {productsincart: 'abandoned/cart', totalsales: 'reports/sales'}},
            // {'stores': {allstore: 'allstore/list', configurations: 'stores/configurations'}},
            // {'system': {import: 'system/import', export: 'system/export'}}
        ];
        return arrays;

    },
    sizeOfObject: function (obj) {
        // http://stackoverflow.com/a/6700/11236
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key))
                size++;
        }
        return size;
    },
    getMenuHtml: function () {
        //console.log()
    },
    capitalize: function (s) {
        return s && s[0].toUpperCase() + s.slice(1);
    }

};

