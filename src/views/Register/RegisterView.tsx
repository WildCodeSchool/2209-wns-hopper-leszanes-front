import { FormEvent, useEffect, useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@apollo/client";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { InputGroup } from "../../components/InputGroup/InputGroup";
import styles from "./RegisterView.module.scss";
import { createUser } from "../../graphql/user/createUser";
import type { UserWithToken } from "../../types/UserWithToken";
import { useAuth } from "../../contexts/authContext";
import { Button } from "../../components/Button/Button";
import { Link } from "../../components/Link/Link";
import { useToast } from "../../contexts/hooks/ToastContext";

type RegisterFormEvent = FormEvent<HTMLFormElement> & {
  target: HTMLInputElement & {
    name: HTMLInputElement;
    email: HTMLInputElement;
    password: HTMLInputElement;
  };
};

type RegisterResponse = {
  createUser: UserWithToken;
};

export const RegisterView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const { createToast } = useToast();

  const icon = useMemo(
    () => (showPassword ? <EyeOff /> : <Eye />),
    [showPassword]
  );
  const [doSignupMutation, { loading }] =
    useMutation<RegisterResponse>(createUser);

  useEffect(() => {
    if (user) {
      navigate("/", {
        replace: true,
      });
    }
  }, [location, navigate, user]);

  const doSignUp = async (name: string, email: string, password: string) => {
    try {
      const { data } = await doSignupMutation({
        variables: {
          data: {
            name,
            email,
            password,
            invitedBy: searchParams.get("invitedBy"),
          },
        },
      });

      if (!loading && data) {
        localStorage.setItem("token", data.createUser.token);
        setUser(data.createUser.user);
        try {
          await axios.post("http://localhost:4000/mails/new-account", {
            email: data.createUser.user.email,
          });
        } catch (error) {
          createToast({
            id: "send-new-account-error",
            description:
              "Une erreur est survenue lors de l'envoi du mail de création de compte",
            title: "Erreur",
            variant: "error",
          });
        }
        if (searchParams.get("invitedBy")) {
          try {
            await axios.post("http://localhost:4000/mails/new-contact", {
              email: data.createUser.user.email,
              invitedBy: searchParams.get("invitedBy"),
            });
          } catch (error) {
            createToast({
              id: "send-contact-error",
              description:
                "Une erreur est survenue lors de l'envoi du mail de contact",
              title: "Erreur",
              variant: "error",
            });
          }
        }
      }

      if (!loading && !data?.createUser) {
        setShowError(true);
      }
    } catch (err) {
      setShowError(true);
    }
  };
  const handleSubmit = async (e: RegisterFormEvent) => {
    e.preventDefault();
    setShowError(false);
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    await doSignUp(name, email, password);
    if (user) {
      navigate("/", {
        replace: true,
      });
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div>
        <h1>S'enregistrer</h1>
        <form onSubmit={handleSubmit}>
          <InputGroup
            label="Nom"
            name="name"
            type="text"
            inputMode="text"
            placeholder="Gérard"
            disabled={loading}
          />
          <InputGroup
            label="Email"
            name="email"
            type="text"
            inputMode="email"
            placeholder="myemail@email.com"
            disabled={loading}
            defaultValue={searchParams.get("email") ?? ""}
          />
          <InputGroup
            label="Mot de passe"
            name="password"
            type={showPassword ? "text" : "password"}
            inputMode="text"
            placeholder="My@Password123"
            iconPosition="right"
            icon={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {icon}
              </button>
            }
            disabled={loading}
            labelProps={{ className: styles.passwordLabel }}
          />
          <Button disabled={loading} type="submit">
            S'enregistrer
          </Button>
          <Link to="/login">Se connecter</Link>
        </form>
        {showError && (
          <p>
            Merci d'entrer des informations valides (Mot de passe 12 caractères,
            [Aa3!])
          </p>
        )}
        {loading && <p>Chargement...</p>}
        {!loading && showError && <p>Mauvais email ou mauvais mot de passe</p>}
      </div>
    </div>
  );
};
