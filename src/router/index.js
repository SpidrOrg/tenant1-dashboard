import { createRouter, createWebHashHistory } from "vue-router";
import DemandPlanner from "@/components/pages/DemandPlanner/DemandPlanner.vue";
import HeatMap from "@/components/pages/HeatMap/HeatMap.vue";
import InternalCharts from "@/components/pages/InternalCharts/InternalCharts.vue";
import ModelAccuracy from "@/components/pages/ModelAccuracy/ModelAccuracy.vue";
import TheFaq from "@/components/pages/TheFAQ/TheFaq.vue";
import TheSupport from "@/components/pages/TheSupport/TheSupport.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    label: "Demand Planner",
    component: DemandPlanner,
  },
  {
    path: "/demand-planner",
    name: "DemandPlanner",
    label: "Demand Planner",
    component: DemandPlanner,
  },
  {
    path: "/heatmap",
    name: "HeatMap",
    label: "Heat-map View",
    component: HeatMap,
  },
  {
    path: "/internal-charts",
    name: "InternalCharts",
    label: "Internal Charts",
    component: InternalCharts,
  },
  {
    path: "/model-accuracy",
    name: "ModelAccuracy",
    label: "Model Accuracy",
    component: ModelAccuracy,
  },
  {
    path: "/faqs",
    name: "FAQs",
    label: "FAQs",
    component: TheFaq,
  },
  {
    path: "/support",
    name: "HelpSupport",
    label: "Help & Support",
    component: TheSupport,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
