package controllers;

import java.util.List;

import com.google.gson.JsonObject;

import models.Bookmark;
import models.Category;
import models.Error;
import models.Result;
import play.data.validation.Required;
import play.mvc.*;

public class Bookmarks extends Controller {

    public static void add(@Required String url,@Required String description,@Required Long category) {
    	Bookmark bookmark=Bookmark.saveBookmark(url,description,category);
    	Result r=null;
    	if(bookmark!=null){
    		bookmark.categoryName=bookmark.category.name;
    		bookmark.category=null;//防止序列化JSON失败
    		r=new Result(Error.S_20,Error.S_20_MSG,bookmark);
    	}else{
    		r=new Result(Error.F_40,Error.F_40_MSG,null);
    	}
        renderJSON(r);
    }
    public static void get(String keywords){
    	Result r=null;
    	if(keywords==null || keywords.equals("")){
    		//获取全部书签
    		List<Bookmark> bms=Bookmark.find("order by id desc").fetch();
    		if(bms.size()>0){
    			for(int i=0;i<bms.size();i++){
    				Bookmark b=bms.get(i);
    				b.categoryName=b.category.name;
    				b.category=null;
    			}
    			r=new Result(Error.S_20,Error.S_20_MSG,bms);
    		}else{
    			r=new Result(Error.S_30,Error.S_30_MSG,null);
    		}
    	}else{
    		//根据查询条件获取书签
    		
    	}
    	renderJSON(r);
    }
	public static void count(@Required Long bookmarkId) {
		Bookmark bookmark=Bookmark.findById(bookmarkId);
		bookmark.click_count++;
		Result r=null;
		if(bookmark.save().isPersistent()){
			r=new Result(Error.S_20, Error.S_20_MSG, bookmark.click_count);
		}else{
			r=new Result(Error.F_40,Error.F_40_MSG,null);
		}
		renderJSON(r);
	}
	
}
