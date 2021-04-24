package com.monsanto.acs2.user.registration.dto;
import com.monsanto.acs2.user.registration.entity.Location;

public class LocationDTO {

    private String sapId;
    
    private String hqSapId;
   
    private String sourceSystem;

    public String getSapId() {
        return sapId;
    }

    public void setSapId(String sapId) {
        this.sapId = sapId;
    }

    public String getHqSapId() {
        return hqSapId;
    }

    public void setHqSapId(String hqSapId) {
        this.hqSapId = hqSapId;
    }

    public String getSourceSystem() {
        return sourceSystem;
    }

    public void setSourceSystem(String sourceSystem) {
        this.sourceSystem = sourceSystem;
    }

    public LocationDTO(Location location) {
        this.sapId = location.getSapId();
        this.hqSapId = location.getHqSapId();
        this.setSourceSystem(location.getSourceSystem());
    }

    public LocationDTO() {}
}
