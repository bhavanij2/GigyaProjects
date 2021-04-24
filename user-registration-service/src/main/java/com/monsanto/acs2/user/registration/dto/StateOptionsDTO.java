package com.monsanto.acs2.user.registration.dto;
import com.monsanto.acs2.user.registration.entity.StateOption;

public class StateOptionsDTO {
  private String name;
  private String abbreviation;

  public String getName() {
    return name;
  }

  public String getAbbreviation() {
    return abbreviation;
  }

  public void setName(String name) {
    this.name = name;
  }


  public void setAbbreviation(String abbreviation) {
    this.abbreviation = abbreviation;
  }

  public StateOptionsDTO(StateOption s) {
      this.name = s.getName();
      this.abbreviation = s.getAbrreviation();
  }

  public StateOptionsDTO() {}
}