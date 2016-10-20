import org.junit.*;

import play.test.*;
import play.mvc.*;
import play.mvc.Http.*;
import utils.Result;
import models.*;

public class ApplicationTest extends FunctionalTest {

    @Test
    public void testThatIndexPageWorks() {
        Response response = GET("/");
        assertIsOk(response);
        assertContentType("text/html", response);
        assertCharset(play.Play.defaultWebEncoding, response);
    }
    @Test(timeout=5000)
    public void testURLAccess(){
    	String url="http://www.npmjs.org";
    	Response response=GET("/api/url/"+url+"/info");
    	assertIsOk(response);
    	assertSame(20, (((Result)renderArgs("r")).errorCode));
    }
}