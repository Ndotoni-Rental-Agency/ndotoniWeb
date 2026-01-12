import { Auth } from 'aws-amplify';

export interface AuthUser {
  userId: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export async function signUpUser(email: string, password: string, username: string) {
  const result = await Auth.signUp({
    username,
    password,
    attributes: {
      email
    }
  });
  return result;
}

export async function signInUser(username: string, password: string): Promise<AuthUser> {
  const user = await Auth.signIn(username, password);

  // Store user info locally
  const authUser: AuthUser = {
    userId: user.attributes.sub,
    username: user.username,
    email: user.attributes.email,
    firstName: user.attributes.given_name,
    lastName: user.attributes.family_name,
    phoneNumber: user.attributes.phone_number,
  };

  localStorage.setItem('user', JSON.stringify(authUser));
  return authUser;
}

export async function signOutUser() {
  await Auth.signOut();
  localStorage.removeItem('user');
}

export function getCurrentUser(): AuthUser | null {
  const stored = localStorage.getItem('user');
  return stored ? JSON.parse(stored) : null;
}
