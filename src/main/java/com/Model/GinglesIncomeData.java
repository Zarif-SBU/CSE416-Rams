
package com.Model;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "GinglesDBData")
public class GinglesIncomeData {
    @Id
    private String id;
    private String state;
    private String data;
    private List<String> fields;
    private List<List<Double>> precincts;

    @Field("regression_points")
    private List<List<Double>> regression;
}