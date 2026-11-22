import { solicitar } from "./api";

export const ordenesService = {
  crear(payload) {
    return solicitar("/api/ordenes", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  listarMias() {
    return solicitar("/api/ordenes");
  },
};