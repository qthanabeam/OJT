const cds = require("@sap/cds");

module.exports = cds.service.impl(async function () {
  this.on("userInfo", async (req) => {
    console.log("userInfo called by:", req.user);
    if (!req.user) return {};
    const { id, roles } = req.user;
    return { id, roles };
  });
});
