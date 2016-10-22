import java.util.concurrent.TimeUnit;

import org.junit.*;
import org.junit.rules.Timeout;

import play.test.*;
import play.mvc.*;
import play.mvc.Http.*;
import utils.Result;
import models.*;

public class ApplicationTest extends FunctionalTest {
	@Rule
	public Timeout timeout=Timeout.seconds(20);
	
    @Test
    public void testThatIndexPageWorks() {
        Response response = GET("/");
        assertIsOk(response);
        assertContentType("text/html", response);
        assertCharset(play.Play.defaultWebEncoding, response);
    }
    @Test
    public void testURLAccess() throws InterruptedException{
    	String url="http://www.ytcydh.com";
    	Response response=GET("/api/url/"+url+"/info");
//    	TimeUnit.SECONDS.sleep(6);
    	assertIsOk(response);
    	System.out.println(response.current().contentType);
//    	assertSame(20, );
    }
}