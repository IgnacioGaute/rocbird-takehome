import { getAuthHeaders } from "@/lib/auth";
import { LoginSchemaType } from "@/schema/auth/login.schema";
import { User } from "@/types/user.type";
import { Logger } from "@/lib/logger";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/auth`;
const logger = new Logger("AuthService");

export const loginUser = async (values: LoginSchemaType, authToken: string) => {
  try {
    logger.log("Intentando login con usuario:", values.email);

    const response = await fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: await getAuthHeaders(authToken),
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (response.ok) {
      logger.log("Login exitoso para:", values.email);
      return data as User;
    } else {
      logger.error("Error en loginUser:", data);
      return null;
    }
  } catch (error) {
    logger.error("Error en loginUser:", error);
    return null;
  }
};
