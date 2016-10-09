package utils;

public class Result {
	public Integer errorCode;
	public String errorMsg;
	public Object data;
	
	public Result(Integer errorCode,String errorMsg,Object data){
		this.errorCode=errorCode;
		this.errorMsg=errorMsg;
		this.data=data;
	}
}
