import { writable } from 'svelte/store'

export const activeSku = writable(0)
export const product = writable({})
export const display = writable(true)
