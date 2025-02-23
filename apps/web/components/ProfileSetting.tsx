"use client";

import { updateUserAttribute } from "aws-amplify/auth";
import { useState } from "react";

export default function ProfileSettings() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  async function handleUpdateUsername(e: { preventDefault: () => void; }) {
    e.preventDefault();
    try {
      const result = await updateUserAttribute({
        userAttribute: {
          // Cognito uses the key "preferred_username" for a display name
          attributeKey: "preferred_username",
          value: username,
        },
      });
      // If nextStep indicates that confirmation is needed, you can prompt for a code.
      if (
        result.nextStep.updateAttributeStep === "CONFIRM_ATTRIBUTE_WITH_CODE"
      ) {
        setMessage(
          `A confirmation code was sent to ${result.nextStep.codeDeliveryDetails?.deliveryMedium}. Please verify your attribute.`
        );
        // Here, you’d show a UI to let the user enter the code and then call confirmUserAttribute.
      } else {
        setMessage("Username updated successfully.");
      }
    } catch (error) {
      console.error("Error updating attribute", error);
      setMessage("There was an error updating your username.");
    }
  }

  return (
    <form onSubmit={handleUpdateUsername}>
      <label>
        New Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your new username"
          required
        />
      </label>
      <button type="submit">Update Username</button>
      {message && <p>{message}</p>}
    </form>
  );
}
