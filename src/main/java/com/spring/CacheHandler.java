package com.spring;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Component;

import com.Model.StateSummary;
import com.Repository.StateSummaryRepository;

import java.util.Map;

@Component
public class CacheHandler {

    @Autowired
    private CacheManager cacheManager;

    @Autowired
    private StateSummaryRepository repository;

    public Map<String, Object> getFromCache(String cacheKey, String cacheName) {
        Cache cache = cacheManager.getCache(cacheName);
        if (cache != null) {
            Cache.ValueWrapper cachedValue = cache.get(cacheKey);
            if (cachedValue != null) {
                System.out.println("Cache hit for " + cacheKey);
                return (Map<String, Object>) cachedValue.get();
            }
        }
        System.out.println("Cache miss for " + cacheKey);
        return null;
    }

    public void putToCache(String cacheKey, Map<String, Object> data, String cacheName) {
        Cache cache = cacheManager.getCache(cacheName);
        if (cache != null) {
            cache.put(cacheKey, data);
            System.out.println("Cache updated for " + cacheKey);
        }
    }
}
