const cds = require("@sap/cds");
const xsenv = require("@sap/xsenv");

module.exports = cds.service.impl(async function () {
  const { userInfo } = this.entities;
  this.on("userInfo", async (req) => {
    const { id, attr } = req.user;
    return {
      id,
      name: attr?.givenName || id,
      email: attr?.email || "",
      scopes: attr?.scopes || [],
    };
  });
});
