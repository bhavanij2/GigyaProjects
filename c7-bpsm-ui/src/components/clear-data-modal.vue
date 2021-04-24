<template>
  <div >
    <lmnt-dialog :open="open" ref="clear-data-modal" @accept="acceptClearData" @cancel="dismissModal">

      <!-- Headline -->
      <lmnt-typo-headline :level="6" slot="header" primary> {{$t('clearDataModal.title')}}</lmnt-typo-headline>

      <!-- Message -->
      <!-- TODO: style the thing -->
      <template slot="body">
        <lmnt-typo-body :level="2" >{{$t('clearDataModal.message')}}</lmnt-typo-body>
      </template>
      <!-- Actions -->
      <lmnt-button slot="cancelButton" class="cancel-button">
        {{ $t('clearDataModal.cancel') }}
      </lmnt-button>

      <lmnt-button slot="acceptButton" class="submit-button">
        {{ $t('clearDataModal.submit') }}
      </lmnt-button>
    </lmnt-dialog>
  </div>
</template>

<script lang="ts">
  const clearData = {

    methods: {
      acceptClearData() {
        this.$emit('acceptClearData');
      },
      dismissModal() {
        this.$emit('clearAllModalClosed');
      }
    },
    name: 'clear-data',
    props: {
      open: { type: Boolean, default: false },
    },
  };
  export default clearData;
</script>