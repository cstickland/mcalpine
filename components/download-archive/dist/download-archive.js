
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.DownloadArchive = factory());
})(this, (function () { 'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }
    class HtmlTag {
        constructor(is_svg = false) {
            this.is_svg = false;
            this.is_svg = is_svg;
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                if (this.is_svg)
                    this.e = svg_element(target.nodeName);
                /** #7364  target for <template> may be provided as #document-fragment(11) */
                else
                    this.e = element((target.nodeType === 11 ? 'TEMPLATE' : target.nodeName));
                this.t = target.tagName !== 'TEMPLATE' ? target : target.content;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.nodeName === 'TEMPLATE' ? this.e.content.childNodes : this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { ownerNode } = info.stylesheet;
                // there is no ownerNode if it runs on jsdom.
                if (ownerNode)
                    detach(ownerNode);
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        const options = { direction: 'both' };
        let config = fn(node, params, options);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config(options);
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function cubicInOut(t) {
        return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    }
    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    var _ = {
      $(selector) {
        if (typeof selector === "string") {
          return document.querySelector(selector);
        }
        return selector;
      },
      extend(...args) {
        return Object.assign(...args);
      },
      cumulativeOffset(element) {
        let top = 0;
        let left = 0;

        do {
          top += element.offsetTop || 0;
          left += element.offsetLeft || 0;
          element = element.offsetParent;
        } while (element);

        return {
          top: top,
          left: left
        };
      },
      directScroll(element) {
        return element && element !== document && element !== document.body;
      },
      scrollTop(element, value) {
        let inSetter = value !== undefined;
        if (this.directScroll(element)) {
          return inSetter ? (element.scrollTop = value) : element.scrollTop;
        } else {
          return inSetter
            ? (document.documentElement.scrollTop = document.body.scrollTop = value)
            : window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop ||
                0;
        }
      },
      scrollLeft(element, value) {
        let inSetter = value !== undefined;
        if (this.directScroll(element)) {
          return inSetter ? (element.scrollLeft = value) : element.scrollLeft;
        } else {
          return inSetter
            ? (document.documentElement.scrollLeft = document.body.scrollLeft = value)
            : window.pageXOffset ||
                document.documentElement.scrollLeft ||
                document.body.scrollLeft ||
                0;
        }
      }
    };

    const defaultOptions = {
      container: "body",
      duration: 500,
      delay: 0,
      offset: 0,
      easing: cubicInOut,
      onStart: noop,
      onDone: noop,
      onAborting: noop,
      scrollX: false,
      scrollY: true
    };

    const _scrollTo = options => {
      let {
        offset,
        duration,
        delay,
        easing,
        x=0,
        y=0,
        scrollX,
        scrollY,
        onStart,
        onDone,
        container,
        onAborting,
        element
      } = options;

      if (typeof offset === "function") {
        offset = offset();
      }

      var cumulativeOffsetContainer = _.cumulativeOffset(container);
      var cumulativeOffsetTarget = element
        ? _.cumulativeOffset(element)
        : { top: y, left: x };

      var initialX = _.scrollLeft(container);
      var initialY = _.scrollTop(container);

      var targetX =
        cumulativeOffsetTarget.left - cumulativeOffsetContainer.left + offset;
      var targetY =
        cumulativeOffsetTarget.top - cumulativeOffsetContainer.top + offset;

      var diffX = targetX - initialX;
    	var diffY = targetY - initialY;

      let scrolling = true;
      let started = false;
      let start_time = now() + delay;
      let end_time = start_time + duration;

      function scrollToTopLeft(element, top, left) {
        if (scrollX) _.scrollLeft(element, left);
        if (scrollY) _.scrollTop(element, top);
      }

      function start(delayStart) {
        if (!delayStart) {
          started = true;
          onStart(element, {x, y});
        }
      }

      function tick(progress) {
        scrollToTopLeft(
          container,
          initialY + diffY * progress,
          initialX + diffX * progress
        );
      }

      function stop() {
        scrolling = false;
      }

      loop(now => {
        if (!started && now >= start_time) {
          start(false);
        }

        if (started && now >= end_time) {
          tick(1);
          stop();
          onDone(element, {x, y});
        }

        if (!scrolling) {
          onAborting(element, {x, y});
          return false;
        }
        if (started) {
          const p = now - start_time;
          const t = 0 + 1 * easing(p / duration);
          tick(t);
        }

        return true;
      });

      start(delay);

      tick(0);

      return stop;
    };

    const proceedOptions = options => {
    	let opts = _.extend({}, defaultOptions, options);
      opts.container = _.$(opts.container);
      opts.element = _.$(opts.element);
      return opts;
    };

    const scrollContainerHeight = containerElement => {
      if (
        containerElement &&
        containerElement !== document &&
        containerElement !== document.body
      ) {
        return containerElement.scrollHeight - containerElement.offsetHeight;
      } else {
        let body = document.body;
        let html = document.documentElement;

        return Math.max(
          body.scrollHeight,
          body.offsetHeight,
          html.clientHeight,
          html.scrollHeight,
          html.offsetHeight
        );
      }
    };

    const setGlobalOptions = options => {
    	_.extend(defaultOptions, options || {});
    };

    const scrollTo = options => {
      return _scrollTo(proceedOptions(options));
    };

    const scrollToBottom = options => {
      options = proceedOptions(options);

      return _scrollTo(
        _.extend(options, {
          element: null,
          y: scrollContainerHeight(options.container)
        })
      );
    };

    const scrollToTop = options => {
      options = proceedOptions(options);

      return _scrollTo(
        _.extend(options, {
          element: null,
          y: 0
        })
      );
    };

    const makeScrollToAction = scrollToFunc => {
      return (node, options) => {
        let current = options;
        const handle = e => {
          e.preventDefault();
          scrollToFunc(
            typeof current === "string" ? { element: current } : current
          );
        };
        node.addEventListener("click", handle);
        node.addEventListener("touchstart", handle);
        return {
          update(options) {
            current = options;
          },
          destroy() {
            node.removeEventListener("click", handle);
            node.removeEventListener("touchstart", handle);
          }
        };
      };
    };

    const scrollto = makeScrollToAction(scrollTo);
    const scrolltotop = makeScrollToAction(scrollToTop);
    const scrolltobottom = makeScrollToAction(scrollToBottom);

    var animateScroll = /*#__PURE__*/Object.freeze({
        __proto__: null,
        makeScrollToAction: makeScrollToAction,
        scrollTo: scrollTo,
        scrollToBottom: scrollToBottom,
        scrollToTop: scrollToTop,
        scrollto: scrollto,
        scrolltobottom: scrolltobottom,
        scrolltotop: scrolltotop,
        setGlobalOptions: setGlobalOptions
    });

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=} start
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0 && stop) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const allItems = writable([]);
    const currentPage = writable(1);
    const itemsDividedIntoPages = writable([]);

    const query = `{
  downloads(first: 1000) {
    edges {
      node {
        id
        title
        downloadCategories {
          nodes {
            name
            id
          }
        }
        featuredImage {
          node {
            altText
            sourceUrl(size: MEDIUM)
          }
        }
        downloadFields {
          fileDownload {
            mediaItemUrl
            dateGmt
          }
        }
        databaseId
        downloadTypes {
          nodes {
            id
            name
          }
        }
      }
    }
  }
}`;

    async function getData(query) {
      const fetchPromise = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
        }),
      });

      const response = await fetchPromise.json();
      return response
    }

    function divideItemsIntoPages(
      postsPerPage,
      items,
      currentPage,
      filters
    ) {
      let page = [];
      let pagesArray = [];

      items.forEach((item) => {
        let addItem = false;
        if (filters.size == 0) {
          addItem = true;
        }
        item.categories.forEach((category) => {
          if (filters.has(category.name)) {
            addItem = true;
          }
        });
        if (addItem) {
          page.push(item);

          if (page.length == postsPerPage) {
            pagesArray.push(page);
            page = [];
            return
          }
        }
      });
      if (page.length > 0) {
        pagesArray.push(page);
      }
      return pagesArray
    }

    /* src/pagination/Pagination.svelte generated by Svelte v3.59.2 */
    const file$8 = "src/pagination/Pagination.svelte";

    // (28:0) {:else}
    function create_else_block_1(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Prev";
    			attr_dev(button, "class", "prev-next-button");
    			button.disabled = true;
    			add_location(button, file$8, 28, 4, 768);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(28:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (21:0) {#if $currentPage > 1}
    function create_if_block_6(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Prev";
    			attr_dev(button, "class", "prev-next-button");
    			add_location(button, file$8, 21, 4, 606);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[4], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(21:0) {#if $currentPage > 1}",
    		ctx
    	});

    	return block;
    }

    // (33:4) {#if $currentPage == totalPages && totalPages > 2}
    function create_if_block_5(ctx) {
    	let button;
    	let t_value = /*$currentPage*/ ctx[1] - 2 + "";
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "pagination-button");
    			add_location(button, file$8, 33, 8, 928);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[5], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentPage*/ 2 && t_value !== (t_value = /*$currentPage*/ ctx[1] - 2 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(33:4) {#if $currentPage == totalPages && totalPages > 2}",
    		ctx
    	});

    	return block;
    }

    // (41:4) {#if $currentPage > 1}
    function create_if_block_4(ctx) {
    	let button;
    	let t_value = /*$currentPage*/ ctx[1] - 1 + "";
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "pagination-button");
    			add_location(button, file$8, 41, 8, 1158);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[6], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentPage*/ 2 && t_value !== (t_value = /*$currentPage*/ ctx[1] - 1 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(41:4) {#if $currentPage > 1}",
    		ctx
    	});

    	return block;
    }

    // (54:4) {#if $currentPage < totalPages}
    function create_if_block_3(ctx) {
    	let button;
    	let t_value = /*$currentPage*/ ctx[1] + 1 + "";
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "pagination-button");
    			add_location(button, file$8, 54, 8, 1502);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_3*/ ctx[7], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentPage*/ 2 && t_value !== (t_value = /*$currentPage*/ ctx[1] + 1 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(54:4) {#if $currentPage < totalPages}",
    		ctx
    	});

    	return block;
    }

    // (62:4) {#if $currentPage == 1 && totalPages > 2}
    function create_if_block_2(ctx) {
    	let button;
    	let t_value = /*$currentPage*/ ctx[1] + 2 + "";
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "pagination-button");
    			add_location(button, file$8, 62, 8, 1751);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_4*/ ctx[8], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentPage*/ 2 && t_value !== (t_value = /*$currentPage*/ ctx[1] + 2 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(62:4) {#if $currentPage == 1 && totalPages > 2}",
    		ctx
    	});

    	return block;
    }

    // (70:4) {#if $currentPage < totalPages - 1 && totalPages > 3}
    function create_if_block_1$2(ctx) {
    	let div;
    	let span;
    	let t1;
    	let button;
    	let t2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "...";
    			t1 = space();
    			button = element("button");
    			t2 = text(/*totalPages*/ ctx[0]);
    			add_location(span, file$8, 70, 47, 2051);
    			attr_dev(div, "class", "pagination-seperator-dots");
    			add_location(div, file$8, 70, 8, 2012);
    			attr_dev(button, "class", "pagination-button");
    			add_location(button, file$8, 71, 8, 2082);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button, anchor);
    			append_dev(button, t2);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_5*/ ctx[9], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*totalPages*/ 1) set_data_dev(t2, /*totalPages*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(70:4) {#if $currentPage < totalPages - 1 && totalPages > 3}",
    		ctx
    	});

    	return block;
    }

    // (90:0) {:else}
    function create_else_block$2(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Next";
    			attr_dev(button, "class", "prev-next-button");
    			button.disabled = true;
    			add_location(button, file$8, 90, 4, 2485);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(90:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (81:0) {#if $currentPage < totalPages}
    function create_if_block$3(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Next";
    			attr_dev(button, "class", "prev-next-button");
    			add_location(button, file$8, 81, 4, 2309);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_6*/ ctx[10], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(81:0) {#if $currentPage < totalPages}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let t0;
    	let div;
    	let t1;
    	let t2;
    	let button;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let if_block6_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*$currentPage*/ ctx[1] > 1) return create_if_block_6;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*$currentPage*/ ctx[1] == /*totalPages*/ ctx[0] && /*totalPages*/ ctx[0] > 2 && create_if_block_5(ctx);
    	let if_block2 = /*$currentPage*/ ctx[1] > 1 && create_if_block_4(ctx);
    	let if_block3 = /*$currentPage*/ ctx[1] < /*totalPages*/ ctx[0] && create_if_block_3(ctx);
    	let if_block4 = /*$currentPage*/ ctx[1] == 1 && /*totalPages*/ ctx[0] > 2 && create_if_block_2(ctx);
    	let if_block5 = /*$currentPage*/ ctx[1] < /*totalPages*/ ctx[0] - 1 && /*totalPages*/ ctx[0] > 3 && create_if_block_1$2(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*$currentPage*/ ctx[1] < /*totalPages*/ ctx[0]) return create_if_block$3;
    		return create_else_block$2;
    	}

    	let current_block_type_1 = select_block_type_1(ctx);
    	let if_block6 = current_block_type_1(ctx);

    	const block = {
    		c: function create() {
    			if_block0.c();
    			t0 = space();
    			div = element("div");
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			button = element("button");
    			t3 = text(/*$currentPage*/ ctx[1]);
    			t4 = space();
    			if (if_block3) if_block3.c();
    			t5 = space();
    			if (if_block4) if_block4.c();
    			t6 = space();
    			if (if_block5) if_block5.c();
    			t7 = space();
    			if_block6.c();
    			if_block6_anchor = empty();
    			attr_dev(button, "class", "pagination-button pagination-button__current");
    			add_location(button, file$8, 49, 4, 1358);
    			attr_dev(div, "class", "page-number-buttons");
    			add_location(div, file$8, 31, 0, 831);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);
    			if (if_block2) if_block2.m(div, null);
    			append_dev(div, t2);
    			append_dev(div, button);
    			append_dev(button, t3);
    			append_dev(div, t4);
    			if (if_block3) if_block3.m(div, null);
    			append_dev(div, t5);
    			if (if_block4) if_block4.m(div, null);
    			append_dev(div, t6);
    			if (if_block5) if_block5.m(div, null);
    			insert_dev(target, t7, anchor);
    			if_block6.m(target, anchor);
    			insert_dev(target, if_block6_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			}

    			if (/*$currentPage*/ ctx[1] == /*totalPages*/ ctx[0] && /*totalPages*/ ctx[0] > 2) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_5(ctx);
    					if_block1.c();
    					if_block1.m(div, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*$currentPage*/ ctx[1] > 1) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_4(ctx);
    					if_block2.c();
    					if_block2.m(div, t2);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (dirty & /*$currentPage*/ 2) set_data_dev(t3, /*$currentPage*/ ctx[1]);

    			if (/*$currentPage*/ ctx[1] < /*totalPages*/ ctx[0]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_3(ctx);
    					if_block3.c();
    					if_block3.m(div, t5);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*$currentPage*/ ctx[1] == 1 && /*totalPages*/ ctx[0] > 2) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_2(ctx);
    					if_block4.c();
    					if_block4.m(div, t6);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*$currentPage*/ ctx[1] < /*totalPages*/ ctx[0] - 1 && /*totalPages*/ ctx[0] > 3) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_1$2(ctx);
    					if_block5.c();
    					if_block5.m(div, null);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx)) && if_block6) {
    				if_block6.p(ctx, dirty);
    			} else {
    				if_block6.d(1);
    				if_block6 = current_block_type_1(ctx);

    				if (if_block6) {
    					if_block6.c();
    					if_block6.m(if_block6_anchor.parentNode, if_block6_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (detaching) detach_dev(t7);
    			if_block6.d(detaching);
    			if (detaching) detach_dev(if_block6_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $currentPage;
    	validate_store(currentPage, 'currentPage');
    	component_subscribe($$self, currentPage, $$value => $$invalidate(1, $currentPage = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Pagination', slots, []);
    	let { totalPages } = $$props;
    	let { transition } = $$props;

    	function setCurrentcurrentPage(newPage) {
    		const url = new URL(location);
    		url.searchParams.set("pagination", newPage);
    		history.pushState({}, "", url);

    		scrollTo({
    			element: "#category-archive",
    			duration: 200
    		});

    		$$invalidate(3, transition = true);
    		currentPage.set(newPage);

    		setTimeout(
    			() => {
    				$$invalidate(3, transition = false);
    			},
    			10
    		);
    	}

    	$$self.$$.on_mount.push(function () {
    		if (totalPages === undefined && !('totalPages' in $$props || $$self.$$.bound[$$self.$$.props['totalPages']])) {
    			console.warn("<Pagination> was created without expected prop 'totalPages'");
    		}

    		if (transition === undefined && !('transition' in $$props || $$self.$$.bound[$$self.$$.props['transition']])) {
    			console.warn("<Pagination> was created without expected prop 'transition'");
    		}
    	});

    	const writable_props = ['totalPages', 'transition'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Pagination> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		setCurrentcurrentPage($currentPage - 1);
    	};

    	const click_handler_1 = () => {
    		setCurrentcurrentPage($currentPage - 2);
    	};

    	const click_handler_2 = () => {
    		setCurrentcurrentPage($currentPage - 1);
    	};

    	const click_handler_3 = () => {
    		setCurrentcurrentPage($currentPage + 1);
    	};

    	const click_handler_4 = () => {
    		setCurrentcurrentPage($currentPage + 2);
    	};

    	const click_handler_5 = () => {
    		setCurrentcurrentPage(totalPages);
    	};

    	const click_handler_6 = () => {
    		setCurrentcurrentPage($currentPage + 1);
    	};

    	$$self.$$set = $$props => {
    		if ('totalPages' in $$props) $$invalidate(0, totalPages = $$props.totalPages);
    		if ('transition' in $$props) $$invalidate(3, transition = $$props.transition);
    	};

    	$$self.$capture_state = () => ({
    		animateScroll,
    		totalPages,
    		transition,
    		currentPage,
    		setCurrentcurrentPage,
    		$currentPage
    	});

    	$$self.$inject_state = $$props => {
    		if ('totalPages' in $$props) $$invalidate(0, totalPages = $$props.totalPages);
    		if ('transition' in $$props) $$invalidate(3, transition = $$props.transition);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		totalPages,
    		$currentPage,
    		setCurrentcurrentPage,
    		transition,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6
    	];
    }

    class Pagination extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { totalPages: 0, transition: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pagination",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get totalPages() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set totalPages(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transition() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transition(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function slide(node, { delay = 0, duration = 400, easing = cubicOut, axis = 'y' } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const primary_property = axis === 'y' ? 'height' : 'width';
        const primary_property_value = parseFloat(style[primary_property]);
        const secondary_properties = axis === 'y' ? ['top', 'bottom'] : ['left', 'right'];
        const capitalized_secondary_properties = secondary_properties.map((e) => `${e[0].toUpperCase()}${e.slice(1)}`);
        const padding_start_value = parseFloat(style[`padding${capitalized_secondary_properties[0]}`]);
        const padding_end_value = parseFloat(style[`padding${capitalized_secondary_properties[1]}`]);
        const margin_start_value = parseFloat(style[`margin${capitalized_secondary_properties[0]}`]);
        const margin_end_value = parseFloat(style[`margin${capitalized_secondary_properties[1]}`]);
        const border_width_start_value = parseFloat(style[`border${capitalized_secondary_properties[0]}Width`]);
        const border_width_end_value = parseFloat(style[`border${capitalized_secondary_properties[1]}Width`]);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `${primary_property}: ${t * primary_property_value}px;` +
                `padding-${secondary_properties[0]}: ${t * padding_start_value}px;` +
                `padding-${secondary_properties[1]}: ${t * padding_end_value}px;` +
                `margin-${secondary_properties[0]}: ${t * margin_start_value}px;` +
                `margin-${secondary_properties[1]}: ${t * margin_end_value}px;` +
                `border-${secondary_properties[0]}-width: ${t * border_width_start_value}px;` +
                `border-${secondary_properties[1]}-width: ${t * border_width_end_value}px;`
        };
    }

    /* src/filters/FilterSection.svelte generated by Svelte v3.59.2 */
    const file$7 = "src/filters/FilterSection.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (44:8) {:else}
    function create_else_block$1(ctx) {
    	let span;
    	let svg;
    	let g1;
    	let g0;
    	let rect;
    	let path;

    	const block = {
    		c: function create() {
    			span = element("span");
    			svg = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			rect = svg_element("rect");
    			path = svg_element("path");
    			attr_dev(rect, "width", "24");
    			attr_dev(rect, "height", "24");
    			attr_dev(rect, "opacity", "0");
    			attr_dev(rect, "class", "svelte-1gzu3zi");
    			add_location(rect, file$7, 48, 28, 1652);
    			attr_dev(path, "d", "M12 15.5a1 1 0 0 1-.71-.29l-4-4a1 1 0 1 1 1.42-1.42L12 13.1l3.3-3.18a1 1 0 1 1 1.38 1.44l-4 3.86a1 1 0 0 1-.68.28z");
    			attr_dev(path, "class", "svelte-1gzu3zi");
    			add_location(path, file$7, 49, 28, 1724);
    			attr_dev(g0, "data-name", "chevron-down");
    			add_location(g0, file$7, 47, 24, 1595);
    			attr_dev(g1, "data-name", "Layer 2");
    			add_location(g1, file$7, 46, 20, 1547);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "class", "svelte-1gzu3zi");
    			add_location(svg, file$7, 45, 16, 1466);
    			attr_dev(span, "class", "svelte-1gzu3zi");
    			add_location(span, file$7, 44, 12, 1443);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, svg);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, rect);
    			append_dev(g0, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(44:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (27:8) {#if openCategory}
    function create_if_block_1$1(ctx) {
    	let span;
    	let svg;
    	let g1;
    	let g0;
    	let rect;
    	let path;

    	const block = {
    		c: function create() {
    			span = element("span");
    			svg = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			rect = svg_element("rect");
    			path = svg_element("path");
    			attr_dev(rect, "width", "24");
    			attr_dev(rect, "height", "24");
    			attr_dev(rect, "transform", "rotate(180 12 12)");
    			attr_dev(rect, "opacity", "0");
    			attr_dev(rect, "class", "svelte-1gzu3zi");
    			add_location(rect, file$7, 31, 29, 875);
    			attr_dev(path, "d", "M16 14.5a1 1 0 0 1-.71-.29L12 10.9l-3.3 3.18a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.42l4-3.86a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.42 1 1 0 0 1-.69.28z");
    			attr_dev(path, "class", "svelte-1gzu3zi");
    			add_location(path, file$7, 36, 30, 1104);
    			attr_dev(g0, "data-name", "chevron-up");
    			add_location(g0, file$7, 30, 25, 820);
    			attr_dev(g1, "data-name", "Layer 2");
    			add_location(g1, file$7, 29, 21, 772);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "class", "svelte-1gzu3zi");
    			add_location(svg, file$7, 28, 17, 691);
    			attr_dev(span, "class", "svelte-1gzu3zi");
    			add_location(span, file$7, 27, 12, 668);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, svg);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, rect);
    			append_dev(g0, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(27:8) {#if openCategory}",
    		ctx
    	});

    	return block;
    }

    // (59:4) {#if openCategory}
    function create_if_block$2(ctx) {
    	let div;
    	let div_transition;
    	let current;
    	let each_value = [.../*items*/ ctx[1]];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "product-archive-category-list svelte-1gzu3zi");
    			add_location(div, file$7, 59, 8, 2068);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*toggleFilter, items, $filters*/ 50) {
    				each_value = [.../*items*/ ctx[1]];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!current) return;
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, { axis: "y", duration: 300 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, slide, { axis: "y", duration: 300 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(59:4) {#if openCategory}",
    		ctx
    	});

    	return block;
    }

    // (64:12) {#each [...items] as item}
    function create_each_block$1(ctx) {
    	let li;
    	let div1;
    	let div0;
    	let div1_class_value;
    	let t0;
    	let html_tag;
    	let raw_value = /*item*/ ctx[9].name + "";
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[8](/*item*/ ctx[9]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			html_tag = new HtmlTag(false);
    			t1 = space();
    			attr_dev(div0, "class", "toggle-circle");
    			add_location(div0, file$7, 75, 24, 2634);

    			attr_dev(div1, "class", div1_class_value = "category-toggle " + (/*$filters*/ ctx[4].has(/*item*/ ctx[9].id)
    			? 'checked'
    			: 'unchecked'));

    			add_location(div1, file$7, 70, 20, 2429);
    			html_tag.a = t1;
    			attr_dev(li, "class", "svelte-1gzu3zi");
    			add_location(li, file$7, 64, 16, 2248);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div1);
    			append_dev(div1, div0);
    			append_dev(li, t0);
    			html_tag.m(raw_value, li);
    			append_dev(li, t1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(li, "click", click_handler_1, false, false, false, false),
    					listen_dev(li, "keydown", /*keydown_handler*/ ctx[6], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*$filters, items*/ 18 && div1_class_value !== (div1_class_value = "category-toggle " + (/*$filters*/ ctx[4].has(/*item*/ ctx[9].id)
    			? 'checked'
    			: 'unchecked'))) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (dirty & /*items*/ 2 && raw_value !== (raw_value = /*item*/ ctx[9].name + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(64:12) {#each [...items] as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let ul;
    	let button;
    	let h5;
    	let t0;
    	let t1;
    	let t2;
    	let current;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*openCategory*/ ctx[3]) return create_if_block_1$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*openCategory*/ ctx[3] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			button = element("button");
    			h5 = element("h5");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(h5, "class", "svelte-1gzu3zi");
    			add_location(h5, file$7, 25, 8, 612);
    			attr_dev(button, "class", "filter-category-title svelte-1gzu3zi");
    			add_location(button, file$7, 19, 4, 473);
    			attr_dev(ul, "class", "product-archive-filters-section svelte-1gzu3zi");
    			add_location(ul, file$7, 18, 0, 424);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);
    			append_dev(ul, button);
    			append_dev(button, h5);
    			append_dev(h5, t0);
    			append_dev(button, t1);
    			if_block0.m(button, null);
    			append_dev(ul, t2);
    			if (if_block1) if_block1.m(ul, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[7], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(button, null);
    				}
    			}

    			if (/*openCategory*/ ctx[3]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*openCategory*/ 8) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(ul, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $filters,
    		$$unsubscribe_filters = noop,
    		$$subscribe_filters = () => ($$unsubscribe_filters(), $$unsubscribe_filters = subscribe(filters, $$value => $$invalidate(4, $filters = $$value)), filters);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_filters());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FilterSection', slots, []);
    	let { title = "title" } = $$props;
    	let { items = [] } = $$props;
    	let { filters = new Set() } = $$props;
    	validate_store(filters, 'filters');
    	$$subscribe_filters();
    	let openCategory = false;

    	function toggleFilter(id) {
    		if ($filters.has(id)) {
    			if ($filters.delete(id)) {
    				filters.set($filters);
    			}

    			return;
    		}

    		filters.set($filters.add(id));
    	}

    	const writable_props = ['title', 'items', 'filters'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FilterSection> was created with unknown prop '${key}'`);
    	});

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler = () => {
    		$$invalidate(3, openCategory = !openCategory);
    	};

    	const click_handler_1 = item => {
    		toggleFilter(item.id);
    	};

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('items' in $$props) $$invalidate(1, items = $$props.items);
    		if ('filters' in $$props) $$subscribe_filters($$invalidate(2, filters = $$props.filters));
    	};

    	$$self.$capture_state = () => ({
    		slide,
    		title,
    		items,
    		filters,
    		openCategory,
    		toggleFilter,
    		$filters
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('items' in $$props) $$invalidate(1, items = $$props.items);
    		if ('filters' in $$props) $$subscribe_filters($$invalidate(2, filters = $$props.filters));
    		if ('openCategory' in $$props) $$invalidate(3, openCategory = $$props.openCategory);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		title,
    		items,
    		filters,
    		openCategory,
    		$filters,
    		toggleFilter,
    		keydown_handler,
    		click_handler,
    		click_handler_1
    	];
    }

    class FilterSection extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { title: 0, items: 1, filters: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FilterSection",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get title() {
    		throw new Error("<FilterSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<FilterSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get items() {
    		throw new Error("<FilterSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<FilterSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filters() {
    		throw new Error("<FilterSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filters(value) {
    		throw new Error("<FilterSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const allCategories = writable(new Set());
    const allFileTypes = writable(new Set());
    const allDownloadTypes = writable(new Set());

    const activeCategoryFilters = writable(new Set());
    const activeFileTypeFilters = writable(new Set());
    const activeDownloadTypeFilters = writable(new Set());

    /* src/filters/Filters.svelte generated by Svelte v3.59.2 */

    const { console: console_1$1 } = globals;

    const file$6 = "src/filters/Filters.svelte";

    function create_fragment$6(ctx) {
    	let div;
    	let filterssection0;
    	let t0;
    	let filterssection1;
    	let t1;
    	let filterssection2;
    	let current;

    	filterssection0 = new FilterSection({
    			props: {
    				title: "Download Type",
    				items: /*downloadTypes*/ ctx[2],
    				filters: activeDownloadTypeFilters
    			},
    			$$inline: true
    		});

    	filterssection1 = new FilterSection({
    			props: {
    				title: "Categories",
    				items: /*categories*/ ctx[0],
    				filters: activeCategoryFilters
    			},
    			$$inline: true
    		});

    	filterssection2 = new FilterSection({
    			props: {
    				title: "File Type",
    				items: /*fileTypes*/ ctx[1],
    				filters: activeFileTypeFilters
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(filterssection0.$$.fragment);
    			t0 = space();
    			create_component(filterssection1.$$.fragment);
    			t1 = space();
    			create_component(filterssection2.$$.fragment);
    			attr_dev(div, "class", "filters svelte-tft6rj");
    			add_location(div, file$6, 26, 0, 630);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(filterssection0, div, null);
    			append_dev(div, t0);
    			mount_component(filterssection1, div, null);
    			append_dev(div, t1);
    			mount_component(filterssection2, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const filterssection0_changes = {};
    			if (dirty & /*downloadTypes*/ 4) filterssection0_changes.items = /*downloadTypes*/ ctx[2];
    			filterssection0.$set(filterssection0_changes);
    			const filterssection1_changes = {};
    			if (dirty & /*categories*/ 1) filterssection1_changes.items = /*categories*/ ctx[0];
    			filterssection1.$set(filterssection1_changes);
    			const filterssection2_changes = {};
    			if (dirty & /*fileTypes*/ 2) filterssection2_changes.items = /*fileTypes*/ ctx[1];
    			filterssection2.$set(filterssection2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filterssection0.$$.fragment, local);
    			transition_in(filterssection1.$$.fragment, local);
    			transition_in(filterssection2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filterssection0.$$.fragment, local);
    			transition_out(filterssection1.$$.fragment, local);
    			transition_out(filterssection2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(filterssection0);
    			destroy_component(filterssection1);
    			destroy_component(filterssection2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Filters', slots, []);
    	let { postsPerPage } = $$props;
    	let { categories } = $$props;
    	let { fileTypes } = $$props;
    	let { downloadTypes } = $$props;

    	activeCategoryFilters.subscribe(value => {
    		console.log(value);
    	});

    	activeFileTypeFilters.subscribe(value => {
    		console.log(value);
    	});

    	activeDownloadTypeFilters.subscribe(value => {
    		console.log(value);
    	});

    	onMount(() => {
    		
    	});

    	$$self.$$.on_mount.push(function () {
    		if (postsPerPage === undefined && !('postsPerPage' in $$props || $$self.$$.bound[$$self.$$.props['postsPerPage']])) {
    			console_1$1.warn("<Filters> was created without expected prop 'postsPerPage'");
    		}

    		if (categories === undefined && !('categories' in $$props || $$self.$$.bound[$$self.$$.props['categories']])) {
    			console_1$1.warn("<Filters> was created without expected prop 'categories'");
    		}

    		if (fileTypes === undefined && !('fileTypes' in $$props || $$self.$$.bound[$$self.$$.props['fileTypes']])) {
    			console_1$1.warn("<Filters> was created without expected prop 'fileTypes'");
    		}

    		if (downloadTypes === undefined && !('downloadTypes' in $$props || $$self.$$.bound[$$self.$$.props['downloadTypes']])) {
    			console_1$1.warn("<Filters> was created without expected prop 'downloadTypes'");
    		}
    	});

    	const writable_props = ['postsPerPage', 'categories', 'fileTypes', 'downloadTypes'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Filters> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('postsPerPage' in $$props) $$invalidate(3, postsPerPage = $$props.postsPerPage);
    		if ('categories' in $$props) $$invalidate(0, categories = $$props.categories);
    		if ('fileTypes' in $$props) $$invalidate(1, fileTypes = $$props.fileTypes);
    		if ('downloadTypes' in $$props) $$invalidate(2, downloadTypes = $$props.downloadTypes);
    	};

    	$$self.$capture_state = () => ({
    		FiltersSection: FilterSection,
    		onMount,
    		activeCategoryFilters,
    		activeFileTypeFilters,
    		activeDownloadTypeFilters,
    		postsPerPage,
    		categories,
    		fileTypes,
    		downloadTypes
    	});

    	$$self.$inject_state = $$props => {
    		if ('postsPerPage' in $$props) $$invalidate(3, postsPerPage = $$props.postsPerPage);
    		if ('categories' in $$props) $$invalidate(0, categories = $$props.categories);
    		if ('fileTypes' in $$props) $$invalidate(1, fileTypes = $$props.fileTypes);
    		if ('downloadTypes' in $$props) $$invalidate(2, downloadTypes = $$props.downloadTypes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [categories, fileTypes, downloadTypes, postsPerPage];
    }

    class Filters extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			postsPerPage: 3,
    			categories: 0,
    			fileTypes: 1,
    			downloadTypes: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Filters",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get postsPerPage() {
    		throw new Error("<Filters>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set postsPerPage(value) {
    		throw new Error("<Filters>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get categories() {
    		throw new Error("<Filters>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set categories(value) {
    		throw new Error("<Filters>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fileTypes() {
    		throw new Error("<Filters>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fileTypes(value) {
    		throw new Error("<Filters>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get downloadTypes() {
    		throw new Error("<Filters>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set downloadTypes(value) {
    		throw new Error("<Filters>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pagination/LoadMore.svelte generated by Svelte v3.59.2 */
    const file$5 = "src/pagination/LoadMore.svelte";

    function create_fragment$5(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Load More";
    			attr_dev(button, "class", "btn btn-black svelte-pgpjbr");
    			attr_dev(button, "aria-label", "load more");
    			add_location(button, file$5, 8, 0, 144);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*loadMore*/ ctx[0], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $currentPage;
    	validate_store(currentPage, 'currentPage');
    	component_subscribe($$self, currentPage, $$value => $$invalidate(1, $currentPage = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LoadMore', slots, []);

    	function loadMore() {
    		currentPage.set($currentPage + 1);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LoadMore> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ currentPage, loadMore, $currentPage });
    	return [loadMore];
    }

    class LoadMore extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LoadMore",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/filters/FiltersToggle.svelte generated by Svelte v3.59.2 */

    const file$4 = "src/filters/FiltersToggle.svelte";

    function create_fragment$4(ctx) {
    	let button;
    	let div9;
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div5;
    	let div3;
    	let t2;
    	let div4;
    	let t3;
    	let div8;
    	let div6;
    	let t4;
    	let div7;
    	let t5;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			div9 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div5 = element("div");
    			div3 = element("div");
    			t2 = space();
    			div4 = element("div");
    			t3 = space();
    			div8 = element("div");
    			div6 = element("div");
    			t4 = space();
    			div7 = element("div");
    			t5 = text("\n    Filters");
    			attr_dev(div0, "class", "filter-line-black svelte-19xd8jc");
    			add_location(div0, file$4, 10, 12, 227);
    			attr_dev(div1, "class", "filter-line-red svelte-19xd8jc");
    			add_location(div1, file$4, 11, 12, 273);
    			attr_dev(div2, "class", "filter-line line-one svelte-19xd8jc");
    			add_location(div2, file$4, 9, 8, 180);
    			attr_dev(div3, "class", "filter-line-black svelte-19xd8jc");
    			add_location(div3, file$4, 14, 12, 375);
    			attr_dev(div4, "class", "filter-line-red svelte-19xd8jc");
    			add_location(div4, file$4, 15, 12, 421);
    			attr_dev(div5, "class", "filter-line line-two svelte-19xd8jc");
    			add_location(div5, file$4, 13, 8, 328);
    			attr_dev(div6, "class", "filter-line-black svelte-19xd8jc");
    			add_location(div6, file$4, 18, 12, 525);
    			attr_dev(div7, "class", "filter-line-red svelte-19xd8jc");
    			add_location(div7, file$4, 19, 12, 571);
    			attr_dev(div8, "class", "filter-line line-three svelte-19xd8jc");
    			add_location(div8, file$4, 17, 8, 476);
    			attr_dev(div9, "class", "filters-icon svelte-19xd8jc");
    			add_location(div9, file$4, 8, 4, 145);
    			attr_dev(button, "class", "filters-heading-open svelte-19xd8jc");
    			add_location(button, file$4, 4, 0, 48);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, div9);
    			append_dev(div9, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div9, t1);
    			append_dev(div9, div5);
    			append_dev(div5, div3);
    			append_dev(div5, t2);
    			append_dev(div5, div4);
    			append_dev(div9, t3);
    			append_dev(div9, div8);
    			append_dev(div8, div6);
    			append_dev(div8, t4);
    			append_dev(div8, div7);
    			append_dev(button, t5);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[1], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FiltersToggle', slots, []);
    	let { filtersOpen } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (filtersOpen === undefined && !('filtersOpen' in $$props || $$self.$$.bound[$$self.$$.props['filtersOpen']])) {
    			console.warn("<FiltersToggle> was created without expected prop 'filtersOpen'");
    		}
    	});

    	const writable_props = ['filtersOpen'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FiltersToggle> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(0, filtersOpen = !filtersOpen);
    	};

    	$$self.$$set = $$props => {
    		if ('filtersOpen' in $$props) $$invalidate(0, filtersOpen = $$props.filtersOpen);
    	};

    	$$self.$capture_state = () => ({ filtersOpen });

    	$$self.$inject_state = $$props => {
    		if ('filtersOpen' in $$props) $$invalidate(0, filtersOpen = $$props.filtersOpen);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [filtersOpen, click_handler];
    }

    class FiltersToggle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { filtersOpen: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FiltersToggle",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get filtersOpen() {
    		throw new Error("<FiltersToggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filtersOpen(value) {
    		throw new Error("<FiltersToggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/card-grid/DownloadSvg.svelte generated by Svelte v3.59.2 */

    const file$3 = "src/card-grid/DownloadSvg.svelte";

    function create_fragment$3(ctx) {
    	let svg;
    	let g1;
    	let g0;
    	let rect0;
    	let rect1;
    	let rect2;
    	let rect3;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			rect0 = svg_element("rect");
    			rect1 = svg_element("rect");
    			rect2 = svg_element("rect");
    			rect3 = svg_element("rect");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(rect0, "width", "24");
    			attr_dev(rect0, "height", "24");
    			attr_dev(rect0, "opacity", "0");
    			attr_dev(rect0, "class", "svelte-9wn03n");
    			add_location(rect0, file$3, 3, 12, 156);
    			attr_dev(rect1, "x", "4");
    			attr_dev(rect1, "y", "18");
    			attr_dev(rect1, "width", "16");
    			attr_dev(rect1, "height", "2");
    			attr_dev(rect1, "rx", "1");
    			attr_dev(rect1, "ry", "1");
    			attr_dev(rect1, "class", "svelte-9wn03n");
    			add_location(rect1, file$3, 4, 12, 212);
    			attr_dev(rect2, "x", "3");
    			attr_dev(rect2, "y", "17");
    			attr_dev(rect2, "width", "4");
    			attr_dev(rect2, "height", "2");
    			attr_dev(rect2, "rx", "1");
    			attr_dev(rect2, "ry", "1");
    			attr_dev(rect2, "transform", "rotate(-90 5 18)");
    			attr_dev(rect2, "class", "svelte-9wn03n");
    			add_location(rect2, file$3, 5, 12, 282);
    			attr_dev(rect3, "x", "17");
    			attr_dev(rect3, "y", "17");
    			attr_dev(rect3, "width", "4");
    			attr_dev(rect3, "height", "2");
    			attr_dev(rect3, "rx", "1");
    			attr_dev(rect3, "ry", "1");
    			attr_dev(rect3, "transform", "rotate(-90 19 18)");
    			attr_dev(rect3, "class", "svelte-9wn03n");
    			add_location(rect3, file$3, 14, 12, 504);
    			attr_dev(path0, "d", "M12 15a1 1 0 0 1-.58-.18l-4-2.82a1 1 0 0 1-.24-1.39 1 1 0 0 1 1.4-.24L12 12.76l3.4-2.56a1 1 0 0 1 1.2 1.6l-4 3a1 1 0 0 1-.6.2z");
    			attr_dev(path0, "class", "svelte-9wn03n");
    			add_location(path0, file$3, 23, 12, 728);
    			attr_dev(path1, "d", "M12 13a1 1 0 0 1-1-1V4a1 1 0 0 1 2 0v8a1 1 0 0 1-1 1z");
    			attr_dev(path1, "class", "svelte-9wn03n");
    			add_location(path1, file$3, 26, 12, 908);
    			attr_dev(g0, "data-name", "download");
    			attr_dev(g0, "class", "svelte-9wn03n");
    			add_location(g0, file$3, 2, 8, 119);
    			attr_dev(g1, "data-name", "Layer 2");
    			attr_dev(g1, "class", "svelte-9wn03n");
    			add_location(g1, file$3, 1, 4, 87);
    			attr_dev(svg, "class", "download-icon svelte-9wn03n");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			add_location(svg, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, rect0);
    			append_dev(g0, rect1);
    			append_dev(g0, rect2);
    			append_dev(g0, rect3);
    			append_dev(g0, path0);
    			append_dev(g0, path1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DownloadSvg', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DownloadSvg> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class DownloadSvg extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DownloadSvg",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/card-grid/Card.svelte generated by Svelte v3.59.2 */
    const file$2 = "src/card-grid/Card.svelte";

    // (37:16) {:else}
    function create_else_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "download-card-image svelte-1ka4hl");
    			add_location(div, file$2, 37, 20, 1024);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(37:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (31:16) {#if imageUrl != ""}
    function create_if_block$1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "download-card-image svelte-1ka4hl");
    			if (!src_url_equal(img.src, img_src_value = /*imageUrl*/ ctx[1])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*imageAlt*/ ctx[2]);
    			add_location(img, file$2, 31, 20, 822);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*imageUrl*/ 2 && !src_url_equal(img.src, img_src_value = /*imageUrl*/ ctx[1])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*imageAlt*/ 4) {
    				attr_dev(img, "alt", /*imageAlt*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(31:16) {#if imageUrl != \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let li;
    	let a;
    	let div6;
    	let div0;
    	let t0;
    	let div5;
    	let div4;
    	let h50;
    	let t1;
    	let t2;
    	let div3;
    	let div1;
    	let t3_value = /*date*/ ctx[4].toLocaleDateString("en-GB").replaceAll("/", ".") + "";
    	let t3;
    	let t4;
    	let div2;
    	let svg0;
    	let g1;
    	let g0;
    	let rect0;
    	let path0;
    	let t5;
    	let t6;
    	let t7;
    	let downloadicon0;
    	let t8;
    	let div13;
    	let div7;
    	let svg1;
    	let g3;
    	let g2;
    	let rect1;
    	let path1;
    	let t9;
    	let t10;
    	let div12;
    	let div11;
    	let h51;
    	let t11;
    	let t12;
    	let div10;
    	let div8;
    	let t13_value = /*date*/ ctx[4].toLocaleDateString("en-GB").replaceAll("/", ".") + "";
    	let t13;
    	let t14;
    	let div9;
    	let svg2;
    	let g5;
    	let g4;
    	let rect2;
    	let path2;
    	let t15;
    	let t16;
    	let t17;
    	let downloadicon1;
    	let li_class_value;
    	let current;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*imageUrl*/ ctx[1] != "") return create_if_block$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);
    	downloadicon0 = new DownloadSvg({ $$inline: true });
    	downloadicon1 = new DownloadSvg({ $$inline: true });

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			div6 = element("div");
    			div0 = element("div");
    			if_block.c();
    			t0 = space();
    			div5 = element("div");
    			div4 = element("div");
    			h50 = element("h5");
    			t1 = text(/*title*/ ctx[3]);
    			t2 = space();
    			div3 = element("div");
    			div1 = element("div");
    			t3 = text(t3_value);
    			t4 = space();
    			div2 = element("div");
    			svg0 = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			rect0 = svg_element("rect");
    			path0 = svg_element("path");
    			t5 = space();
    			t6 = text(/*fileType*/ ctx[6]);
    			t7 = space();
    			create_component(downloadicon0.$$.fragment);
    			t8 = space();
    			div13 = element("div");
    			div7 = element("div");
    			svg1 = svg_element("svg");
    			g3 = svg_element("g");
    			g2 = svg_element("g");
    			rect1 = svg_element("rect");
    			path1 = svg_element("path");
    			t9 = text("\n           Download Started");
    			t10 = space();
    			div12 = element("div");
    			div11 = element("div");
    			h51 = element("h5");
    			t11 = text(/*title*/ ctx[3]);
    			t12 = space();
    			div10 = element("div");
    			div8 = element("div");
    			t13 = text(t13_value);
    			t14 = space();
    			div9 = element("div");
    			svg2 = svg_element("svg");
    			g5 = svg_element("g");
    			g4 = svg_element("g");
    			rect2 = svg_element("rect");
    			path2 = svg_element("path");
    			t15 = space();
    			t16 = text(/*fileType*/ ctx[6]);
    			t17 = space();
    			create_component(downloadicon1.$$.fragment);
    			attr_dev(div0, "class", "download-card-image-container svelte-1ka4hl");
    			add_location(div0, file$2, 29, 12, 721);
    			attr_dev(h50, "class", "svelte-1ka4hl");
    			add_location(h50, file$2, 42, 20, 1225);
    			attr_dev(div1, "class", "svelte-1ka4hl");
    			add_location(div1, file$2, 44, 24, 1324);
    			attr_dev(rect0, "width", "24");
    			attr_dev(rect0, "height", "24");
    			attr_dev(rect0, "opacity", "0");
    			attr_dev(rect0, "class", "svelte-1ka4hl");
    			add_location(rect0, file$2, 55, 41, 1852);
    			attr_dev(path0, "d", "M19.74 7.33l-4.44-5a1 1 0 0 0-.74-.33h-8A2.53 2.53 0 0 0 4 4.5v15A2.53 2.53 0 0 0 6.56 22h10.88A2.53 2.53 0 0 0 20 19.5V8a1 1 0 0 0-.26-.67zM9 12h3a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2zm6 6H9a1 1 0 0 1 0-2h6a1 1 0 0 1 0 2zm-.29-10a.79.79 0 0 1-.71-.85V4l3.74 4z");
    			attr_dev(path0, "class", "svelte-1ka4hl");
    			add_location(path0, file$2, 59, 42, 2067);
    			attr_dev(g0, "data-name", "file-text");
    			attr_dev(g0, "class", "svelte-1ka4hl");
    			add_location(g0, file$2, 54, 37, 1786);
    			attr_dev(g1, "data-name", "Layer 2");
    			attr_dev(g1, "class", "svelte-1ka4hl");
    			add_location(g1, file$2, 53, 33, 1726);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "class", "svelte-1ka4hl");
    			add_location(svg0, file$2, 50, 28, 1569);
    			attr_dev(div2, "class", "svelte-1ka4hl");
    			add_location(div2, file$2, 49, 24, 1535);
    			attr_dev(div3, "class", "download-info-container svelte-1ka4hl");
    			add_location(div3, file$2, 43, 20, 1262);
    			attr_dev(div4, "class", "download-card-text svelte-1ka4hl");
    			add_location(div4, file$2, 41, 16, 1172);
    			attr_dev(div5, "class", "download-card-text-container svelte-1ka4hl");
    			add_location(div5, file$2, 40, 12, 1113);
    			attr_dev(div6, "class", "download-card svelte-1ka4hl");
    			add_location(div6, file$2, 28, 8, 681);
    			attr_dev(a, "class", "download-card-desktop svelte-1ka4hl");
    			attr_dev(a, "href", /*fileUrl*/ ctx[0]);
    			attr_dev(a, "download", "");
    			add_location(a, file$2, 22, 4, 554);
    			attr_dev(rect1, "width", "24");
    			attr_dev(rect1, "height", "24");
    			attr_dev(rect1, "opacity", "0");
    			attr_dev(rect1, "class", "svelte-1ka4hl");
    			add_location(rect1, file$2, 75, 119, 2934);
    			attr_dev(path1, "d", "M9.86 18a1 1 0 0 1-.73-.32l-4.86-5.17a1 1 0 1 1 1.46-1.37l4.12 4.39 8.41-9.2a1 1 0 1 1 1.48 1.34l-9.14 10a1 1 0 0 1-.73.33z");
    			attr_dev(path1, "class", "svelte-1ka4hl");
    			add_location(path1, file$2, 75, 161, 2976);
    			attr_dev(g2, "data-name", "checkmark");
    			attr_dev(g2, "class", "svelte-1ka4hl");
    			add_location(g2, file$2, 75, 94, 2909);
    			attr_dev(g3, "data-name", "Layer 2");
    			attr_dev(g3, "class", "svelte-1ka4hl");
    			add_location(g3, file$2, 75, 71, 2886);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "class", "svelte-1ka4hl");
    			add_location(svg1, file$2, 75, 11, 2826);
    			attr_dev(div7, "class", "download-card-image-container svelte-1ka4hl");
    			add_location(div7, file$2, 74, 8, 2771);
    			attr_dev(h51, "class", "svelte-1ka4hl");
    			add_location(h51, file$2, 81, 16, 3283);
    			attr_dev(div8, "class", "svelte-1ka4hl");
    			add_location(div8, file$2, 83, 20, 3374);
    			attr_dev(rect2, "width", "24");
    			attr_dev(rect2, "height", "24");
    			attr_dev(rect2, "opacity", "0");
    			attr_dev(rect2, "class", "svelte-1ka4hl");
    			add_location(rect2, file$2, 92, 37, 3800);
    			attr_dev(path2, "d", "M19.74 7.33l-4.44-5a1 1 0 0 0-.74-.33h-8A2.53 2.53 0 0 0 4 4.5v15A2.53 2.53 0 0 0 6.56 22h10.88A2.53 2.53 0 0 0 20 19.5V8a1 1 0 0 0-.26-.67zM9 12h3a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2zm6 6H9a1 1 0 0 1 0-2h6a1 1 0 0 1 0 2zm-.29-10a.79.79 0 0 1-.71-.85V4l3.74 4z");
    			attr_dev(path2, "class", "svelte-1ka4hl");
    			add_location(path2, file$2, 96, 38, 3999);
    			attr_dev(g4, "data-name", "file-text");
    			attr_dev(g4, "class", "svelte-1ka4hl");
    			add_location(g4, file$2, 91, 33, 3738);
    			attr_dev(g5, "data-name", "Layer 2");
    			attr_dev(g5, "class", "svelte-1ka4hl");
    			add_location(g5, file$2, 90, 29, 3682);
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "viewBox", "0 0 24 24");
    			attr_dev(svg2, "class", "svelte-1ka4hl");
    			add_location(svg2, file$2, 87, 24, 3537);
    			attr_dev(div9, "class", "svelte-1ka4hl");
    			add_location(div9, file$2, 86, 20, 3507);
    			attr_dev(div10, "class", "download-info-container svelte-1ka4hl");
    			add_location(div10, file$2, 82, 16, 3316);
    			attr_dev(div11, "class", "download-card-text svelte-1ka4hl");
    			add_location(div11, file$2, 80, 12, 3234);
    			attr_dev(div12, "class", "download-card-text-container svelte-1ka4hl");
    			add_location(div12, file$2, 79, 8, 3179);
    			attr_dev(div13, "class", "download-started svelte-1ka4hl");
    			add_location(div13, file$2, 73, 4, 2732);
    			attr_dev(li, "class", li_class_value = "download-card-container " + (/*downloaded*/ ctx[5] ? 'downloaded' : '') + " svelte-1ka4hl");
    			add_location(li, file$2, 21, 0, 480);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, div6);
    			append_dev(div6, div0);
    			if_block.m(div0, null);
    			append_dev(div6, t0);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, h50);
    			append_dev(h50, t1);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    			append_dev(div3, div1);
    			append_dev(div1, t3);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, svg0);
    			append_dev(svg0, g1);
    			append_dev(g1, g0);
    			append_dev(g0, rect0);
    			append_dev(g0, path0);
    			append_dev(div2, t5);
    			append_dev(div2, t6);
    			append_dev(div5, t7);
    			mount_component(downloadicon0, div5, null);
    			append_dev(li, t8);
    			append_dev(li, div13);
    			append_dev(div13, div7);
    			append_dev(div7, svg1);
    			append_dev(svg1, g3);
    			append_dev(g3, g2);
    			append_dev(g2, rect1);
    			append_dev(g2, path1);
    			append_dev(div7, t9);
    			append_dev(div13, t10);
    			append_dev(div13, div12);
    			append_dev(div12, div11);
    			append_dev(div11, h51);
    			append_dev(h51, t11);
    			append_dev(div11, t12);
    			append_dev(div11, div10);
    			append_dev(div10, div8);
    			append_dev(div8, t13);
    			append_dev(div10, t14);
    			append_dev(div10, div9);
    			append_dev(div9, svg2);
    			append_dev(svg2, g5);
    			append_dev(g5, g4);
    			append_dev(g4, rect2);
    			append_dev(g4, path2);
    			append_dev(div9, t15);
    			append_dev(div9, t16);
    			append_dev(div12, t17);
    			mount_component(downloadicon1, div12, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*downloadFile*/ ctx[7], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			}

    			if (!current || dirty & /*title*/ 8) set_data_dev(t1, /*title*/ ctx[3]);
    			if ((!current || dirty & /*date*/ 16) && t3_value !== (t3_value = /*date*/ ctx[4].toLocaleDateString("en-GB").replaceAll("/", ".") + "")) set_data_dev(t3, t3_value);

    			if (!current || dirty & /*fileUrl*/ 1) {
    				attr_dev(a, "href", /*fileUrl*/ ctx[0]);
    			}

    			if (!current || dirty & /*title*/ 8) set_data_dev(t11, /*title*/ ctx[3]);
    			if ((!current || dirty & /*date*/ 16) && t13_value !== (t13_value = /*date*/ ctx[4].toLocaleDateString("en-GB").replaceAll("/", ".") + "")) set_data_dev(t13, t13_value);

    			if (!current || dirty & /*downloaded*/ 32 && li_class_value !== (li_class_value = "download-card-container " + (/*downloaded*/ ctx[5] ? 'downloaded' : '') + " svelte-1ka4hl")) {
    				attr_dev(li, "class", li_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(downloadicon0.$$.fragment, local);
    			transition_in(downloadicon1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(downloadicon0.$$.fragment, local);
    			transition_out(downloadicon1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if_block.d();
    			destroy_component(downloadicon0);
    			destroy_component(downloadicon1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, []);
    	let { fileUrl } = $$props;
    	let { imageUrl = "" } = $$props;
    	let { imageAlt = "" } = $$props;
    	let { title } = $$props;
    	let { date } = $$props;
    	let fileType = fileUrl.split(/[#?]/)[0].split('.').pop().trim().toUpperCase();
    	let downloaded = false;

    	function downloadFile(e) {
    		if (downloaded === false) {
    			$$invalidate(5, downloaded = true);
    			return;
    		}

    		e.preventDefault();
    	}

    	$$self.$$.on_mount.push(function () {
    		if (fileUrl === undefined && !('fileUrl' in $$props || $$self.$$.bound[$$self.$$.props['fileUrl']])) {
    			console.warn("<Card> was created without expected prop 'fileUrl'");
    		}

    		if (title === undefined && !('title' in $$props || $$self.$$.bound[$$self.$$.props['title']])) {
    			console.warn("<Card> was created without expected prop 'title'");
    		}

    		if (date === undefined && !('date' in $$props || $$self.$$.bound[$$self.$$.props['date']])) {
    			console.warn("<Card> was created without expected prop 'date'");
    		}
    	});

    	const writable_props = ['fileUrl', 'imageUrl', 'imageAlt', 'title', 'date'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('fileUrl' in $$props) $$invalidate(0, fileUrl = $$props.fileUrl);
    		if ('imageUrl' in $$props) $$invalidate(1, imageUrl = $$props.imageUrl);
    		if ('imageAlt' in $$props) $$invalidate(2, imageAlt = $$props.imageAlt);
    		if ('title' in $$props) $$invalidate(3, title = $$props.title);
    		if ('date' in $$props) $$invalidate(4, date = $$props.date);
    	};

    	$$self.$capture_state = () => ({
    		fileUrl,
    		imageUrl,
    		imageAlt,
    		title,
    		date,
    		fileType,
    		DownloadIcon: DownloadSvg,
    		downloaded,
    		downloadFile
    	});

    	$$self.$inject_state = $$props => {
    		if ('fileUrl' in $$props) $$invalidate(0, fileUrl = $$props.fileUrl);
    		if ('imageUrl' in $$props) $$invalidate(1, imageUrl = $$props.imageUrl);
    		if ('imageAlt' in $$props) $$invalidate(2, imageAlt = $$props.imageAlt);
    		if ('title' in $$props) $$invalidate(3, title = $$props.title);
    		if ('date' in $$props) $$invalidate(4, date = $$props.date);
    		if ('fileType' in $$props) $$invalidate(6, fileType = $$props.fileType);
    		if ('downloaded' in $$props) $$invalidate(5, downloaded = $$props.downloaded);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [fileUrl, imageUrl, imageAlt, title, date, downloaded, fileType, downloadFile];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			fileUrl: 0,
    			imageUrl: 1,
    			imageAlt: 2,
    			title: 3,
    			date: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get fileUrl() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fileUrl(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imageUrl() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imageUrl(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imageAlt() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imageAlt(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get date() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set date(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/card-grid/Grid.svelte generated by Svelte v3.59.2 */
    const file$1 = "src/card-grid/Grid.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (10:8) {#each currentPageItems as item}
    function create_each_block(ctx) {
    	let card;
    	let current;
    	const card_spread_levels = [/*item*/ ctx[1]];
    	let card_props = {};

    	for (let i = 0; i < card_spread_levels.length; i += 1) {
    		card_props = assign(card_props, card_spread_levels[i]);
    	}

    	card = new Card({ props: card_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = (dirty & /*currentPageItems*/ 1)
    			? get_spread_update(card_spread_levels, [get_spread_object(/*item*/ ctx[1])])
    			: {};

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(10:8) {#each currentPageItems as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let ul;
    	let current;
    	let each_value = /*currentPageItems*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "download-archive-grid mobile-two-column svelte-1me9xlv");
    			add_location(ul, file$1, 8, 4, 152);
    			attr_dev(div, "class", "download-archive-grid-container svelte-1me9xlv");
    			add_location(div, file$1, 7, 0, 102);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*currentPageItems*/ 1) {
    				each_value = /*currentPageItems*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Grid', slots, []);
    	let { currentPageItems = [] } = $$props;
    	const writable_props = ['currentPageItems'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Grid> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('currentPageItems' in $$props) $$invalidate(0, currentPageItems = $$props.currentPageItems);
    	};

    	$$self.$capture_state = () => ({ currentPageItems, Card });

    	$$self.$inject_state = $$props => {
    		if ('currentPageItems' in $$props) $$invalidate(0, currentPageItems = $$props.currentPageItems);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [currentPageItems];
    }

    class Grid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { currentPageItems: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Grid",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get currentPageItems() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentPageItems(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.59.2 */

    const { console: console_1 } = globals;
    const file = "src/App.svelte";

    // (91:4) {#if filtersOpen}
    function create_if_block_1(ctx) {
    	let filters;
    	let updating_categories;
    	let updating_fileTypes;
    	let current;

    	function filters_categories_binding(value) {
    		/*filters_categories_binding*/ ctx[10](value);
    	}

    	function filters_fileTypes_binding(value) {
    		/*filters_fileTypes_binding*/ ctx[11](value);
    	}

    	let filters_props = { postsPerPage: /*postsPerPage*/ ctx[0] };

    	if (/*$allCategories*/ ctx[6] !== void 0) {
    		filters_props.categories = /*$allCategories*/ ctx[6];
    	}

    	if (/*$allFileTypes*/ ctx[5] !== void 0) {
    		filters_props.fileTypes = /*$allFileTypes*/ ctx[5];
    	}

    	filters = new Filters({ props: filters_props, $$inline: true });
    	binding_callbacks.push(() => bind(filters, 'categories', filters_categories_binding));
    	binding_callbacks.push(() => bind(filters, 'fileTypes', filters_fileTypes_binding));

    	const block = {
    		c: function create() {
    			create_component(filters.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(filters, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const filters_changes = {};
    			if (dirty & /*postsPerPage*/ 1) filters_changes.postsPerPage = /*postsPerPage*/ ctx[0];

    			if (!updating_categories && dirty & /*$allCategories*/ 64) {
    				updating_categories = true;
    				filters_changes.categories = /*$allCategories*/ ctx[6];
    				add_flush_callback(() => updating_categories = false);
    			}

    			if (!updating_fileTypes && dirty & /*$allFileTypes*/ 32) {
    				updating_fileTypes = true;
    				filters_changes.fileTypes = /*$allFileTypes*/ ctx[5];
    				add_flush_callback(() => updating_fileTypes = false);
    			}

    			filters.$set(filters_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filters.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filters.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(filters, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(91:4) {#if filtersOpen}",
    		ctx
    	});

    	return block;
    }

    // (96:8) {#if totalPages > 1}
    function create_if_block(ctx) {
    	let pagination;
    	let updating_transition;
    	let current;

    	function pagination_transition_binding(value) {
    		/*pagination_transition_binding*/ ctx[12](value);
    	}

    	let pagination_props = { totalPages: /*totalPages*/ ctx[4] };

    	if (/*transition*/ ctx[1] !== void 0) {
    		pagination_props.transition = /*transition*/ ctx[1];
    	}

    	pagination = new Pagination({ props: pagination_props, $$inline: true });
    	binding_callbacks.push(() => bind(pagination, 'transition', pagination_transition_binding));

    	const block = {
    		c: function create() {
    			create_component(pagination.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pagination, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const pagination_changes = {};
    			if (dirty & /*totalPages*/ 16) pagination_changes.totalPages = /*totalPages*/ ctx[4];

    			if (!updating_transition && dirty & /*transition*/ 2) {
    				updating_transition = true;
    				pagination_changes.transition = /*transition*/ ctx[1];
    				add_flush_callback(() => updating_transition = false);
    			}

    			pagination.$set(pagination_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pagination.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pagination.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pagination, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(96:8) {#if totalPages > 1}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let section;
    	let filterstoggle;
    	let updating_filtersOpen;
    	let t0;
    	let t1;
    	let grid;
    	let t2;
    	let div;
    	let t3;
    	let loadmore;
    	let section_class_value;
    	let current;

    	function filterstoggle_filtersOpen_binding(value) {
    		/*filterstoggle_filtersOpen_binding*/ ctx[9](value);
    	}

    	let filterstoggle_props = {};

    	if (/*filtersOpen*/ ctx[2] !== void 0) {
    		filterstoggle_props.filtersOpen = /*filtersOpen*/ ctx[2];
    	}

    	filterstoggle = new FiltersToggle({
    			props: filterstoggle_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(filterstoggle, 'filtersOpen', filterstoggle_filtersOpen_binding));
    	let if_block0 = /*filtersOpen*/ ctx[2] && create_if_block_1(ctx);

    	grid = new Grid({
    			props: {
    				currentPageItems: /*currentPageItems*/ ctx[3]
    			},
    			$$inline: true
    		});

    	let if_block1 = /*totalPages*/ ctx[4] > 1 && create_if_block(ctx);
    	loadmore = new LoadMore({ $$inline: true });

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(filterstoggle.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			create_component(grid.$$.fragment);
    			t2 = space();
    			div = element("div");
    			if (if_block1) if_block1.c();
    			t3 = space();
    			create_component(loadmore.$$.fragment);
    			attr_dev(div, "class", "pagination-container");
    			add_location(div, file, 94, 4, 3407);
    			attr_dev(section, "class", section_class_value = "download-archive " + (/*filtersOpen*/ ctx[2] ? 'filters-open' : '') + " svelte-qhiq8p");
    			add_location(section, file, 88, 0, 3130);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(filterstoggle, section, null);
    			append_dev(section, t0);
    			if (if_block0) if_block0.m(section, null);
    			append_dev(section, t1);
    			mount_component(grid, section, null);
    			append_dev(section, t2);
    			append_dev(section, div);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t3);
    			mount_component(loadmore, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const filterstoggle_changes = {};

    			if (!updating_filtersOpen && dirty & /*filtersOpen*/ 4) {
    				updating_filtersOpen = true;
    				filterstoggle_changes.filtersOpen = /*filtersOpen*/ ctx[2];
    				add_flush_callback(() => updating_filtersOpen = false);
    			}

    			filterstoggle.$set(filterstoggle_changes);

    			if (/*filtersOpen*/ ctx[2]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*filtersOpen*/ 4) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(section, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const grid_changes = {};
    			if (dirty & /*currentPageItems*/ 8) grid_changes.currentPageItems = /*currentPageItems*/ ctx[3];
    			grid.$set(grid_changes);

    			if (/*totalPages*/ ctx[4] > 1) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*totalPages*/ 16) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, t3);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*filtersOpen*/ 4 && section_class_value !== (section_class_value = "download-archive " + (/*filtersOpen*/ ctx[2] ? 'filters-open' : '') + " svelte-qhiq8p")) {
    				attr_dev(section, "class", section_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filterstoggle.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(grid.$$.fragment, local);
    			transition_in(if_block1);
    			transition_in(loadmore.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filterstoggle.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(grid.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(loadmore.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(filterstoggle);
    			if (if_block0) if_block0.d();
    			destroy_component(grid);
    			if (if_block1) if_block1.d();
    			destroy_component(loadmore);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let totalPages;
    	let $itemsDividedIntoPages;
    	let $currentPage;
    	let $allFileTypes;
    	let $allCategories;
    	let $allItems;
    	validate_store(itemsDividedIntoPages, 'itemsDividedIntoPages');
    	component_subscribe($$self, itemsDividedIntoPages, $$value => $$invalidate(8, $itemsDividedIntoPages = $$value));
    	validate_store(currentPage, 'currentPage');
    	component_subscribe($$self, currentPage, $$value => $$invalidate(13, $currentPage = $$value));
    	validate_store(allFileTypes, 'allFileTypes');
    	component_subscribe($$self, allFileTypes, $$value => $$invalidate(5, $allFileTypes = $$value));
    	validate_store(allCategories, 'allCategories');
    	component_subscribe($$self, allCategories, $$value => $$invalidate(6, $allCategories = $$value));
    	validate_store(allItems, 'allItems');
    	component_subscribe($$self, allItems, $$value => $$invalidate(14, $allItems = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { postsPerPage } = $$props;
    	let { paginationType = 2 } = $$props;
    	let transition = false;
    	let filtersOpen = false;

    	onMount(async () => {
    		let items = [];
    		let data = await getData(query);
    		const urlParams = new URLSearchParams(window.location.search);
    		currentPage.set(parseInt(urlParams.get("pagination")) || 1);

    		data.data.downloads.edges.forEach(download => {
    			let date = new Date(Date.parse(download?.node?.downloadFields?.fileDownload?.dateGmt));

    			let downloadObject = {
    				title: download.node.title,
    				imageUrl: download?.node?.featuredImage?.node?.sourceUrl,
    				imageAlt: download?.node?.featuredImage?.node?.altText,
    				fileUrl: download?.node?.downloadFields?.fileDownload?.mediaItemUrl,
    				date,
    				fileType: download?.node?.downloadFields?.fileDownload?.mediaItemUrl?.split(/[#?]/)[0].split('.').pop().trim(),
    				categories: download?.node?.downloadCategories?.nodes,
    				downloadType: download?.node?.downloadTypes?.nodes
    			};

    			items.push(downloadObject);
    		});

    		allItems.set(items);
    		console.log($allItems);

    		$allItems.forEach(item => {
    			item.categories.forEach(category => {
    				$allCategories.add({ name: category.name, id: category.id });
    			});

    			$allFileTypes.add({
    				name: item.fileUrl.split(/[#?]/)[0].split('.').pop().trim().toUpperCase(),
    				id: item.fileUrl.split(/[#?]/)[0].split('.').pop().trim()
    			});
    		});

    		console.log($allFileTypes);
    	});

    	allItems.subscribe(value => {
    		itemsDividedIntoPages.set(divideItemsIntoPages(postsPerPage, value, currentPage, new Set()));
    	});

    	let currentPageItems;

    	itemsDividedIntoPages.subscribe(value => {
    		$$invalidate(3, currentPageItems = value[$currentPage - 1]);
    	});

    	currentPage.subscribe(value => {
    		if (paginationType === 1) {
    			$$invalidate(3, currentPageItems = $itemsDividedIntoPages[value - 1] || []);
    		}

    		if (paginationType === 2) {
    			let itemsToDisplay = [];

    			for (let i = 0; i < value && i < totalPages; i++) {
    				itemsToDisplay.push(...$itemsDividedIntoPages[i]);
    			}

    			$$invalidate(3, currentPageItems = itemsToDisplay);
    		}
    	});

    	$$self.$$.on_mount.push(function () {
    		if (postsPerPage === undefined && !('postsPerPage' in $$props || $$self.$$.bound[$$self.$$.props['postsPerPage']])) {
    			console_1.warn("<App> was created without expected prop 'postsPerPage'");
    		}
    	});

    	const writable_props = ['postsPerPage', 'paginationType'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function filterstoggle_filtersOpen_binding(value) {
    		filtersOpen = value;
    		$$invalidate(2, filtersOpen);
    	}

    	function filters_categories_binding(value) {
    		$allCategories = value;
    		allCategories.set($allCategories);
    	}

    	function filters_fileTypes_binding(value) {
    		$allFileTypes = value;
    		allFileTypes.set($allFileTypes);
    	}

    	function pagination_transition_binding(value) {
    		transition = value;
    		$$invalidate(1, transition);
    	}

    	$$self.$$set = $$props => {
    		if ('postsPerPage' in $$props) $$invalidate(0, postsPerPage = $$props.postsPerPage);
    		if ('paginationType' in $$props) $$invalidate(7, paginationType = $$props.paginationType);
    	};

    	$$self.$capture_state = () => ({
    		Pagination,
    		Filters,
    		LoadMore,
    		FiltersToggle,
    		Grid,
    		getData,
    		divideItemsIntoPages,
    		itemsDividedIntoPages,
    		query,
    		allItems,
    		currentPage,
    		allCategories,
    		allFileTypes,
    		allDownloadTypes,
    		onMount,
    		postsPerPage,
    		paginationType,
    		transition,
    		filtersOpen,
    		currentPageItems,
    		totalPages,
    		$itemsDividedIntoPages,
    		$currentPage,
    		$allFileTypes,
    		$allCategories,
    		$allItems
    	});

    	$$self.$inject_state = $$props => {
    		if ('postsPerPage' in $$props) $$invalidate(0, postsPerPage = $$props.postsPerPage);
    		if ('paginationType' in $$props) $$invalidate(7, paginationType = $$props.paginationType);
    		if ('transition' in $$props) $$invalidate(1, transition = $$props.transition);
    		if ('filtersOpen' in $$props) $$invalidate(2, filtersOpen = $$props.filtersOpen);
    		if ('currentPageItems' in $$props) $$invalidate(3, currentPageItems = $$props.currentPageItems);
    		if ('totalPages' in $$props) $$invalidate(4, totalPages = $$props.totalPages);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$itemsDividedIntoPages*/ 256) {
    			$$invalidate(4, totalPages = $itemsDividedIntoPages.length);
    		}
    	};

    	return [
    		postsPerPage,
    		transition,
    		filtersOpen,
    		currentPageItems,
    		totalPages,
    		$allFileTypes,
    		$allCategories,
    		paginationType,
    		$itemsDividedIntoPages,
    		filterstoggle_filtersOpen_binding,
    		filters_categories_binding,
    		filters_fileTypes_binding,
    		pagination_transition_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { postsPerPage: 0, paginationType: 7 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get postsPerPage() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set postsPerPage(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get paginationType() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set paginationType(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    return App;

}));
//# sourceMappingURL=download-archive.js.map
