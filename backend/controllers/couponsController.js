const pool = require("../database/database");

async function delete_coupons(req, res) {
  try {
    const { id } = req.params;
    const removeCoupon = await pool.query("DELETE FROM event_coupons WHERE coupon_id = $1", [id]);
    res.status(200).json({ message: "Cupom removido com sucesso!", type: "success" });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      message: `Erro ao remover categoria. ${err.message}`,
      type: "error",
    });
  }
}

module.exports = {
  create_category,
  read_event_categories_admin,
  read_event_categories_public,
  update_categories,
  delete_categories,
};
