const languages = ['de', 'en'];
const defaultLanguage = 'de';
import { getUserFromLocalStorage } from '~/utils/auth'

export default function ({ app, route, store, isDev, redirect }) {
  let version = route.query._storyblok || isDev ? 'draft' : 'published'
  //TODO: redirect if language does not exist
  //let language = route.params.language || defaultLanguage;
  let language = defaultLanguage;

  if (process.server) {
    store.commit('setCacheVersion', app.$storyapi.cacheVersion)
  }

  if (!store.state.settings._uid || language !== store.state.language) {
    store.commit('setLanguage', language)
    return store.dispatch('loadSettings', {version: version, language: language});
  }

  if (process.client && !store.state.user) {
    let jwt = getUserFromLocalStorage();
    return store.commit('setAuth', {jwt});
  }
}
