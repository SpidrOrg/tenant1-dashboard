<script>
import _ from 'lodash';
import JsonEditorVue from 'json-editor-vue';
import saveUIConfig from '@/api/saveUIConfig';

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
  },
  data(){
    return {
      value: this.uiConfig.config,
      isPristine: true,
      isSaving: false
    }
  },
  methods: {
    updateContent(modVal){
      let parsedModVal;
      try {
        parsedModVal = JSON.parse(modVal.text);
      } catch(e){
        console.log(e);
      }
      this.isPristine = _.isEqual(parsedModVal, this.uiConfig);
    },
    async handleSave(){
      if (this.isPristine) return;
      this.isSaving = true;

      let currentValue;
      try {
        currentValue = JSON.parse(this.value);
      }catch (e){
        console.log(e);
      }
      const res = await saveUIConfig(currentValue).then(()=>true).catch((e)=>{
        console.log(e);
        return false;
      })

      if (res){
        this.isPristine = true;
      }
      this.isSaving = false;
    }
  }
};
</script>

<template>
  <div class="tw-flex tw-w-full tw-h-8 tw-bg-brand-gray-1">
    <h1 class="tw-flex tw-h-full tw-items-center tw-font-bold tw-text-lg">
      UI Configuration
    </h1>
  </div>
  <div class='tw-flex tw-w-full tw-justify-end tw-pb-1'>
    <button
      :class="`tw-px-2 tw-py-1.5 tw-border-2 tw-border-solid tw-border-brand-primary ${isPristine ? '' : 'tw-bg-brand-primary'}`"
      @click='handleSave'
    >
      <div class="tw-flex tw-gap-x-2 tw-items-center">
        <v-icon
          icon="mdi-content-save-outline"
          :class="`${isPristine ? 'tw-text-brand-primary' : 'tw-text-white'}`"
          :size="24"
        />
        <span :class="`tw-text-base ${isPristine ? 'tw-text-black' : 'tw-text-white'}`">
                      Save
                    </span>
      </div>
      <v-progress-linear v-if='isSaving' class="tw-text-white" indeterminate></v-progress-linear>
    </button>
  </div>
  <JsonEditorVue
    v-model="value"
    :onChange="updateContent"
    mode='text'
    :mainMenuBar='false'
  />
</template>
