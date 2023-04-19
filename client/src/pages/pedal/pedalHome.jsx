import { Fragment } from "react";
import LatestNews from "../home/components/latestNews";
import NextEvents from "../home/components/nextEvents";
import _config from "../../_config";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const PedalHome = () => {
  const fetchPedal = async (e) => {
    try {
      const response = await fetch(`/api/events/records/pedalparatodos`, {
        method: "GET",
      });
      const parseResponse = await response.json();
      console.log(parseResponse);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchPedal();
  }, []);

  return (
    <Fragment>
      <div className="d-flex flex-column align-items-center justify-content-center vh-100 hero pedal" style={{ height: "50vh" }}>
        <a href="#evento">
          <img src={_config.images.pedalLogo} alt="" className="img-fluid" style={{ position: "relative", top: "-110px" }} />
        </a>
      </div>
      <div id="evento" style={{ position: "relative", top: "-110px" }}></div>
      <div className="container-fluid py-4 bg-light">
        <div className="row flex-column-reverse flex-lg-row justify-content-center">
          <div className="col-12 col-lg-4 d-flex align-items-center justify-content-center">
            <img
              src="https://lh3.googleusercontent.com/lr/AHRh2pYfbGP_-xyMID7zCY2ToxtOV3MF9XlUeMjG0s3p4rez9U7yoBkOHxGuEvZgjou0sRuCZD_nJ7nz_4RcULFPOF4h9Uc_DZNbvRtOPXjuC_jKVzf2wKSuif6Nm7RCFT0l6JNM6sLQu6ea5Dydey8yi2Z6LWO1qogoQ6Zber9kFKxky_vehdVQtw3YOHq9Fz1uD3ITi-9O-v2_LRPKCzzIn1hjwbP5o30mTwuIrtvu85m4oxHpdqvNuP_JS28rEIDbiOdQw3KqS08106bRFzWK0AvNLcZnrpwOX0fEIlaMTILIZpv6M_YUEAuuQBrTmEFipL9Kva7lyOPrKZtmcm_lGGhJUFxmZnJi7suhOAAd4VIHyrAtft83yQ_qF0OfvteyorWeG2duh2BCvw8Y-ZGSis6KTd0kPEaN6jua58J6Ce_rXkPPgc3gszgUdwUMiPKcRuTz800Ho-2qFZHXLpKAkDBWNBdtr6V7ap7RSdpxftQ2sBqxtbV63uc1uENLCeFDX08m3XhJuuosuUzckNtM3kMfgGbczVdR1blSAZIceheGnAM8qbxTeeQtjdOMKiwtoT4I_qbyo4OO272oXpLku_DdlhicjIYjEdaxqI2ZtiHZadHwhu0mLcqBe-M9YZrKJqSGE2LP9EFRkYUqazYmikGlhirXPmYqk12I7COs3wzfXGb3cFpsYnWdPWi847e0fheJaZHR8hbMDruQsEg34zU951wOwGzujZD4oNDtVmcVwDiofLU3BqlZBwkDkBoMNuYxzihrWeepHHgzbbKLrmPERBmIjZddu-vrCff5aPTzoLZp7d-3H9MgaSQde_3DRieN3in0Ykxz9PXCOEyDyqzKP3ZK334ZulO0_Ufssm2p1WSwOq4MTpHh-cAf28Mah9L6wGPqQow-YZcHUimunXeOkYY6Cj_RxwxFA-BWUAzajQ0raqH_vHT1QTaX_dSYq8VOOmOi0AGmLKrj5ZDbMleYVBFPOMUn24IutNlkgezIZQhkTQ=w2500-h2500"
              alt=""
              className="rounded-3 img-fluid shadow-lg"
              style={{ maxHeight: "600px" }}
            />
          </div>
          <div className="col-12 col-lg-5 d-flex justify-content-center  align-items-lg-start  flex-column">
            <h1>#BoraPedalar</h1>
            <p className="text-justify">
              Bem-vindos ao Pedal Para Todos, um evento de passeio ciclístico que busca promover a inclusão social, a saúde e a diversão através do
              ciclismo.
            </p>

            <p className="text-justify">
              Acreditamos que o ciclismo é uma forma incrível de melhorar a saúde física e mental, além de ser uma maneira sustentável e
              ecologicamente responsável de locomoção. Por isso, queremos incentivar mais pessoas a descobrir os benefícios de pedalar e a se juntar a
              nós nessa jornada emocionante.
            </p>

            <p className="text-justify">
              O "Pedal Para Todos" é um evento que não apenas celebra o ciclismo, mas também a união e a diversidade. Seja você um ciclista experiente
              ou alguém que está começando agora, estamos ansiosos para recebê-lo em nosso evento e compartilhar com você a alegria de pedalar.
            </p>
            <div className="d-flex justify-content-center mb-3">
              <a href="#eventos" className="btn btn-success shadow form-control px-5" style={{ maxWidth: "250px" }}>
                Inscreva-se!
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid py-4">
        <div className="row flex-column flex-lg-row justify-content-center">
          <div className="col-12 col-lg-5 d-flex  justify-content-center flex-column me-5">
            <h1>Ação Social</h1>
            <p className="text-justify">
              Além de promover a prática do ciclismo, o Pedal Para Todos realiza uma ação social de arrecadação de alimentos para ajudar pessoas em
              situação de vulnerabilidade. Ao participar do evento, você é convidado a trazer um alimento não perecível, que será doado para
              instituições de caridade locais.
            </p>
          </div>
          <div className="col-12 col-lg-4 d-flex align-items-center justify-content-center">
            <img
              src="https://lh3.googleusercontent.com/lr/AHRh2paHIoop172ODZsu0BggwFaoGJ4lDZ_5EnJHuti10CkROCBUmd_5Azrv7kUcE9qWf7sViIaqWVhy_WVVW4-Ie2yxqIv8ohiDLzf-P75tQ-k_BQev9HWOuCzxU0gpRAcNPWRaRzlqHcUwOaY_SUCNH3HAyLvFSkbrjp2fnyp2F-g0SWSAzCUA6gtK6LWZnPmK4F8siSkIAVpwbKxjH_q190Q0X_XHbDb71DDyyNTbK8iBItLfAcBiTDsAb2eNV3aFThTnjfSFx-6dzWFJDMlioDoZ9BaFSAOI4KQ8apP9huxJ6scwucgauiF_ag0WmOH6WDABvhgKzzAe-yNRUf3MVuF9vui3kQ1I86Lz6Yfp-lPMaAu2nuCr7TkrU1H2-_QVBoi3fS2j_koMaXN-DHkAjxenJjfE7HgNKKcarCXJH_-oVNTEBBxlQPEp1qqTPPvwUaaApxr5p9KDD50ensCIq4R2epD3wcqtM2x9oodfLM5TO7wPe431Z4-_LMFJE-l5SjmV5s65yEOIUg28mYgfNX6PnGVWFbim0f5fTtkbDOhfAw3vb8z_DbjJvsSQxUBW-YUHKyfffi4uxHrlnxRDpFgcdsUYCruNfI_1ue9e8XiQ5ACkbc2sVLreVd00d6WYi26Osd9-zGVpefU3PiInied5Nvszrvkzs9ywzwt3NInErg_XUDKSAr90tYPdFBARYqnuOIrs2OM4XuQgG3dKB2Hzt02bp0Kea1SZg6-iK5MXICx5vEf2gongPnKHq9blMDfjWi4AmCQsPih24XuhNliYmMwFsm3Y4Xcs0gupiWPFR9eel6wnomp8zC0OwaSF9vqUJM34uhDpvSMJyVNH1ECh-KmCn3E2Jsy0X9VQGVzNQsxI7i2npxNtFr-MSFgkYY7FOIp3MjRXzN4sHUTEAPD6Ho_yYpg98OdPdy1b-mpnnkVVhlTdCkpY8zS5j_WwSRJTIr1Z5TCnrogWjMIeFpiLMqcfaHx4SUBOC72uqj0WVfED7A=w2500-h2500"
              alt=""
              className="rounded-3 img-fluid shadow-lg"
              style={{ maxHeight: "600px" }}
            />
          </div>
        </div>
      </div>
      <LatestNews category={"Pedal Para Todos"} />
      <div className="container-fluid  pt-3">
        <div className="row">
          <div className="col-12 ">
            <h1>Últimas Edições</h1>
            <div id="eventos" style={{ position: "relative", top: "-110px" }}></div>
          </div>
        </div>
      </div>

      <NextEvents event={"Pedal Para Todos"} />
    </Fragment>
  );
};

export default PedalHome;
