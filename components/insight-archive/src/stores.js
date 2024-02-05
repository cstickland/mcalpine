import { writable } from 'svelte/store'

export const filters = writable(new Set())
export const currentPage = writable(1)
