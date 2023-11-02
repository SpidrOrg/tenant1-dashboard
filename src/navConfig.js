import _ from 'lodash';
import DemandPlanner from '@/pages/DemandPlanner/DemandPlanner.vue';
import DemandPlannerMonthly from '@/pages/DemandPlannerMonthly/DemandPlannerMonthly.vue';
import HeatMap from '@/pages/HeatMap/HeatMap.vue';
import InternalCharts from '@/pages/InternalCharts/InternalCharts.vue';
import ModelAccuracy from '@/pages/ModelAccuracy/ModelAccuracy.vue';
import TheFaq from '@/pages/TheFAQ/TheFaq.vue';
import TheSupport from '@/pages/TheSupport/TheSupport.vue';
import AdminPage from '@/pages/AdminPage/AdminPage.vue';
import DemandPlannerIcon from '@/images/demand-planner-icon.svg';
import DemandPlannerIconActive from '@/images/demand-planner-icon-active.svg';
import HeatMapIcon from '@/images/heat-map-icon.svg';
import HeatMapIconActive from '@/images/heat-map-icon-active.svg';
import InternalChartsIcon from '@/images/internal-charts-icon.svg';
import InternalChartsIconActive from '@/images/internal-charts-icon-active.svg';
import ModelAccuracyIcon from '@/images/model-accuracy-icon.svg';
import ModelAccuracyIconActive from '@/images/model-accuracy-icon-active.svg';
import FaqIcon from '@/images/faq-icon.svg';
import FaqIconActive from '@/images/faq-icon-active.svg';
import HelpSupportIcon from '@/images/help-support-icon.svg';
import HelpSupportIconActive from '@/images/help-support-icon-active.svg';
import AdminIconActive from '@/images/eye-off-icon.svg'
import AdminIcon from '@/images/eye-icon.svg'


const DASHBOARDS_DEFAULT_CONFIG =  {
  demandPlanner: {
    label: 'Demand Planner',
    icon: DemandPlannerIcon,
    icon_active: DemandPlannerIconActive,
    component: DemandPlanner,
  },
  demandPlannerMonthly: {
    label: 'Demand Planner (M)',
    icon: DemandPlannerIcon,
    icon_active: DemandPlannerIconActive,
    component: DemandPlannerMonthly,
  },
  heatMap: {
    label: 'Heat-map View',
    icon: HeatMapIcon,
    icon_active: HeatMapIconActive,
    component: HeatMap,
  },
  internalCharts: {
    label: 'Internal Charts',
    icon: InternalChartsIcon,
    icon_active: InternalChartsIconActive,
    component: InternalCharts,
  },
  modelAccuracy: {
    label: 'Accuracy',
    icon: ModelAccuracyIcon,
    icon_active: ModelAccuracyIconActive,
    component: ModelAccuracy,
  },
  faqs: {
    label: 'FAQs',
    icon: FaqIcon,
    icon_active: FaqIconActive,
    component: TheFaq,
  },
  help: {
    label: 'Help & Support',
    icon: HelpSupportIcon,
    icon_active: HelpSupportIconActive,
    component: TheSupport,
  },
}

export const PAGE_KEYS = (uiConfig, isAdmin = false)=>{
  const availableDashboards = _.get(uiConfig, "config.availableDashboards")
  const toReturn = _.reduce(availableDashboards, (acc, v)=>{
    acc[v.key] = v.value;
    return acc;
  }, {});
  if (isAdmin){
    toReturn["ADMIN"] = "admin"
  }
  return toReturn;
};

const PAGES_CONFIG = (uiConfig, isAdmin = false) => {
  const availableDashboards = _.get(uiConfig, "config.availableDashboards")

  const toReturn = _.reduce(availableDashboards, (acc, v)=>{
    acc[v.value] = _.assign({}, _.get(DASHBOARDS_DEFAULT_CONFIG, `${v.value}`), v);
    return acc;
  }, {});

  if (isAdmin){
    toReturn['admin'] = {
      label: 'UI Configuration',
      icon: AdminIcon,
      icon_active: AdminIconActive,
      component: AdminPage,
    }
  }
  return toReturn;
};

export default PAGES_CONFIG;
