angular.module('bookmark',[])
.controller('bookmarkController',['$scope','API','$timeout',function($scope,API,$timeout){
	$scope.wallScroll=false;
	$scope.scrollText="添加书签";
	$scope.showForm=function(){
		$scope.wallScroll=!$scope.wallScroll;
		if($scope.scrollText=="添加书签"){
			$scope.scrollText="回到导航";
		}else{
			$scope.scrollText="添加书签";
		}
	};
	$scope.flip=false;
	// 分类下拉编辑控件
	$scope.presentCategories=false;
	$scope.newCategory={name:''};
	var timer;
	$scope.showCategories=function(){
		$timeout.cancel(timer);
		$scope.presentCategories=true;
	};
	$scope.hideCategories=function(){
		timer=$timeout(function(){
			$scope.presentCategories=false;
		},200);
	};
	$scope.selectCategory=function(category){
		var tmp={};
		angular.copy(category,tmp);
		$scope.newCategory=tmp;
		angular.element("#newCategory").focus();
	};
	$scope.removeCategory=function(cId){
		// $http
		$scope.showCategories();
		angular.forEach($scope.categories,function(o,i){
			if(o.id==cId){
				$scope.categories.splice(i,1);
			}
		});
		// $scope.showCategories();
	};
	$scope.flipToCategory=function(){
		$scope.flip=true;
		$scope.newCategory={name:''};
	};
	$scope.addOrEditCategory=function(){
		// $http
		if($scope.newCategory.name){
			if($scope.newCategory.id){//编辑分类
				angular.forEach($scope.categories,function(o,i){
					if(o.id===$scope.newCategory.id && o.name!==$scope.newCategory.name){
						o.name=$scope.newCategory.name;
					}
				});
			}else{
				$scope.categories.push($scope.newCategory);
			}
			angular.element("#newCategory").focus();
		}else{
			$scope.flip=false;
		}
		$scope.newCategory={name:''};

	};

	$scope.form={
		url:"",
		description:"",
		category:"",
		reset:function(){
			this.url="";
			this.description="";
			this.category="";
		},
		submit:function(event){
			API.bookmark.add(this.url,this.description,this.category)
			.then(function(res){
				var data=res.data;
				if(data.errorCode==20){
					$scope.urls.unshift(data.data);
					this.reset();
					return data.data;
				}else{
					alert(data.errorMsg);
				}
			}.bind(this))
			.then(function(data){
				console.log(data);
				var bookmarkId=data.id;
				API.url.get(data.url,bookmarkId)
				.then(function(res){
					var data=res.data;
					if(data.errorCode==20){
						angular.forEach($scope.urls,function(o,i){
							if(o.id==bookmarkId){
								$scope.urls[i].icon=data.data.icon;
								$scope.urls[i].title=data.data.title;
							}
						});
					}else{
						alert(data.errorMsg);
					}
				});
			})
			.catch(function(){
				alert('fail to add bookmark');
			});
		}
	};
	// 获取所有书签
	$scope.urls=[];
	API.bookmark.get()
	.then(function(res){
		var data=res.data;
		if(data.errorCode==20){
			$scope.urls=data.data;
		}else{
			alert(data.errorMsg);
		}
	})
	.catch(function(){
		alert('fail to get bookmark');
	});
	// 获取分类
	$scope.categories=[];
	API.category.get()
	.then(function(res){
		var data=res.data;
		if(data.errorCode==20){
			$scope.categories=data.data;
			// $scope.form.description=$scope.categories[0].name;
		}else{
			alert(data.errorMsg);
		}
	})
	.catch(function(){
		alert('fail to get category');
	});
	// 增加书签点击数
	$scope.addCount=function(bookmarkId){
		API.bookmark.count(bookmarkId);
	};
}])
.service('API',['$http',function($http){
	return {
		bookmark:{
			add:function(url,description,category){
				return $http.post('/bookmark',{url:url,description:description,category:category});
			},
			get:function(keywords){
				return $http.get('/bookmarks',{params:{keywords:keywords||''}});
			},
			alter:function(){

			},
			remove:function(){

			},
			count:function(bookmarkId){
				// alert(1)
				return $http.post('/bookmark/'+bookmarkId+'/count');
			}
		},
		category:{
			get:function(){
				return $http.get('/category');
			}
		},
		url:{
			get:function(url,bookmarkId){
				var apiUrl='/url/'+encodeURIComponent(url)+'/info';
				return $http.get(apiUrl,{params:{bookmarkId:bookmarkId}});
			}
		}
	};
}])
.filter('avail',[function(){
	return function(input){
		return input?"y":"n";
	};
}])
.filter('category',[function(){
	return function(input,categories){
		for(var i=0,len=categories.length;i<len;i++){
			if(categories[i].id==input){
				return categories[i].name;
			}
		}
		return "未知";
	};
}])
.config(function($httpProvider) {
  // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

  /**
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */ 
  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
      
    for(name in obj) {
      value = obj[name];
        
      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }
      
    return query.length ? query.substr(0, query.length - 1) : query;
  };

  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
});