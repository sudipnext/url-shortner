"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { HomeURL } from "@/lib/utils";
type Props = {};

const Verify = (props: Props) => {
  const handleClick = () => {
    fetch(`${HomeURL()}auth/users/resend_activation/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "",
      }),
    }).then((response) => {
      if (response.ok) {
        alert("Verification link has been sent to your email");
      } else {
        alert("An error occurred. Please try again later.");
      }
    });
  };

  return (
    <div className="flex flex-col justify-center items-center mt-40 p-24 w-full">
      <div className="text-2xl text-green-600 font-extrabold">
        Verify Your Email
      </div>
      <p className="pt-5 underline w-full">
        Please check your mail for the verification link for signup. If you
        encounter any issues, please contact the administrator at
        admin@gmail.com.
      </p>
      <Button onClick={handleClick} className="w-1/2 mt-5">
        Resend Link
      </Button>
    </div>
  );
};

export default Verify;
