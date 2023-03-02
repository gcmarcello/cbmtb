import React from "react";

const ConfirmRegistration = ({ name }) => {
  return (
    <div className="container inner-page">
      <h1>
        {" "}
        <i class="bi bi-check-circle-fill text-success"></i> Bem vindo à CBMTB!
      </h1>
      <p>
        {name || "Usuário"}, obrigado por se cadastrar no sistema da CBMTB! Para concluir seu cadastro, você precisa confirmar sua conta. Por favor,
        siga as instruções abaixo para confirmar sua conta:
      </p>
      <ul>
        <li>Verifique sua caixa de entrada de e-mail e localize o e-mail de confirmação que enviamos para você.</li>
        <li>
          Clique no botão "Confirmar minha conta" ou no link fornecido no e-mail. Se o botão ou o link não funcionar, copie e cole a URL fornecida em
          um navegador da web.
        </li>
      </ul>
      <p>
        Parabéns! Sua conta está confirmada. Se você não recebeu o e-mail de confirmação, por favor, verifique sua pasta de spam ou lixo eletrônico.
        Se o e-mail não estiver lá, entre em contato conosco pelo e-mail suporte@cbmtb.com para que possamos ajudá-lo.
      </p>

      <p>Estamos ansiosos para vê-lo em breve em nossos eventos!</p>
      <p>Atenciosamente, a equipe da CBMTB.</p>
    </div>
  );
};

export default ConfirmRegistration;
