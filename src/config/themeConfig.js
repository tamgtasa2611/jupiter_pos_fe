const themeConfig = {
  token: {
    colorPrimary: "#1a73e8",
    borderRadius: 12,
    colorBgContainer: "#ffffff",
    wireframe: false,
    boxShadow: "0 6px 16px 0 rgba(0, 0, 0, 0.07)",
    boxShadowSecondary:
      "0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.07)",
  },
  components: {
    Button: {
      paddingInline: 16,
      controlHeight: 36,
      borderRadiusSM: 8,
      borderRadiusLG: 16,

      primaryShadow: "0 8px 16px -4px rgba(26, 115, 232, 0.2)",
      defaultShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    },
    Card: {
      borderRadiusLG: 16
    },
    Input: {
      borderRadius: 10,
    },
    Modal: {
      borderRadiusLG: 16,

      boxShadowPopoverArrow: "2px 2px 5px rgba(0, 0, 0, 0.05)",
      boxShadowPopover: "0 6px 16px rgba(0, 0, 0, 0.07)",
    },

    Select: {
      boxShadowPopover: "0 6px 16px 0 rgba(0, 0, 0, 0.07)",
    },
  },
};

export default themeConfig;
