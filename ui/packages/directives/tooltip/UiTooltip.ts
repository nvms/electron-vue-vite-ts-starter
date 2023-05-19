import tippy from "tippy.js";
import type { App, DirectiveBinding } from "vue";

export default {
  install(app: App) {
    app.directive("tooltip", {
      mounted(el: any, binding: DirectiveBinding) {
        let { trigger } = binding.value;
        if (trigger === "hover") trigger = "mouseenter";

        el.instance = tippy(el, {
          trigger: trigger || "mouseenter",
          content: binding.value.content,
          delay: binding.value.delay ?? [300, 100],
          animation: "shift-toward-subtle",
          interactive: true,
          appendTo: () => document.body,
          placement: binding.value.placement,
          allowHTML: binding.value.allowHTML,
          arrow: true,
          inertia: true,
          maxWidth: 250,
          onShow(instance) {
            instance.setContent(el.instanceContent);
            const node = document.getElementsByTagName("html")[0];
            if (node.classList.contains("dark")) {
              instance.popper.children[0].setAttribute("data-theme", "dark");
            } else {
              instance.popper.children[0].setAttribute("data-theme", "light");
            }
          },
        });

        el.instance.popper.children[0].setAttribute("data-ui", "tooltip");
      },

      updated(el: any, binding: DirectiveBinding) {
        el.instanceContent = binding.value.content;
      },

      unmounted(el: any) {
        el.instance = null;
      },
    });
  },
};
