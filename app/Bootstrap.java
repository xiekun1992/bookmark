import models.Category;
import play.jobs.Job;
import play.jobs.OnApplicationStart;

@OnApplicationStart
public class Bootstrap extends Job{
	public void doJob(){
		if(Category.findAll().size()==0){
			new Category("all").save();
		}
	}
}
