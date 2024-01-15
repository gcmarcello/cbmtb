async function verifyCoupon(couponId, eventId) {
  const validateCoupon = await pool.query(
    "SELECT * FROM event_coupons WHERE event_id = $1 AND coupon_id = $2",
    [eventId, couponId]
  );

  if (!validateCoupon.rows[0]) {
    return { message: "Cupom inválido.", type: "error" };
  }

  const verifyAvailability = await pool.query(
    "SELECT * FROM registrations AS r LEFT JOIN event_coupons AS ec ON r.coupon_id = ec.coupon_id WHERE r.event_id = $1 AND ec.coupon_link = $2",
    [eventId, couponId]
  );

  if (verifyAvailability.rows.length >= validateCoupon.rows[0].coupon_uses) {
    return { message: "Cupom Esgotado.", type: "error" };
  }

  return { message: "Cupom válido.", type: "success" };
}

module.exports = { verifyCoupon };
