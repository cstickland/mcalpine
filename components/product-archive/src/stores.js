import { writable } from 'svelte/store'

export const filters = writable(new set())
export const currentPage = writable(1)
