package models;

import play.*;
import play.data.validation.Required;
import play.db.jpa.*;

import javax.persistence.*;

import org.hibernate.annotations.Cascade;

import java.util.*;

@Entity
@Table(name="xk_category")
public class Category extends Model {
	@Required
    public String name;
    public Date create_time;
    @OneToMany(mappedBy="category", cascade=CascadeType.REFRESH)
    public List<Bookmark> bookmark;
    
    public Category(String name){
    	this.name=name;
    	this.create_time=new Date();
    }
}
