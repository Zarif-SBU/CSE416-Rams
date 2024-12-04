package com.spring;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import com.mongodb.client.gridfs.model.GridFSFile;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import java.io.IOException;
import java.nio.file.Files;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ServerController {

    @GetMapping("/Data/{param1}/{param2}/{param3}")
    public ResponseEntity<String> getGeoJson(@PathVariable String param1, @PathVariable String param2, @PathVariable String param3) throws IOException {
        Resource resource = new ClassPathResource(param1 + param2 + "." + param3);
        String GeoJson = new String(Files.readAllBytes(resource.getFile().toPath()));
        return ResponseEntity.ok(GeoJson);
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        ObjectId fileId = gridFsTemplate.store(file.getInputStream(), file.getOriginalFilename());
        return ResponseEntity.ok("File uploaded with ID: " + fileId.toString());
    }

    @GetMapping("/downloadFile/{fileId}")
    public ResponseEntity<GridFsResource> downloadFile(@PathVariable String fileId) {

        GridFSFile gridFsFile = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(new ObjectId(fileId))));
        if (gridFsFile == null) {
            return ResponseEntity.notFound().build();
        }
    
        GridFsResource resource = gridFsTemplate.getResource(gridFsFile);
    
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=" + resource.getFilename())
                .contentType(MediaType.APPLICATION_JSON)
                .body(resource);
    }
}
    
