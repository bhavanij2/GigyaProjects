package com.monsanto.acs2.user.registration.dto;

import com.monsanto.acs2.user.registration.dto.AuditToDTO;
import com.monsanto.acs2.user.registration.dto.AuditFromDTO;

import java.util.UUID;
import java.time.LocalDateTime;

public class AuditDTO {
    private String application;
    private String action;
    private String field;
    private String updatedBy;
    private LocalDateTime updatedTimestamp;
    private UUID transactionId;
    private AuditToDTO to;
    private AuditFromDTO from;

    public AuditDTO(){}

    public String getApplication(){
        return application;
    }

    public void setApplication(String application){
        this.application = application;
    }

    public String getAction(){
        return action;
    }

    public void setAction(String action){
        this.action = action;
    }

    public String getField(){
        return field;
    }

    public void setField(String field){
        this.field = field;
    }

    public String getUpdatedBy(){
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy){
        this.updatedBy = updatedBy;
    }

    public String getUpdatedTimestamp(){
        return LocalDateTime.now().toString();
    }

    public void setUpdatedTimestamp(LocalDateTime updatedTimestamp){
        this.updatedTimestamp = updatedTimestamp;
    }

    public UUID getTransactionId(){
        return transactionId;
    }

    public void setTransactionId(UUID transactionId){
        this.transactionId = transactionId;
    }
    
    public AuditToDTO getTo(){
        return to;
    }

    public void setAuditToDTO(AuditToDTO to){
        this.to = to;
    }

    public AuditFromDTO getFrom(){
        return new AuditFromDTO();
    }

    public void setAuditFromDTO(AuditFromDTO from){
        this.from = from;
    }
}