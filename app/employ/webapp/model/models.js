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
      getCurrentUser: async function () {
        // bind action
        const oModel = new sap.ui.model.odata.v4.ODataModel({
          serviceUrl: "/odata/v4/employee/",
          synchronizationMode: "None",
          operationMode: "Server",
        });
        // get current user
        let oAction = oModel.bindContext("/userInfo(...)");
        let isAdmin;
        await oAction.invoke().catch((err) => {
          console.log(err);
        });
        const oResult = oAction.getBoundContext().getObject();
        console.log(oResult);
        isAdmin = oResult.roles.hasOwnProperty("Admin");
        return new JSONModel({ isAdmin });
      },
    };
  }
);
