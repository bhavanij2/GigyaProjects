<template>
  <div >
    <lmnt-dialog :open="open" ref="error-message-modal" @change="setErrorMessageOpen(!open)">

      <!-- Headline -->
      <lmnt-typo-headline :level="6" slot="header" primary>Error</lmnt-typo-headline>

      <template slot="body">
        <lmnt-typo-body :level="2">Something isn't working right now. Some features may not be available.</lmnt-typo-body>
      </template>

      <lmnt-button slot="acceptButton" class="submit-button">
        OK
      </lmnt-button>
    </lmnt-dialog>
  </div>
</template>

<script lang="ts">
import { mapMutations } from 'vuex';

  const errorMessageModal = {
    methods: {
      ...mapMutations('ua', [ 'setErrorMessageOpen' ]),
    },
    name: 'error-message-modal',
    props: {
      open: { type: Boolean, default: false },
    },
  };
  export default errorMessageModal;
</script>