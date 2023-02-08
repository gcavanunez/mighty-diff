// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  // transpilePackages: [
  //   "@adobe/react-spectrum",
  //   "@react-spectrum/actiongroup",
  //   "@react-spectrum/badge",
  //   "@react-spectrum/breadcrumbs",
  //   "@react-spectrum/button",
  //   "@react-spectrum/buttongroup",
  //   "@react-spectrum/calendar",
  //   "@react-spectrum/checkbox",
  //   "@react-spectrum/color",
  //   "@react-spectrum/combobox",
  //   "@react-spectrum/contextualhelp",
  //   "@react-spectrum/datepicker",
  //   "@react-spectrum/dialog",
  //   "@react-spectrum/divider",
  //   "@react-spectrum/dnd",
  //   "@react-spectrum/form",
  //   "@react-spectrum/icon",
  //   "@react-spectrum/illustratedmessage",
  //   "@react-spectrum/image",
  //   "@react-spectrum/label",
  //   "@react-spectrum/labeledvalue",
  //   "@react-spectrum/layout",
  //   "@react-spectrum/link",
  //   "@react-spectrum/list",
  //   "@react-spectrum/listbox",
  //   "@react-spectrum/menu",
  //   "@react-spectrum/meter",
  //   "@react-spectrum/numberfield",
  //   "@react-spectrum/overlays",
  //   "@react-spectrum/picker",
  //   "@react-spectrum/progress",
  //   "@react-spectrum/provider",
  //   "@react-spectrum/radio",
  //   "@react-spectrum/slider",
  //   "@react-spectrum/searchfield",
  //   "@react-spectrum/statuslight",
  //   "@react-spectrum/switch",
  //   "@react-spectrum/table",
  //   "@react-spectrum/tabs",
  //   "@react-spectrum/text",
  //   "@react-spectrum/textfield",
  //   "@react-spectrum/theme-dark",
  //   "@react-spectrum/theme-default",
  //   "@react-spectrum/theme-light",
  //   "@react-spectrum/tooltip",
  //   "@react-spectrum/view",
  //   "@react-spectrum/well",
  //   "@spectrum-icons/illustrations",
  //   "@spectrum-icons/ui",
  //   "@spectrum-icons/workflow",
  // ],
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};
export default config;
