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
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;

import com.Repository.LARepo;
import com.Repository.StateSummaryRepository;
import com.Repository.GinglesRaceDataRepository;
import com.Repository.GinglesIncomeDataRepository;
import com.Repository.CongressionalTableRepository;
import com.Model.Feature;
import com.Model.StateSummary;
import com.Model.GinglesData;
import com.Model.GinglesIncomeData;
import com.Model.CongressionalTable;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.bson.types.ObjectId;

import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ServerController {

    @Autowired
    private LARepo laRepo;

    @Autowired
    private CacheHandler cacheHandler;

    @Autowired
    private StateSummaryRepository stateSumRepo;

    @Autowired
    private GridFsTemplate gridFsTemplate;

    @Autowired
    private GinglesRaceDataRepository ginglesRepo;

    @Autowired
    private GinglesIncomeDataRepository ginglesIncomeRepo;

    @Autowired
    private CongressionalTableRepository congressTableRepo;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Get all Features
    @GetMapping("/test")
    public List<Feature> getAllFeatures() {
        return laRepo.findAll();
    }

    // Endpoint for each district, fetching information based on the district
    @GetMapping("/info/Districts/{state}/{districtNum}")
    public String getDistrictInfo(@RequestParam String param) {
        return new String();
    }

    // Endpoint for charts
    @GetMapping("/Data/chart/{state}/{chartType}")
    public String getChartInfo(@RequestParam String param) {
        return new String();
    }

    @GetMapping("/CongressionalTable/{state}")
    public Map<String, Object> getCongressionalTable(@PathVariable String state) {
        String cacheKey = state + "congressionalTable";
        String cacheName = "congressionalTable";

        Map<String, Object> cachedData = cacheHandler.getFromCache(cacheKey, cacheName);
        if(cachedData != null)
        {
            return cachedData;
        }

        CongressionalTable congressTableData = congressTableRepo.findByStateIgnoreCase(state);

        System.out.println("THIS IS THE DATA COMING BACK: ");
        System.out.println(congressTableData);

        // Map<String, Object> tableSummary = new HashMap<>();
        // tableSummary.put("state", congressTableData.getState());
        // tableSummary.put("districtthree", congressTableData.getDistrictthree());
        // tableSummary.put("districtsix", congressTableData.getDistrictsix());
        // tableSummary.put("districtone", congressTableData.getDistrictone());
        // tableSummary.put("districtfour", congressTableData.getDistrictfour());
        // tableSummary.put("districtfive", congressTableData.getDistrictfive());
        // tableSummary.put("districttwo", congressTableData.getDistricttwo());

        Map<String, Object> tableSummary = Map.of(
            "state", congressTableData.getState(),
            "districtthree", congressTableData.getDistrictthree(),
            "districtsix", congressTableData.getDistrictsix(),
            "districtone", congressTableData.getDistrictone(),
            "districtfour", congressTableData.getDistrictfour(),
            "districtfive", congressTableData.getDistrictfive(),
            "districttwo", congressTableData.getDistricttwo()
        );

        cacheHandler.putToCache(cacheKey, tableSummary, cacheName);

        return tableSummary;
    }

    @GetMapping("/Gingles/{selectedDisplay}/{state}/{race}")
    public Map<String, Object> getGingles(@PathVariable String selectedDisplay, @PathVariable String state, @PathVariable String race) {
        String cacheKey;
        String cacheName = "ginglesData";

        if (!race.equals("none")) {
            cacheKey = selectedDisplay + state + race + "gingles";
        }
        else
        {
            cacheKey = selectedDisplay + state + "gingles";
        }

        Map<String, Object> cachedData = cacheHandler.getFromCache(cacheKey, cacheName);
        if(cachedData != null)
        {
            return cachedData;
        }
        
        GinglesData ginglesData;

        if (!race.equals("none")) {
            ginglesData = ginglesRepo.findByStateIgnoreCaseAndDataIgnoreCaseAndPopulationIgnoreCase(state, selectedDisplay, race);
        } 
        else 
        {
            
            GinglesIncomeData ginglesIncomeData = ginglesIncomeRepo.findByStateIgnoreCaseAndDataIgnoreCase(state, selectedDisplay);

            // ginglesData = new GinglesData(
            // ginglesIncomeData.getId(),
            // ginglesIncomeData.getState(),
            // ginglesIncomeData.getData(),
            // null, 
            // ginglesIncomeData.getFields(),
            // ginglesIncomeData.getPrecincts()
            // );

            Map<String, Object> ginglesSummary = new HashMap<>();
            ginglesSummary.put("state", ginglesIncomeData.getState());
            ginglesSummary.put("data", ginglesIncomeData.getData());
            ginglesSummary.put("fields", ginglesIncomeData.getFields());
            ginglesSummary.put("precincts", ginglesIncomeData.getPrecincts());
            ginglesSummary.put("regression_points", ginglesIncomeData.getRegression());

            cacheHandler.putToCache(cacheKey, ginglesSummary, cacheName);

            return ginglesSummary;
         }
    
        System.out.println(ginglesData);
        System.out.println(ginglesData);
        Map<String, Object> ginglesSummary = new HashMap<>();
        ginglesSummary.put("state", ginglesData.getState());
        ginglesSummary.put("data", ginglesData.getData());
        ginglesSummary.put("race", ginglesData.getPopulation());
        ginglesSummary.put("fields", ginglesData.getFields());
        ginglesSummary.put("precincts", ginglesData.getPrecincts());
        ginglesSummary.put("regression_points", ginglesData.getRegression());

        cacheHandler.putToCache(cacheKey, ginglesSummary, cacheName);
    
        return ginglesSummary;
    }

    // Get state summary
    @GetMapping("/info/{state}/{keyName}")
    public Map<String, Object> getStateSummary(@PathVariable String state, @PathVariable String keyName) {
        String cacheKey = state + keyName;
        String cacheName = "summaryData";
        Map<String, Object> cachedData = cacheHandler.getFromCache(cacheKey, cacheName);
        if (cachedData != null) {
            return cachedData;
        }
        StateSummary summary = stateSumRepo.findByStateIgnoreCase(state);
        Map<String, Object> summaryData = summary.getSummary();
        cacheHandler.putToCache(cacheKey, summaryData, cacheName);

        return summaryData;
    }

    // Get colors based on category
    @GetMapping("/Data/colors/{category}")
    public Map<String, String> getColors(@PathVariable String category) {
        try {
            ClassPathResource resource = new ClassPathResource("colors/" + category.toLowerCase() + ".json");
            return objectMapper.readValue(resource.getInputStream(), Map.class);
        } catch (IOException e) {
            e.printStackTrace();
            return Map.of(); 
        }
    }

    // Get race density
    @GetMapping("/Data/Minority/{state}/{race}")
    public Map<String, Object> getRaceDensity(@PathVariable String state, @PathVariable String race) {
        return null;
    }

    // Get GeoJson
    @GetMapping("/Data/{state}/{geoLevel}/{fileType}")
    public ResponseEntity<String> getGeoJson(@PathVariable String state, @PathVariable String geoLevel, @PathVariable String fileType) throws IOException {
        Resource resource = new ClassPathResource(state + geoLevel + "." + fileType);
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
    
