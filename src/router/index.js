// Composables
import { createRouter, createWebHistory } from 'vue-router'
import Default from "@/layouts/default/Default.vue";
import DemandPlanner from "@/pages/DemandPlanner/DemandPlannerNew.vue";
import HeatMap from "@/pages/HeatMap/HeatMap.vue";
import InternalCharts from "@/pages/InternalCharts/InternalCharts.vue";
import ModelAccuracy from "@/pages/ModelAccuracy/ModelAccuracy.vue";
import TheFaq from "@/pages/TheFAQ/TheFaq.vue";
import TheSupport from "@/pages/TheSupport/TheSupport.vue";
import DemandPlannerIcon from "@/images/demand-planner-icon.svg";
import HeatMapIcon from "@/images/heat-map-icon.svg";
import InternalChartsIcon from "@/images/internal-charts-icon.svg";
import ModelAccuracyIcon from "@/images/model-accuracy-icon.svg";
import FaqIcon from "@/images/faq-icon.svg";
import HelpSupportIcon from "@/images/help-support-icon.svg";

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
        component: DemandPlanner,
      },
      {
        path: '/demand-planner',
        name: 'DemandPlanner',
        label: "Demand Planner",
        icon: DemandPlannerIcon,
        component: DemandPlanner,
      },
      {
        path: "/heatmap",
        name: "HeatMap",
        label: "Heat-map View",
        icon: HeatMapIcon,
        component: HeatMap,
      },
      {
        path: "/internal-charts",
        name: "InternalCharts",
        label: "Internal Charts",
        icon: InternalChartsIcon,
        component: InternalCharts,
      },
      {
        path: "/model-accuracy",
        name: "ModelAccuracy",
        label: "Model Accuracy",
        icon: ModelAccuracyIcon,
        component: ModelAccuracy,
      },
      {
        path: "/faqs",
        name: "FAQs",
        label: "FAQs",
        icon: FaqIcon,
        component: TheFaq,
      },
      {
        path: "/support",
        name: "HelpSupport",
        label: "Help & Support",
        icon: HelpSupportIcon,
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
