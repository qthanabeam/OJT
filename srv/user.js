const cds = require("@sap/cds");

module.exports = cds.service.impl(async function () {
  this.on("userInfo", async (req) => {
    const { id, attr } = req.user;
    return {
      id: id || "anonymous",
      name: attr?.givenName || id || "Unknown",
      email: attr?.email || "",
      scopes: attr?.scopes || [],
    };
  });
});
