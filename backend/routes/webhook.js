const router = require("express").Router();
const pool = require("../database/database");

router.post("/pagarme", async (req, res) => {
  try {
    if(!req.body?.data) return res.status(400).json("Invalid request");
    const {id, status, charges} = req.body.data;
    const metadata = req.body?.data?.metadata;

    if(status === 'paid' && charges[0].payment_method === 'pix') {
      if(metadata?.registration_id){
        const registration = await pool.query(
        "UPDATE registrations SET registration_status = $1 WHERE registration_id = $2 RETURNING *",
        ['completed', metadata.registration_id]
      );
      const deletedRegistrations = await pool.query("DELETE FROM registrations WHERE user_id = $1 AND event_id = $2 AND registration_status != $3", [metadata.user_id, metadata.event_id, 'completed'])
      } else await pool.query(
        "UPDATE registrations SET registration_status = $1 WHERE payment_id = $2 RETURNING *",
        ['completed', id]
      );
      
    }
    
    return res.status(200).json("ok");
  } catch (err) {
    console.error(err.message);
    return res.status(500).json("Server Error");
  }
});


module.exports = router;
