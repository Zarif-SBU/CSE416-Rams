package com.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "LAPrecinctJSON")
public class Feature {
    @Id
    private String id;
    private String type;
    private String name;
    private String crs;
    private String features;
    
}
