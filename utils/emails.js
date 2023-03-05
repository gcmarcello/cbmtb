const sgMail = require("@sendgrid/mail");

module.exports = class Email {
  constructor(emails) {
    this.emails = emails;
  }
  async sendConfirmationEmail(firstName, confirmationId) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: this.emails[0],
      from: {
        name: "CBMTB - Confederação Brasileira de Mountain Bike",
        email: "noreply@cbmtb.com",
      },
      subject: "Confirme sua conta na CBMTB.",
      html: `<h2>Confirmação de Criação de Conta</h2><p>Prezado(a) ${firstName},</p><p>Obrigado por criar uma conta no sistema da CBMTB! Sua conta foi criada com sucesso e agora você pode aproveitar todos os recursos que oferecemos.</p><p>Para começar, por favor confirme o seu endereço de e-mail clicando no link abaixo:</p><p><a href='https://cbmtb.com.br/confirmacao/${confirmationId}'>Confirmar Conta</a></p><p>Se você não criou esta conta, por favor, ignore este e-mail.</p><p>Obrigado mais uma vez por se inscrever em nosso site. Estamos ansiosos para vê-lo(a) lá!</p><br><p>Atenciosamente,</p><p> a CBMTB</p>`,
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
  }
};
