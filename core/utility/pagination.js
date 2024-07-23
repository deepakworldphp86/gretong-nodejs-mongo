module.exports = {
  pageUrl: function (baseUrl, pageNum) {
    return baseUrl + pageNum;
  },

  getPaginate: async function (model, req, pageUrl, perPage, currentPage) {
    perPage = perPage || 10;
    currentPage = parseInt(currentPage) || 1;

    const collectionCount = await model.countDocuments();
    const dataCount = collectionCount ? parseInt(collectionCount) : 0;
    const perPageView = parseInt(perPage);

    var pages = Math.ceil(dataCount / perPageView);

    var pagination = "";
    console.log(dataCount);
    console.log(perPage);

    if (pages > 1 && pageUrl && currentPage <= pages) {

      pagination += '<div class="m-4 pull-right">';
      pagination += '<nav class="pagination justify-content-end" aria-label="Page navigation">';
      pagination += '<ul class="pagination text-center">';

      // First page link
      if (currentPage === 1) {
        pagination += '<li class="disabled"><span class="page-link">First</span></li>';
      } else {
        pagination += `<li class="page-item"><a class="page-link" href="${this.pageUrl(pageUrl, 1)}">First</a></li>`;
      }

      // Previous page link
      if (currentPage > 1) {
        pagination += `<li class="page-item"><a class="page-link" href="${this.pageUrl(pageUrl, currentPage - 1)}">Previous</a></li>`;
      } else {
        pagination += '<li class="disabled"><span class="page-link">Previous</span></li>';
      }

      // Page numbers
      var startPage = Math.max(1, currentPage - 4);
      var endPage = Math.min(pages, currentPage + 4);

      if (startPage > 1) {
        pagination += '<li class="disabled"><span class="page-link">...</span></li>';
      }

      for (let i = startPage; i <= endPage; i++) {
        if (i === currentPage) {
          pagination += `<li class="active"><span class="page-link">${i}</span></li>`;
        } else {
          pagination += `<li class="page-item"><a class="page-link" href="${this.pageUrl(pageUrl, i)}">${i}</a></li>`;
        }
      }

      if (endPage < pages) {
        pagination += '<li class="disabled"><span class="page-link">...</span></li>';
      }

      // Next page link
      if (currentPage < pages) {
        pagination += `<li class="page-item"><a class="page-link" href="${this.pageUrl(pageUrl, currentPage + 1)}">Next</a></li>`;
      } else {
        pagination += '<li class="disabled"><span class="page-link">Next</span></li>';
      }

      // Last page link
      if (currentPage === pages) {
        pagination += '<li class="disabled"><span class="page-link">Last</span></li>';
      } else {
        pagination += `<li class="page-item"><a class="page-link" href="${this.pageUrl(pageUrl, pages)}">Last</a></li>`;
      }

      pagination += '</ul>';
      pagination += '</nav>';
      pagination += '</div>';
    }

    return pagination;
  }
};
