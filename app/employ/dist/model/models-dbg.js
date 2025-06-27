sap.ui.define(
  ["sap/ui/model/json/JSONModel", "sap/ui/Device"],
  function (JSONModel, Device) {
    "use strict";

    return {
      /**
       * Provides runtime information for the device the UI5 app is running on as a JSONModel.
       * @returns {sap.ui.model.json.JSONModel} The device model.
       */
      createDeviceModel: function () {
        var oModel = new JSONModel(Device);
        oModel.setDefaultBindingMode("OneWay");
        return oModel;
      },

      /**
       * Fetches current user info via OData function `userInfo()`
       * @returns {Promise<JSONModel>} JSONModel with isAdmin, id, and roles
       */
      getCurrentUser: async function () {
        const oModel = new sap.ui.model.odata.v4.ODataModel({
          serviceUrl: "/odata/v4/employee/",
          synchronizationMode: "None",
        });

        const oContextBinding = oModel.bindContext("/userInfo(...)", null, {
          $$groupId: "$auto", // <== Bắt buộc cho deferred binding
          $$updateGroupId: "userInfo", // <== Bắt buộc để gọi được function
        });

        try {
          await oContextBinding.execute(); // <== Gọi execute() thay vì invoke()

          const oContext = oContextBinding.getBoundContext();
          if (!oContext) {
            console.error("No bound context returned from userInfo()");
            console.log(oContext);
            return new JSONModel({ isAdmin: true, id: null, roles: [] });
          }

          const oResult = oContext.getObject();
          console.log("User Info Result:", oResult);

          const roles = oResult?.roles || [];
          const isAdmin =
            roles.includes("Admin") || roles.includes("ojt_employ.Admin");

          return new JSONModel({
            isAdmin: isAdmin,
            id: oResult?.id || null,
            roles: roles,
          });
        } catch (err) {
          console.error("Error invoking userInfo():", err);
          return new JSONModel({ isAdmin: false, id: null, roles: [] });
        }
      },
    };
  }
);
