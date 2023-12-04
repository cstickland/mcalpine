
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ProductHero = factory());
})(this, (function () { 'use strict';

    function noop() { }
    const identity = x => x;
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
    function create_in_transition(node, fn, params) {
        const options = { direction: 'in' };
        let config = fn(node, params, options);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config(options);
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
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

    const activeSku = writable(0);
    const product = writable({});
    const display = writable(true);

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }
    function quadInOut(t) {
        t /= 0.5;
        if (t < 1)
            return 0.5 * t * t;
        t--;
        return -0.5 * (t * (t - 2) - 1);
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
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
    function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const sd = 1 - start;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `
			transform: ${transform} scale(${1 - (sd * u)});
			opacity: ${target_opacity - (od * u)}
		`
        };
    }

    /* src/ActiveSkuDetails.svelte generated by Svelte v3.59.2 */
    const file$6 = "src/ActiveSkuDetails.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (9:4) {#if $product?.skus && $product?.skus.length > 0}
    function create_if_block$3(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$display*/ ctx[1] && create_if_block_1$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*$display*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$display*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(9:4) {#if $product?.skus && $product?.skus.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (10:4) {#if $display}
    function create_if_block_1$3(ctx) {
    	let div;
    	let raw_value = /*$product*/ ctx[0]?.skus[/*$activeSku*/ ctx[2]]?.product_description + "";
    	let div_transition;
    	let t;
    	let ul;
    	let ul_transition;
    	let current;
    	let if_block = /*$product*/ ctx[0]?.skus[/*$activeSku*/ ctx[2]]?.product_features && create_if_block_2$3(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = space();
    			ul = element("ul");
    			if (if_block) if_block.c();
    			add_location(div, file$6, 10, 4, 307);
    			add_location(ul, file$6, 11, 4, 394);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			div.innerHTML = raw_value;
    			insert_dev(target, t, anchor);
    			insert_dev(target, ul, anchor);
    			if (if_block) if_block.m(ul, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$product, $activeSku*/ 5) && raw_value !== (raw_value = /*$product*/ ctx[0]?.skus[/*$activeSku*/ ctx[2]]?.product_description + "")) div.innerHTML = raw_value;
    			if (/*$product*/ ctx[0]?.skus[/*$activeSku*/ ctx[2]]?.product_features) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$3(ctx);
    					if_block.c();
    					if_block.m(ul, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!current) return;
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, true);
    				div_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!current) return;
    				if (!ul_transition) ul_transition = create_bidirectional_transition(ul, fade, {}, true);
    				ul_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, false);
    			div_transition.run(0);
    			if (!ul_transition) ul_transition = create_bidirectional_transition(ul, fade, {}, false);
    			ul_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_transition) div_transition.end();
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(ul);
    			if (if_block) if_block.d();
    			if (detaching && ul_transition) ul_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(10:4) {#if $display}",
    		ctx
    	});

    	return block;
    }

    // (13:8) {#if $product?.skus[$activeSku]?.product_features}
    function create_if_block_2$3(ctx) {
    	let each_1_anchor;
    	let each_value = /*$product*/ ctx[0]?.skus[/*$activeSku*/ ctx[2]]?.product_features;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$product, $activeSku*/ 5) {
    				each_value = /*$product*/ ctx[0]?.skus[/*$activeSku*/ ctx[2]]?.product_features;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(13:8) {#if $product?.skus[$activeSku]?.product_features}",
    		ctx
    	});

    	return block;
    }

    // (14:8) {#each $product?.skus[$activeSku]?.product_features as feature}
    function create_each_block$3(ctx) {
    	let li;
    	let t0_value = /*feature*/ ctx[3].feature + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			add_location(li, file$6, 14, 12, 558);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$product, $activeSku*/ 5 && t0_value !== (t0_value = /*feature*/ ctx[3].feature + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(14:8) {#each $product?.skus[$activeSku]?.product_features as feature}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let h1;
    	let raw_value = /*$product*/ ctx[0].title + "";
    	let t0;
    	let t1;
    	let a0;
    	let t3;
    	let a1;
    	let current;
    	let if_block = /*$product*/ ctx[0]?.skus && /*$product*/ ctx[0]?.skus.length > 0 && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			a0 = element("a");
    			a0.textContent = "WHERE TO BUY";
    			t3 = space();
    			a1 = element("a");
    			a1.textContent = "LEAVE A REVIEW";
    			attr_dev(h1, "class", "h3 product-title");
    			add_location(h1, file$6, 7, 4, 173);
    			attr_dev(a0, "href", "");
    			attr_dev(a0, "class", "btn btn-black");
    			add_location(a0, file$6, 22, 4, 679);
    			attr_dev(a1, "href", "");
    			attr_dev(a1, "class", "btn btn-black btn-outline");
    			add_location(a1, file$6, 23, 4, 733);
    			attr_dev(div, "class", "product-details-container");
    			add_location(div, file$6, 6, 0, 129);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			h1.innerHTML = raw_value;
    			append_dev(div, t0);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t1);
    			append_dev(div, a0);
    			append_dev(div, t3);
    			append_dev(div, a1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*$product*/ 1) && raw_value !== (raw_value = /*$product*/ ctx[0].title + "")) h1.innerHTML = raw_value;
    			if (/*$product*/ ctx[0]?.skus && /*$product*/ ctx[0]?.skus.length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$product*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, t1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
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
    	let $product;
    	let $display;
    	let $activeSku;
    	validate_store(product, 'product');
    	component_subscribe($$self, product, $$value => $$invalidate(0, $product = $$value));
    	validate_store(display, 'display');
    	component_subscribe($$self, display, $$value => $$invalidate(1, $display = $$value));
    	validate_store(activeSku, 'activeSku');
    	component_subscribe($$self, activeSku, $$value => $$invalidate(2, $activeSku = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ActiveSkuDetails', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ActiveSkuDetails> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		activeSku,
    		product,
    		display,
    		fade,
    		$product,
    		$display,
    		$activeSku
    	});

    	return [$product, $display, $activeSku];
    }

    class ActiveSkuDetails extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ActiveSkuDetails",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/ProductSkus.svelte generated by Svelte v3.59.2 */
    const file$5 = "src/ProductSkus.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (7:4) {#if  $product?.skus && $product?.skus.length > 0}
    function create_if_block$2(ctx) {
    	let ul;
    	let each_value = /*$product*/ ctx[0].skus;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(ul, file$5, 7, 8, 174);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$activeSku, activeSku, $product*/ 3) {
    				each_value = /*$product*/ ctx[0].skus;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(7:4) {#if  $product?.skus && $product?.skus.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (10:16) {#if i == 0}
    function create_if_block_2$2(ctx) {
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let t2_value = /*productSku*/ ctx[4].product_config_label + "";
    	let t2;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "Sku";
    			t1 = space();
    			div1 = element("div");
    			t2 = text(t2_value);
    			attr_dev(div0, "class", "title");
    			add_location(div0, file$5, 11, 24, 329);
    			attr_dev(div1, "class", "attribute-title");
    			add_location(div1, file$5, 12, 24, 382);
    			attr_dev(div2, "class", "sku-headers");
    			add_location(div2, file$5, 10, 20, 279);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$product*/ 1 && t2_value !== (t2_value = /*productSku*/ ctx[4].product_config_label + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(10:16) {#if i == 0}",
    		ctx
    	});

    	return block;
    }

    // (20:24) {#if i == 0}
    function create_if_block_1$2(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let img_alt_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*image*/ ctx[7].product_image)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*productSku*/ ctx[4].sku);
    			add_location(img, file$5, 21, 32, 844);
    			attr_dev(div, "class", "sku-image-container");
    			add_location(div, file$5, 20, 28, 778);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$product*/ 1 && !src_url_equal(img.src, img_src_value = /*image*/ ctx[7].product_image)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*$product*/ 1 && img_alt_value !== (img_alt_value = /*productSku*/ ctx[4].sku)) {
    				attr_dev(img, "alt", img_alt_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(20:24) {#if i == 0}",
    		ctx
    	});

    	return block;
    }

    // (19:20) {#each productSku.product_images as image, i}
    function create_each_block_1$1(ctx) {
    	let if_block_anchor;
    	let if_block = /*i*/ ctx[6] == 0 && create_if_block_1$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*i*/ ctx[6] == 0) if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(19:20) {#each productSku.product_images as image, i}",
    		ctx
    	});

    	return block;
    }

    // (9:12) {#each $product.skus as productSku, i}
    function create_each_block$2(ctx) {
    	let t0;
    	let li;
    	let t1;
    	let div0;
    	let t2_value = /*productSku*/ ctx[4].sku + "";
    	let t2;
    	let t3;
    	let div1;
    	let t4_value = /*productSku*/ ctx[4].product_config_attribute + "";
    	let t4;
    	let t5;
    	let li_class_value;
    	let mounted;
    	let dispose;
    	let if_block = /*i*/ ctx[6] == 0 && create_if_block_2$2(ctx);
    	let each_value_1 = /*productSku*/ ctx[4].product_images;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	function click_handler() {
    		return /*click_handler*/ ctx[3](/*i*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			li = element("li");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			div0 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			div1 = element("div");
    			t4 = text(t4_value);
    			t5 = space();
    			attr_dev(div0, "class", "sku-text");
    			add_location(div0, file$5, 25, 20, 1012);
    			add_location(div1, file$5, 26, 20, 1077);
    			attr_dev(li, "class", li_class_value = /*i*/ ctx[6] == /*$activeSku*/ ctx[1] ? 'active' : "");
    			add_location(li, file$5, 15, 16, 516);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, li, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(li, null);
    				}
    			}

    			append_dev(li, t1);
    			append_dev(li, div0);
    			append_dev(div0, t2);
    			append_dev(li, t3);
    			append_dev(li, div1);
    			append_dev(div1, t4);
    			append_dev(li, t5);

    			if (!mounted) {
    				dispose = [
    					listen_dev(li, "click", click_handler, false, false, false, false),
    					listen_dev(li, "keydown", /*keydown_handler*/ ctx[2], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (/*i*/ ctx[6] == 0) if_block.p(ctx, dirty);

    			if (dirty & /*$product*/ 1) {
    				each_value_1 = /*productSku*/ ctx[4].product_images;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(li, t1);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty & /*$product*/ 1 && t2_value !== (t2_value = /*productSku*/ ctx[4].sku + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*$product*/ 1 && t4_value !== (t4_value = /*productSku*/ ctx[4].product_config_attribute + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*$activeSku*/ 2 && li_class_value !== (li_class_value = /*i*/ ctx[6] == /*$activeSku*/ ctx[1] ? 'active' : "")) {
    				attr_dev(li, "class", li_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(li);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(9:12) {#each $product.skus as productSku, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let if_block = /*$product*/ ctx[0]?.skus && /*$product*/ ctx[0]?.skus.length > 0 && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "product-skus-container");
    			add_location(div, file$5, 5, 0, 74);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$product*/ ctx[0]?.skus && /*$product*/ ctx[0]?.skus.length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
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
    	let $product;
    	let $activeSku;
    	validate_store(product, 'product');
    	component_subscribe($$self, product, $$value => $$invalidate(0, $product = $$value));
    	validate_store(activeSku, 'activeSku');
    	component_subscribe($$self, activeSku, $$value => $$invalidate(1, $activeSku = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ProductSkus', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ProductSkus> was created with unknown prop '${key}'`);
    	});

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler = i => {
    		activeSku.set(i);
    	};

    	$$self.$capture_state = () => ({ product, activeSku, $product, $activeSku });
    	return [$product, $activeSku, keydown_handler, click_handler];
    }

    class ProductSkus extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProductSkus",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/DownloadSvg.svelte generated by Svelte v3.59.2 */

    const file$4 = "src/DownloadSvg.svelte";

    function create_fragment$4(ctx) {
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
    			add_location(rect0, file$4, 3, 12, 134);
    			attr_dev(rect1, "x", "4");
    			attr_dev(rect1, "y", "18");
    			attr_dev(rect1, "width", "16");
    			attr_dev(rect1, "height", "2");
    			attr_dev(rect1, "rx", "1");
    			attr_dev(rect1, "ry", "1");
    			add_location(rect1, file$4, 4, 12, 190);
    			attr_dev(rect2, "x", "3");
    			attr_dev(rect2, "y", "17");
    			attr_dev(rect2, "width", "4");
    			attr_dev(rect2, "height", "2");
    			attr_dev(rect2, "rx", "1");
    			attr_dev(rect2, "ry", "1");
    			attr_dev(rect2, "transform", "rotate(-90 5 18)");
    			add_location(rect2, file$4, 5, 12, 260);
    			attr_dev(rect3, "x", "17");
    			attr_dev(rect3, "y", "17");
    			attr_dev(rect3, "width", "4");
    			attr_dev(rect3, "height", "2");
    			attr_dev(rect3, "rx", "1");
    			attr_dev(rect3, "ry", "1");
    			attr_dev(rect3, "transform", "rotate(-90 19 18)");
    			add_location(rect3, file$4, 14, 12, 482);
    			attr_dev(path0, "d", "M12 15a1 1 0 0 1-.58-.18l-4-2.82a1 1 0 0 1-.24-1.39 1 1 0 0 1 1.4-.24L12 12.76l3.4-2.56a1 1 0 0 1 1.2 1.6l-4 3a1 1 0 0 1-.6.2z");
    			add_location(path0, file$4, 23, 12, 706);
    			attr_dev(path1, "d", "M12 13a1 1 0 0 1-1-1V4a1 1 0 0 1 2 0v8a1 1 0 0 1-1 1z");
    			add_location(path1, file$4, 26, 12, 886);
    			attr_dev(g0, "data-name", "download");
    			add_location(g0, file$4, 2, 8, 97);
    			attr_dev(g1, "data-name", "Layer 2");
    			add_location(g1, file$4, 1, 4, 65);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$4, 0, 0, 0);
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
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
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
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DownloadSvg",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/ProductInstructions.svelte generated by Svelte v3.59.2 */
    const file$3 = "src/ProductInstructions.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	child_ctx[4] = i;
    	return child_ctx;
    }

    // (7:0) {#if $product?.skus && $product?.skus.length > 0}
    function create_if_block$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*$product*/ ctx[0].skus;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$product, $activeSku*/ 3) {
    				each_value = /*$product*/ ctx[0].skus;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
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
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(7:0) {#if $product?.skus && $product?.skus.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (9:8) {#if i == $activeSku }
    function create_if_block_1$1(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let div_intro;
    	let current;
    	let if_block0 = /*productSku*/ ctx[2].product_installation_instructions && create_if_block_3$1(ctx);
    	let if_block1 = /*productSku*/ ctx[2].product_technical_drawing && create_if_block_2$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			attr_dev(div, "class", "product-instructions-container");
    			add_location(div, file$3, 9, 12, 308);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*productSku*/ ctx[2].product_installation_instructions) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*$product*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*productSku*/ ctx[2].product_technical_drawing) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*$product*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_2$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, t1);
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
    			transition_in(if_block0);
    			transition_in(if_block1);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fade, {});
    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(9:8) {#if i == $activeSku }",
    		ctx
    	});

    	return block;
    }

    // (11:16) {#if productSku.product_installation_instructions}
    function create_if_block_3$1(ctx) {
    	let div;
    	let a;
    	let t;
    	let downloadsvg;
    	let a_href_value;
    	let current;
    	downloadsvg = new DownloadSvg({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			t = text("Installation Instructions\n                        ");
    			create_component(downloadsvg.$$.fragment);
    			attr_dev(a, "href", a_href_value = /*productSku*/ ctx[2].product_installation_instructions);
    			attr_dev(a, "download", "");
    			add_location(a, file$3, 12, 20, 504);
    			attr_dev(div, "class", "installation-instructions");
    			add_location(div, file$3, 11, 16, 444);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, t);
    			mount_component(downloadsvg, a, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*$product*/ 1 && a_href_value !== (a_href_value = /*productSku*/ ctx[2].product_installation_instructions)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(downloadsvg.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(downloadsvg.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(downloadsvg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(11:16) {#if productSku.product_installation_instructions}",
    		ctx
    	});

    	return block;
    }

    // (21:16) {#if productSku.product_technical_drawing}
    function create_if_block_2$1(ctx) {
    	let div;
    	let a;
    	let t;
    	let downloadsvg;
    	let a_href_value;
    	let current;
    	downloadsvg = new DownloadSvg({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			t = text("Technical Drawing\n                        ");
    			create_component(downloadsvg.$$.fragment);
    			attr_dev(a, "href", a_href_value = /*productSku*/ ctx[2].product_technical_drawing);
    			attr_dev(a, "download", "");
    			add_location(a, file$3, 22, 20, 904);
    			attr_dev(div, "class", "technical-drawing");
    			add_location(div, file$3, 21, 16, 852);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, t);
    			mount_component(downloadsvg, a, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*$product*/ 1 && a_href_value !== (a_href_value = /*productSku*/ ctx[2].product_technical_drawing)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(downloadsvg.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(downloadsvg.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(downloadsvg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(21:16) {#if productSku.product_technical_drawing}",
    		ctx
    	});

    	return block;
    }

    // (8:4) {#each $product.skus as productSku, i}
    function create_each_block$1(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*i*/ ctx[4] == /*$activeSku*/ ctx[1] && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*i*/ ctx[4] == /*$activeSku*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeSku*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(8:4) {#each $product.skus as productSku, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$product*/ ctx[0]?.skus && /*$product*/ ctx[0]?.skus.length > 0 && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$product*/ ctx[0]?.skus && /*$product*/ ctx[0]?.skus.length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$product*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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

    function instance$3($$self, $$props, $$invalidate) {
    	let $product;
    	let $activeSku;
    	validate_store(product, 'product');
    	component_subscribe($$self, product, $$value => $$invalidate(0, $product = $$value));
    	validate_store(activeSku, 'activeSku');
    	component_subscribe($$self, activeSku, $$value => $$invalidate(1, $activeSku = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ProductInstructions', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ProductInstructions> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		activeSku,
    		product,
    		fade,
    		DownloadSvg,
    		$product,
    		$activeSku
    	});

    	return [$product, $activeSku];
    }

    class ProductInstructions extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProductInstructions",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/ProductDetails.svelte generated by Svelte v3.59.2 */
    const file$2 = "src/ProductDetails.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let activeskudetails;
    	let t0;
    	let productskus;
    	let t1;
    	let productinstructions;
    	let current;
    	activeskudetails = new ActiveSkuDetails({ $$inline: true });
    	productskus = new ProductSkus({ $$inline: true });
    	productinstructions = new ProductInstructions({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(activeskudetails.$$.fragment);
    			t0 = space();
    			create_component(productskus.$$.fragment);
    			t1 = space();
    			create_component(productinstructions.$$.fragment);
    			attr_dev(div, "class", "product-hero-details");
    			add_location(div, file$2, 6, 0, 202);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(activeskudetails, div, null);
    			append_dev(div, t0);
    			mount_component(productskus, div, null);
    			append_dev(div, t1);
    			mount_component(productinstructions, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(activeskudetails.$$.fragment, local);
    			transition_in(productskus.$$.fragment, local);
    			transition_in(productinstructions.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(activeskudetails.$$.fragment, local);
    			transition_out(productskus.$$.fragment, local);
    			transition_out(productinstructions.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(activeskudetails);
    			destroy_component(productskus);
    			destroy_component(productinstructions);
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
    	validate_slots('ProductDetails', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ProductDetails> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		ActiveSkuDetails,
    		ProductSkus,
    		ProductInstructions
    	});

    	return [];
    }

    class ProductDetails extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProductDetails",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/ProductImage.svelte generated by Svelte v3.59.2 */
    const file$1 = "src/ProductImage.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    // (39:4) {#if $product.skus && $product.skus.length > 0}
    function create_if_block_3(ctx) {
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let current;
    	let if_block = /*$display*/ ctx[2] && create_if_block_5(ctx);
    	let each_value_1 = /*$product*/ ctx[1].skus;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = text("Viewing: ");
    			if (if_block) if_block.c();
    			t1 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "active-sku");
    			add_location(div0, file$1, 39, 8, 1244);
    			attr_dev(div1, "class", "product-image-div active");
    			add_location(div1, file$1, 45, 8, 1514);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t0);
    			if (if_block) if_block.m(div0, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div1, null);
    				}
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*$display*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$display*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*$product, quadInOut, $activeSku, $display*/ 14) {
    				each_value_1 = /*$product*/ ctx[1].skus;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (if_block) if_block.d();
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(39:4) {#if $product.skus && $product.skus.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (41:21) {#if $display}
    function create_if_block_5(ctx) {
    	let span;
    	let t_value = /*$product*/ ctx[1].skus[/*$activeSku*/ ctx[3]].sku + "";
    	let t;
    	let span_transition;
    	let current;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			add_location(span, file$1, 40, 35, 1304);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*$product, $activeSku*/ 10) && t_value !== (t_value = /*$product*/ ctx[1].skus[/*$activeSku*/ ctx[3]].sku + "")) set_data_dev(t, t_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!current) return;

    				if (!span_transition) span_transition = create_bidirectional_transition(
    					span,
    					scale,
    					{
    						start: 0.9,
    						opacity: 0,
    						duration: 300,
    						easing: quadInOut
    					},
    					true
    				);

    				span_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!span_transition) span_transition = create_bidirectional_transition(
    				span,
    				scale,
    				{
    					start: 0.9,
    					opacity: 0,
    					duration: 300,
    					easing: quadInOut
    				},
    				false
    			);

    			span_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching && span_transition) span_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(41:21) {#if $display}",
    		ctx
    	});

    	return block;
    }

    // (48:12) {#if i == $activeSku && $display}
    function create_if_block_4(ctx) {
    	let img;
    	let img_src_value;
    	let img_transition;
    	let current;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "product-image active");
    			if (!src_url_equal(img.src, img_src_value = /*productSku*/ ctx[8].product_images[0].product_image)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$1, 48, 16, 1662);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty & /*$product*/ 2 && !src_url_equal(img.src, img_src_value = /*productSku*/ ctx[8].product_images[0].product_image)) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!current) return;

    				if (!img_transition) img_transition = create_bidirectional_transition(
    					img,
    					scale,
    					{
    						start: 0.9,
    						opacity: 0,
    						duration: 300,
    						easing: quadInOut
    					},
    					true
    				);

    				img_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!img_transition) img_transition = create_bidirectional_transition(
    				img,
    				scale,
    				{
    					start: 0.9,
    					opacity: 0,
    					duration: 300,
    					easing: quadInOut
    				},
    				false
    			);

    			img_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			if (detaching && img_transition) img_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(48:12) {#if i == $activeSku && $display}",
    		ctx
    	});

    	return block;
    }

    // (47:8) {#each $product.skus as productSku, i}
    function create_each_block_1(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*i*/ ctx[10] == /*$activeSku*/ ctx[3] && /*$display*/ ctx[2] && create_if_block_4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*i*/ ctx[10] == /*$activeSku*/ ctx[3] && /*$display*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeSku, $display*/ 12) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(47:8) {#each $product.skus as productSku, i}",
    		ctx
    	});

    	return block;
    }

    // (59:4) {#if $product.schematic_image}
    function create_if_block_2(ctx) {
    	let div;
    	let raw_value = /*$product*/ ctx[1].schematic_image + "";

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "product-hero-schematic-image");
    			add_location(div, file$1, 59, 8, 2032);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			div.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$product*/ 2 && raw_value !== (raw_value = /*$product*/ ctx[1].schematic_image + "")) div.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(59:4) {#if $product.schematic_image}",
    		ctx
    	});

    	return block;
    }

    // (64:4) {#if $product?.skus}
    function create_if_block_1(ctx) {
    	let div;
    	let each_value = /*$product*/ ctx[1]?.skus;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "product-hero-control-images");
    			add_location(div, file$1, 64, 8, 2178);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$product, activeSku*/ 2) {
    				each_value = /*$product*/ ctx[1]?.skus;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
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
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(64:4) {#if $product?.skus}",
    		ctx
    	});

    	return block;
    }

    // (66:12) {#each $product?.skus as productSku, i}
    function create_each_block(ctx) {
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[6](/*i*/ ctx[10]);
    	}

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "product-image-thumbnail");
    			if (!src_url_equal(img.src, img_src_value = /*productSku*/ ctx[8].product_images[0].product_image)) attr_dev(img, "src", img_src_value);
    			add_location(img, file$1, 66, 16, 2288);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(img, "click", click_handler, false, false, false, false),
    					listen_dev(img, "keydown", /*keydown_handler*/ ctx[5], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*$product*/ 2 && !src_url_equal(img.src, img_src_value = /*productSku*/ ctx[8].product_images[0].product_image)) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(66:12) {#each $product?.skus as productSku, i}",
    		ctx
    	});

    	return block;
    }

    // (97:8) {#if shareOpen}
    function create_if_block(ctx) {
    	let div;
    	let a0;
    	let svg0;
    	let path0;
    	let t0;
    	let a1;
    	let svg1;
    	let defs;
    	let style;
    	let t1;
    	let g1;
    	let g0;
    	let path1;
    	let t2;
    	let a2;
    	let svg2;
    	let g2;
    	let path2;
    	let path3;
    	let path4;
    	let path5;
    	let t3;
    	let a3;
    	let svg3;
    	let g3;
    	let rect0;
    	let path6;
    	let rect1;
    	let circle;
    	let t4;
    	let a4;
    	let svg4;
    	let path7;
    	let t5;
    	let a5;
    	let svg5;
    	let g5;
    	let g4;
    	let rect2;
    	let path8;
    	let path9;
    	let path10;
    	let div_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a0 = element("a");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t0 = space();
    			a1 = element("a");
    			svg1 = svg_element("svg");
    			defs = svg_element("defs");
    			style = svg_element("style");
    			t1 = text(".cls-1 {\n                                    fill: #fff;\n                                    stroke-width: 0px;\n                                }\n                            ");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			path1 = svg_element("path");
    			t2 = space();
    			a2 = element("a");
    			svg2 = svg_element("svg");
    			g2 = svg_element("g");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			path4 = svg_element("path");
    			path5 = svg_element("path");
    			t3 = space();
    			a3 = element("a");
    			svg3 = svg_element("svg");
    			g3 = svg_element("g");
    			rect0 = svg_element("rect");
    			path6 = svg_element("path");
    			rect1 = svg_element("rect");
    			circle = svg_element("circle");
    			t4 = space();
    			a4 = element("a");
    			svg4 = svg_element("svg");
    			path7 = svg_element("path");
    			t5 = space();
    			a5 = element("a");
    			svg5 = svg_element("svg");
    			g5 = svg_element("g");
    			g4 = svg_element("g");
    			rect2 = svg_element("rect");
    			path8 = svg_element("path");
    			path9 = svg_element("path");
    			path10 = svg_element("path");
    			attr_dev(path0, "d", "M21.531,3.708A.706.706,0,0,0,20.825,3H17.3a6.735,6.735,0,0,0-7.06,6.354v3.812H6.706A.706.706,0,0,0,6,13.874v3.671a.706.706,0,0,0,.706.706h3.53v9.46a.706.706,0,0,0,.706.706h4.236a.706.706,0,0,0,.706-.706v-9.46h3.7a.706.706,0,0,0,.692-.522l1.017-3.671a.706.706,0,0,0-.678-.89h-4.73V9.356A1.412,1.412,0,0,1,17.3,8.085h3.53a.706.706,0,0,0,.706-.706Z");
    			attr_dev(path0, "transform", "translate(-6 -2.994)");
    			attr_dev(path0, "fill", "#fff");
    			add_location(path0, file$1, 107, 24, 3826);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "viewBox", "0 0 15.531 25.423");
    			add_location(svg0, file$1, 103, 20, 3664);
    			attr_dev(a0, "href", `https://www.facebook.com/share.php?u=${encodeURI(window.location.href)}`);
    			add_location(a0, file$1, 98, 16, 3476);
    			add_location(style, file$1, 127, 28, 4871);
    			add_location(defs, file$1, 126, 24, 4836);
    			attr_dev(path1, "id", "path1009");
    			attr_dev(path1, "class", "cls-1");
    			attr_dev(path1, "d", "m2.44,0l386.39,516.64L0,936.69h87.51l340.42-367.76,275.05,367.76h297.8l-408.13-545.7L954.57,0h-87.51l-313.51,338.7L300.24,0H2.44Zm128.69,64.46h136.81l604.13,807.76h-136.81L131.13,64.46Z");
    			add_location(path1, file$1, 136, 32, 5240);
    			attr_dev(g0, "id", "layer1");
    			add_location(g0, file$1, 135, 28, 5192);
    			attr_dev(g1, "id", "svg5");
    			add_location(g1, file$1, 134, 24, 5150);
    			attr_dev(svg1, "id", "Layer_2");
    			attr_dev(svg1, "data-name", "Layer 2");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 1000.78 936.69");
    			add_location(svg1, file$1, 120, 20, 4592);
    			attr_dev(a1, "href", `https://twitter.com/intent/tweet?&url=${encodeURI(window.location.href)}`);
    			add_location(a1, file$1, 115, 16, 4403);
    			attr_dev(path2, "d", "M18.841,0H7.993A8,8,0,0,0,0,7.993V18.841a8,8,0,0,0,7.993,7.993H18.841a8,8,0,0,0,7.993-7.993V7.993A8,8,0,0,0,18.841,0Zm5.3,18.841a5.3,5.3,0,0,1-5.3,5.3H7.993a5.3,5.3,0,0,1-5.3-5.3V7.993a5.3,5.3,0,0,1,5.3-5.3H18.841a5.3,5.3,0,0,1,5.3,5.3Z");
    			attr_dev(path2, "fill", "#fff");
    			add_location(path2, file$1, 151, 28, 5986);
    			attr_dev(path3, "d", "M396.5,309.5");
    			attr_dev(path3, "transform", "translate(-372.362 -290.659)");
    			attr_dev(path3, "fill", "#fff");
    			add_location(path3, file$1, 155, 28, 6368);
    			attr_dev(path4, "d", "M113.34,106.4a6.94,6.94,0,1,0,6.94,6.94A6.94,6.94,0,0,0,113.34,106.4Zm0,11.183a4.243,4.243,0,1,1,4.243-4.243A4.243,4.243,0,0,1,113.34,117.583Zm0,0");
    			attr_dev(path4, "transform", "translate(-99.923 -99.923)");
    			attr_dev(path4, "fill", "#fff");
    			add_location(path4, file$1, 160, 28, 6599);
    			attr_dev(path5, "d", "M310.724,81.662A1.662,1.662,0,1,1,309.062,80,1.662,1.662,0,0,1,310.724,81.662Zm0,0");
    			attr_dev(path5, "transform", "translate(-288.687 -75.13)");
    			attr_dev(path5, "fill", "#fff");
    			add_location(path5, file$1, 165, 28, 6962);
    			attr_dev(g2, "transform", "translate(0 0)");
    			add_location(g2, file$1, 150, 24, 5927);
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "viewBox", "0 0 26.834 26.834");
    			add_location(svg2, file$1, 146, 20, 5765);
    			attr_dev(a2, "href", "");
    			add_location(a2, file$1, 145, 16, 5733);
    			attr_dev(rect0, "width", "34");
    			attr_dev(rect0, "height", "34");
    			attr_dev(rect0, "transform", "translate(34.281 34.121) rotate(180)");
    			attr_dev(rect0, "fill", "#fff");
    			attr_dev(rect0, "opacity", "0");
    			add_location(rect0, file$1, 176, 28, 7512);
    			attr_dev(path6, "d", "M17.56,8.4A8.231,8.231,0,0,0,9.3,16.617v8.3a1.271,1.271,0,0,0,1.271,1.271h2.965a1.271,1.271,0,0,0,1.271-1.271v-8.3a2.739,2.739,0,0,1,3.036-2.725,2.824,2.824,0,0,1,2.471,2.824v8.2a1.271,1.271,0,0,0,1.271,1.271h2.965a1.271,1.271,0,0,0,1.271-1.271v-8.3A8.231,8.231,0,0,0,17.56,8.4Z");
    			attr_dev(path6, "transform", "translate(3.831 3.46)");
    			attr_dev(path6, "fill", "#fff");
    			add_location(path6, file$1, 183, 28, 7833);
    			attr_dev(rect1, "width", "6.354");
    			attr_dev(rect1, "height", "16.519");
    			attr_dev(rect1, "rx", "0.9");
    			attr_dev(rect1, "transform", "translate(4.236 13.131)");
    			attr_dev(rect1, "fill", "#fff");
    			add_location(rect1, file$1, 188, 28, 8323);
    			attr_dev(circle, "cx", "3.177");
    			attr_dev(circle, "cy", "3.177");
    			attr_dev(circle, "r", "3.177");
    			attr_dev(circle, "transform", "translate(4.236 4.236)");
    			attr_dev(circle, "fill", "#fff");
    			add_location(circle, file$1, 195, 28, 8635);
    			attr_dev(g3, "transform", "translate(-0.281 -0.121)");
    			add_location(g3, file$1, 175, 24, 7443);
    			attr_dev(svg3, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg3, "viewBox", "0 0 34 34");
    			add_location(svg3, file$1, 174, 20, 7358);
    			attr_dev(a3, "href", "");
    			add_location(a3, file$1, 173, 16, 7326);
    			attr_dev(path7, "d", "M27.5,4H6.5A4.5,4.5,0,0,0,2,8.5v15A4.5,4.5,0,0,0,6.5,28h21A4.5,4.5,0,0,0,32,23.5V8.5A4.5,4.5,0,0,0,27.5,4Zm0,3-9.75,6.7a1.5,1.5,0,0,1-1.5,0L6.5,7Z");
    			attr_dev(path7, "transform", "translate(-2 -4)");
    			attr_dev(path7, "fill", "#fff");
    			add_location(path7, file$1, 210, 24, 9196);
    			attr_dev(svg4, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg4, "viewBox", "0 0 29.999 24");
    			add_location(svg4, file$1, 206, 20, 9038);
    			attr_dev(a4, "href", "");
    			add_location(a4, file$1, 205, 16, 9006);
    			attr_dev(rect2, "width", "24");
    			attr_dev(rect2, "height", "24");
    			attr_dev(rect2, "opacity", "0");
    			add_location(rect2, file$1, 221, 33, 9793);
    			attr_dev(path8, "d", "M13.29 9.29l-4 4a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4-4a1 1 0 0 0-1.42-1.42z");
    			add_location(path8, file$1, 225, 34, 9976);
    			attr_dev(path9, "d", "M12.28 17.4L11 18.67a4.2 4.2 0 0 1-5.58.4 4 4 0 0 1-.27-5.93l1.42-1.43a1 1 0 0 0 0-1.42 1 1 0 0 0-1.42 0l-1.27 1.28a6.15 6.15 0 0 0-.67 8.07 6.06 6.06 0 0 0 9.07.6l1.42-1.42a1 1 0 0 0-1.42-1.42z");
    			add_location(path9, file$1, 227, 34, 10132);
    			attr_dev(path10, "d", "M19.66 3.22a6.18 6.18 0 0 0-8.13.68L10.45 5a1.09 1.09 0 0 0-.17 1.61 1 1 0 0 0 1.42 0L13 5.3a4.17 4.17 0 0 1 5.57-.4 4 4 0 0 1 .27 5.95l-1.42 1.43a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l1.42-1.42a6.06 6.06 0 0 0-.6-9.06z");
    			add_location(path10, file$1, 229, 34, 10407);
    			attr_dev(g4, "data-name", "link-2");
    			add_location(g4, file$1, 220, 29, 9738);
    			attr_dev(g5, "data-name", "Layer 2");
    			add_location(g5, file$1, 219, 25, 9686);
    			attr_dev(svg5, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg5, "viewBox", "0 0 24 24");
    			add_location(svg5, file$1, 218, 20, 9601);
    			attr_dev(a5, "href", "");
    			add_location(a5, file$1, 217, 16, 9569);
    			attr_dev(div, "class", "product-share-links");
    			add_location(div, file$1, 97, 12, 3393);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a0);
    			append_dev(a0, svg0);
    			append_dev(svg0, path0);
    			append_dev(div, t0);
    			append_dev(div, a1);
    			append_dev(a1, svg1);
    			append_dev(svg1, defs);
    			append_dev(defs, style);
    			append_dev(style, t1);
    			append_dev(svg1, g1);
    			append_dev(g1, g0);
    			append_dev(g0, path1);
    			append_dev(div, t2);
    			append_dev(div, a2);
    			append_dev(a2, svg2);
    			append_dev(svg2, g2);
    			append_dev(g2, path2);
    			append_dev(g2, path3);
    			append_dev(g2, path4);
    			append_dev(g2, path5);
    			append_dev(div, t3);
    			append_dev(div, a3);
    			append_dev(a3, svg3);
    			append_dev(svg3, g3);
    			append_dev(g3, rect0);
    			append_dev(g3, path6);
    			append_dev(g3, rect1);
    			append_dev(g3, circle);
    			append_dev(div, t4);
    			append_dev(div, a4);
    			append_dev(a4, svg4);
    			append_dev(svg4, path7);
    			append_dev(div, t5);
    			append_dev(div, a5);
    			append_dev(a5, svg5);
    			append_dev(svg5, g5);
    			append_dev(g5, g4);
    			append_dev(g4, rect2);
    			append_dev(g4, path8);
    			append_dev(g4, path9);
    			append_dev(g4, path10);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!current) return;
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, { axis: "x" }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, slide, { axis: "x" }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(97:8) {#if shareOpen}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div4;
    	let div1;
    	let a0;
    	let t1;
    	let span0;
    	let svg0;
    	let path0;
    	let t2;
    	let a1;
    	let t4;
    	let span1;
    	let svg1;
    	let path1;
    	let t5;
    	let div0;
    	let t6_value = /*$product*/ ctx[1].title + "";
    	let t6;
    	let t7;
    	let t8;
    	let t9;
    	let t10;
    	let div3;
    	let div2;
    	let svg2;
    	let g1;
    	let g0;
    	let rect;
    	let path2;
    	let t11;
    	let div3_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*$product*/ ctx[1].skus && /*$product*/ ctx[1].skus.length > 0 && create_if_block_3(ctx);
    	let if_block1 = /*$product*/ ctx[1].schematic_image && create_if_block_2(ctx);
    	let if_block2 = /*$product*/ ctx[1]?.skus && create_if_block_1(ctx);
    	let if_block3 = /*shareOpen*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div1 = element("div");
    			a0 = element("a");
    			a0.textContent = "Home";
    			t1 = space();
    			span0 = element("span");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t2 = space();
    			a1 = element("a");
    			a1.textContent = "Products";
    			t4 = space();
    			span1 = element("span");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t5 = space();
    			div0 = element("div");
    			t6 = text(t6_value);
    			t7 = space();
    			if (if_block0) if_block0.c();
    			t8 = space();
    			if (if_block1) if_block1.c();
    			t9 = space();
    			if (if_block2) if_block2.c();
    			t10 = space();
    			div3 = element("div");
    			div2 = element("div");
    			svg2 = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			rect = svg_element("rect");
    			path2 = svg_element("path");
    			t11 = space();
    			if (if_block3) if_block3.c();
    			attr_dev(a0, "href", "/");
    			add_location(a0, file$1, 9, 8, 287);
    			attr_dev(path0, "d", "M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z");
    			add_location(path0, file$1, 17, 16, 528);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "width", "13.922");
    			attr_dev(svg0, "height", "16.245");
    			attr_dev(svg0, "viewBox", "0 0 13.922 16.245");
    			add_location(svg0, file$1, 11, 12, 335);
    			add_location(span0, file$1, 10, 8, 316);
    			attr_dev(a1, "class", "breadcrumb-middle-link");
    			attr_dev(a1, "href", "/products");
    			add_location(a1, file$1, 23, 8, 681);
    			attr_dev(path1, "d", "M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z");
    			add_location(path1, file$1, 31, 16, 965);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "width", "13.922");
    			attr_dev(svg1, "height", "16.245");
    			attr_dev(svg1, "viewBox", "0 0 13.922 16.245");
    			add_location(svg1, file$1, 25, 12, 772);
    			add_location(span1, file$1, 24, 8, 753);
    			attr_dev(div0, "class", "breadcrumbs-current");
    			add_location(div0, file$1, 36, 8, 1117);
    			attr_dev(div1, "class", "hero-breadcrumbs");
    			add_location(div1, file$1, 8, 4, 248);
    			attr_dev(rect, "width", "24");
    			attr_dev(rect, "height", "24");
    			attr_dev(rect, "opacity", "0");
    			add_location(rect, file$1, 89, 25, 3048);
    			attr_dev(path2, "d", "M18 15a3 3 0 0 0-2.1.86L8 12.34V12v-.33l7.9-3.53A3 3 0 1 0 15 6v.34L7.1 9.86a3 3 0 1 0 0 4.28l7.9 3.53V18a3 3 0 1 0 3-3z");
    			add_location(path2, file$1, 89, 68, 3091);
    			attr_dev(g0, "data-name", "share");
    			add_location(g0, file$1, 88, 21, 3002);
    			attr_dev(g1, "data-name", "Layer 2");
    			add_location(g1, file$1, 87, 17, 2958);
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "viewBox", "0 0 24 24");
    			add_location(svg2, file$1, 86, 12, 2881);
    			attr_dev(div2, "class", "product-share-icon");
    			add_location(div2, file$1, 79, 8, 2707);
    			attr_dev(div3, "class", div3_class_value = "product-share " + (/*shareOpen*/ ctx[0] ? 'active' : ''));
    			add_location(div3, file$1, 78, 4, 2643);
    			attr_dev(div4, "class", "product-hero-image");
    			add_location(div4, file$1, 7, 0, 211);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div1);
    			append_dev(div1, a0);
    			append_dev(div1, t1);
    			append_dev(div1, span0);
    			append_dev(span0, svg0);
    			append_dev(svg0, path0);
    			append_dev(div1, t2);
    			append_dev(div1, a1);
    			append_dev(div1, t4);
    			append_dev(div1, span1);
    			append_dev(span1, svg1);
    			append_dev(svg1, path1);
    			append_dev(div1, t5);
    			append_dev(div1, div0);
    			append_dev(div0, t6);
    			append_dev(div4, t7);
    			if (if_block0) if_block0.m(div4, null);
    			append_dev(div4, t8);
    			if (if_block1) if_block1.m(div4, null);
    			append_dev(div4, t9);
    			if (if_block2) if_block2.m(div4, null);
    			append_dev(div4, t10);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, svg2);
    			append_dev(svg2, g1);
    			append_dev(g1, g0);
    			append_dev(g0, rect);
    			append_dev(g0, path2);
    			append_dev(div3, t11);
    			if (if_block3) if_block3.m(div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div2, "click", /*click_handler_1*/ ctx[7], false, false, false, false),
    					listen_dev(div2, "keydown", /*keydown_handler_1*/ ctx[4], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*$product*/ 2) && t6_value !== (t6_value = /*$product*/ ctx[1].title + "")) set_data_dev(t6, t6_value);

    			if (/*$product*/ ctx[1].skus && /*$product*/ ctx[1].skus.length > 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*$product*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div4, t8);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*$product*/ ctx[1].schematic_image) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_2(ctx);
    					if_block1.c();
    					if_block1.m(div4, t9);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*$product*/ ctx[1]?.skus) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_1(ctx);
    					if_block2.c();
    					if_block2.m(div4, t10);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*shareOpen*/ ctx[0]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty & /*shareOpen*/ 1) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(div3, null);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*shareOpen*/ 1 && div3_class_value !== (div3_class_value = "product-share " + (/*shareOpen*/ ctx[0] ? 'active' : ''))) {
    				attr_dev(div3, "class", div3_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block3);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block3);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			mounted = false;
    			run_all(dispose);
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
    	let $product;
    	let $display;
    	let $activeSku;
    	validate_store(product, 'product');
    	component_subscribe($$self, product, $$value => $$invalidate(1, $product = $$value));
    	validate_store(display, 'display');
    	component_subscribe($$self, display, $$value => $$invalidate(2, $display = $$value));
    	validate_store(activeSku, 'activeSku');
    	component_subscribe($$self, activeSku, $$value => $$invalidate(3, $activeSku = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ProductImage', slots, []);
    	let shareOpen = false;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ProductImage> was created with unknown prop '${key}'`);
    	});

    	function keydown_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler = i => {
    		activeSku.set(i);
    	};

    	const click_handler_1 = () => {
    		$$invalidate(0, shareOpen = !shareOpen);
    	};

    	$$self.$capture_state = () => ({
    		product,
    		activeSku,
    		display,
    		scale,
    		slide,
    		quadInOut,
    		shareOpen,
    		$product,
    		$display,
    		$activeSku
    	});

    	$$self.$inject_state = $$props => {
    		if ('shareOpen' in $$props) $$invalidate(0, shareOpen = $$props.shareOpen);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		shareOpen,
    		$product,
    		$display,
    		$activeSku,
    		keydown_handler_1,
    		keydown_handler,
    		click_handler,
    		click_handler_1
    	];
    }

    class ProductImage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProductImage",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.59.2 */

    const { console: console_1 } = globals;
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let div;
    	let productimage;
    	let t;
    	let productdetails;
    	let current;
    	productimage = new ProductImage({ $$inline: true });
    	productdetails = new ProductDetails({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(productimage.$$.fragment);
    			t = space();
    			create_component(productdetails.$$.fragment);
    			attr_dev(div, "class", "product-hero-container");
    			add_location(div, file, 20, 0, 510);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(productimage, div, null);
    			append_dev(div, t);
    			mount_component(productdetails, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(productimage.$$.fragment, local);
    			transition_in(productdetails.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(productimage.$$.fragment, local);
    			transition_out(productdetails.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(productimage);
    			destroy_component(productdetails);
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
    	let $product;
    	validate_store(product, 'product');
    	component_subscribe($$self, product, $$value => $$invalidate(1, $product = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { productDetails = {} } = $$props;

    	onMount(() => {
    		product.set(productDetails);
    		console.log($product.skus);
    	});

    	activeSku.subscribe(value => {
    		display.set(false);

    		setTimeout(
    			() => {
    				display.set(true);
    			},
    			300
    		);
    	});

    	const writable_props = ['productDetails'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('productDetails' in $$props) $$invalidate(0, productDetails = $$props.productDetails);
    	};

    	$$self.$capture_state = () => ({
    		productDetails,
    		product,
    		activeSku,
    		display,
    		onMount,
    		ProductDetails,
    		ProductImage,
    		$product
    	});

    	$$self.$inject_state = $$props => {
    		if ('productDetails' in $$props) $$invalidate(0, productDetails = $$props.productDetails);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [productDetails];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { productDetails: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get productDetails() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set productDetails(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    return App;

}));
//# sourceMappingURL=product-hero.js.map
