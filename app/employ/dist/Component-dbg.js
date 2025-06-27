sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/BusyIndicator",
  ],
  function (UIComponent, Device, JSONModel, MessageToast, BusyIndicator) {
    "use strict";

    return UIComponent.extend("ojt.employ.Component", {
      metadata: {
        manifest: "json",
        interfaces: ["sap.ui.core.IAsyncContentCreation"],
      },

      init: function () {
        // Call the base component's init function
        UIComponent.prototype.init.apply(this, arguments);

        // Initialize the router
        this.getRouter().initialize();

        // Set device model
        var oDeviceModel = new JSONModel(Device);
        oDeviceModel.setDefaultBindingMode("OneWay");
        this.setModel(oDeviceModel, "device");

        // Set user model
        var oUserModel = new JSONModel({
          isAdmin: false,
          role: "",
          userName: "",
          email: "",
          scopes: [],
        });
        this.setModel(oUserModel, "user");

        // Check user role from XSUAA
        this._checkUserRole();
      },

      _checkUserRole: function () {
        var that = this;
        BusyIndicator.show();

        fetch("/employee/userInfo", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
          .then(function (response) {
            if (!response.ok) {
              throw new Error(
                "Network response was not ok: " + response.status
              );
            }
            return response.json();
          })
          .then(function (data) {
            var oUserModel = that.getModel("user");
            var bIsAdmin =
              data.scopes && data.scopes.includes("ojt_employ.Admin");

            oUserModel.setProperty("/isAdmin", bIsAdmin);
            oUserModel.setProperty("/role", bIsAdmin ? "Admin" : "Viewer");
            oUserModel.setProperty("/userName", data.name || "Unknown");
            oUserModel.setProperty("/email", data.email || "");
            oUserModel.setProperty("/scopes", data.scopes || []);

            BusyIndicator.hide();
          })
          .catch(function (error) {
            console.error("Error fetching user info:", error);
            BusyIndicator.hide();
            MessageToast.show("Không thể lấy thông tin người dùng");
            that.getModel("user").setProperty("/role", "Viewer");
          });
      },
      // _checkUserRole: function () {
      //   var oUserModel = this.getModel("user");
      //   var bIsAdmin = true;
      //   oUserModel.setProperty("/isAdmin", bIsAdmin);
      //   oUserModel.setProperty("/role", "Admin");
      //   oUserModel.setProperty("/userName", "Admin User");
      //   oUserModel.setProperty("/email", "admin@example.com");
      //   oUserModel.setProperty("/scopes", ["ojt_employ.Admin"]);
      //   console.log(oUserModel);
      // },
    });
  }
);
