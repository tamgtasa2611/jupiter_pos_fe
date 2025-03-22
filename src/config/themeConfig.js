const themeConfig = {
  token: {
    colorPrimary: "#1a73e8",
    borderRadius: 12,
    colorBgContainer: "#ffffff",
    wireframe: false,

    // Global shadow tokens that will apply to many components
    boxShadow: "0 6px 16px 0 rgba(0, 0, 0, 0.07)",
    boxShadowSecondary: "0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.07)",

    motionEaseInOut: "cubic-bezier(0.45, 0, 0.55, 1)",
  },
  components: {
    Button: {
      // paddingInline: 16,
      // controlHeight: 40,
      borderRadiusSM: 8,
      borderRadiusLG: 16,
      // For buttons, we need to use this specific token
      primaryShadow: "0 8px 16px -4px rgba(26, 115, 232, 0.2)",
      defaultShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    },
    Card: {
      borderRadiusLG: 16,
    },
    Input: {
      borderRadius: 10,
    },
    Modal: {
      borderRadiusLG: 16,
      // Modal uses this token for shadow
      boxShadowPopoverArrow: "2px 2px 5px rgba(0, 0, 0, 0.05)",
      boxShadowPopover: "0 6px 16px rgba(0, 0, 0, 0.07)",
    },
    // Add shadow for other components you need to customize
    Select: {
      boxShadowPopover: "0 6px 16px 0 rgba(0, 0, 0, 0.07)",
    },
  },
};

export default themeConfig;
