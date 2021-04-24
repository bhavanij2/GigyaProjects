package com.monsanto.acs2.user.registration.entity;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.UUID;
import java.util.Set;

@Entity
public class User extends AuditEntity {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    private UUID id;

    @Column
    private String myMonUserId;

    @Column
    private String email;

    @Column
    private String sapAccountNumber;

    @Column
    private String hqSapId;

//    @Column
//    @ManyToMany(cascade = {CascadeType.PERSIST})
//    @JoinTable(
//        name = "user_location_role",
//        joinColumns = @JoinColumn(name = "user_id"),
//        inverseJoinColumns = {
//            @JoinColumn(name = "role_id"),
//            @JoinColumn(name = "sap_id")
//        }
//    )
//    private Set<LocationRole> locationRoles;

    @OneToMany(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private Set<UserLocationRole> userLocationRoles;

    @Column
    private Long registrationCompletedTimestamp;

    @Column
    private Long policyAcceptedTimestamp;

    @OneToOne(mappedBy = "user")
    private UserContact userContact;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Brand brand;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private UserType userType;

    @Column
    private String portal;

    @Column
    private String gigyaUid;

    @Column(name = "c7_registration_timestamp")
    private Long c7RegistrationTimestamp;

    @Column
    private UUID emailVerificationCode;

    @Column
    private Long verificationCompletedTimestamp;

    @Column(nullable = false)
    private String createdBy;

    @Column(nullable = false)
    private boolean testUser = false;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getMyMonUserId() {
        return myMonUserId;
    }

    public void setMyMonUserId(String myMonUserId) {
        this.myMonUserId = myMonUserId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSapAccountNumber() {
        return sapAccountNumber;
    }

    public void setSapAccountNumber(String sapAccountNumber) {
        this.sapAccountNumber = sapAccountNumber;
    }

    public String getHqSapId() {
        return hqSapId;
    }

    public void setHqSapId(String hqSapId) {
        this.hqSapId = hqSapId;
    }

    public boolean isRegistrationCompleted() {
        return getRegistrationCompletedTimestamp() != null;
    }

    private Long getRegistrationCompletedTimestamp() {
        return registrationCompletedTimestamp;
    }

    public void setRegistrationCompletedTimestamp(Long registrationCompletedTimestamp) {
        this.registrationCompletedTimestamp = registrationCompletedTimestamp;
    }

    public boolean isPolicyAccepted() {
        return getPolicyAcceptedTimestamp() != null;
    }

    private Long getPolicyAcceptedTimestamp() {
        return policyAcceptedTimestamp;
    }

    public void setPolicyAcceptedTimestamp(Long policyAcceptedTimestamp) {
        this.policyAcceptedTimestamp = policyAcceptedTimestamp;
    }

    public UserContact getUserContact() {
        return userContact;
    }

    public void setUserContact(UserContact userContact) {
        this.userContact = userContact;
    }

    public String getPortal() {
        return portal;
    }

    public void setPortal(String portal) {
        this.portal = portal;
    }

    public Brand getBrand() {
        return brand;
    }

    public void setBrand(Brand brand) {
        this.brand = brand;
    }

    public UserType getUserType() {
        return userType;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }

    public String getGigyaUid() {
        return gigyaUid;
    }

    public void setGigyaUid(String gigyaUid) {
        this.gigyaUid = gigyaUid;
    }

    public Long getC7RegistrationTimestamp() {
        return c7RegistrationTimestamp;
    }

    public void setC7RegistrationTimestamp(Long c7RegistrationTimestamp) {
        this.c7RegistrationTimestamp = c7RegistrationTimestamp;
    }

    public UUID getEmailVerificationCode() {
        return emailVerificationCode;
    }

    public void setEmailVerificationCode(UUID emailVerificationCode) {
        this.emailVerificationCode = emailVerificationCode;
    }

    public boolean isVerificationCompleted() {
        return getVerificationCompletedTimestamp() != null;
    }

    private Long getVerificationCompletedTimestamp() {
        return verificationCompletedTimestamp;
    }

    public void setVerificationCompletedTimestamp(Long verificationCompletedTimestamp) {
        this.verificationCompletedTimestamp = verificationCompletedTimestamp;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public boolean isTestUser() {
        return testUser;
    }

    public void setTestUser(boolean testUser) {
        this.testUser = testUser;
    }

    public Set<UserLocationRole> getUserLocationRoles() {
        return userLocationRoles;
    }

    public void setUserLocationRoles(Set<UserLocationRole> userLocationRoles) {
        this.userLocationRoles = userLocationRoles;
    }

    public void addUserLocationRole(UserLocationRole userLocationRole) {
        userLocationRoles.add(userLocationRole);
        userLocationRole.setUser(this);
    }

    public void removeUserLocationRole(UserLocationRole userLocationRole) {
        userLocationRoles.remove(userLocationRole);
        userLocationRole.setUser(null);
    }
    public User() {
    }
}
