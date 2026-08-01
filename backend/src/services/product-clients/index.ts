import { TickomiumClient } from "./tickomium.client";
import { FormateClient } from "./formate.client";
import { MdocClient } from "./mdoc.client";

// Un producto sin configurar NO debe tumbar la API de IKK: el panel tiene que
// seguir sirviendo landing, sesión, operadores, bitácora y prospectos, y
// mostrar ese producto como "sin conexión". Por eso, si falta la URL o el
// token, el cliente se construye igual apuntando a un destino inválido: la
// llamada falla sola y el agregador (Promise.allSettled) la reporta.
const UNCONFIGURED_URL = "http://ikk-producto-sin-configurar.invalid";

function readConfig(
  product: string,
  urlKey: string,
  tokenKey: string
): { baseUrl: string; serviceToken: string } {
  const baseUrl = process.env[urlKey]?.trim();
  const serviceToken = process.env[tokenKey]?.trim();

  if (!baseUrl || !serviceToken) {
    console.warn(
      `[IKK] ${product} sin configurar: falta ${!baseUrl ? urlKey : tokenKey}. ` +
        "El panel lo mostrará como sin conexión."
    );
    return { baseUrl: UNCONFIGURED_URL, serviceToken: "sin-configurar" };
  }

  return { baseUrl, serviceToken };
}

export const tickomiumClient = new TickomiumClient(
  readConfig("Tickomium", "API_URL_TICKOMIUM", "SERVICE_TOKEN_TICKOMIUM")
);

export const formateClient = new FormateClient(
  readConfig("Formate", "API_URL_FORMATE", "SERVICE_TOKEN_FORMATE")
);

export const mdocClient = new MdocClient(
  readConfig("mDoc", "API_URL_MDOC", "SERVICE_TOKEN_MDOC")
);

export { TickomiumClient, FormateClient, MdocClient };
