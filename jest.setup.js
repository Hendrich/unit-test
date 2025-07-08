import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Polyfill for TextEncoder/TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Polyfill Web Streams API
if (typeof global.ReadableStream === "undefined") {
  global.ReadableStream = require("web-streams-polyfill").ReadableStream;
}
if (typeof global.WritableStream === "undefined") {
  global.WritableStream = require("web-streams-polyfill").WritableStream;
}
if (typeof global.TransformStream === "undefined") {
  global.TransformStream = require("web-streams-polyfill").TransformStream;
}

// Polyfill MessagePort/MessageChannel
if (typeof global.MessageChannel === "undefined") {
  global.MessageChannel = require("worker_threads").MessageChannel;
}
if (typeof global.MessagePort === "undefined") {
  global.MessagePort = require("worker_threads").MessagePort;
}

// Polyfill global Request, Response, Headers agar test Next.js App Router bisa jalan di Jest
global.Request = require("undici").Request;
global.Response = require("undici").Response;
global.Headers = require("undici").Headers;
