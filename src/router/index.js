// Composables
import { createRouter, createWebHistory } from 'vue-router'
import Default from "@/layouts/default/Default.vue";
import DemandPlanner from "@/pages/DemandPlanner/DemandPlanner.vue";
import HeatMap from "@/pages/HeatMap/HeatMap.vue";
import InternalCharts from "@/pages/InternalCharts/InternalCharts.vue";
import ModelAccuracy from "@/pages/ModelAccuracy/ModelAccuracy.vue";
import TheFaq from "@/pages/TheFAQ/TheFaq.vue";
import TheSupport from "@/pages/TheSupport/TheSupport.vue";
import DemmandPlannerIcon from "@/images/demand-planner-icon.png";
import HeatMapIcon from "@/images/heat-map-icon.png";
import InternalChartsIcon from "@/images/internal-charts-icon.png";
import ModelAccuracyIcon from "@/images/model-accuracy-icon.png";
import FaqIcon from "@/images/faq-icon.png";
import HelpSupportIcon from "@/images/help-support-icon.png";

const routes = [
  {
    path: '/',
    component: Default,
    children: [
      {
        path: '',
        name: 'landing',
        label: "Demand Planner",
        icon: DemmandPlannerIcon,
        component: DemandPlanner,
      },
      {
        path: '/demand-planner',
        name: 'DemandPlanner',
        label: "Demand Planner",
        icon: DemmandPlannerIcon,
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
