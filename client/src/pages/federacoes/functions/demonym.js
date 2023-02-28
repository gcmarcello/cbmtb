export function retrieveDemonym(state) {
  switch (state) {
    case "ac":
      return "Acreana";
    case "al":
      return "Alagoana";
    case "ap":
      return "Amapaense";
    case "am":
      return "Amazonense";
    case "ba":
      return "Baiana";
    case "ce":
      return "Cearense";
    case "es":
      return "Capixaba";
    case "go":
      return "Goiana";
    case "ma":
      return "Maranhense";
    case "mt":
      return "Mato-Grossense";
    case "ms":
      return "Sul-Mato-Grossense";
    case "mg":
      return "Mineira";
    case "pa":
      return "Paraense";
    case "pb":
      return "Paraibana";
    case "pe":
      return "Pernambucana";
    case "pi":
      return "Piauiense";
    case "rj":
      return "Carioca";
    case "rn":
      return "Potiguar";
    case "rs":
      return "Gaúcha";
    case "ro":
      return "Rondoniana";
    case "rr":
      return "Roraimense";
    case "sc":
      return "Catarinense";
    case "sp":
      return "Paulista";
    case "se":
      return "Sergipana";
    case "to":
      return "Tocantinense";
    case "df":
      return "Brasiliense";
    default:
      return "Brasileira";
  }
}
