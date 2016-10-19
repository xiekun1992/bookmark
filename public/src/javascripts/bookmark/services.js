angular.module('bookmark.service',[])
.service('API',['$resource',function($resource){
	return {
		Bookmark:$resource('/api/bookmark/:bookmarkId/:subRoute',
			{bookmarkId:'@id'},
			{count:{method:'POST',params:{subRoute:'count'}}}),
		Category:$resource('/api/category/:categoryId',
			{categoryId:'@id'}),
		Url:$resource('/api/url/:url/info')
	};
}]);