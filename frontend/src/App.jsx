import { SignIn, SignInButton, SignOutButton } from "@clerk/clerk-react";
import React from "react";

const App = () => {
  return (
    <div>
      <SignInButton mode="modal"></SignInButton>
      <SignOutButton />
    </div>
  );
};

export default App;
