export function properErrorNames(field) {
  switch (field) {
    case "firstName":
      return "Nome";
    case "lastName":
      return "Sobrenome";
    case "email":
      return "Email";
    case "password":
      return "Senha";
    case "repeatPassword":
      return "Confirmação da Senha";
    case "birthDate":
      return "Data de Nascimento";
    case "gender":
      return "Sexo";
    case "state":
      return "Estado";
    case "city":
      return "Cidade";
    case "address":
      return "Endereço";
    case "cpf":
      return "CPF";
    case "phone":
      return "Telefone";
    case "cep":
      return "CEP";
    default:
      return "";
  }
}
