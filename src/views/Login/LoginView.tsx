import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom";
import { InputGroup } from "../../components/InputGroup/InputGroup";
import styles from "./LoginView.module.scss";
import { signIn } from "../../graphql/user/singIn";
import { UserWithToken } from "../../types/UserWithToken";
import { useAuth } from "../../contexts/authContext";
import { LoadingLayout } from "../../components/LoadingLayout/LoadingLayout";
import { Button } from "../../components/Button/Button";
import { Link } from "../../components/Link/Link";

type SignInFormEvent = FormEvent<HTMLFormElement> & {
  target: HTMLInputElement & {
    email: HTMLInputElement;
    password: HTMLInputElement;
  };
};

export const LoginView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, loading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [wrongCredentials, setWrongCredential] = useState(false);
  const icon = showPassword ? <EyeOff /> : <Eye />;
  const [doSigninMutation, { loading }] = useMutation<{
    signIn: UserWithToken;
  }>(signIn);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      navigate((location.state?.from as string) || "/", {
        replace: true,
      });
    }
  }, [location, navigate, user]);

  const doSignIn = async (email: string, password: string) => {
    try {
      const { data } = await doSigninMutation({
        variables: {
          email,
          password,
        },
      });
      if (!loading && data) {
        localStorage.setItem("token", data.signIn.token);
        setUser(data.signIn.user);
        setWrongCredential(false);
      }

      if (!loading && !data) {
        setWrongCredential(true);
      }
    } catch (err) {
      setWrongCredential(true);
    }
  };
  const handleSubmit = async (e: SignInFormEvent) => {
    e.preventDefault();
    setWrongCredential(false);
    const email = e.target.email.value;
    const password = e.target.password.value;
    await doSignIn(email, password);
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      navigate((location.state?.from as string) || "/", {
        replace: true,
      });
    }
  };

  if (authLoading) {
    return <LoadingLayout />;
  }

  return (
    <div className={styles.loginContainer}>
      <div>
        <h1>Se connecter</h1>
        <form onSubmit={handleSubmit}>
          <InputGroup
            label="Email"
            name="email"
            type="text"
            inputMode="email"
            placeholder="myemail@email.com"
            disabled={loading}
          />
          <InputGroup
            label="Mot de passe"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="My@Password123"
            inputMode="text"
            disabled={loading}
            iconPosition="right"
            icon={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {icon}
              </button>
            }
            labelProps={{ className: styles.passwordLabel }}
          />
          <Button isLoading={loading} type="submit">
            Se connecter
          </Button>
          <Link to="/register">S'enregistrer</Link>
        </form>
        {loading && <p>Chargement...</p>}
        {!loading && wrongCredentials && (
          <p>Mauvais email ou mauvais mot de passe</p>
        )}
      </div>
    </div>
  );
};
