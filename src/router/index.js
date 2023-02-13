import { createRouter, createWebHashHistory } from "vue-router";
import HomePage from "@/components/pages/HomePage.vue";
import JobResultsPage from "@/components/pages/JobResultsPage.vue";
import TeamsPage from "@/components/pages/TeamsPage.vue";
import LocationPage from "@/components/pages/LocationPage.vue";
import LifeAtBoboCareersPage from "@/components/pages/LifeAtBoboCareersPage.vue";
import HowWeHirePage from "@/components/pages/HowWeHirePage.vue";
import StudentsPage from "@/components/pages/StudentsPage.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/teams",
    name: "Teams",
    component: TeamsPage,
  },
  {
    path: "/location",
    name: "Location",
    component: LocationPage,
  },
  {
    path: "/life",
    name: "LifeAtBoboCareers",
    component: LifeAtBoboCareersPage,
  },
  {
    path: "/howWeHire",
    name: "HowWeHire",
    component: HowWeHirePage,
  },
  {
    path: "/students",
    name: "Students",
    component: StudentsPage,
  },
  {
    path: "/jobs/results",
    name: "JobResults",
    component: JobResultsPage,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
