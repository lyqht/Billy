import {User} from '@supabase/supabase-js';
import supabase from '../api/supabase';
import Cache from './Cache';

class UserService {
  signUpUser = async (email: string, password: string) => {
    let {user, error} = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error(JSON.stringify(error));
      throw Error(error.message);
    }

    return user;
  };

  signInUser = async (email: string, password: string) => {
    let {user, error} = await supabase.auth.signIn({
      email,
      password,
    });

    if (error) {
      console.debug({error});
      throw Error(error.message);
    }

    return user;
  };

  logOutUser = async () => {
    Cache.deleteUser();
    let {error} = await supabase.auth.signOut();
    if (error) {
      console.debug({error});
      throw Error(error.message);
    }
  };

  getUser = (): User | null => {
    const retrievedUser = Cache.getUser();
    if (retrievedUser) {
      return retrievedUser;
    }

    return supabase.auth.user();
  };
}

export default new UserService();
