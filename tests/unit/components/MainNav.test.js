import { render, screen } from "@testing-library/vue";

import MainNav from "@/MainNav.vue";

describe("MainNav", () => {
  it("Displays Company Logo", () => {
    render(MainNav, {
      data() {
        return {
          company: "Visd",
        };
      },
    });

    const compName = screen.getByText("Visd");

    expect(compName).toBeInTheDocument();
  });
});
