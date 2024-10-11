package com.spring;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
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
}

