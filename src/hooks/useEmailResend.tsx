import React from "react";
import { Resend } from "resend";
import { Alert } from "react-native";
import { RESEND_API_KEY, SEND_FEEDBACK_TO } from "@env";

const resend = new Resend(RESEND_API_KEY);

export const useEmailResend = () => {
  const sendEmail = async (
    email: string,
    setEmail: React.SetStateAction,
  ): Promise<unknown> => {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [SEND_FEEDBACK_TO],
      subject: "Feedback",
      text: email,
    });

    console.log(error);

    if (error) {
      throw new Error("Error sending the email");
    }
    Alert.alert("Message sending success!");
    setEmail("");
  };

  return {
    sendEmail,
  };
};
