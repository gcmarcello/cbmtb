const Federations = () => {
  return (
    <div className="container inner-page">
      <h1 className="mb-3">Federações Estaduais</h1>
      <div className="accordion" id="accordionExample">
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingOne">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="false"
              aria-controls="collapseOne"
            >
              <img src="/estados/18-pernambuco-rounded.png" width={45} height={30} alt="sp" className="me-2" />
              <span>Pernambuco</span>
            </button>
          </h2>
          <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              <strong>Federação Paulista de Mountain Bike</strong>
              <ul>
                <li>Site</li>
                <li>Telefone</li>
                <li>Endereço</li>
              </ul>

              <strong>Clubes</strong>
              <ul>
                <li>
                  Media Paulista de Ciclismo
                  <ul>
                    <li>Site</li>
                    <li>Telefone</li>
                    <li>Endereço</li>
                  </ul>
                </li>
                <li>
                  Clube 2
                  <ul>
                    <li>Site</li>
                    <li>Telefone</li>
                    <li>Endereço</li>
                  </ul>
                </li>
                <li>
                  Clube 3
                  <ul>
                    <li>Site</li>
                    <li>Telefone</li>
                    <li>Endereço</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingTwo">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              <img src="/estados/25-santa-catarina-rounded.png" width={45} height={30} alt="sp" className="me-2" />
              <span>Santa Cantarina</span>
            </button>
          </h2>
          <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate
              classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS
              transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any
              HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingThree">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              <img src="/estados/26-sao-paulo-rounded.png" width={45} height={30} alt="sp" className="me-2" />
              <span>São Paulo</span>
            </button>
          </h2>
          <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              <strong>Federação Paulista de Mountain Bike</strong>
              <ul>
                <li>Site</li>
                <li>Telefone</li>
                <li>Endereço</li>
              </ul>

              <strong>Clubes</strong>
              <ul>
                <li>
                  Media Paulista de Ciclismo
                  <ul>
                    <li>Site</li>
                    <li>Telefone</li>
                    <li>Endereço</li>
                  </ul>
                </li>
                <li>
                  Clube 2
                  <ul>
                    <li>Site</li>
                    <li>Telefone</li>
                    <li>Endereço</li>
                  </ul>
                </li>
                <li>
                  Clube 3
                  <ul>
                    <li>Site</li>
                    <li>Telefone</li>
                    <li>Endereço</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Federations;
