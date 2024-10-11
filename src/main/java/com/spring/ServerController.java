package com.spring;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.io.IOException;
import java.nio.file.Files;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ServerController {

    @GetMapping("/NJ_District_GeoJson")
    public ResponseEntity<String> getGeoJson() throws IOException {
        Resource resource = new ClassPathResource("NJDistricts.geojson");
        String NJ_District_GeoJson = new String(Files.readAllBytes(resource.getFile().toPath()));
        return ResponseEntity.ok(NJ_District_GeoJson);
    }
}

