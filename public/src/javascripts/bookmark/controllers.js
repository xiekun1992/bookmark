angular.module('bookmark.controller',[])
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
		$scope.showCategories();
		API.Category.remove({categoryId:cId})
		.$promise.then(function(data){
			if(data.errorCode==20){
				angular.forEach($scope.categories,function(o,i){
					if(o.id==cId){
						$scope.categories.splice(i,1);
					}
				});
			}else{
				alert(data.errorMsg);
			}
		})
		.catch(function(){
			alert('fail to delete category');
		});
	};
	$scope.flipToCategory=function(){
		$scope.flip=true;
		$scope.newCategory={name:''};
	};
	$scope.addOrEditCategory=function(){
		if($scope.newCategory.name){
			if($scope.newCategory.id>0){//编辑分类
				API.Category.update({categoryId:$scope.newCategory.id},{name:$scope.newCategory.name})
				.$promise.then(function(data){
					if(data.errorCode==20){
						angular.forEach($scope.categories,function(o,i){
							if(o.id===$scope.newCategory.id && o.name!==$scope.newCategory.name){
								o.name=$scope.newCategory.name;
							}
						});
						$scope.newCategory={name:''};
					}else{
						// alert(data.errorMsg);
					}
				})
				.catch(function(){
					alert('更新分类失败');
				});
			}else{
				API.Category.save({name:$scope.newCategory.name})
				.$promise.then(function(data){
					if(data.errorCode==20){
						$scope.categories.push(data.data);
						$scope.newCategory={name:''};
					}else{
						alert(data.errorMsg);
					}
				})
				.catch(function(){
					alert('更新分类失败');
				});
			}
			angular.element("#newCategory").focus();
		}else{
			$scope.flip=false;
			$scope.presentCategories=false;
		}
		

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
			API.Bookmark.save({url:this.url,description:this.description,category:this.category})
			.$promise.then(function(data){
				if(data.errorCode==20){
					$scope.urls.unshift(data.data);
					this.reset();
					return data.data;
				}else{
					// alert(data.errorMsg);
				}
			}.bind(this))
			.then(function(data){
				console.log(data);
				var bookmarkId=data.id;
				API.Url.get({url:data.url,bookmarkId:bookmarkId})
				.$promise.then(function(data){
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
	API.Bookmark.get()
	.$promise.then(function(data){
		if(data.errorCode==20){
			$scope.urls=data.data;
		}else{
			// alert(data.errorMsg);
		}
	})
	.catch(function(){
		alert('fail to get bookmark');
	});
	// 获取分类
	$scope.categories=[];
	API.Category.get()
	.$promise.then(function(data){
		if(data.errorCode==20){
			$scope.categories=data.data;
		}else{
			// alert(data.errorMsg);
		}
	})
	.catch(function(){
		alert('fail to get category');
	});
	// 增加书签点击数
	$scope.addCount=function(bookmarkId){
		API.Bookmark.count({id:bookmarkId});
	};
}]);