package com.monsanto.acs2.user.registration.dto;

import com.monsanto.acs2.user.registration.entity.Brand;
import com.monsanto.acs2.user.registration.entity.User;
import com.monsanto.acs2.user.registration.entity.UserContact;
import com.monsanto.acs2.user.registration.entity.UserType;
import com.monsanto.acs2.user.registration.entity.StateOption;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class UserInformationDTO {
    private final UserInformationForm form;
    private final boolean policyAccepted;
    private final boolean emailVerified;
    private final boolean registrationCompleted;
    private final Brand brand;
    private final UserType userType;
    private final PortalParametersDTO portal;
    private final List<StateOptionsDTO> states;

    public UserInformationDTO(User user, ArrayList<StateOption> states, PortalParametersDTO portal) {
        this.form = !user.isRegistrationCompleted() ? new UserInformationForm(user) : null;
        this.policyAccepted = user.isPolicyAccepted();
        this.emailVerified = user.isVerificationCompleted();
        this.registrationCompleted = user.isRegistrationCompleted();
        this.brand = user.getBrand();
        this.userType = user.getUserType();
        this.portal = portal;
        List<StateOptionsDTO> stateOptions = states.stream()
            .map(so -> new StateOptionsDTO(so))
            .collect(Collectors.toList());
        this.states = stateOptions;
    }

    public UserInformationForm getForm() {
        return form;
    }

    public boolean isPolicyAccepted() {
        return policyAccepted;
    }

    public boolean isEmailVerified() {
        return emailVerified;
    }

    public boolean isRegistrationCompleted() {
        return registrationCompleted;
    }

    public Brand getBrand() {
        return brand;
    }

    public UserType getUserType() {
        return userType;
    }

    public PortalParametersDTO getPortal() {
        return portal;
    }

    public List<StateOptionsDTO> getStates() {
        return states;
    }

    public class UserInformationForm extends UserRegistrationRequestDTO {
        private final String sapAccountNumber;

        public UserInformationForm(User user) {
            this.sapAccountNumber = user.getSapAccountNumber();

            UserContact userContact = user.getUserContact();
            if (userContact != null) {
                setEmail(userContact.getEmail());
                setFirstName(userContact.getFirstName());
                setLastName(userContact.getLastName());
                setPhone1(userContact.getPhone1());
                setPhoneType1(userContact.getPhoneType1());
                setPhone2(userContact.getPhone2());
                setPhoneType2(userContact.getPhoneType2());
                setAddress1(userContact.getAddress1());
                setAddress2(userContact.getAddress2());
                setCountry(userContact.getCountry());
                setCity(userContact.getCity());
                setState(userContact.getState());
                setZipcode(userContact.getZipcode());
            } else {
                setEmail(user.getEmail());
            }
        }

        public String getSapAccountNumber() {
            return sapAccountNumber;
        }
    }
}
