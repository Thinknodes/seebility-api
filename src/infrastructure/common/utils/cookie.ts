export function getCookieString(token: string, time: number) {
  return `token=${token}; HttpOnly; Path=/; Max-Age=${time}`;
}
