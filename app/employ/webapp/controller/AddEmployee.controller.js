sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
  ],
  function (Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("ojt.employ.controller.AddEmployee", {
      onInit: function () {
        var oNewEmployeeModel = new JSONModel({
          firstName: "",
          lastName: "",
          dateOfBirth: null,
          gender: "",
          email: "",
          hireDate: "",
          role_ID: "",
          department_ID: "",
          performanceRating: 1,
          salary: 0,
        });
        this.getView().setModel(oNewEmployeeModel, "newEmployee");
      },

      onSubmitNewEmployee: function () {
        var oModel = this.getView().getModel();
        var oNewEmployeeModel = this.getView().getModel("newEmployee");
        var oRouter = this.getOwnerComponent().getRouter();
        var oNewEmployee = oNewEmployeeModel.getData();

        if (
          !oNewEmployee.firstName ||
          !oNewEmployee.lastName ||
          !oNewEmployee.email ||
          !oNewEmployee.role_ID ||
          !oNewEmployee.department_ID
        ) {
          MessageToast.show("Vui lòng điền đầy đủ các trường bắt buộc");
          return;
        }

        var oListBinding = oModel.bindList("/Employees");
        var oNewContext = oListBinding.create({
          firstName: oNewEmployee.firstName,
          lastName: oNewEmployee.lastName,
          dateOfBirth: oNewEmployee.dateOfBirth,
          gender: oNewEmployee.gender,
          email: oNewEmployee.email,
          hireDate: oNewEmployee.hireDate,
          role_ID: oNewEmployee.role_ID,
          department_ID: oNewEmployee.department_ID,
          performanceRating: oNewEmployee.performanceRating,
          salary: 0,
        });

        oNewContext
          .created()
          .then(function () {
            MessageToast.show("Nhân viên đã được tạo");
            oRouter.navTo("list");
          })
          .catch(function (oError) {
            MessageToast.show(
              "Lỗi khi tạo nhân viên: " + (oError.message || "Unknown error")
            );
          });
      },

      onCancel: function () {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("list");
      },
    });
  }
);
