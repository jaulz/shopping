import { IncomingMessage } from "http";

export function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getIp(request: IncomingMessage) {
  return (
    String(request.headers["x-forwarded-for"]).split(",").shift() ||
    request.socket?.remoteAddress
  );
}
