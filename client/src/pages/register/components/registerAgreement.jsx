import React from "react";

const RegisterAgreement = (props) => {
  return (
    <div class="form-check d-flex align-items-top justify-content-start mt-1">
      <input
        class="form-check-input"
        type="checkbox"
        value={props.agreementAgreed}
        id="flexCheckDefault"
        disabled={!props.agreementRead}
        onChange={() => props.setAgreementAgreed(!props.agreementAgreed)}
      />
      <span className="ms-1">
        <span className="d-inline-block d-lg-none d-xl-inline-block">Aceito os </span>{" "}
        <button
          type="button"
          class="btn btn-link p-0 m-0 mb-1"
          data-bs-toggle="modal"
          data-bs-target="#termsModal"
          onClick={() => props.setAgreementRead(true)}
        >
          Termos de Uso (leia para aceitar)
        </button>
      </span>

      <div class="modal fade" id="termsModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Termos de Uso de Dados (LGPD)
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <ol>
                <li>
                  <p>
                    <span style={{ fontSize: "20px" }}>
                      <strong>Introdu&ccedil;&atilde;o</strong>
                    </span>
                  </p>
                </li>
              </ol>

              <p>
                Estes Termos de Privacidade t&ecirc;m como objetivo informar a voc&ecirc;, titular dos dados pessoais, sobre como a CBMTB coleta,
                utiliza, armazena e protege seus dados pessoais, de acordo com a Lei Geral de Prote&ccedil;&atilde;o de Dados (LGPD) do Brasil.
              </p>

              <ol start="2">
                <li>
                  <strong>
                    <span style={{ fontSize: "20px" }}>Dados coletados</span>
                  </strong>
                </li>
              </ol>

              <p>N&oacute;s coletamos os seguintes dados pessoais:</p>

              <ul>
                <li>Nome completo;</li>
                <li>Endere&ccedil;o de e-mail;</li>
                <li>N&uacute;mero de telefone;</li>
                <li>Endere&ccedil;o residencial;</li>
                <li>Data de nascimento;</li>
                <li>CPF (Cadastro de Pessoas F&iacute;sicas).</li>
              </ul>

              <ol start="3">
                <li>
                  <span style={{ fontSize: "20px" }}>
                    <strong>Finalidade do tratamento</strong>
                  </span>
                </li>
              </ol>

              <p>Utilizamos seus dados pessoais para:</p>

              <ul>
                <li>Fornecer e gerenciar os servi&ccedil;os contratados;</li>
                <li>Realizar processos de cobran&ccedil;a e pagamento;</li>
                <li>Fins de marketing e comunica&ccedil;&atilde;o, com seu consentimento;</li>
                <li>Atender a obriga&ccedil;&otilde;es legais e regulat&oacute;rias.</li>
              </ul>

              <ol start="4">
                <li>
                  <strong>
                    <span style={{ fontSize: "20px" }}>Consentimento</span>
                  </strong>
                </li>
              </ol>

              <p>
                Ao utilizar nossos servi&ccedil;os e fornecer seus dados pessoais, voc&ecirc; concorda com os termos aqui estabelecidos. Voc&ecirc;
                tem o direito de revogar seu consentimento a qualquer momento, entrando em contato conosco.
              </p>

              <ol start="5">
                <li>
                  <span style={{ fontSize: "20px" }}>
                    <strong>Direitos do titular dos dados</strong>
                  </span>
                </li>
              </ol>

              <p>De acordo com a LGPD, voc&ecirc; tem o direito de:</p>

              <ul>
                <li>Acessar seus dados pessoais;</li>
                <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
                <li>
                  Solicitar a anonimiza&ccedil;&atilde;o, bloqueio ou elimina&ccedil;&atilde;o de dados desnecess&aacute;rios, excessivos ou tratados
                  em desconformidade com a LGPD;
                </li>
                <li>
                  Solicitar a portabilidade dos dados a outro fornecedor de servi&ccedil;o ou produto, mediante requisi&ccedil;&atilde;o expressa;
                </li>
                <li>Ser informado sobre as entidades p&uacute;blicas e privadas com as quais compartilhamos seus dados;</li>
                <li>Revogar o consentimento a qualquer momento.</li>
              </ul>

              <ol start="6">
                <li>
                  <strong>
                    <span style={{ fontSize: "20px" }}>Seguran&ccedil;a dos dados</span>
                  </strong>
                </li>
              </ol>

              <p>
                N&oacute;s adotamos medidas de seguran&ccedil;a apropriadas para proteger seus dados pessoais contra perda, uso indevido, acesso
                n&atilde;o autorizado, divulga&ccedil;&atilde;o, altera&ccedil;&atilde;o e destrui&ccedil;&atilde;o.
              </p>

              <ol start="7">
                <li>
                  <span style={{ fontSize: "20px" }}>
                    <strong>Reten&ccedil;&atilde;o de dados</strong>
                  </span>
                </li>
              </ol>

              <p>
                Armazenamos seus dados pessoais pelo tempo necess&aacute;rio para cumprir com as finalidades descritas nestes Termos de Privacidade e
                conforme exigido pelas leis e regulamentos aplic&aacute;veis.
              </p>

              <ol start="8">
                <li>
                  <span style={{ fontSize: "20px" }}>
                    <strong>Compartilhamento de dados</strong>
                  </span>
                </li>
              </ol>

              <p>
                Compartilhamos seus dados pessoais somente com parceiros e fornecedores autorizados, necess&aacute;rios para a presta&ccedil;&atilde;o
                dos servi&ccedil;os contratados e em conformidade com a LGPD.
              </p>

              <ol start="9">
                <li>
                  <span style={{ fontSize: "20px" }}>
                    <strong>Altera&ccedil;&otilde;es nos Termos de Privacidade</strong>
                  </span>
                </li>
              </ol>

              <p>
                Reservamo-nos o direito de alterar estes Termos de Privacidade a qualquer momento. As altera&ccedil;&otilde;es entrar&atilde;o em
                vigor imediatamente ap&oacute;s a publica&ccedil;&atilde;o. Recomendamos que voc&ecirc; revise periodicamente nossos Termos de
                Privacidade para se manter atualizado.
              </p>

              <ol start="10">
                <li>
                  <span style={{ fontSize: "20px" }}>
                    <strong>Contato</strong>
                  </span>
                </li>
              </ol>

              <p>
                Se voc&ecirc; tiver d&uacute;vidas, preocupa&ccedil;&otilde;es ou solicita&ccedil;&otilde;es relacionadas &agrave;
                prote&ccedil;&atilde;o de seus dados pessoais, entre em contato conosco atrav&eacute;s do canal de ouvidoria em
                cbmtb.com.br/ouvidoria.
              </p>

              <p>Data da &uacute;ltima atualiza&ccedil;&atilde;o: 03/04/2023</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterAgreement;
