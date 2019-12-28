module.exports = {
    arrayCategory: function () {
        var arrays = [
            {key: 'sales', value: 'Sales'},
            {key: 'catalog', value: 'Catalog'},
            {key: 'customers', value: 'Customers'},
            {key: 'marketing', value: 'Marketing'},
            {key: 'content', value: 'Content'},
            {key: 'reports', value: 'Reports'},
            {key: 'stores', value: 'Stores'},
            {key: 'system', value: 'System'}

        ];
        return arrays;
    },
    logoArray: function () {
        var arrays = [
            'fa fa-cogs',
            'fa fa-check-square-o nav_icon',
            'fa fa-file-text-o nav_icon',
            'fa fa-bar-chart nav_icon',
            'icon-font nav-icon',
            'icon-table nav-icon',
            'fa fa-map-marker',
            'fa fa-exclamation-triangle',
            'fa fa-list-ul'

        ]
        return arrays;
    },
    adminMenus: function () {

        var arrays = [
            {'sales': {orders: 'Orders', invoices: 'Invoices', shipments: 'Shipments'}},
            {'catalog': {products: 'Products', categories: 'Categories'}},
            {'customers': {allcustomer: 'All Customer', nowonline: 'Now Online'}},
            {'marketing': {catalogrule: 'Catalog Rule', cartrule: 'Cart Rule'}},
            {'content': {pages: 'Products', blocks: 'Blocks'}},
            {'reports': {productsincart: 'Products in cart', totalsales: 'Total Sales'}},
            {'stores': {allstore: 'All Stores', configurations: 'Configurations'}},
            {'system': {import: 'Import', export: 'Export'}}
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
  getMenuHtml : function(){
      console.log()
  }  
    
};

