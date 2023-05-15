import DemandPlanner from '@/pages/DemandPlanner/DemandPlanner.vue';
import HeatMap from '@/pages/HeatMap/HeatMap.vue';
import InternalCharts from '@/pages/InternalCharts/InternalCharts.vue';
import ModelAccuracy from '@/pages/ModelAccuracy/ModelAccuracy.vue';
import TheFaq from '@/pages/TheFAQ/TheFaq.vue';
import TheSupport from '@/pages/TheSupport/TheSupport.vue';
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

export const PAGE_KEYS = {
  DEMAND_PLANNER: 'demandPlanner',
  HEAT_MAP: 'heatMap',
  INTERNAL_CHARTS: 'internalCharts',
  MODEL_ACCURACY: 'modelAccuracy',
  FAQS: 'faqs',
  HELP: 'help',
};

const PAGES_CONFIG = {
  demandPlanner: {
    label: 'Demand Planner',
    icon: DemandPlannerIcon,
    icon_active: DemandPlannerIconActive,
    component: DemandPlanner,
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
};

export default PAGES_CONFIG;
