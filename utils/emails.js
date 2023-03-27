const sgMail = require("@sendgrid/mail");
const dayjs = require("dayjs");

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
      subject: "Confirme sua conta na CBMTB",
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
  async sendRegistrationEmail(firstName, eventName, dateStart, dateEnd, location, category, registrationID, eventLink) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: this.emails[0],
      from: {
        name: "CBMTB - Confederação Brasileira de Mountain Bike",
        email: "noreply@cbmtb.com",
      },
      subject: `Confirmação de inscrição no(a) ${eventName}`,
      html: `<h1><strong>Confirma&ccedil;&atilde;o de Inscri&ccedil;&atilde;o</strong></h1>

      <p>Prezado(a) ${firstName},</p>
      
      <p>Obrigado por se inscrever no(a) <strong><span style="font-size:16px">${eventName}</span></strong>! Sua inscri&ccedil;&atilde;o foi confirmada e falta pouco para estarmos juntos!</p>
      
      <p>Aqui est&atilde;o as informa&ccedil;&otilde;es do evento e da sua inscri&ccedil;&atilde;o.&nbsp;Imprima este e-mail e leve ao evento para facilitar o check-in!</p>
      
      <ul>
        <li><strong>Data:</strong>&nbsp;${dayjs(dateStart).format("DD/MM/YYYY HH:mm")} -&nbsp;${dayjs(dateEnd).format("DD/MM/YYYY HH:mm")}</li>
        <li><strong>Local:</strong>&nbsp;${location}</li>
        <li><strong>Categoria:</strong>&nbsp;${category}</li>
        <li><strong>ID da inscri&ccedil;&atilde;o:</strong> ${registrationID}&nbsp;(Esse &eacute; apenas o n&uacute;mero de controle no sistema, seu n&uacute;mero de atleta&nbsp;ser&aacute; definido de forma aleat&oacute;ria no check-in do evento)</li>
      </ul>
      
      <p><a href="https://cbmtb.com.br/evento/${eventLink}">Clique aqui</a> para acessar a p&aacute;gina do evento com todas as informa&ccedil;&otilde;es</p>
      
      <p>Atenciosamente,</p>
      
      <p>a CBMTB</p>`,
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
