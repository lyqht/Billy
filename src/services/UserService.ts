import {User} from '@supabase/supabase-js';
import supabase from '../api/supabase';
import Cache from './Cache';

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

  logOutUser = async () => {
    Cache.setUserId('');
    let {error} = await supabase.auth.signOut();
  };

  getUser = async (): Promise<User | null> => {
    const retrievedUser = Cache.getUser();
    if (retrievedUser) {
      return retrievedUser;
    }

    return supabase.auth.user();
  };
}

export default new UserService();
