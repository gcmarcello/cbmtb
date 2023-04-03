const sgMail = require("@sendgrid/mail");
const dayjs = require("dayjs");

const config = require("../config");

module.exports = class Email {
  constructor(emails) {
    this.emails = emails;
  }
  async sendConfirmationEmail(firstName, confirmationId) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: this.emails[0],
      from: {
        name: `${config.entidade} - ${config.entidade_fullName}`,
        email: "noreply@cbmtb.com",
      },
      subject: `Confirme sua conta na ${config.entidade}`,
      html: `<h2>Confirmação de Criação de Conta</h2><p>Prezado(a) ${firstName},</p><p>Obrigado por criar uma conta no sistema da ${
        config.entidade
      }! Sua conta foi criada com sucesso e agora você pode aproveitar todos os recursos que oferecemos.</p><p>Para começar, por favor confirme o seu endereço de e-mail clicando no link abaixo:</p><p><a href='${
        process.env.NODE_ENV === "production"
          ? "https://cbmtb.com.br"
          : "http://localhost:3000"
      }/confirmacao/${confirmationId}'>Confirmar Conta</a></p><p>Se você não criou esta conta, por favor, ignore este e-mail.</p><p>Obrigado mais uma vez por se inscrever em nosso site. Estamos ansiosos para vê-lo(a) lá!</p><br><p>Atenciosamente,</p><p> a ${
        config.entidade
      }</p>`,
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
  async sendRegistrationEmail(
    firstName,
    eventName,
    dateStart,
    dateEnd,
    location,
    category,
    registrationID,
    eventLink
  ) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: this.emails[0],
      from: {
        name: `${config.entidade} - ${config.entidade_fullName}`,
        email: "noreply@cbmtb.com",
      },
      subject: `Confirmação de inscrição no(a) ${eventName}`,
      html: `<h1><strong>Confirma&ccedil;&atilde;o de Inscri&ccedil;&atilde;o</strong></h1>

      <p>Prezado(a) ${firstName},</p>
      
      <p>Obrigado por se inscrever no(a) <strong><span style="font-size:16px">${eventName}</span></strong>! Sua inscri&ccedil;&atilde;o foi confirmada e falta pouco para estarmos juntos!</p>
      
      <p>Aqui est&atilde;o as informa&ccedil;&otilde;es do evento e da sua inscri&ccedil;&atilde;o.&nbsp;Imprima este e-mail e leve ao evento para facilitar o check-in!</p>
      
      <ul>
        <li><strong>Data:</strong>&nbsp;${dayjs(dateStart).format(
          "DD/MM/YYYY HH:mm"
        )} -&nbsp;${dayjs(dateEnd).format("DD/MM/YYYY HH:mm")}</li>
        <li><strong>Local:</strong>&nbsp;${location}</li>
        <li><strong>Categoria:</strong>&nbsp;${category}</li>
        <li><strong>ID da inscri&ccedil;&atilde;o:</strong> ${registrationID}&nbsp;(Esse &eacute; apenas o n&uacute;mero de controle no sistema, seu n&uacute;mero de atleta&nbsp;ser&aacute; definido de forma aleat&oacute;ria no check-in do evento)</li>
      </ul>
      
      <p><a href="https://cbmtb.com.br/evento/${eventLink}">Clique aqui</a> para acessar a p&aacute;gina do evento com todas as informa&ccedil;&otilde;es</p>
      
      <p>Atenciosamente,</p>
      
      <p>a ${config.entidade}</p>`,
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

  async sendPasswordReset(firstName, passwordResetId) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    let response;
    const msg = {
      to: this.emails[0],
      from: {
        name: `${config.entidade} - ${config.entidade_fullName}`,
        email: "noreply@cbmtb.com",
      },
      subject: `Redefinição de Senha ${config.entidade}`,
      html: `<h2>Redefini&ccedil;&atilde;o de Senha no Sistema ${
        config.entidade
      }</h2>

      <p>Prezado(a) ${firstName},</p>
      
      <p>Recebemos uma solicita&ccedil;&atilde;o de redefini&ccedil;&atilde;o de senha para a sua conta em nosso sistema. Se voc&ecirc; n&atilde;o solicitou essa mudan&ccedil;a, por favor, entre em contato conosco imediatamente para investigarmos.</p>
      
      <p>Se foi voc&ecirc; quem solicitou, clique no link abaixo para ser direcionado para a p&aacute;gina de redefini&ccedil;&atilde;o de senha:</p>
      
      <p><a href="${
        process.env.NODE_ENV === "production"
          ? "https://cbmtb.com.br"
          : "http://localhost:3000"
      }/senha/${passwordResetId}">Redefinir Senha</a></p>
      
      <p>Por quest&otilde;es de seguran&ccedil;a, o link acima expirar&aacute; em 2 horas. Certifique-se de concluir o processo de redefini&ccedil;&atilde;o de senha antes desse prazo.</p>
      
      <p>Se voc&ecirc; encontrar dificuldades ou precisar de ajuda durante o processo de redefini&ccedil;&atilde;o, por favor, entre em contato com nossa equipe de suporte.</p>
      
      <p>Atenciosamente,</p>
      
      <p>&nbsp;</p>
      
      <p>a ${config.entidade}</p>`,
    };

    return sgMail
      .send(msg)
      .then(() => {
        return { message: "Email enviado com sucesso.", type: "success" };
      })
      .catch((error) => {
        console.error(error);
        return { message: error.message, type: "error" };
      });
  }

  async sendRegistrationCancellationEmail(firstName, eventName, eventLink) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: this.emails[0],
      from: {
        name: `${config.entidade} - ${config.entidade_fullName}`,
        email: "noreply@cbmtb.com",
      },
      subject: `Confirmação de cancelamento de inscrição no(a) ${eventName}`,
      html: `<h1><strong>Confirma&ccedil;&atilde;o de Cancelamento de Inscri&ccedil;&atilde;o</strong></h1>

      <p>Prezado(a) ${firstName},</p>

      <p>
          Lamentamos informar que sua inscrição no evento <strong><span style="font-size:16px">${eventName}</span></strong> foi
          cancelada. Esperamos que você possa participar dos nossos próximos
          eventos.
        </p>

        <p>
          Se você cancelou sua inscrição por engano ou deseja obter mais informações, você pode acessar a página do evento e se inscrever novamente <a href="https://cbmtb.com.br/evento/${eventLink}">clicando aqui.</a>
        </p>
      
      
      
        <p>Agradecemos sua compreensão.</p>
        <p>Atenciosamente,</p>
        <p>${config.entidade} - ${config.entidade_fullName}</p>`,
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
