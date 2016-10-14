angular.module('bookmark.filter',[])
.filter('category',[function(){
	return function(input,categories){
		for(var i=0,len=categories.length;i<len;i++){
			if(categories[i].id==input){
				return categories[i].name;
			}
		}
		return "未知";
	};
}]);