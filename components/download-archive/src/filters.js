import { writable } from 'svelte/store'

export const filters = writable(new Set())
export const activeFilters = writable(new Set())
