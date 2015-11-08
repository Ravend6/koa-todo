'use strict';


var moment = require('moment');

moment.locale('ru');

module.exports = function (app) {
  var nunjucksEnv = app.context.render.env;

  nunjucksEnv.addFilter('shorten', function (str, count) {
    return str.slice(0, count || 5);
  });

  nunjucksEnv.addFilter('timeAgo', function (time) {
    return moment(time).fromNow();
  });

  // pagination.total, pagination.limit, pagination.skip, pagination.page
  // skip ненужен
  nunjucksEnv.addFilter('paginator', function (pagination) {
    if (pagination.total === 0) {
      return;
    }
    let currentPage = pagination.page;
    let nextPage = currentPage + 1;
    let previosPage = (currentPage - 1) || 1;
    let countPages = Math.ceil(pagination.total / pagination.limit);
    let i = 1;
    let loopCountPages = countPages;
    if (currentPage > 2) {
      i = (currentPage > 1) ? (currentPage) - 1 : 1;
      if (countPages !== currentPage) {
        loopCountPages = currentPage + 1;
      } else {
        i = currentPage - 2;
      }
    } else {
      loopCountPages = (loopCountPages > 3) ? 3 : loopCountPages;
    }
    let li = '';
    for (i; i <= loopCountPages; i++) {
      if (i === currentPage) {
        li +=`<li class="active"><a href="?page=${i}">${i}</a></li>`;
      } else {
        li +=`<li><a href="?page=${i}">${i}</a></li>`;
      }

    }

    let templateHeader = `
    <nav class="text-center">
      <ul class="pagination">`;
    if (currentPage === 1) {
      templateHeader += `
        <li class="disabled">
            <a href="?page=${previosPage}" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>`;
    } else {
      templateHeader += `
        <li>
            <a href="?page=1" aria-label="first">
            <span aria-hidden="true">&larr;</span>
          </a>
        </li>
        <li>
            <a href="?page=${previosPage}" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>`;
    }
    let templateFooter;
    if (currentPage === countPages) {
        templateFooter = `
        <li class="disabled">
          <a href="?page=${nextPage}" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>`;
    } else {
      templateFooter = `
          <li>
            <a href="?page=${nextPage}" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
          <li>
              <a href="?page=${countPages}" aria-label="first">
              <span aria-hidden="true">&rarr;</span>
            </a>
          </li>
        </ul>
      </nav>`;
    }
    return templateHeader + li + templateFooter;
  });
};

