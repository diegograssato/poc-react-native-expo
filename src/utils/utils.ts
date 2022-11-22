import { Buffer } from 'buffer'
import Cookies from 'js-cookie'
import sha1 from 'crypto-js/sha1'

export const base64Encode = (text: string): string => {
  return Buffer.from(text).toString('base64')
}

export const setCookie = async (key: string, value: string): Promise<void> => {
  await Cookies.set(key, value)
}

export const getCookie = (key: string): string | undefined => {
  return Cookies.get(key)
}

export const clearCookie = (key: string) => {
  return Cookies.remove(key)
}

export const SHA1Encode = (value: string) => {
  return sha1(
    JSON.stringify([value, process.env.REACT_APP_SH1_SALT_VALUE])
  ).toString()
}
