const _config = {
  site: {
    url: process.env.NODE_ENV === "production" ? "https://cbmtb.com.br" : "http://localhost:3000",
    reCaptchaSiteKey: process.env.NODE_ENV === "production" ? "6LeMSVslAAAAAIMjysMeMhlXvjiZfWEIxWqqDZN-" : "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
  },
  images: {
    primaryLogo: "https://cbmtb.s3.sa-east-1.amazonaws.com/assets/logonotxt.png",
    secondaryLogo: "https://cbmtb.s3.sa-east-1.amazonaws.com/assets/logoconf_white.svg",
    dashboardLogo: "https://cbmtb.s3.sa-east-1.amazonaws.com/assets/logoconf_black.svg",
    pedalLogo: "https://cbmtb.s3.sa-east-1.amazonaws.com/assets/pedal-logo.png",
    crosshair: "https://cbmtb.s3.sa-east-1.amazonaws.com/assets/crosshair.png",
  },
  entidade: {
    abbreviation: "CBMTB",
    name: "Confederação Brasileira de Mountain Bike",
    type: "Confederação",
  },
  contact: {
    supportEmail: "suporte@cbmtb.com",
    noreply: "suporte@cbmtb.com",
    ouvidoria: "suporte@cbmtb.com",
  },
  pages: {
    federacoes: true,
  },
  redes: {
    twitter: "https://twitter.com/cbmtb",
    instagram: "https://www.instagram.com/cbmtb/",
    facebook: "https://pt-br.facebook.com/confederacaobrasileiramtb/",
  },
};

module.exports = _config;
