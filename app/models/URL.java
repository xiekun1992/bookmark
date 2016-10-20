package models;

import play.*;
import play.db.jpa.*;

import javax.persistence.*;

import org.htmlparser.Parser;
import org.htmlparser.filters.TagNameFilter;
import org.htmlparser.util.NodeList;

import com.google.gson.JsonObject;

import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URLConnection;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class URL {
	public static String userAgent="Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36";
	
	public String icon;
	public String title;
	
	public URL(String icon,String title){
		this.icon=icon;
		this.title=title;
	}
	/**
     * 获取icon和title，同时有/favicon.ico和link[rel=icon]的时候，以后者为准
     * @param bUrl
     * @return
     */
    
    public static URL access(Long bookmarkId,String bUrl){
    	URL u=null;
    	String icon="",title="";
    	try {
    		//获取icon链接
    		icon=resourceExist(bUrl,1);
    		System.out.println(bUrl+" 的icon地址为： "+icon);
				
			//解析html
			Parser parser=new Parser();
			parser.setURL(bUrl);
			
			parser.setEncoding("utf-8");
			//获取页面的title元素
			TagNameFilter filter=new TagNameFilter("title");
			NodeList nodeList=parser.parse(filter);
			for(int i=0;i<nodeList.size();i++){
				title=nodeList.elementAt(i).toPlainTextString();
				System.out.println("获取到的title内容："+title);
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		u=new URL(icon, title);
		if(u!=null && bookmarkId!=null){
			//修改现有书签的title和icon信息
			Bookmark bookmark=Bookmark.findById(bookmarkId);
			bookmark.icon=icon;
			bookmark.title=title;
			bookmark.save();
		}
    	return u;
    }
    /**
     * 获取指定超链接的icon资源
     * @param path 请求的链接
     * @param type 1html，2图片
     * @return 网站图标地址
     */
    public static String resourceExist(String path,int type){
    	java.net.URL url;
		try {
			url = new java.net.URL(path);
			HttpURLConnection urlc=(HttpURLConnection) url.openConnection();
			urlc.setRequestProperty("Connection", "Keep-Alive");
			urlc.setRequestProperty("Accept-Language", "zh-CN,zh;q=0.8");
			urlc.setRequestProperty("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
			urlc.setRequestProperty("User-Agent", userAgent);
			urlc.connect();
			
			String statusCode=urlc.getResponseCode()+"";
			switch(statusCode.charAt(0)){
			case '2':
				if(urlc.getContentLengthLong()>0){
					System.out.println("获取资源成功");
					if(type==1){
						return parseIconPath(url,path);						
					}else if(type==2){
						return path;
					}
				}
				System.out.println("获取的资源长度为0");
				return "";
			case '3':
				System.out.println("重定向，Location："+urlc.getHeaderField("Location"));
				return resourceExist(urlc.getHeaderField("Location"),type);
			case '4':
			case '5':
			default:
				System.out.println("获取资源失败");
				return "";
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
//			e.printStackTrace();
			return "";
		}
    }
    
    public static String parseIconPath(java.net.URL url,String bUrl) throws Exception{
    	String icon="";
    	System.out.println("解析icon路径");
		//获取doc成功，该书签有效
		//需要处理重定向的问题3xx ========== 需要限制重定向的次数
		//先判断根路径下的favicon.ico
		String rootIconUrl=url.getProtocol()+"://"+url.getHost()+"/favicon.ico";
		System.out.println("根路径下的icon："+rootIconUrl);
		java.net.URL iUrl=new java.net.URL(rootIconUrl);
		HttpURLConnection ic=(HttpURLConnection)iUrl.openConnection();
		ic.setRequestProperty("User-Agent", userAgent);
		ic.connect();
		if(ic.getResponseCode()==200 && ic.getContentLength()>0){
			//获取根目录下的favicon.ico成功
			icon=rootIconUrl;
		}
			
		//再获取页面中的link元素
		Parser iparser=new Parser();
		iparser.setURL(bUrl);
		iparser.setEncoding("utf-8");
		//处理link元素
		TagNameFilter ifilter=new TagNameFilter("link");
		NodeList inodeList=(NodeList) iparser.parse(ifilter);
		for(int i=0;i<inodeList.size();i++){
			String link=inodeList.elementAt(i).getText();
			System.out.println(link);
			if(link.indexOf("rel=\"shortcut icon\"")!=-1 || link.indexOf("rel=\"icon\"")!=-1){
				Pattern p=Pattern.compile("href=\"([\\S]+)\"");
				Matcher m=p.matcher(link);
				while(m.find()){
					String iconHref=m.group(1);
					System.out.println("href= "+iconHref);
					//检查是否以绝对路径开始
					if(iconHref.startsWith("http://") || iconHref.startsWith("https://") || iconHref.startsWith("ftp://") || iconHref.startsWith("//")){
						icon=iconHref;
					}else{
						//增加对路径的判断，如：对于xx.com/latest/ 而言 /favicon.ico与favicon.ico的起始位置不相同
						if(iconHref.startsWith("/")){
//							System.out.println(url.getPath());
							if(url.getPath().equals("/")){
								icon=resourceExist(url.getProtocol()+"://"+url.getHost()+iconHref,2);
							}else{
								//遍历可能的起始路径，并重新请求icon链接
								for(String pathFrag:url.getPath().split("/")){
									icon=url.getProtocol()+"://"+url.getHost()+"/"+pathFrag+iconHref;
									System.out.println("icon的路径："+icon);
									icon=resourceExist(icon,2);
								}
							}
						}else{
							icon=bUrl+iconHref;
						}
					}
				}
			}
		}
    	
    	return icon;
    }
}
