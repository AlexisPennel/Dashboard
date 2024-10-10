"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { setCookie } from "nookies";
import api from "@/app/api";

const Login = () => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const getCookie = (name) => {
    let cookieArray = document.cookie.split(";");
    for (let i = 0; i < cookieArray.length; i++) {
      let cookiePair = cookieArray[i].split("=");
      if (name == cookiePair[0].trim()) {
        return decodeURIComponent(cookiePair[1]);
      }
    }
    return null;
  };

  const handleSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();

    const data = {
      email: mail,
      password: password,
    };

    api
      .post("api/auth/login", data)
      .then((res) => {
        const data = res.data;
        console.log(data.token);
        setCookie(null, "access_token", data.token, {
          maxAge: 7 * 24 * 60 * 60,
          secure: true, // Assurez-vous que votre site fonctionne en HTTPS
          sameSite: "None", // Nécessaire pour le cross-site cookies; exige 'Secure'
        });

        setCookie(null, "userID", data.userId, {
          maxAge: 7 * 24 * 60 * 60,
          secure: true, // Assurez-vous que votre site fonctionne en HTTPS
          sameSite: "None", // Nécessaire pour le cross-site cookies; exige 'Secure'
        });

        if (getCookie("access_token") && getCookie("userID")) {
          // Exécuter la redirection
          window.location.href = "/admin/dashboard";
        } else {
          setIsLoading(false);
          setIsError(true);
          // Gérer l'erreur si les cookies ne sont pas présents
          console.error("Les cookies n'ont pas été correctement créés.");
        }
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        setIsError(true);
        const form = e.target;
        form.reset();
      });
  };

  return (
    <Card className="mx-auto mt-8 max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Connexion</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={mail}
              autoComplete="on"
              onChange={(e) => setMail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Mot de passe
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="on"
            />
          </div>
          {isLoading ? (
            <Button disabled>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Envoi en cours
            </Button>
          ) : (
            <Button type="submit" className="w-full" variant="">
              Connexion
            </Button>
          )}
        </form>
      </CardContent>
      <CardFooter>
        {isError && (
          <p className="text-red-700">Email ou mot de passe incorrect</p>
        )}
      </CardFooter>
    </Card>
  );
};

export default Login;
