module.exports = {
  pageUrl: function (url, pageNum) {
    var url = url + pageNum;

    return url;
  },
  getPaginate: async function (model, filter,req, pageUrl,perPage,currentPage) {
    var perPage = perPage || 10 ;
    const limit = 100;
    const offset =  1;
    
    const collectionData = await model.find(filter).skip(offset).limit(limit);
    console.log(collectionData);

    const collectionCount = await model.find(filter).count();
    const pages = Math.ceil(collectionCount / perPage);
    var perPage = 9;
    var currentPage = req.params.page || 1;


    var pagination = "";
      if (pages > 0 && pageUrl && currentPage) {
        var pagination = pagination + '<div class="m-4 pull-right">';
        pagination =
          pagination +
          '<nav class="pagination justify-content-end" aria-label="Page navigation">';
        pagination = pagination + '<ul class="pagination text-center">';
        if (currentPage == 1) {
          pagination = pagination + '<li class="disabled"><a>First</a></li>';
        } else {
          pagination =
            pagination +
            '<li class="page-item"><a class="page-link" href="' +
            this.pageUrl(pageUrl, 1) +
            '">First</a></li>';
        }
        var i = Number(currentPage) > 5 ? Number(currentPage) - 4 : 1;
        if (i !== 1) {
          pagination = pagination + '<li class="disabled"><a>...</a></li>';
        }
        for (; i <= Number(currentPage) + 4 && i <= pages; i++) {
          if (i == currentPage) {
            pagination =
              pagination + '<li class="active"><a>' + i + "</a></li>";
          } else {
            pagination =
              pagination +
              '<li class="page-item" ><a class="page-link" href="' +
              this.pageUrl(pageUrl, i) +
              '">' +
              i +
              "</a></li>";
          }
          if (i == Number(currentPage) + 4 && i < pages) {
            pagination = pagination + '<li class="disabled"><a>...</a></li>';
          }
        }
        if (currentPage == pages) {
          pagination = pagination + '<li class="disabled"><a>Last</a></li>';
        } else {
          pagination =
            pagination +
            '<li class="page-item" ><a class="page-link" href="' +
            this.pageUrl(pageUrl, pages) +
            '">Last</a></li>';
        }
        pagination = pagination + "</ul>";
        pagination = pagination + "</nav>";
        pagination = pagination + "</div>";
      }

    return pagination;
  },
};
