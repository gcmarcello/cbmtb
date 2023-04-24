const cepSearch = require("cep-promise");

const handleCep = async (props) => {
  try {
    props.setCepLoading(true);
    let info = await cepSearch(props.getValues("cep"));
    props.setValue("state", info.state);
    props.setValue("city", info.city);
    props.setValue("address", info.street);
    return true;
  } catch (error) {
    props.setError("cep", {
      type: "server",
      message: "CEP Inválido.",
    });
    props.setValue("state", "");
    props.setValue("city", "");
    props.setValue("address", "");
    return false;
  } finally {
    props.setCepLoading(false);
  }
};

export default handleCep;
