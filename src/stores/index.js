import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'


const pinia = createPinia()

pinia.use(persist)

export default pinia

// import { useUserStore } from './modules/user'
// import { useCounterStore } from './modules/counter'
// export {useUserStore,useCounterStore}

export * from './modules/counter'
export * from './modules/user'