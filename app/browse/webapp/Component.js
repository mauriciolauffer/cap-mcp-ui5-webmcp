sap.ui.define(["sap/fe/core/AppComponent", "./webmcp"], (AppComponent, webmcp) =>
  AppComponent.extend("cap-mcp-ui5-webmcp-x1.browse.Component", {
    metadata: { manifest: "json" },

    init() {
      AppComponent.prototype.init.apply(this, arguments);
      this._webmcpController = webmcp.register(this.getModel());
    },

    exit() {
      this._webmcpController?.abort();
      AppComponent.prototype.exit.apply(this, arguments);
    },
  }),
);
