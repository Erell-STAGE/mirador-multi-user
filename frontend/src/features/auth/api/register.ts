import i18n from "features/translation/i18n";
import { RegisterFormData, UserResponse } from "../export";
import { t } from "i18next";


export const register = async (
  data: RegisterFormData,
): Promise<UserResponse> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/link-user-group/user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          password: data.newPassword,
          preferredLanguage: i18n.language,
        }),
      },
    );

    const responseJSON = await response.json();

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error(t("failedToCreateUser") + "\n" + '"' + t("userAlreadyExists") + '"');
      }
      else if (response.status === 400) {
        throw new Error(t("failedToCreateUser") + "\n" + '"' + responseJSON.message + '"');
      }
      else
        throw new Error(t("failedToCreateUser"));
    }

    return responseJSON;

  } catch (error) {
    throw error;
  }
};
