import type { CookieSerializeOptions } from "cookie";
import { serialize, parse } from "cookie";
import type { NextApiResponse, NextApiRequest } from "next";

/**
 * This sets `cookie` using the `res` object
 */

// export const setCookie = (
//   res: NextApiResponse,
//   name: string,
//   value: unknown,
//   options: CookieSerializeOptions = {}
// ) => {
//   const stringValue =
//     typeof value === "object" ? "j:" + JSON.stringify(value) : String(value);

//   if (typeof options.maxAge === "number") {
//     options.expires = new Date(Date.now() + options.maxAge * 1000);
//   }

//   res.setHeader("Set-Cookie", serialize(name, stringValue, options));
// };

export interface CookieOptionsType extends CookieSerializeOptions {
  res?: NextApiResponse;
  req?: NextApiRequest;
}
export const setCookie = (
  key: string,
  data: string,
  options: CookieOptionsType
): void => {
  const { req, res, ..._options } = options;
  const _req = req;
  const _res = res;
  const _cookieOptions = _options;

  const cookieStr = serialize(key, data, {
    path: "/",
    ..._cookieOptions,
  });
  if (_res && _req) {
    let currentCookies = _res.getHeader("Set-Cookie");

    if (!Array.isArray(currentCookies)) {
      currentCookies = !currentCookies ? [] : [String(currentCookies)];
    }
    // make sure all prev cookies get appended
    _res.setHeader("Set-Cookie", currentCookies.concat(cookieStr));

    if (_req && _req.cookies) {
      const _cookies = _req.cookies;
      data === "" ? delete _cookies[key] : (_cookies[key] = data);
    }

    if (_req && _req.headers && _req.headers.cookie) {
      const _cookies = parse(_req.headers.cookie);

      data === "" ? delete _cookies[key] : (_cookies[key] = data);

      _req.headers.cookie = Object.entries(_cookies).reduce((accum, item) => {
        return accum.concat(`${item[0]}=${item[1]};`);
      }, "");
    }
  }
};
