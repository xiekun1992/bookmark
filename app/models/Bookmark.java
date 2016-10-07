package models;

import play.*;
import play.data.validation.MaxSize;
import play.data.validation.Required;
import play.db.jpa.*;
import play.utils.HTML;
import sun.org.mozilla.javascript.internal.ast.NodeVisitor;

import javax.persistence.*;
import javax.swing.text.html.HTML.Tag;

import org.htmlparser.Parser;
import org.htmlparser.filters.NodeClassFilter;
import org.htmlparser.filters.TagNameFilter;
import org.htmlparser.util.NodeList;
import org.htmlparser.visitors.TextExtractingVisitor;

import com.google.gson.JsonObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Entity
@Table(name="xk_bookmark")
public class Bookmark extends Model {
	public String icon;
    public String title;
    @Required
    @Lob
    @MaxSize(10000)
    public String url;
    @Required
    @ManyToOne
    public Category category;
    @Required
    public String description;
    public Date create_time;
    public Integer owner;
    public Integer click_count;
    public Boolean available;
    
    @Transient
    public String categoryName;
    
    public Bookmark(String title,String url,Integer owner,String description,Category category){
    	this.category=category;
    	this.description=description;
    	this.icon="";
    	this.title=title;
    	this.url=url;
    	this.owner=owner;
    	this.create_time=new Date();
    	this.click_count=0;
    	this.available=true;
    }
    
    public static Bookmark saveBookmark(String url,String description,Long category){
    	Bookmark bm=new Bookmark("",url,0,description,(Category)Category.findById(category));
    	Boolean saved=bm.save().isPersistent();
    	if(saved){
    		return bm;
    	}
    	return null;
    }
    
}
