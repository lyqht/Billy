import supabase from '../api/supabase';

class UserService {
  signUpUser = async (email: string, password: string) => {
    let {user, error} = await supabase.auth.signUp({
      email,
      password,
    });

    return user;
  };

  signInUser = async (email: string, password: string) => {
    let {user, error} = await supabase.auth.signIn({
      email,
      password,
    });
    return user;
  };
}

export default new UserService();
