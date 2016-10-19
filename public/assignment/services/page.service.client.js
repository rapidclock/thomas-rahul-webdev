/**
 * Created by RT on 11/10/16.
 */
(function(){
    angular
        .module("WebAppMaker")
        .factory('PageService', PageService);
    function PageService(){
        var pages = [
            { "_id": "321", "name": "Post 1", "title": "Post XXX", "websiteId": "567" },
            { "_id": "432", "name": "Post 2", "title": "SA 2", "websiteId": "567" },
            { "_id": "543", "name": "Post 3", "title": "XX 3", "websiteId": "567" }
        ];
        var api = {
            'createPage' : createPage,
            'findPageByWebsiteId' : findPageByWebsiteId,
            'findPageById' : findPageById,
            'updatePage' : updatePage,
            'deletePage' : deletePage,
            'deletePagesByWebsite' : deletePagesByWebsite
        };
        return api;

        function getNextId() {
            function getMaxId(maxId, currentId) {
                var current = parseInt(currentId._id);
                if (maxId > current) {
                    return maxId;
                } else {
                    return current + 1;
                }
            }
            return pages.reduce(getMaxId, 0).toString();
        }

        function createPage(websiteId, page){
            var newPageId = getNextId();
            var newPage = {
                _id: newPageId,
                name: page.name,
                title: page.title,
                websiteId: websiteId
            };
            pages.push(newPage);
        }

        function findPageById(pageId){
            for(p in pages){
                var page = pages[p];
                if(page._id == pageId){
                    return page;
                }
            }
            return null;
        }

        function findPageByWebsiteId(websiteId) {
            var result = [];
            function filterByWebsiteId(page){
                return page.websiteId === websiteId;
            }
            result = pages.filter(filterByWebsiteId);
            return result;
        }

        function updatePage(pageId, page){
            var oldPage = findPageById(pageId);
            var index = pages.indexOf(oldPage);
            pages[index].name = page.name;
            pages[index].title = page.title;
        }

        function deletePage(pageId) {
            var oldPage = findPageById(pageId);
            var index = pages.indexOf(oldPage);
            pages.splice(index, 1);
        }

        function deletePagesByWebsite(websiteId){
            for(p in pages){
                var page = pages[p];
                if(page.websiteId == websiteId){
                    deletePage(page._id);
                }
            }
        }
    }
})();