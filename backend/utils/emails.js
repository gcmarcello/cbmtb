const sgMail = require("@sendgrid/mail");
const dayjs = require("dayjs");
const QRCode = require("qrcode");

const _config = require("../_config");

module.exports = class Email {
  constructor(emails) {
    this.emails = emails;
  }
  async sendConfirmationEmail(firstName, confirmationId) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: this.emails[0],
      from: {
        name: `${_config.entidade.name} - ${_config.entidade.name}`,
        email: _config.contact.noreply,
      },
      subject: `Confirme sua conta na ${_config.entidade.name}`,
      html: `<h2>Confirmação de Criação de Conta</h2><p>Prezado(a) ${firstName},</p><p>Obrigado por criar uma conta no sistema da ${_config.entidade.name}! Sua conta foi criada com sucesso e agora você pode aproveitar todos os recursos que oferecemos.</p><p>Para começar, por favor confirme o seu endereço de e-mail clicando no link abaixo:</p><p><a href='${_config.site.url}/confirmacao/${confirmationId}'>Confirmar Conta</a></p><p>Se você não criou esta conta, por favor, ignore este e-mail.</p><p>Obrigado mais uma vez por se inscrever em nosso site. Estamos ansiosos para vê-lo(a) lá!</p><br><p>Atenciosamente,</p><p> a ${_config.entidade.name}</p>`,
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
    if (process.env.NODE_ENV !== "production") return;
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const qrCode = await new Promise((resolve, reject) => {
      QRCode.toDataURL(registrationID, function (err, url) {
        if (err) reject(err);
        resolve(url);
      });
    });
    const msg = {
      to: this.emails[0],
      from: {
        name: `${_config.entidade.name} - ${_config.entidade.name}`,
        email: _config.contact.noreply,
      },
      subject: `${_config.entidade.name} - Confirmação de inscrição no(a) ${eventName}`,
      html: `<h1><strong>Confirma&ccedil;&atilde;o de Inscri&ccedil;&atilde;o</strong></h1>

      <p>Prezado(a) ${firstName},</p>
      
      <p>Obrigado por se inscrever no(a) <strong><span style="font-size:16px">${eventName}</span></strong>! Sua inscri&ccedil;&atilde;o foi confirmada e falta pouco para estarmos juntos!</p>
      
      <p>Aqui est&atilde;o as informa&ccedil;&otilde;es do evento e da sua inscri&ccedil;&atilde;o.&nbsp;Imprima este e-mail ou leve seu celular ao evento para facilitar o check-in!</p>
      
      <strong>QR Code para Check-in</strong><br/>
      <img src="${qrCode}"/>

      <ul>
        <li><strong>Data:</strong>&nbsp;${dayjs(dateStart).format("DD/MM/YYYY HH:mm")} -&nbsp;${dayjs(dateEnd).format("DD/MM/YYYY HH:mm")}</li>
        <li><strong>Local:</strong>&nbsp;${location}</li>
        <li><strong>Categoria:</strong>&nbsp;${category}</li>
        <li><strong>ID da inscri&ccedil;&atilde;o:</strong> ${registrationID}&nbsp;(Esse &eacute; apenas o n&uacute;mero de controle no sistema, seu n&uacute;mero de atleta&nbsp;ser&aacute; definido de forma aleat&oacute;ria no check-in do evento)</li>
      </ul>
      
      <p><a href="https://${
        _config.site.url
      }/eventos/${eventLink}">Clique aqui</a> para acessar a p&aacute;gina do evento com todas as informa&ccedil;&otilde;es</p>
      
      <p>Atenciosamente,</p>
      
      <p>a ${_config.entidade.name}</p>`,
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
        name: `${_config.entidade.name} - ${_config.entidade.name}`,
        email: _config.contact.noreply,
      },
      subject: `${_config.entidade.name} - Redefinição de Senha ${_config.entidade.name}`,
      html: `<h2>Redefini&ccedil;&atilde;o de Senha no Sistema ${_config.entidade.name}</h2>

      <p>Prezado(a) ${firstName},</p>
      
      <p>Recebemos uma solicita&ccedil;&atilde;o de redefini&ccedil;&atilde;o de senha para a sua conta em nosso sistema. Se voc&ecirc; n&atilde;o solicitou essa mudan&ccedil;a, por favor, entre em contato conosco imediatamente para investigarmos.</p>
      
      <p>Se foi voc&ecirc; quem solicitou, clique no link abaixo para ser direcionado para a p&aacute;gina de redefini&ccedil;&atilde;o de senha:</p>
      
      <p><a href="${_config.site.url}/senha/${passwordResetId}">Redefinir Senha</a></p>
      
      <p>Por quest&otilde;es de seguran&ccedil;a, o link acima expirar&aacute; em 2 horas. Certifique-se de concluir o processo de redefini&ccedil;&atilde;o de senha antes desse prazo.</p>
      
      <p>Se voc&ecirc; encontrar dificuldades ou precisar de ajuda durante o processo de redefini&ccedil;&atilde;o, por favor, entre em contato com nossa equipe de suporte.</p>
      
      <p>Atenciosamente,</p>
      
      <p>&nbsp;</p>
      
      <p>a ${_config.entidade.name}</p>`,
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
        name: `${_config.entidade.name} - ${_config.entidade.name}`,
        email: _config.contact.noreply,
      },
      subject: `${_config.entidade.name} - Confirmação de cancelamento de inscrição no(a) ${eventName}`,
      html: `<h1><strong>Confirma&ccedil;&atilde;o de Cancelamento de Inscri&ccedil;&atilde;o</strong></h1>

      <p>Prezado(a) ${firstName},</p>

      <p>
          Lamentamos informar que sua inscrição no evento <strong><span style="font-size:16px">${eventName}</span></strong> foi
          cancelada. Esperamos que você possa participar dos nossos próximos
          eventos.
        </p>

        <p>
          Se você cancelou sua inscrição por engano ou deseja obter mais informações, você pode acessar a página do evento e se inscrever novamente <a href="${_config.site.url}/eventos/${eventLink}">clicando aqui.</a>
        </p>
      
      
      
        <p>Agradecemos sua compreensão.</p>
        <p>Atenciosamente,</p>
        <p>${_config.entidade.name} - ${_config.entidade.name}</p>`,
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

  async answerTicketEmail(firstName, ticketId) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: this.emails[0],
      from: {
        name: `${_config.entidade.name} - ${_config.entidade.name}`,
        email: _config.contact.ouvidoria,
      },
      subject: `${_config.entidade.name} - Resposta ao Chamado`,
      html: `<h1><strong>Resposta ao Chamado&nbsp;</strong></h1>

      <p>Prezado(a) ${firstName},</p>
      
      <p>Seu chamado (<small>${ticketId}</small>) teve uma resposta. Acesse o chamado <a href='${_config.site.url}/ouvidoria/${ticketId}'>clicando aqui</a>. Por favor, se seu problema não foi resolvido, use a caixa de resposta para deixar outra mensagem para nós!</p>

      <hr />
      <p>Por favor, n&atilde;o retorne esta mensagem.</p>
      
      <p>Agradecemos sua compreens&atilde;o.</p>
      
      <p>Atenciosamente,</p>
      
      <p>A ${_config.entidade.name}&nbsp;</p>`,
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

  async sendProfileChangeEmail(user) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: this.emails[0],
      from: {
        name: `${_config.entidade.name} - ${_config.entidade.name}`,
        email: _config.contact.noreply,
      },
      subject: `${_config.entidade.name} - Alteração de Cadastro`,
      html: `<h1><strong>Alteração de Cadastro</strong></h1>

      <p>Prezado(a) ${user.firstName},</p>
      
      <p>Este e-mail tem como objetivo confirmar a alteração de seus dados cadastrais em nosso sistema. Agradecemos por nos informar as mudanças necessárias para manter suas informações atualizadas.</p>

      <p>Para acessar o seu perfil e confirmar as novas informações, por favor <a href="${_config.site.url}/usuario/perfil">clique aqui</a>.</p>
      
      <hr />
      <p>Por favor, n&atilde;o retorne esta mensagem. Caso voc&ecirc; tenha mais alguma d&uacute;vida, favor abrir um novo chamado <a href="${_config.site.url}/ouvidoria" target="_blank">clicando aqui.</a></p>
      
      <p>Atenciosamente,</p>
      
      <p>A ${_config.entidade.name}&nbsp;</p>`,
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
