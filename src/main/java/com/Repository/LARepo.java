package com.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.Model.Feature;

@Repository
public interface LARepo extends MongoRepository<Feature,String>{

}
