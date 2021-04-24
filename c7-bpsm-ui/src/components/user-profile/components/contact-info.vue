<template>
  <div class="ua-contact-info">
    <div class="ua-contact-info-segment ua-contact-info-avatar">
      <avatar-icon class="small-avatar" custom-size="40px" />
    </div>
    <div class="ua-contact-info-segment">
      <lmnt-typo-caption>{{$t('userProfile.name')}}</lmnt-typo-caption>
      <lmnt-typo-body :level=1>{{userProfile.profile.first_name}} {{userProfile.profile.last_name}}</lmnt-typo-body>
    </div>
    <div class="ua-contact-info-segment">
      <lmnt-typo-caption>{{$t('userProfile.username')}}</lmnt-typo-caption>
      <lmnt-typo-body :level=1>{{userProfile.profile.id | c7mask(APIEnvironment !== 'production') }}</lmnt-typo-body>
    </div>
    <div class="ua-contact-info-segment">
      <lmnt-typo-caption>{{$t('userProfile.phone')}}</lmnt-typo-caption>
      <lmnt-typo-body :level=1>{{userProfile.profile.primary_phone | phone}}</lmnt-typo-body>
    </div>
    <div class="ua-contact-info-segment">
      <lmnt-typo-caption>{{$t('userProfile.location')}}</lmnt-typo-caption>
      <lmnt-typo-body :level=1>{{userProfile.profile.city}}, {{userProfile.profile.state}}</lmnt-typo-body>
    </div>
    <div class="ua-contact-info-segment">
      <lmnt-typo-caption>{{$t('userProfile.status')}}</lmnt-typo-caption>
      <lmnt-typo-body :level=1>{{userProfile.profile.status || 'Unknown'}}</lmnt-typo-body>
    </div>
    <div class="ua-contact-info-segment">
      <lmnt-typo-caption>{{$t('userProfile.lastSignedIn')}}</lmnt-typo-caption>
      <lmnt-typo-body :level=1>{{userProfile.profile.lastLogin | date}}</lmnt-typo-body>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from 'vuex';

import date from '@/filters/date.filter';
import phone from '@/filters/phone.filter';

const userProfile = mapState('ua', ['userProfile']);
const APIEnvironment = mapState('c7', ['APIEnvironment']);

const ContactInfo = {
  computed: {
    ...mapState('ua', [
      'userProfile',
    ]),
    ...mapState('c7', [
      'APIEnvironment',
    ]),
  },
  filters: { date, phone },
  name: 'contact-info',
};

export default ContactInfo;
</script>

<style lang="scss">
.c7-userprofile {
  .ua-contact-info {
    position: relative;
    &:before {
      display: inline-block;
      content: ' ';
      width: 60px;
      height: 1px;
    }
  }

  .ua-contact-info-avatar {
    position: absolute;
    top: 0;
    left: 0;
  }

  .ua-contact-info-segment{
    display: inline-block;
    margin-right: 40px;

    span {
      display: block;
    }
  }
}
</style>