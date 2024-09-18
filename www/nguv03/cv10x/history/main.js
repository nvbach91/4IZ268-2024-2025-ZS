/* verze pro hash #page1 #page2 #page3 atd */
/*
$(document).ready(() => {
    const navigation = $('#navigation');
    navigation.append([1, 2, 3].map((p) => $(`<button data-page="${p}">Page ${p}</button>`)));
    const navigationButtons = navigation.children();
    
    const heading = $('#heading');

    const renderPage = (pageNumber) => {
        heading.text(`Page ${pageNumber}`);
        document.title = `Page ${pageNumber}`;
    };

    if (!location.hash) {
        history.replaceState({}, 'Page 1', '#page1');
        renderPage(1);
    } else {
        const pageNumber = location.hash.replace('#page', '');
        renderPage(pageNumber || 1);
    }

    navigationButtons.click(function () {
        const pageNumber = $(this).data('page');
        if (`#page${pageNumber}` !== location.hash) {
            history.pushState({}, '', `#page${pageNumber}`);
            renderPage(pageNumber);
        }
    });

    $(window).on('popstate', (event) => {
        const pageNumber = location.hash.replace('#page', '');
        renderPage(pageNumber);
    });
});
*/

/* verze pro path /1 /2 /3 atd */

$(document).ready(() => {
    const staticPath = `/www/nguv03/cv10x/history`;
    const pageNumbers = [1, 2, 3];
    const navigationButtons = pageNumbers.map((n) => $(`<button class="page" data-page="${n}">Page ${n}</button>`))
    const navigation = $('#navigation');
    navigation.append(navigationButtons);
    const pageButtons = $('.page');
    const heading = $('#heading');

    const renderPage = (pageNumber) => {
        heading.text(`Page ${pageNumber}`);
        document.title = `Page ${pageNumber}`;
    };

    const getCurrentPageNumber = () => location.pathname.replace(`${staticPath}/`, '');

    pageButtons.click(function () {
        const pageNumber = $(this).data('page');
        const currentPageNumber = getCurrentPageNumber();
        if (currentPageNumber !== pageNumber.toString()) {
            history.pushState({}, '', [staticPath, pageNumber].join('/'));
            renderPage(pageNumber);
        }
    });

    $(window).on('popstate', (e) => {
        const pageNumber = getCurrentPageNumber();
        renderPage(pageNumber);
    });

    const currentPageNumber = getCurrentPageNumber();
    if (!/^\d+$/.test(currentPageNumber)) {
        history.replaceState({}, 'Page 1', [staticPath, '1'].join('/'));
        renderPage(1);
    } else {
        renderPage(currentPageNumber || 1);
    }

});

