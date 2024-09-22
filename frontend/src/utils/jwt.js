import { jwtDecode } from "jwt-decode";

export function getNameFromToken(token) {
  if (!token) {
    return null;
  }

  try {
    const decoded = jwtDecode(token); // jwt-decode로 디코딩
    console.log(decoded);
    return decoded.name; // 디코딩된 JWT에서 name 필드 반환
  } catch (error) {
    console.error("Invalid JWT Token", error);
    return null;
  }
}
