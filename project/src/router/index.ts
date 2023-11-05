import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';

import { supabase } from 'app/config/supabase';

let localUser;
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);
    

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    //history: createHistory(process.env.VUE_ROUTER_BASE),
    history: createWebHistory(process.env.VUE_ROUTER_BASE),
  });



async function getUser(next: any){
  localUser = await supabase.auth.session() 
  if(localUser?.access_token){
    next();
  }
  else{
    next("/")
  }
}

async function isMember(to :any,next: any){
  localUser = await supabase.auth.session() 

  if(localUser?.access_token){
    try {
      const channelId = to.params.id; 
      const headers = {
        'Authorization': `Bearer ${localUser.access_token}`, 
        'Content-Type': 'application/json',
      };
      const response = await fetch(`http://localhost:3333/channels/${channelId}`, {
        method: 'GET',
        headers: headers,
      });
      if (response.status === 200) {
        next();
      } else {
        next("/channels"); 
      }
    } catch (error) {
      next("/");
    }
  }
  else{
    next("/");
  }
}

Router.beforeEach((to, from, next) => {
  if (to.meta.requiresMembership){
    isMember(to,next);
  }
  else if (to.meta.requiresAuth){
    getUser(next)
  }
  else{
    next();
  }
})
  return Router;
});
