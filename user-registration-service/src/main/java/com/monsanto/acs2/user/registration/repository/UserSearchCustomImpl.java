package com.monsanto.acs2.user.registration.repository;

import com.monsanto.acs2.user.registration.entity.User;
import com.monsanto.acs2.user.registration.entity.LocationRole;
import com.monsanto.acs2.user.registration.entity.Brand;
import com.monsanto.acs2.user.registration.entity.UserType;
import com.monsanto.acs2.user.registration.entity.Location;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.stereotype.Repository;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.ListJoin;
import javax.persistence.criteria.Path;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

@Repository
public class UserSearchCustomImpl implements UserSearchCustom {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<User> searchUser(String hqSapId, String email, String first_name, String last_name,
     String locationId, String  city, String state, String brand, String persona, String country){

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<User> query = cb.createQuery(User.class);
        Root<User> user = query.from(User.class);
        List<Predicate> predicates = new ArrayList<>();
        Predicate predicateRegistrationCompletedTimestampIsNull = cb.isNull(user.get("registrationCompletedTimestamp"));
        predicates.add(predicateRegistrationCompletedTimestampIsNull);
        Predicate userContactIsNotNull = cb.isNotNull(user.get("userContact").get("email"));
        predicates.add(userContactIsNotNull);
        if(hqSapId != null && hqSapId.length() > 0) {
            Predicate predicateForHqSapId = cb.equal(user.get("hqSapId"), hqSapId);
            predicates.add(predicateForHqSapId);
        }
        if(email != null && email.length() > 0) {
            Predicate predicateForEmail = cb.like(cb.upper(user.get("email")), "%"+email.toUpperCase()+"%");
            predicates.add(predicateForEmail);
        }
        if(first_name != null && first_name.length() > 0) {
            Predicate predicateForFirstName = cb.like(cb.upper(user.get("userContact").get("firstName")), "%"+first_name.toUpperCase()+"%");
            predicates.add(predicateForFirstName);
        }
        if(last_name != null && last_name.length() > 0) {
            Predicate predicateForLastName = cb.like(cb.upper(user.get("userContact").get("lastName")), "%"+last_name.toUpperCase()+"%");
            predicates.add(predicateForLastName);
        }
        if(locationId != null && locationId.length() > 0) {
            Predicate predicateLocation = cb.like(user.join("userLocationRoles").join("location").get("sapId"), "%"+locationId+"%");
            predicates.add(predicateLocation);
        }
        if(city != null && city.length() > 0) {
            Predicate predicateCity = cb.like(cb.upper(user.get("userContact").get("city")), "%"+city.toUpperCase()+"%");
            predicates.add(predicateCity);
        }
        if(state != null && state.length() > 0) {
            Predicate predicateState = cb.like(cb.upper(user.get("userContact").get("state")), "%"+state.toUpperCase()+"%");
            predicates.add(predicateState);
        }
        if(brand != null && brand.length() > 0) {
            String[] brands = brand.split(",");
            ArrayList<Brand> brandList = new ArrayList<Brand>();
            for(String brandString:brands) {
                brandList.add(Brand.valueOf(brandString));
            }
            Predicate brandPredicate = user.get("brand").in(brandList);
            predicates.add(brandPredicate);
        }
        if(country != null && country.length() > 0) {
            String[] countries = country.split(",");
            ArrayList<String> countryList = new ArrayList<String>();
            for(String countryString:countries) {
                countryList.add(countryString);
            }
            Predicate countryPredicate = user.get("userContact").get("country").in(countryList);
            predicates.add(countryPredicate);
        }
        if(persona != null && persona.length() > 0) {
            String[] personas = persona.split(",");
            ArrayList<UserType> personaList = new ArrayList<UserType>();
            for(String personaString:personas) {
                personaList.add(UserType.valueOf(personaString));
            }
            Predicate personaPredicate = user.get("userType").in(personaList);
            predicates.add(personaPredicate);
        }
        query.where(predicates.toArray(new Predicate[predicates.size()]));
        List<User> items = entityManager.createQuery(query).getResultList();
        return items;
    }
}
