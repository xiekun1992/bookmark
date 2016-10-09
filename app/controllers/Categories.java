package controllers;

import java.util.List;

import models.Category;
import play.data.validation.Required;
import play.mvc.*;
import utils.Error;
import utils.Result;

public class Categories extends Controller {

    public static void add(@Required String name) {
    	Category c=Category.find("name=?", name).first();
    	Result r=null;
    	if(c!=null){
    		//重复添加
    		r=new Result(Error.F_41, Error.F_41_MSG, null);
    	}else{
    		Category category=new Category(name);
    		if(category.save().isPersistent()){
    			category.bookmark=null;
    			r=new Result(Error.S_20, Error.S_20_MSG, category);
    		}else{
    			r=new Result(Error.F_42, Error.F_42_MSG, null);
    		}
    	}
        renderJSON(r);
    }

	public static void get() {
		Result r=null;
		List<Category> categories=Category.findAll();
		if(categories.size()>0){
			for(int i=0;i<categories.size();i++){
				categories.get(i).bookmark=null;
			}
			r=new Result(Error.S_20, Error.S_20_MSG, categories);
		}else{
			r=new Result(Error.S_30,Error.S_30_MSG,null);
		}
		renderJSON(r);
	}
	
	public static void remove(@Required Long categoryId){
		Result r=null;
		int num=Category.delete("id=?", categoryId);
		if(num>0){
			r=new Result(Error.S_20, Error.S_20_MSG, null);
		}else{
			r=new Result(Error.F_43, Error.F_43_MSG, null);
		}
		renderJSON(r);
	}
}
