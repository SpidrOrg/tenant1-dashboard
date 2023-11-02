<script>
import _ from 'lodash';
import JsonEditorVue from 'json-editor-vue';
import saveUIConfig from '@/api/saveUIConfig';

const AVAILABLE_EDIT_MODES = {
  TEXT: 'text',
  TABLE: 'table'
};

export default {
  name: 'AdminPage',
  components: {
    JsonEditorVue
  },
  props: {
    uiConfig: {
      type: Object,
      required: true,
    },
    onUiSettingUpdate: {
      type: Function,
      required: true
    }
  },
  data(){
    return {
      value: this.uiConfig.config,
      isPristine: true,
      isSaving: false,
      editMode: AVAILABLE_EDIT_MODES.TABLE,
      availableEditModes: AVAILABLE_EDIT_MODES,
      editorError: false,
      lastContent: ''
    }
  },
  methods: {
    updateContent(modVal){
      let parsedModVal;
      this.editorError = false;
      try {
        if (this.editMode === AVAILABLE_EDIT_MODES.TEXT){
          parsedModVal = JSON.parse(_.get(modVal, "text"));
        } else {
          parsedModVal = _.get(modVal, "json");
          this.value = parsedModVal;
        }

        this.editorError = false;
      } catch(e) {
        this.editorError = true;
        console.log(e);
      }
      this.lastContent = parsedModVal;
      this.isPristine = _.isEqual(parsedModVal, _.get(this.uiConfig, 'config'));
    },
    toggleEditMode(){
      this.editMode = this.editMode === AVAILABLE_EDIT_MODES.TEXT ? AVAILABLE_EDIT_MODES.TABLE : AVAILABLE_EDIT_MODES.TEXT
    },
    async handleSave(){
      console.log("se")
      if (this.isPristine) return;
      this.isSaving = true;
      this.editorError = false;
      // let currentValue;
      try {
        // if (this.editMode === AVAILABLE_EDIT_MODES.TEXT && typeof(this.value) !== 'object'){
        //   currentValue = JSON.parse(this.value);
        // } else {
        //   currentValue = JSON.parse(JSON.stringify(this.value));
        // }

        const res = await saveUIConfig(JSON.parse(JSON.stringify(this.lastContent))).catch((e)=>{
          console.log(e);
          this.editorError = true;
          return false;
        })

        if (res){
          this.isPristine = true;
          this.value = res.config;
        }
        this.isSaving = false;
        this.onUiSettingUpdate(res);
        this.editorError = false;
      } catch (e) {
        console.log(e);
        this.isSaving = false;
        this.editorError = true;
      }

    }
  }
};
</script>

<template>
  <div class='tw-flex tw-justify-between tw-flex-row'>
    <div class="tw-flex tw-w-full tw-h-8 tw-bg-brand-gray-1">
      <h1 class="tw-flex tw-h-full tw-items-center tw-font-bold tw-text-lg">
        UI Configuration
      </h1>
    </div>
    <div class='tw-flex tw-w-full tw-flex-row tw-justify-end tw-gap-3'>
      <div class='tw-flex  tw-justify-end tw-pb-1'>
        <button
          class="tw-px-2 tw-py-1.5 tw-border-2 tw-border-solid tw-border-brand-primary"
          @click='toggleEditMode'
        >
          <div class="tw-flex tw-gap-x-2 tw-items-center">
            <v-icon
              :icon="this.editMode === availableEditModes.TEXT ? 'mdi-table' : 'mdi-text'"
              class="tw-text-brand-primary"
              :size="24"
            />
            <div class='tw-flex tw-flex-col' style='line-height: 12px'>
              <span>{{this.editMode === availableEditModes.TEXT ? 'Table' : 'Text'}} </span>
              <span style='font-size: 10px'>Mode</span>

            </div>
          </div>
        </button>
      </div>
      <div class='tw-flex tw-justify-end tw-pb-1'>
        <button
          :class="`tw-px-2 tw-py-1.5 tw-border-2 tw-border-solid ${editorError ? 'tw-border-red-500' : 'tw-border-brand-primary'} ${isPristine && !isSaving ? '' : 'tw-bg-brand-primary'} ${editorError ? 'tw-bg-red-600' : ''}`"
          @click='handleSave'
        >
          <div class="tw-flex tw-gap-x-2 tw-items-center">
            <v-icon
              icon="mdi-content-save-outline"
              :class="`${isPristine && !isSaving ? 'tw-text-brand-primary' : 'tw-text-white'}`"
              :size="24"
            />
            <span :class="`tw-text-base ${isPristine && !isSaving ? 'tw-text-black' : 'tw-text-white'}`">
                      Save
                    </span>
          </div>
          <v-progress-linear v-if='isSaving' class="tw-text-white" indeterminate></v-progress-linear>
        </button>
      </div>
    </div>
  </div>


  <JsonEditorVue
    v-model="value"
    v-bind="val1"
    :onChange="updateContent"
    :mode='editMode'
    :mainMenuBar='false'
    style='width: 100%; height: 100%'
  />
</template>
