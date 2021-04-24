package com.monsanto.acs2.user.registration.dto;

import java.math.BigInteger;

public class RegistrationMetricDTO {
    private final BigInteger count;
    private final String yearMonth;
    private final String entryMethod;

    public RegistrationMetricDTO(BigInteger count, String yearMonth, String entryMethod) {
        this.count = count;
        this.yearMonth = yearMonth;
        this.entryMethod = entryMethod;
    }

    public BigInteger getCount() {
        return count;
    }

    public String getYearMonth() {
        return yearMonth;
    }

    public String getEntryMethod() {
        return entryMethod;
    }
}
