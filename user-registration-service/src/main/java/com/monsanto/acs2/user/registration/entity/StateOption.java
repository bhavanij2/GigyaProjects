package com.monsanto.acs2.user.registration.entity;

import com.fasterxml.jackson.databind.JsonNode;

public class StateOption {
  private String name;
  private String abbreviation;

  public StateOption(JsonNode data) {
    name = data.get("properties").get("l1_name").textValue();
    abbreviation = data.get("properties").get("l1_iso_code").textValue();
  }

  public String getName() {
    return name;
  }
  
  public String getAbrreviation() {
    return abbreviation;
  }
}