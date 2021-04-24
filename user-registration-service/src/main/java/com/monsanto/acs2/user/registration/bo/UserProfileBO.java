package com.monsanto.acs2.user.registration.bo;

import java.util.ArrayList;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class UserProfileBO {

  private String federationId;
  private String email;

  public UserProfileBO() {}

  public UserProfileBO(String email, String federationId){
    this.email = email;
    this.federationId = federationId;
  }

  public String getFederationId() {
    return federationId;
  }
  public void setFederationId(String federationId) {
    this.federationId = federationId;
  }

  public String getEmail() {
    return email;
  }
  public void setEmail(String email) {
    this.email = email;
  }

  public String getAdminId() {
    if (this.federationId == null) {
      return this.email;
    }
    return this.federationId;
  }

}
