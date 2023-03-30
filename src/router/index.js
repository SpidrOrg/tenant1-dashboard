// Composables
import { createRouter, createWebHistory } from 'vue-router'
import Default from "@/layouts/default/Default.vue";
import DemandPlanner from "@/pages/DemandPlanner/DemandPlanner.vue";
import HeatMap from "@/pages/HeatMap/HeatMap.vue";
import InternalCharts from "@/pages/InternalCharts/InternalCharts.vue";
import ModelAccuracy from "@/pages/ModelAccuracy/ModelAccuracy.vue";
import TheFaq from "@/pages/TheFAQ/TheFaq.vue";
import TheSupport from "@/pages/TheSupport/TheSupport.vue";
import DemandPlannerIcon from "@/images/demand-planner-icon.svg";
import DemandPlannerIconActive from "@/images/demand-planner-icon-active.svg";
import HeatMapIcon from "@/images/heat-map-icon.svg";
import HeatMapIconActive from "@/images/heat-map-icon-active.svg";
import InternalChartsIcon from "@/images/internal-charts-icon.svg";
import InternalChartsIconActive from "@/images/internal-charts-icon-active.svg";
import ModelAccuracyIcon from "@/images/model-accuracy-icon.svg";
import ModelAccuracyIconActive from "@/images/model-accuracy-icon-active.svg";
import FaqIcon from "@/images/faq-icon.svg";
import FaqIconActive from "@/images/faq-icon-active.svg";
import HelpSupportIcon from "@/images/help-support-icon.svg";
import HelpSupportIconActive from "@/images/help-support-icon-active.svg";

const routes = [
  {
    path: '/',
    component: Default,
    children: [
      {
        path: '',
        name: 'landing',
        label: "Demand Planner",
        icon: DemandPlannerIcon,
        icon_active:DemandPlannerIconActive,
        component: DemandPlanner,
      },
      {
        path: '/demand-planner',
        name: 'DemandPlanner',
        label: "Demand Planner",
        icon: DemandPlannerIcon,
        icon_active:DemandPlannerIconActive,
        component: DemandPlanner,
      },
      {
        path: "/heatmap",
        name: "HeatMap",
        label: "Heat-map View",
        icon: HeatMapIcon,
        icon_active:HeatMapIconActive,
        component: HeatMap,
      },
      {
        path: "/internal-charts",
        name: "InternalCharts",
        label: "Internal Charts",
        icon: InternalChartsIcon,
        icon_active:InternalChartsIconActive,
        component: InternalCharts,
      },
      {
        path: "/model-accuracy",
        name: "ModelAccuracy",
        label: "Model Accuracy",
        icon: ModelAccuracyIcon,
        icon_active:ModelAccuracyIconActive,
        component: ModelAccuracy,
      },
      {
        path: "/faqs",
        name: "FAQs",
        label: "FAQs",
        icon: FaqIcon,
        icon_active:FaqIconActive,
        component: TheFaq,
      },
      {
        path: "/support",
        name: "HelpSupport",
        label: "Help & Support",
        icon: HelpSupportIcon,
        icon_active:HelpSupportIconActive,
        component: TheSupport,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
