package controllers;

import models.Bookmark;
import models.URL;

import com.google.gson.JsonObject;

import play.data.validation.Required;
import play.mvc.*;
import utils.Error;
import utils.Result;

public class URLs extends Controller {

	public static void access(@Required Long bookmarkId,@Required String url) {
		URL u=URL.access(bookmarkId,url);
		Result r=null;
		if(u!=null){
			r=new Result(Error.S_20, Error.S_20_MSG, u);
		}else{
			r=new Result(Error.F_40, Error.F_40_MSG, null);
		}
		renderJSON(r);
	}

}
