
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Mobile = factory());
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
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
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
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
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
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value == null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
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
    function create_out_transition(node, fn, params) {
        const options = { direction: 'out' };
        let config = fn(node, params, options);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config(options);
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
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

    const open = writable(false);
    const searchOpen = writable(false);
    const searchQuery = writable('');
    const results = writable({});
    const ajaxUrl = writable('');
    const menus = writable({});
    const activeMenu = writable(0);
    const version = writable(0);
    const productCategories = writable({});
    const facebook = writable('https://www.facebook.com/');
    const twitter = writable('https://twitter.com/');
    const instagram = writable('https://www.instagram.com/');
    const linkedin = writable('https://uk.linkedin.com/');
    const youtube = writable('https://www.youtube.com/');
    const email = writable('email@email.com');
    const openClassVersionTwo = writable('closed');
    const menuParentId = writable('');
    const navBarMenu = writable({});
    const menuParentTitle = writable('');
    const imageLinks = writable({});

    function highlightResults(searchQuery, result) {
      let textToSearch = searchQuery;
      let paragraph = result;

      textToSearch = textToSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      let pattern = new RegExp(`${textToSearch}`, 'ig');

      paragraph = paragraph.replace(pattern, (match) => `<b>${match}</b>`);
      return paragraph
    }

    async function getData(graphQlUrl, menus, query, productCategories) {
      const fetchPromise = await fetch(graphQlUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': '<YOUR_RAPIDAPI_KEY>',
        },
        body: JSON.stringify({
          query: query,
        }),
      });

      const response = await fetchPromise.json();
      menus.set(response.data.menus.nodes);
      productCategories.set(response.data.productCategories.edges);
      imageLinks.set(response.data.themeGeneralSettings.themeSettings.imageLinks);
    }

    const query = `{
  productCategories(first: 1000) {
    edges {
      node {
        id
        name
        parentId
        link
        customFields {
          categoryImage {
            altText
            sourceUrl(size: THUMBNAIL)
          }
        }
      }
    }
  }
  menus {
    nodes {
      menuItems(where: {parentId: null}) {
        nodes {
          parentId
          id
          url
          title: label
        }
      }
      name
      slug
    }
  }
  themeGeneralSettings {
    themeSettings {
      imageLinks {
        backgroundImage {
          sourceUrl(size: MEDIUM_LARGE)
        }
        textAlignment
        textColor
        text
        linkUrl
      }
    }
  }
}`;

    const previousSuggestions = writable([]);

    async function getResults(searchTerm, previousSuggestions) {
      const query = `{
  posts(where: {search: "${searchTerm}"}, first: 100) {
    edges {
      node {
        link
        title
      }
    }
  }
  productCategories(where: {search: "${searchTerm}"}, first: 100) {
    edges {
      node {
        name
        products(first: 100) {
          nodes {
            customFields2 {
              skus {
                sku
                productImages {
                  productImage {
                    mediaItemUrl
                  }
                }
              }
            }
            link
            title
          }
        }
      }
    }
  }
  products(where: {search: "${searchTerm}"}, first: 1000) {
    nodes {
      customFields2 {
        skus {
          sku
          productImages {
            productImage {
              mediaItemUrl
            }
          }
        }
      }
      link
      title
    }
  }
  pages(where: {search: "${searchTerm}"}) {
    edges {
      node {
        title
        link
      }
    }
  }
}`;
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
      let categories = [];

      let otherResults = [];
      let otherSimilarity = [];
      let products = response.data.products.nodes;
      let productCategories = response.data.productCategories.edges;
      let posts = response.data.posts.edges;
      let pages = response.data.pages.edges;

      // put all posts and pages into an "other" array
      posts.forEach((post) => {
        post.node.postType = 'post';
        otherResults.push(post.node);
      });

      pages.forEach((page) => {
        page.node.postType = 'page';
        otherResults.push(page.node);
      });

      //sort other array by levenstein distance of title to searchTerm
      otherResults.forEach((result) => {
        otherSimilarity.push(result.title);
      });

      response.data.other = sortOtherResultsBySimilarity(otherResults, searchTerm);

      //if no products are found, but a product categories are then use products from the category
      if (products.length == 0 && productCategories.length == 1) {
        products = productCategories[0].node.products;
      }

      //sort products by sku compared to search term using levenstein distance
      response.data.products.nodes = sortProductsBySimilarity(products, searchTerm);

      // move all category names into a single level array.
      response.data.productCategories.edges.forEach((category) => {
        categories.push(category.node.name);
      });

      if (categories.length > 0) {
        // sort categories compared to search term using levenstein distance
        response.data.productCategories = sortBySimilarity(categories, searchTerm);
        //if categories are found then update the last found categories
        previousSuggestions.set(sortBySimilarity(categories, searchTerm));
      } else {
        // if no categories are found then use the previous found categories as suggestions
        response.data.productCategories = get_store_value(previousSuggestions);
      }
      return response
    }

    function levenshteinDistance(a, b) {
      // Create a 2D array to store the distances
      let distances = new Array(a.length + 1);
      for (let i = 0; i <= a.length; i++) {
        distances[i] = new Array(b.length + 1);
      }

      // Initialize the first row and column
      for (let i = 0; i <= a.length; i++) {
        distances[i][0] = i;
      }
      for (let j = 0; j <= b.length; j++) {
        distances[0][j] = j;
      }

      // Fill in the rest of the array
      for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
          if (a[i - 1] === b[j - 1]) {
            distances[i][j] = distances[i - 1][j - 1];
          } else {
            distances[i][j] =
              Math.min(
                distances[i - 1][j],
                distances[i][j - 1],
                distances[i - 1][j - 1],
              ) + 1;
          }
        }
      }
      // Return the final distance
      return distances[a.length][b.length]
    }

    function sortBySimilarity(products, searchTerm) {
      // Create an array of objects to store the words and their distances
      let wordDistances = products.map((word) => ({
        word: word,
        distance: levenshteinDistance(word.toLowerCase(), searchTerm.toLowerCase()),
      }));

      // Sort the array by distance
      wordDistances.sort((a, b) => a.distance - b.distance);
      // Return the sorted list of words
      return wordDistances.map((wd) => wd.word)
    }

    function sortProductsBySimilarity(products, searchTerm) {
      let wordDistances = products.map((product) => ({
        product: product,
        distance: levenshteinDistance(
          getSkusList(product, searchTerm)[0],
          searchTerm,
        ),
      }));

      wordDistances.sort((a, b) => a.distance - b.distance);

      return wordDistances.map((wd) => wd.product)
    }

    // take all the skus from a producct object and sort them via levenshtein Distance
    function getSkusList(product, searchTerm) {
      let skus = [];
      let sortedSkus = [];
      product.customFields2.skus.forEach((row) => {
        skus.push(row.sku.toLowerCase());
      });

      sortedSkus = sortBySimilarity(skus, searchTerm.toLowerCase());
      return sortedSkus
    }

    function sortOtherResultsBySimilarity(otherResults, searchTerm) {
      let wordDistances = otherResults.map((other) => ({
        other: other,
        distance: levenshteinDistance(
          other.title.toLowerCase,
          searchTerm.toLowerCase(),
        ),
      }));
      wordDistances.sort((a, b) => a.distance - b.distance);

      return wordDistances.map((wd) => wd.other)
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
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

    /* src/nav-controls/Logo.svelte generated by Svelte v3.59.2 */
    const file$e = "src/nav-controls/Logo.svelte";

    function create_fragment$e(ctx) {
    	let div;
    	let a;
    	let svg;
    	let defs;
    	let style;
    	let t;
    	let g1;
    	let g0;
    	let rect;
    	let polygon0;
    	let polygon1;
    	let polygon2;
    	let path0;
    	let path1;
    	let polygon3;
    	let path2;
    	let div_intro;
    	let div_outro;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			svg = svg_element("svg");
    			defs = svg_element("defs");
    			style = svg_element("style");
    			t = text(".cls-1 {\n                        fill: #e63228;\n                        stroke-width: 0px;\n                    }\n                ");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			rect = svg_element("rect");
    			polygon0 = svg_element("polygon");
    			polygon1 = svg_element("polygon");
    			polygon2 = svg_element("polygon");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			polygon3 = svg_element("polygon");
    			path2 = svg_element("path");
    			add_location(style, file$e, 14, 16, 373);
    			add_location(defs, file$e, 13, 13, 350);
    			attr_dev(rect, "class", "cls-1");
    			attr_dev(rect, "x", "465.55");
    			attr_dev(rect, "width", "36.42");
    			attr_dev(rect, "height", "114.15");
    			add_location(rect, file$e, 23, 20, 655);
    			attr_dev(polygon0, "class", "cls-1");
    			attr_dev(polygon0, "points", "662.08 71.55 687.57 71.55 699.12 42.6 662.08 42.6 662.08 28.95 688.17 28.95 699.73 0 662.08 0 636.51 0 625.66 0 625.66 114.15 636.51 114.15 662.08 114.15 688.17 114.15 699.73 85.2 662.08 85.2 662.08 71.55");
    			add_location(polygon0, file$e, 29, 20, 855);
    			attr_dev(polygon1, "class", "cls-1");
    			attr_dev(polygon1, "points", "346.9 0 310.48 0 310.48 114.15 328.69 114.15 346.9 114.15 362.39 114.15 373.94 82.9 346.9 82.9 346.9 0");
    			add_location(polygon1, file$e, 33, 20, 1183);
    			attr_dev(polygon2, "class", "cls-1");
    			attr_dev(polygon2, "points", "576.94 47.83 550.68 0 514.26 0 514.26 114.15 550.68 114.15 550.68 66.32 576.94 114.15 613.36 114.15 613.36 0 576.94 0 576.94 47.83");
    			add_location(polygon2, file$e, 37, 20, 1409);
    			attr_dev(path0, "class", "cls-1");
    			attr_dev(path0, "d", "m435.72,0h-54.1v114.15h36.42v-28.71h17.69c10.15,0,18.38-8.23,18.38-18.38V18.38c0-10.15-8.23-18.38-18.38-18.38Zm-8.26,48.73c0,4.3-3.36,8.35-9.42,8.35v-31.16c4.71,0,9.42,3.26,9.42,7.96v14.85Z");
    			add_location(path0, file$e, 41, 20, 1663);
    			attr_dev(path1, "class", "cls-1");
    			attr_dev(path1, "d", "m257.76,0h-36.42l-16.6,114.15h36.42l2.04-14.06h18.12l2.04,14.06h36.42L283.18,0h-25.43Zm-11.81,81.19l6.31-43.39,6.31,43.39h-12.62Z");
    			add_location(path1, file$e, 45, 20, 1968);
    			attr_dev(polygon3, "class", "cls-1");
    			attr_dev(polygon3, "points", "125.83 0 108.15 0 89.42 0 80.58 60.76 71.75 0 53.02 0 35.33 0 16.6 0 0 114.15 36.42 114.15 44.17 60.81 51.93 114.15 72.82 114.15 88.35 114.15 109.24 114.15 116.99 60.81 124.75 114.15 161.17 114.15 144.57 0 125.83 0");
    			add_location(polygon3, file$e, 48, 22, 2192);
    			attr_dev(path2, "class", "cls-1");
    			attr_dev(path2, "d", "m161.31,17.91h0v33.7h0c0,9.89,8.02,17.91,17.91,17.91h23.01v-17.91h-3.9c-5.37,0-9.72-4.35-9.72-9.72v-14.26c0-5.37,4.35-9.72,9.72-9.72h3.9V0h-23.01c-9.89,0-17.91,8.02-17.91,17.91Z");
    			add_location(path2, file$e, 51, 22, 2509);
    			attr_dev(g0, "id", "McAlpine_Logo_-_New");
    			add_location(g0, file$e, 22, 16, 606);
    			attr_dev(g1, "id", "Layer_1-2");
    			add_location(g1, file$e, 21, 12, 571);
    			attr_dev(svg, "id", "Layer_2");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 699.73 114.15");
    			attr_dev(svg, "class", "svelte-dlzbcc");
    			add_location(svg, file$e, 9, 8, 220);
    			attr_dev(a, "class", "mobile-logo svelte-dlzbcc");
    			attr_dev(a, "href", "/");
    			add_location(a, file$e, 8, 4, 179);
    			add_location(div, file$e, 4, 0, 67);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, svg);
    			append_dev(svg, defs);
    			append_dev(defs, style);
    			append_dev(style, t);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, rect);
    			append_dev(g0, polygon0);
    			append_dev(g0, polygon1);
    			append_dev(g0, polygon2);
    			append_dev(g0, path0);
    			append_dev(g0, path1);
    			append_dev(g0, polygon3);
    			append_dev(g0, path2);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!current) return;
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, slide, { axis: "x", delay: 200, duration: 200 });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, slide, { axis: "x", duration: 200 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Logo', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Logo> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ slide });
    	return [];
    }

    class Logo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Logo",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src/nav-controls/Hamburger.svelte generated by Svelte v3.59.2 */
    const file$d = "src/nav-controls/Hamburger.svelte";

    function create_fragment$d(ctx) {
    	let div2;
    	let div0;
    	let t;
    	let div1;
    	let div2_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			attr_dev(div0, "class", "mobile-line first svelte-1dsxa6q");
    			add_location(div0, file$d, 64, 4, 1611);
    			attr_dev(div1, "class", "mobile-line second svelte-1dsxa6q");
    			add_location(div1, file$d, 65, 4, 1649);
    			attr_dev(div2, "class", div2_class_value = "mobile-hamburger " + /*openClass*/ ctx[0] + " svelte-1dsxa6q");
    			add_location(div2, file$d, 24, 0, 451);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t);
    			append_dev(div2, div1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div2, "click", /*click_handler*/ ctx[5], false, false, false, false),
    					listen_dev(div2, "keypress", /*keypress_handler*/ ctx[6], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*openClass*/ 1 && div2_class_value !== (div2_class_value = "mobile-hamburger " + /*openClass*/ ctx[0] + " svelte-1dsxa6q")) {
    				attr_dev(div2, "class", div2_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let $open;
    	let $version;
    	validate_store(open, 'open');
    	component_subscribe($$self, open, $$value => $$invalidate(1, $open = $$value));
    	validate_store(version, 'version');
    	component_subscribe($$self, version, $$value => $$invalidate(2, $version = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Hamburger', slots, []);
    	let { openClass } = $$props;
    	let { position } = $$props;

    	function openKeyPressedHamburger(e) {
    		switch (e.key) {
    			case "Enter":
    				open.set(!$open);
    				if (!$open) {
    					searchOpen.set(false);
    				}
    				break;
    		}
    	}

    	$$self.$$.on_mount.push(function () {
    		if (openClass === undefined && !('openClass' in $$props || $$self.$$.bound[$$self.$$.props['openClass']])) {
    			console.warn("<Hamburger> was created without expected prop 'openClass'");
    		}

    		if (position === undefined && !('position' in $$props || $$self.$$.bound[$$self.$$.props['position']])) {
    			console.warn("<Hamburger> was created without expected prop 'position'");
    		}
    	});

    	const writable_props = ['openClass', 'position'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Hamburger> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		if ($version == 1 || $version == 2) {
    			open.set(!$open);

    			if (!$open) {
    				searchOpen.set(false);
    			}
    		}
    	}; // if ($version == 2) {
    	//     if ($searchOpen) {

    	const keypress_handler = () => {
    		openKeyPressedHamburger();
    	};

    	$$self.$$set = $$props => {
    		if ('openClass' in $$props) $$invalidate(0, openClass = $$props.openClass);
    		if ('position' in $$props) $$invalidate(4, position = $$props.position);
    	};

    	$$self.$capture_state = () => ({
    		open,
    		searchOpen,
    		version,
    		openClassVersionTwo,
    		openClass,
    		position,
    		openKeyPressedHamburger,
    		$open,
    		$version
    	});

    	$$self.$inject_state = $$props => {
    		if ('openClass' in $$props) $$invalidate(0, openClass = $$props.openClass);
    		if ('position' in $$props) $$invalidate(4, position = $$props.position);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		openClass,
    		$open,
    		$version,
    		openKeyPressedHamburger,
    		position,
    		click_handler,
    		keypress_handler
    	];
    }

    class Hamburger extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { openClass: 0, position: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hamburger",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get openClass() {
    		throw new Error("<Hamburger>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set openClass(value) {
    		throw new Error("<Hamburger>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get position() {
    		throw new Error("<Hamburger>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error("<Hamburger>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/nav-controls/Search-Icon.svelte generated by Svelte v3.59.2 */
    const file$c = "src/nav-controls/Search-Icon.svelte";

    function create_fragment$c(ctx) {
    	let div;
    	let svg;
    	let g1;
    	let g0;
    	let rect;
    	let path;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			rect = svg_element("rect");
    			path = svg_element("path");
    			attr_dev(rect, "width", "24");
    			attr_dev(rect, "height", "24");
    			attr_dev(rect, "opacity", "0");
    			add_location(rect, file$c, 32, 17, 720);
    			attr_dev(path, "d", "M20.71 19.29l-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8 7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zM5 11a6 6 0 1 1 6 6 6 6 0 0 1-6-6z");
    			attr_dev(path, "class", "svelte-tzq6hp");
    			add_location(path, file$c, 32, 60, 763);
    			attr_dev(g0, "data-name", "search");
    			add_location(g0, file$c, 31, 13, 681);
    			attr_dev(g1, "data-name", "Layer 2");
    			add_location(g1, file$c, 30, 9, 645);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "class", "svelte-tzq6hp");
    			add_location(svg, file$c, 29, 4, 576);
    			attr_dev(div, "class", "svelte-tzq6hp");
    			add_location(div, file$c, 12, 0, 279);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, rect);
    			append_dev(g0, path);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", /*click_handler*/ ctx[2], false, false, false, false),
    					listen_dev(div, "keypress", /*keypress_handler*/ ctx[3], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $searchOpen;
    	validate_store(searchOpen, 'searchOpen');
    	component_subscribe($$self, searchOpen, $$value => $$invalidate(0, $searchOpen = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Search_Icon', slots, []);

    	function openKeyPressedSearch(e) {
    		switch (e.key) {
    			case "Enter":
    				searchOpen.set(!$searchOpen);
    				break;
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Search_Icon> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		openClassVersionTwo.set('closed');
    		searchOpen.set(!$searchOpen);

    		if ($searchOpen) {
    			open.set(true);
    			return;
    		}

    		open.set(false);
    	};

    	const keypress_handler = () => {
    		openKeyPressedSearch();
    	};

    	$$self.$capture_state = () => ({
    		searchOpen,
    		open,
    		version,
    		openClassVersionTwo,
    		openKeyPressedSearch,
    		$searchOpen
    	});

    	return [$searchOpen, openKeyPressedSearch, click_handler, keypress_handler];
    }

    class Search_Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Search_Icon",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src/nav-controls/Controls.svelte generated by Svelte v3.59.2 */
    const file$b = "src/nav-controls/Controls.svelte";

    // (68:4) {:else}
    function create_else_block_1$2(ctx) {
    	let logo;
    	let current;
    	logo = new Logo({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(logo.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(logo, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(logo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(logo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(logo, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$2.name,
    		type: "else",
    		source: "(68:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (53:4) {#if $version == 1 || $version == 2}
    function create_if_block_1$5(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2$5, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (!/*$searchOpen*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
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
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(53:4) {#if $version == 1 || $version == 2}",
    		ctx
    	});

    	return block;
    }

    // (56:8) {:else}
    function create_else_block$3(ctx) {
    	let input;
    	let input_intro;
    	let input_outro;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "name", "s");
    			attr_dev(input, "placeholder", "Search a product name, SKU or term…");
    			input.autofocus = true;
    			attr_dev(input, "autocomplete", "off");
    			attr_dev(input, "class", "svelte-cmahgy");
    			add_location(input, file$b, 56, 12, 1420);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*$searchQuery*/ ctx[4]);
    			current = true;
    			input.focus();

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[6]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$searchQuery*/ 16 && input.value !== /*$searchQuery*/ ctx[4]) {
    				set_input_value(input, /*$searchQuery*/ ctx[4]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!current) return;
    				if (input_outro) input_outro.end(1);
    				input_intro = create_in_transition(input, fade, { axis: "x", delay: 200, duration: 200 });
    				input_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (input_intro) input_intro.invalidate();
    			input_outro = create_out_transition(input, fade, { axis: "x", duration: 200 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			if (detaching && input_outro) input_outro.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(56:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (54:8) {#if !$searchOpen}
    function create_if_block_2$5(ctx) {
    	let logo;
    	let current;
    	logo = new Logo({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(logo.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(logo, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(logo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(logo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(logo, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$5.name,
    		type: "if",
    		source: "(54:8) {#if !$searchOpen}",
    		ctx
    	});

    	return block;
    }

    // (73:8) {#if $version == 1 || $version == 2}
    function create_if_block$9(ctx) {
    	let hamburger;
    	let current;

    	hamburger = new Hamburger({
    			props: {
    				openClass: /*openClassVersionOne*/ ctx[1],
    				position: "controls"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(hamburger.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(hamburger, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const hamburger_changes = {};
    			if (dirty & /*openClassVersionOne*/ 2) hamburger_changes.openClass = /*openClassVersionOne*/ ctx[1];
    			hamburger.$set(hamburger_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(hamburger.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(hamburger.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(hamburger, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(73:8) {#if $version == 1 || $version == 2}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div1;
    	let current_block_type_index;
    	let if_block0;
    	let t0;
    	let div0;
    	let searchicon;
    	let t1;
    	let div1_class_value;
    	let current;
    	const if_block_creators = [create_if_block_1$5, create_else_block_1$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$version*/ ctx[3] == 1 || /*$version*/ ctx[3] == 2) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	searchicon = new Search_Icon({ $$inline: true });
    	let if_block1 = (/*$version*/ ctx[3] == 1 || /*$version*/ ctx[3] == 2) && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if_block0.c();
    			t0 = space();
    			div0 = element("div");
    			create_component(searchicon.$$.fragment);
    			t1 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div0, "class", "control-icons svelte-cmahgy");
    			add_location(div0, file$b, 70, 4, 1844);
    			attr_dev(div1, "class", div1_class_value = "mobile-nav-controls " + /*openClass*/ ctx[0] + " svelte-cmahgy");
    			add_location(div1, file$b, 51, 0, 1257);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if_blocks[current_block_type_index].m(div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			mount_component(searchicon, div0, null);
    			append_dev(div0, t1);
    			if (if_block1) if_block1.m(div0, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div1, t0);
    			}

    			if (/*$version*/ ctx[3] == 1 || /*$version*/ ctx[3] == 2) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*$version*/ 8) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$9(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div0, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*openClass*/ 1 && div1_class_value !== (div1_class_value = "mobile-nav-controls " + /*openClass*/ ctx[0] + " svelte-cmahgy")) {
    				attr_dev(div1, "class", div1_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(searchicon.$$.fragment, local);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(searchicon.$$.fragment, local);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if_blocks[current_block_type_index].d();
    			destroy_component(searchicon);
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let openClassVersionOne;
    	let openClass;
    	let $searchOpen;
    	let $open;
    	let $version;
    	let $searchQuery;
    	validate_store(searchOpen, 'searchOpen');
    	component_subscribe($$self, searchOpen, $$value => $$invalidate(2, $searchOpen = $$value));
    	validate_store(open, 'open');
    	component_subscribe($$self, open, $$value => $$invalidate(5, $open = $$value));
    	validate_store(version, 'version');
    	component_subscribe($$self, version, $$value => $$invalidate(3, $version = $$value));
    	validate_store(searchQuery, 'searchQuery');
    	component_subscribe($$self, searchQuery, $$value => $$invalidate(4, $searchQuery = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Controls', slots, []);
    	let timer;

    	function cycleHamburger() {
    		if ($version == 1) {
    			if ($open) {
    				return "open";
    			} else {
    				return "closed";
    			}
    		}

    		if ($version == 2) {
    			if ($open && !$searchOpen) {
    				return "open";
    			} else {
    				return "closed";
    			}
    		}
    	}

    	searchQuery.subscribe(async value => {
    		if (value == "") {
    			results.set({});
    			return;
    		}

    		clearTimeout(timer);

    		timer = setTimeout(
    			async () => {
    				const data = await getResults(value, previousSuggestions);
    				results.set(data);
    			},
    			200
    		);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Controls> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		$searchQuery = this.value;
    		searchQuery.set($searchQuery);
    	}

    	$$self.$capture_state = () => ({
    		open,
    		searchOpen,
    		searchQuery,
    		results,
    		version,
    		openClassVersionTwo,
    		getResults,
    		previousSuggestions,
    		Logo,
    		Hamburger,
    		SearchIcon: Search_Icon,
    		fade,
    		timer,
    		cycleHamburger,
    		openClass,
    		openClassVersionOne,
    		$searchOpen,
    		$open,
    		$version,
    		$searchQuery
    	});

    	$$self.$inject_state = $$props => {
    		if ('timer' in $$props) timer = $$props.timer;
    		if ('openClass' in $$props) $$invalidate(0, openClass = $$props.openClass);
    		if ('openClassVersionOne' in $$props) $$invalidate(1, openClassVersionOne = $$props.openClassVersionOne);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$open*/ 32) {
    			$$invalidate(1, openClassVersionOne = $open ? "open" : "closed");
    		}
    	};

    	$$invalidate(0, openClass = cycleHamburger());

    	return [
    		openClass,
    		openClassVersionOne,
    		$searchOpen,
    		$version,
    		$searchQuery,
    		$open,
    		input_input_handler
    	];
    }

    class Controls extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Controls",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/nav-content/Submit.svelte generated by Svelte v3.59.2 */
    const file$a = "src/nav-content/Submit.svelte";

    // (27:4) {#if $version == 1}
    function create_if_block$8(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "result-count svelte-1i8yi2i");
    			add_location(div, file$a, 27, 8, 519);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(27:4) {#if $version == 1}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let button;
    	let t0;
    	let div0;
    	let t2;
    	let div2;
    	let div1;
    	let svg;
    	let path;
    	let button_class_value;
    	let mounted;
    	let dispose;
    	let if_block = /*$version*/ ctx[1] == 1 && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (if_block) if_block.c();
    			t0 = space();
    			div0 = element("div");
    			div0.textContent = "View All Results";
    			t2 = space();
    			div2 = element("div");
    			div1 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(div0, "class", "view-all svelte-1i8yi2i");
    			add_location(div0, file$a, 29, 4, 562);
    			attr_dev(path, "d", "M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z");
    			attr_dev(path, "fill", "#fff");
    			add_location(path, file$a, 37, 17, 865);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "13.922");
    			attr_dev(svg, "height", "16.245");
    			attr_dev(svg, "viewBox", "0 0 13.922 16.245");
    			attr_dev(svg, "class", "svelte-1i8yi2i");
    			add_location(svg, file$a, 32, 12, 685);
    			attr_dev(div1, "class", "view-all-chevron svelte-1i8yi2i");
    			add_location(div1, file$a, 31, 8, 642);
    			attr_dev(div2, "class", "view-all svelte-1i8yi2i");
    			add_location(div2, file$a, 30, 4, 611);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "id", "search-submit");
    			attr_dev(button, "class", button_class_value = "search-submit submit-btn " + /*versionClass*/ ctx[0] + " svelte-1i8yi2i");
    			button.value = "view all results";
    			add_location(button, file$a, 19, 0, 329);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			if (if_block) if_block.m(button, null);
    			append_dev(button, t0);
    			append_dev(button, div0);
    			append_dev(button, t2);
    			append_dev(button, div2);
    			append_dev(div2, div1);
    			append_dev(div1, svg);
    			append_dev(svg, path);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*submitForm*/ ctx[2], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$version*/ ctx[1] == 1) {
    				if (if_block) ; else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					if_block.m(button, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*versionClass*/ 1 && button_class_value !== (button_class_value = "search-submit submit-btn " + /*versionClass*/ ctx[0] + " svelte-1i8yi2i")) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $version;
    	validate_store(version, 'version');
    	component_subscribe($$self, version, $$value => $$invalidate(1, $version = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Submit', slots, []);
    	let { form } = $$props;

    	function submitForm() {
    		form.submit();
    	}

    	let versionClass = "";

    	if ($version == 1) {
    		versionClass = "submit-version-one";
    	}

    	if ($version == 2) {
    		versionClass = "submit-version-two";
    	}

    	$$self.$$.on_mount.push(function () {
    		if (form === undefined && !('form' in $$props || $$self.$$.bound[$$self.$$.props['form']])) {
    			console.warn("<Submit> was created without expected prop 'form'");
    		}
    	});

    	const writable_props = ['form'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Submit> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('form' in $$props) $$invalidate(3, form = $$props.form);
    	};

    	$$self.$capture_state = () => ({
    		version,
    		form,
    		submitForm,
    		versionClass,
    		$version
    	});

    	$$self.$inject_state = $$props => {
    		if ('form' in $$props) $$invalidate(3, form = $$props.form);
    		if ('versionClass' in $$props) $$invalidate(0, versionClass = $$props.versionClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [versionClass, $version, submitForm, form];
    }

    class Submit extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { form: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Submit",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get form() {
    		throw new Error("<Submit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set form(value) {
    		throw new Error("<Submit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/nav-content/Results.svelte generated by Svelte v3.59.2 */
    const file$9 = "src/nav-content/Results.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    // (24:4) {#if $searchQuery.length > 0}
    function create_if_block$7(ctx) {
    	let t0;
    	let div1;
    	let div0;
    	let t2;
    	let t3;
    	let t4;
    	let if_block3_anchor;
    	let current;
    	let if_block0 = /*$results*/ ctx[1]?.data?.productCategories?.length > 0 && /*$results*/ ctx[1]?.data?.productCategories[0] != /*$searchQuery*/ ctx[3] && create_if_block_10(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*$results*/ ctx[1]?.data?.products?.nodes?.length > 0) return create_if_block_7;
    		return create_else_block_2$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type(ctx);
    	let if_block2 = /*$results*/ ctx[1]?.data?.other != null && /*$results*/ ctx[1]?.data?.other?.length > 0 && create_if_block_2$4(ctx);
    	let if_block3 = (/*$version*/ ctx[4] == 1 || /*$version*/ ctx[4] == 2) && create_if_block_1$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Products";
    			t2 = space();
    			if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			t4 = space();
    			if (if_block3) if_block3.c();
    			if_block3_anchor = empty();
    			attr_dev(div0, "class", "result-title svelte-16fgc3b");
    			add_location(div0, file$9, 43, 12, 1578);
    			attr_dev(div1, "class", "search-results__section-title svelte-16fgc3b");
    			add_location(div1, file$9, 42, 16, 1522);
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t2);
    			if_block1.m(div1, null);
    			insert_dev(target, t3, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, t4, anchor);
    			if (if_block3) if_block3.m(target, anchor);
    			insert_dev(target, if_block3_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*$results*/ ctx[1]?.data?.productCategories?.length > 0 && /*$results*/ ctx[1]?.data?.productCategories[0] != /*$searchQuery*/ ctx[3]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_10(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div1, null);
    				}
    			}

    			if (/*$results*/ ctx[1]?.data?.other != null && /*$results*/ ctx[1]?.data?.other?.length > 0) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_2$4(ctx);
    					if_block2.c();
    					if_block2.m(t4.parentNode, t4);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*$version*/ ctx[4] == 1 || /*$version*/ ctx[4] == 2) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty & /*$version*/ 16) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_1$4(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(if_block3_anchor.parentNode, if_block3_anchor);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block3);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block3);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			if_block1.d();
    			if (detaching) detach_dev(t3);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(t4);
    			if (if_block3) if_block3.d(detaching);
    			if (detaching) detach_dev(if_block3_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(24:4) {#if $searchQuery.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (25:8) {#if $results?.data?.productCategories?.length > 0 && $results?.data?.productCategories[0] != $searchQuery}
    function create_if_block_10(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let each_value_2 = /*$results*/ ctx[1]?.data?.productCategories;
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Suggestions";
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "result-title svelte-16fgc3b");
    			add_location(div0, file$9, 26, 16, 844);
    			attr_dev(div1, "class", "search-results__section-title svelte-16fgc3b");
    			add_location(div1, file$9, 25, 12, 784);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div1, null);
    				}
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*searchQuery, $results, highlightResults, $searchQuery*/ 10) {
    				each_value_2 = /*$results*/ ctx[1]?.data?.productCategories;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(25:8) {#if $results?.data?.productCategories?.length > 0 && $results?.data?.productCategories[0] != $searchQuery}",
    		ctx
    	});

    	return block;
    }

    // (29:20) {#if i < 3 && $searchQuery != category}
    function create_if_block_11(ctx) {
    	let div;
    	let html_tag;
    	let raw_value = highlightResults(/*$searchQuery*/ ctx[3], /*category*/ ctx[14]) + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[7](/*category*/ ctx[14]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			html_tag = new HtmlTag(false);
    			t = space();
    			html_tag.a = t;
    			attr_dev(div, "class", "search-product-result svelte-16fgc3b");
    			add_location(div, file$9, 29, 24, 1045);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			html_tag.m(raw_value, div);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "keydown", /*keydown_handler*/ ctx[6], false, false, false, false),
    					listen_dev(div, "click", click_handler, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$searchQuery, $results*/ 10 && raw_value !== (raw_value = highlightResults(/*$searchQuery*/ ctx[3], /*category*/ ctx[14]) + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(29:20) {#if i < 3 && $searchQuery != category}",
    		ctx
    	});

    	return block;
    }

    // (28:16) {#each $results?.data?.productCategories as category, i}
    function create_each_block_2(ctx) {
    	let if_block_anchor;
    	let if_block = /*i*/ ctx[11] < 3 && /*$searchQuery*/ ctx[3] != /*category*/ ctx[14] && create_if_block_11(ctx);

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
    			if (/*i*/ ctx[11] < 3 && /*$searchQuery*/ ctx[3] != /*category*/ ctx[14]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_11(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(28:16) {#each $results?.data?.productCategories as category, i}",
    		ctx
    	});

    	return block;
    }

    // (73:12) {:else}
    function create_else_block_2$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "No Products Found";
    			attr_dev(div, "class", "search-product-result svelte-16fgc3b");
    			add_location(div, file$9, 73, 16, 3021);
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
    		id: create_else_block_2$1.name,
    		type: "else",
    		source: "(73:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (45:12) {#if $results?.data?.products?.nodes?.length > 0}
    function create_if_block_7(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*$results*/ ctx[1]?.data?.products?.nodes;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
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
    			if (dirty & /*$results, highlightResults, $searchQuery*/ 10) {
    				each_value_1 = /*$results*/ ctx[1]?.data?.products?.nodes;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(45:12) {#if $results?.data?.products?.nodes?.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (47:20) {#if i < 3}
    function create_if_block_8(ctx) {
    	let a;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let t1_value = /*product*/ ctx[12]?.customFields2?.skus.length + "";
    	let t1;
    	let t2;
    	let t3;
    	let div1;
    	let raw_value = highlightResults(/*$searchQuery*/ ctx[3], /*product*/ ctx[12]?.title) + "";
    	let t4;
    	let a_href_value;

    	function select_block_type_1(ctx, dirty) {
    		if (/*product*/ ctx[12]?.customFields2?.skus.length > 1) return create_if_block_9;
    		return create_else_block_1$1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			a = element("a");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			if_block.c();
    			t3 = space();
    			div1 = element("div");
    			t4 = space();
    			attr_dev(img, "height", "58px");
    			attr_dev(img, "width", "58px");
    			if (!src_url_equal(img.src, img_src_value = /*product*/ ctx[12]?.customFields2?.skus[0]?.productImages[0]?.productImage?.mediaItemUrl)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "result-image svelte-16fgc3b");
    			add_location(img, file$9, 48, 28, 1890);
    			attr_dev(div0, "class", "c-red search-product-sku-count svelte-16fgc3b");
    			add_location(div0, file$9, 57, 28, 2327);
    			add_location(div1, file$9, 63, 28, 2672);
    			attr_dev(a, "href", a_href_value = /*product*/ ctx[12]?.link);
    			attr_dev(a, "class", "search-product-result svelte-16fgc3b");
    			add_location(a, file$9, 47, 24, 1807);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, img);
    			append_dev(a, t0);
    			append_dev(a, div0);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			if_block.m(div0, null);
    			append_dev(a, t3);
    			append_dev(a, div1);
    			div1.innerHTML = raw_value;
    			append_dev(a, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$results*/ 2 && !src_url_equal(img.src, img_src_value = /*product*/ ctx[12]?.customFields2?.skus[0]?.productImages[0]?.productImage?.mediaItemUrl)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*$results*/ 2 && t1_value !== (t1_value = /*product*/ ctx[12]?.customFields2?.skus.length + "")) set_data_dev(t1, t1_value);

    			if (current_block_type !== (current_block_type = select_block_type_1(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			}

    			if (dirty & /*$searchQuery, $results*/ 10 && raw_value !== (raw_value = highlightResults(/*$searchQuery*/ ctx[3], /*product*/ ctx[12]?.title) + "")) div1.innerHTML = raw_value;
    			if (dirty & /*$results*/ 2 && a_href_value !== (a_href_value = /*product*/ ctx[12]?.link)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(47:20) {#if i < 3}",
    		ctx
    	});

    	return block;
    }

    // (62:32) {:else}
    function create_else_block_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Sku");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(62:32) {:else}",
    		ctx
    	});

    	return block;
    }

    // (60:32) {#if product?.customFields2?.skus.length > 1}
    function create_if_block_9(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Skus");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(60:32) {#if product?.customFields2?.skus.length > 1}",
    		ctx
    	});

    	return block;
    }

    // (46:16) {#each $results?.data?.products?.nodes as product, i}
    function create_each_block_1$1(ctx) {
    	let if_block_anchor;
    	let if_block = /*i*/ ctx[11] < 3 && create_if_block_8(ctx);

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
    			if (/*i*/ ctx[11] < 3) if_block.p(ctx, dirty);
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
    		source: "(46:16) {#each $results?.data?.products?.nodes as product, i}",
    		ctx
    	});

    	return block;
    }

    // (77:8) {#if $results?.data?.other != null && $results?.data?.other?.length > 0}
    function create_if_block_2$4(ctx) {
    	let div1;
    	let div0;
    	let t1;

    	function select_block_type_2(ctx, dirty) {
    		if (/*$results*/ ctx[1]?.data?.other) return create_if_block_3$2;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Other Results";
    			t1 = space();
    			if_block.c();
    			attr_dev(div0, "class", "result-title svelte-16fgc3b");
    			add_location(div0, file$9, 78, 16, 3266);
    			attr_dev(div1, "class", "search-results__section-title svelte-16fgc3b");
    			add_location(div1, file$9, 77, 12, 3206);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			if_block.m(div1, null);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(77:8) {#if $results?.data?.other != null && $results?.data?.other?.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (99:16) {:else}
    function create_else_block$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "No other pages found";
    			add_location(div, file$9, 99, 20, 4279);
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
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(99:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (80:16) {#if $results?.data?.other}
    function create_if_block_3$2(ctx) {
    	let each_1_anchor;
    	let each_value = /*$results*/ ctx[1]?.data?.other;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
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
    			if (dirty & /*$results, highlightResults, $searchQuery*/ 10) {
    				each_value = /*$results*/ ctx[1]?.data?.other;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
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
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(80:16) {#if $results?.data?.other}",
    		ctx
    	});

    	return block;
    }

    // (82:24) {#if i < 3}
    function create_if_block_4$2(ctx) {
    	let a;
    	let div0;
    	let raw_value = highlightResults(/*$searchQuery*/ ctx[3], /*other*/ ctx[9]?.title) + "";
    	let t0;
    	let div1;
    	let t1;
    	let a_href_value;

    	function select_block_type_3(ctx, dirty) {
    		if (/*other*/ ctx[9]?.postType == "post") return create_if_block_5$1;
    		if (/*other*/ ctx[9]?.postType == "page") return create_if_block_6$1;
    	}

    	let current_block_type = select_block_type_3(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			a = element("a");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t1 = space();
    			add_location(div0, file$9, 86, 32, 3671);
    			attr_dev(div1, "class", "other-post-type svelte-16fgc3b");
    			add_location(div1, file$9, 92, 32, 3955);
    			attr_dev(a, "href", a_href_value = /*other*/ ctx[9]?.permalink);
    			attr_dev(a, "class", "search-product-result other svelte-16fgc3b");
    			add_location(a, file$9, 82, 28, 3482);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, div0);
    			div0.innerHTML = raw_value;
    			append_dev(a, t0);
    			append_dev(a, div1);
    			if (if_block) if_block.m(div1, null);
    			append_dev(a, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$searchQuery, $results*/ 10 && raw_value !== (raw_value = highlightResults(/*$searchQuery*/ ctx[3], /*other*/ ctx[9]?.title) + "")) div0.innerHTML = raw_value;
    			if (current_block_type !== (current_block_type = select_block_type_3(ctx))) {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			}

    			if (dirty & /*$results*/ 2 && a_href_value !== (a_href_value = /*other*/ ctx[9]?.permalink)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);

    			if (if_block) {
    				if_block.d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(82:24) {#if i < 3}",
    		ctx
    	});

    	return block;
    }

    // (94:110) 
    function create_if_block_6$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Page");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(94:110) ",
    		ctx
    	});

    	return block;
    }

    // (94:36) {#if other?.postType == "post"}
    function create_if_block_5$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Article");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(94:36) {#if other?.postType == \\\"post\\\"}",
    		ctx
    	});

    	return block;
    }

    // (81:20) {#each $results?.data?.other as other, i}
    function create_each_block$6(ctx) {
    	let if_block_anchor;
    	let if_block = /*i*/ ctx[11] < 3 && create_if_block_4$2(ctx);

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
    			if (/*i*/ ctx[11] < 3) if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(81:20) {#each $results?.data?.other as other, i}",
    		ctx
    	});

    	return block;
    }

    // (103:21) {#if $version == 1 || $version == 2}
    function create_if_block_1$4(ctx) {
    	let submit;
    	let current;

    	submit = new Submit({
    			props: {
    				totalResults: /*totalResults*/ ctx[2],
    				form: /*form*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(submit.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(submit, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const submit_changes = {};
    			if (dirty & /*totalResults*/ 4) submit_changes.totalResults = /*totalResults*/ ctx[2];
    			if (dirty & /*form*/ 1) submit_changes.form = /*form*/ ctx[0];
    			submit.$set(submit_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(submit.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(submit.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(submit, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(103:21) {#if $version == 1 || $version == 2}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div1;
    	let div0;
    	let div1_intro;
    	let div1_outro;
    	let current;
    	let if_block = /*$searchQuery*/ ctx[3].length > 0 && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "results-container show svelte-16fgc3b");
    			attr_dev(div0, "id", "results-container");
    			add_location(div0, file$9, 19, 0, 551);
    			attr_dev(div1, "class", "menu-container svelte-16fgc3b");
    			add_location(div1, file$9, 16, 0, 448);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if (if_block) if_block.m(div0, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$searchQuery*/ ctx[3].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$searchQuery*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$7(ctx);
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
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			add_render_callback(() => {
    				if (!current) return;
    				if (div1_outro) div1_outro.end(1);
    				div1_intro = create_in_transition(div1, fade, { duration: 200, delay: 200 });
    				div1_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (div1_intro) div1_intro.invalidate();
    			div1_outro = create_out_transition(div1, fade, { duration: 200 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			if (detaching && div1_outro) div1_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let totalResults;
    	let openClass;
    	let $open;
    	let $results;
    	let $searchQuery;
    	let $version;
    	validate_store(open, 'open');
    	component_subscribe($$self, open, $$value => $$invalidate(5, $open = $$value));
    	validate_store(results, 'results');
    	component_subscribe($$self, results, $$value => $$invalidate(1, $results = $$value));
    	validate_store(searchQuery, 'searchQuery');
    	component_subscribe($$self, searchQuery, $$value => $$invalidate(3, $searchQuery = $$value));
    	validate_store(version, 'version');
    	component_subscribe($$self, version, $$value => $$invalidate(4, $version = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Results', slots, []);
    	let { form } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (form === undefined && !('form' in $$props || $$self.$$.bound[$$self.$$.props['form']])) {
    			console.warn("<Results> was created without expected prop 'form'");
    		}
    	});

    	const writable_props = ['form'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Results> was created with unknown prop '${key}'`);
    	});

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler = async category => {
    		searchQuery.set(category);
    	};

    	$$self.$$set = $$props => {
    		if ('form' in $$props) $$invalidate(0, form = $$props.form);
    	};

    	$$self.$capture_state = () => ({
    		Submit,
    		Hamburger,
    		results,
    		highlightResults,
    		searchQuery,
    		version,
    		open,
    		fade,
    		form,
    		openClass,
    		totalResults,
    		$open,
    		$results,
    		$searchQuery,
    		$version
    	});

    	$$self.$inject_state = $$props => {
    		if ('form' in $$props) $$invalidate(0, form = $$props.form);
    		if ('openClass' in $$props) openClass = $$props.openClass;
    		if ('totalResults' in $$props) $$invalidate(2, totalResults = $$props.totalResults);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$results*/ 2) {
    			$$invalidate(2, totalResults = $results?.products?.length + $results?.other?.length);
    		}

    		if ($$self.$$.dirty & /*$open*/ 32) {
    			openClass = $open ? "open" : "closed";
    		}
    	};

    	return [
    		form,
    		$results,
    		totalResults,
    		$searchQuery,
    		$version,
    		$open,
    		keydown_handler,
    		click_handler
    	];
    }

    class Results extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { form: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Results",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get form() {
    		throw new Error("<Results>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set form(value) {
    		throw new Error("<Results>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/nav-content/menu/SocialLinks.svelte generated by Svelte v3.59.2 */
    const file$8 = "src/nav-content/menu/SocialLinks.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (27:12) {#if menuVersionOne}
    function create_if_block$6(ctx) {
    	let each_1_anchor;
    	let each_value = /*menuVersionOne*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
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
    			if (dirty & /*menuVersionOne*/ 1) {
    				each_value = /*menuVersionOne*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
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
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(27:12) {#if menuVersionOne}",
    		ctx
    	});

    	return block;
    }

    // (28:16) {#each menuVersionOne as link}
    function create_each_block$5(ctx) {
    	let a;
    	let t_value = /*link*/ ctx[8].title + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = /*link*/ ctx[8].url);
    			attr_dev(a, "class", "svelte-10u95ht");
    			add_location(a, file$8, 28, 20, 625);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*menuVersionOne*/ 1 && t_value !== (t_value = /*link*/ ctx[8].title + "")) set_data_dev(t, t_value);

    			if (dirty & /*menuVersionOne*/ 1 && a_href_value !== (a_href_value = /*link*/ ctx[8].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(28:16) {#each menuVersionOne as link}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div4;
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let a0;
    	let svg0;
    	let path0;
    	let t1;
    	let a1;
    	let svg1;
    	let defs;
    	let style;
    	let t2;
    	let g1;
    	let g0;
    	let path1;
    	let t3;
    	let a2;
    	let svg2;
    	let g2;
    	let path2;
    	let path3;
    	let path4;
    	let path5;
    	let t4;
    	let a3;
    	let svg3;
    	let g3;
    	let rect0;
    	let path6;
    	let rect1;
    	let circle;
    	let t5;
    	let a4;
    	let svg4;
    	let g4;
    	let path7;
    	let t6;
    	let a5;
    	let svg5;
    	let path8;
    	let a5_href_value;
    	let t7;
    	let div3;
    	let if_block = /*menuVersionOne*/ ctx[0] && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			div1 = element("div");
    			a0 = element("a");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t1 = space();
    			a1 = element("a");
    			svg1 = svg_element("svg");
    			defs = svg_element("defs");
    			style = svg_element("style");
    			t2 = text(".cls-1 {\n                                fill: #fff;\n                                stroke-width: 0px;\n                            }\n                        ");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			path1 = svg_element("path");
    			t3 = space();
    			a2 = element("a");
    			svg2 = svg_element("svg");
    			g2 = svg_element("g");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			path4 = svg_element("path");
    			path5 = svg_element("path");
    			t4 = space();
    			a3 = element("a");
    			svg3 = svg_element("svg");
    			g3 = svg_element("g");
    			rect0 = svg_element("rect");
    			path6 = svg_element("path");
    			rect1 = svg_element("rect");
    			circle = svg_element("circle");
    			t5 = space();
    			a4 = element("a");
    			svg4 = svg_element("svg");
    			g4 = svg_element("g");
    			path7 = svg_element("path");
    			t6 = space();
    			a5 = element("a");
    			svg5 = svg_element("svg");
    			path8 = svg_element("path");
    			t7 = space();
    			div3 = element("div");
    			attr_dev(div0, "class", "social-block-menu svelte-10u95ht");
    			add_location(div0, file$8, 25, 8, 493);
    			attr_dev(path0, "d", "M21.531,3.708A.706.706,0,0,0,20.825,3H17.3a6.735,6.735,0,0,0-7.06,6.354v3.812H6.706A.706.706,0,0,0,6,13.874v3.671a.706.706,0,0,0,.706.706h3.53v9.46a.706.706,0,0,0,.706.706h4.236a.706.706,0,0,0,.706-.706v-9.46h3.7a.706.706,0,0,0,.692-.522l1.017-3.671a.706.706,0,0,0-.678-.89h-4.73V9.356A1.412,1.412,0,0,1,17.3,8.085h3.53a.706.706,0,0,0,.706-.706Z");
    			attr_dev(path0, "transform", "translate(-6 -2.994)");
    			attr_dev(path0, "fill", "#E63128");
    			add_location(path0, file$8, 37, 21, 957);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "viewBox", "0 0 15.531 25.423");
    			attr_dev(svg0, "class", "svelte-10u95ht");
    			add_location(svg0, file$8, 34, 16, 828);
    			attr_dev(a0, "href", /*$facebook*/ ctx[1]);
    			attr_dev(a0, "class", "social-link svelte-10u95ht");
    			add_location(a0, file$8, 33, 12, 771);
    			add_location(style, file$8, 52, 24, 1815);
    			add_location(defs, file$8, 51, 20, 1784);
    			attr_dev(path1, "id", "path1009");
    			attr_dev(path1, "class", "cls-1");
    			attr_dev(path1, "d", "m2.44,0l386.39,516.64L0,936.69h87.51l340.42-367.76,275.05,367.76h297.8l-408.13-545.7L954.57,0h-87.51l-313.51,338.7L300.24,0H2.44Zm128.69,64.46h136.81l604.13,807.76h-136.81L131.13,64.46Z");
    			add_location(path1, file$8, 61, 28, 2148);
    			attr_dev(g0, "id", "layer1");
    			add_location(g0, file$8, 60, 24, 2104);
    			attr_dev(g1, "id", "svg5");
    			add_location(g1, file$8, 59, 20, 2066);
    			attr_dev(svg1, "id", "Layer_2");
    			attr_dev(svg1, "data-name", "Layer 2");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 1000.78 936.69");
    			attr_dev(svg1, "class", "svelte-10u95ht");
    			add_location(svg1, file$8, 45, 16, 1564);
    			attr_dev(a1, "href", /*$twitter*/ ctx[2]);
    			attr_dev(a1, "class", "social-link svelte-10u95ht");
    			add_location(a1, file$8, 44, 12, 1508);
    			attr_dev(path2, "d", "M18.841,0H7.993A8,8,0,0,0,0,7.993V18.841a8,8,0,0,0,7.993,7.993H18.841a8,8,0,0,0,7.993-7.993V7.993A8,8,0,0,0,18.841,0Zm5.3,18.841a5.3,5.3,0,0,1-5.3,5.3H7.993a5.3,5.3,0,0,1-5.3-5.3V7.993a5.3,5.3,0,0,1,5.3-5.3H18.841a5.3,5.3,0,0,1,5.3,5.3Z");
    			attr_dev(path2, "fill", "#E63128");
    			add_location(path2, file$8, 75, 25, 2847);
    			attr_dev(path3, "d", "M396.5,309.5");
    			attr_dev(path3, "transform", "translate(-372.362 -290.659)");
    			attr_dev(path3, "fill", "#E63128");
    			add_location(path3, file$8, 78, 26, 3191);
    			attr_dev(path4, "d", "M113.34,106.4a6.94,6.94,0,1,0,6.94,6.94A6.94,6.94,0,0,0,113.34,106.4Zm0,11.183a4.243,4.243,0,1,1,4.243-4.243A4.243,4.243,0,0,1,113.34,117.583Zm0,0");
    			attr_dev(path4, "transform", "translate(-99.923 -99.923)");
    			attr_dev(path4, "fill", "#E63128");
    			add_location(path4, file$8, 82, 26, 3380);
    			attr_dev(path5, "d", "M310.724,81.662A1.662,1.662,0,1,1,309.062,80,1.662,1.662,0,0,1,310.724,81.662Zm0,0");
    			attr_dev(path5, "transform", "translate(-288.687 -75.13)");
    			attr_dev(path5, "fill", "#E63128");
    			add_location(path5, file$8, 86, 26, 3701);
    			attr_dev(g2, "transform", "translate(0 0)");
    			add_location(g2, file$8, 74, 21, 2792);
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "viewBox", "0 0 26.834 26.834");
    			attr_dev(svg2, "class", "svelte-10u95ht");
    			add_location(svg2, file$8, 71, 16, 2663);
    			attr_dev(a2, "href", /*$instagram*/ ctx[3]);
    			attr_dev(a2, "class", "social-link svelte-10u95ht");
    			add_location(a2, file$8, 70, 12, 2605);
    			attr_dev(rect0, "width", "34");
    			attr_dev(rect0, "height", "34");
    			attr_dev(rect0, "transform", "translate(34.281 34.121) rotate(180)");
    			attr_dev(rect0, "fill", "#E63128");
    			attr_dev(rect0, "opacity", "0");
    			add_location(rect0, file$8, 97, 25, 4239);
    			attr_dev(path6, "d", "M17.56,8.4A8.231,8.231,0,0,0,9.3,16.617v8.3a1.271,1.271,0,0,0,1.271,1.271h2.965a1.271,1.271,0,0,0,1.271-1.271v-8.3a2.739,2.739,0,0,1,3.036-2.725,2.824,2.824,0,0,1,2.471,2.824v8.2a1.271,1.271,0,0,0,1.271,1.271h2.965a1.271,1.271,0,0,0,1.271-1.271v-8.3A8.231,8.231,0,0,0,17.56,8.4Z");
    			attr_dev(path6, "transform", "translate(3.831 3.46)");
    			attr_dev(path6, "fill", "#E63128");
    			add_location(path6, file$8, 103, 26, 4510);
    			attr_dev(rect1, "width", "6.354");
    			attr_dev(rect1, "height", "16.519");
    			attr_dev(rect1, "rx", "0.9");
    			attr_dev(rect1, "transform", "translate(4.236 13.131)");
    			attr_dev(rect1, "fill", "#E63128");
    			add_location(rect1, file$8, 107, 26, 4958);
    			attr_dev(circle, "cx", "3.177");
    			attr_dev(circle, "cy", "3.177");
    			attr_dev(circle, "r", "3.177");
    			attr_dev(circle, "transform", "translate(4.236 4.236)");
    			attr_dev(circle, "fill", "#E63128");
    			add_location(circle, file$8, 113, 26, 5220);
    			attr_dev(g3, "transform", "translate(-0.281 -0.121)");
    			add_location(g3, file$8, 96, 21, 4174);
    			attr_dev(svg3, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg3, "viewBox", "0 0 34 34");
    			attr_dev(svg3, "class", "svelte-10u95ht");
    			add_location(svg3, file$8, 95, 16, 4093);
    			attr_dev(a3, "href", /*$linkedin*/ ctx[4]);
    			attr_dev(a3, "class", "social-link svelte-10u95ht");
    			add_location(a3, file$8, 94, 12, 4036);
    			attr_dev(path7, "d", "M35.1,80.488c-.56-4.735-2.438-5.387-6.173-5.642-5.309-.361-17.166-.361-22.482,0-3.728.255-5.6.907-6.159,5.642a67.868,67.868,0,0,0,0,13.034c.56,4.735,2.431,5.387,6.166,5.642,5.316.361,17.173.361,22.482,0,3.735-.255,5.613-.907,6.173-5.642A69.034,69.034,0,0,0,35.1,80.488ZM14.11,92.02V82.132l9.476,4.947Z");
    			attr_dev(path7, "transform", "translate(0.025 -74.575)");
    			attr_dev(path7, "fill", "#E63128");
    			add_location(path7, file$8, 128, 25, 5792);
    			attr_dev(g4, "transform", "translate(0 0)");
    			add_location(g4, file$8, 127, 21, 5737);
    			attr_dev(svg4, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg4, "viewBox", "0 0 35.44 24.86");
    			attr_dev(svg4, "class", "svelte-10u95ht");
    			add_location(svg4, file$8, 124, 16, 5610);
    			attr_dev(a4, "href", /*$youtube*/ ctx[5]);
    			attr_dev(a4, "class", "social-link svelte-10u95ht");
    			add_location(a4, file$8, 123, 12, 5554);
    			attr_dev(path8, "d", "M27.5,4H6.5A4.5,4.5,0,0,0,2,8.5v15A4.5,4.5,0,0,0,6.5,28h21A4.5,4.5,0,0,0,32,23.5V8.5A4.5,4.5,0,0,0,27.5,4Zm0,3-9.75,6.7a1.5,1.5,0,0,1-1.5,0L6.5,7Z");
    			attr_dev(path8, "transform", "translate(-2 -4)");
    			attr_dev(path8, "fill", "#E63128");
    			add_location(path8, file$8, 138, 21, 6495);
    			attr_dev(svg5, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg5, "viewBox", "0 0 29.999 24");
    			attr_dev(svg5, "class", "svelte-10u95ht");
    			add_location(svg5, file$8, 137, 16, 6410);
    			attr_dev(a5, "href", a5_href_value = "mailto:" + /*$email*/ ctx[6]);
    			attr_dev(a5, "class", "social-link svelte-10u95ht");
    			add_location(a5, file$8, 136, 12, 6344);
    			attr_dev(div1, "class", "social-links-icons svelte-10u95ht");
    			add_location(div1, file$8, 32, 8, 726);
    			attr_dev(div2, "class", "social-block-links svelte-10u95ht");
    			add_location(div2, file$8, 24, 4, 452);
    			attr_dev(div3, "class", "social-block-hash svelte-10u95ht");
    			add_location(div3, file$8, 147, 4, 6861);
    			attr_dev(div4, "class", "social-block svelte-10u95ht");
    			add_location(div4, file$8, 23, 0, 421);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div2);
    			append_dev(div2, div0);
    			if (if_block) if_block.m(div0, null);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, a0);
    			append_dev(a0, svg0);
    			append_dev(svg0, path0);
    			append_dev(div1, t1);
    			append_dev(div1, a1);
    			append_dev(a1, svg1);
    			append_dev(svg1, defs);
    			append_dev(defs, style);
    			append_dev(style, t2);
    			append_dev(svg1, g1);
    			append_dev(g1, g0);
    			append_dev(g0, path1);
    			append_dev(div1, t3);
    			append_dev(div1, a2);
    			append_dev(a2, svg2);
    			append_dev(svg2, g2);
    			append_dev(g2, path2);
    			append_dev(g2, path3);
    			append_dev(g2, path4);
    			append_dev(g2, path5);
    			append_dev(div1, t4);
    			append_dev(div1, a3);
    			append_dev(a3, svg3);
    			append_dev(svg3, g3);
    			append_dev(g3, rect0);
    			append_dev(g3, path6);
    			append_dev(g3, rect1);
    			append_dev(g3, circle);
    			append_dev(div1, t5);
    			append_dev(div1, a4);
    			append_dev(a4, svg4);
    			append_dev(svg4, g4);
    			append_dev(g4, path7);
    			append_dev(div1, t6);
    			append_dev(div1, a5);
    			append_dev(a5, svg5);
    			append_dev(svg5, path8);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*menuVersionOne*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*$facebook*/ 2) {
    				attr_dev(a0, "href", /*$facebook*/ ctx[1]);
    			}

    			if (dirty & /*$twitter*/ 4) {
    				attr_dev(a1, "href", /*$twitter*/ ctx[2]);
    			}

    			if (dirty & /*$instagram*/ 8) {
    				attr_dev(a2, "href", /*$instagram*/ ctx[3]);
    			}

    			if (dirty & /*$linkedin*/ 16) {
    				attr_dev(a3, "href", /*$linkedin*/ ctx[4]);
    			}

    			if (dirty & /*$youtube*/ 32) {
    				attr_dev(a4, "href", /*$youtube*/ ctx[5]);
    			}

    			if (dirty & /*$email*/ 64 && a5_href_value !== (a5_href_value = "mailto:" + /*$email*/ ctx[6])) {
    				attr_dev(a5, "href", a5_href_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (if_block) if_block.d();
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
    	let $menus;
    	let $facebook;
    	let $twitter;
    	let $instagram;
    	let $linkedin;
    	let $youtube;
    	let $email;
    	validate_store(menus, 'menus');
    	component_subscribe($$self, menus, $$value => $$invalidate(7, $menus = $$value));
    	validate_store(facebook, 'facebook');
    	component_subscribe($$self, facebook, $$value => $$invalidate(1, $facebook = $$value));
    	validate_store(twitter, 'twitter');
    	component_subscribe($$self, twitter, $$value => $$invalidate(2, $twitter = $$value));
    	validate_store(instagram, 'instagram');
    	component_subscribe($$self, instagram, $$value => $$invalidate(3, $instagram = $$value));
    	validate_store(linkedin, 'linkedin');
    	component_subscribe($$self, linkedin, $$value => $$invalidate(4, $linkedin = $$value));
    	validate_store(youtube, 'youtube');
    	component_subscribe($$self, youtube, $$value => $$invalidate(5, $youtube = $$value));
    	validate_store(email, 'email');
    	component_subscribe($$self, email, $$value => $$invalidate(6, $email = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SocialLinks', slots, []);
    	let menuVersionOne;

    	onMount(() => {
    		$menus.forEach(menu => {
    			if (menu.slug == "mobile-v1") {
    				$$invalidate(0, menuVersionOne = menu.menuItems.nodes);
    			}
    		});
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SocialLinks> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		facebook,
    		instagram,
    		twitter,
    		linkedin,
    		youtube,
    		email,
    		menus,
    		onMount,
    		menuVersionOne,
    		$menus,
    		$facebook,
    		$twitter,
    		$instagram,
    		$linkedin,
    		$youtube,
    		$email
    	});

    	$$self.$inject_state = $$props => {
    		if ('menuVersionOne' in $$props) $$invalidate(0, menuVersionOne = $$props.menuVersionOne);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [menuVersionOne, $facebook, $twitter, $instagram, $linkedin, $youtube, $email];
    }

    class SocialLinks extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SocialLinks",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/nav-content/menu/MenuImageLinks.svelte generated by Svelte v3.59.2 */

    const { console: console_1 } = globals;
    const file$7 = "src/nav-content/menu/MenuImageLinks.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (10:4) {#if $imageLinks && $imageLinks.length > 0}
    function create_if_block$5(ctx) {
    	let each_1_anchor;
    	let each_value = /*$imageLinks*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
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
    			if (dirty & /*$imageLinks*/ 1) {
    				each_value = /*$imageLinks*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
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
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(10:4) {#if $imageLinks && $imageLinks.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (11:4) {#each $imageLinks as link}
    function create_each_block$4(ctx) {
    	let a;
    	let p;
    	let t0_value = /*link*/ ctx[1].text + "";
    	let t0;
    	let t1;
    	let a_href_value;
    	let a_class_value;
    	let a_style_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(p, "class", "svelte-46z6t1");
    			add_location(p, file$7, 16, 8, 447);
    			attr_dev(a, "href", a_href_value = /*link*/ ctx[1].Url);
    			attr_dev(a, "class", a_class_value = "image-link " + /*link*/ ctx[1].textColor + " " + /*link*/ ctx[1].textAlignement + " svelte-46z6t1");
    			attr_dev(a, "style", a_style_value = `background-image: url('${/*link*/ ctx[1].backgroundImage.sourceUrl}');`);
    			add_location(a, file$7, 11, 4, 262);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, p);
    			append_dev(p, t0);
    			append_dev(a, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$imageLinks*/ 1 && t0_value !== (t0_value = /*link*/ ctx[1].text + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*$imageLinks*/ 1 && a_href_value !== (a_href_value = /*link*/ ctx[1].Url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*$imageLinks*/ 1 && a_class_value !== (a_class_value = "image-link " + /*link*/ ctx[1].textColor + " " + /*link*/ ctx[1].textAlignement + " svelte-46z6t1")) {
    				attr_dev(a, "class", a_class_value);
    			}

    			if (dirty & /*$imageLinks*/ 1 && a_style_value !== (a_style_value = `background-image: url('${/*link*/ ctx[1].backgroundImage.sourceUrl}');`)) {
    				attr_dev(a, "style", a_style_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(11:4) {#each $imageLinks as link}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div;
    	let if_block = /*$imageLinks*/ ctx[0] && /*$imageLinks*/ ctx[0].length > 0 && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "menu-image-container svelte-46z6t1");
    			add_location(div, file$7, 8, 0, 143);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$imageLinks*/ ctx[0] && /*$imageLinks*/ ctx[0].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$5(ctx);
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
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $imageLinks;
    	validate_store(imageLinks, 'imageLinks');
    	component_subscribe($$self, imageLinks, $$value => $$invalidate(0, $imageLinks = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MenuImageLinks', slots, []);

    	imageLinks.subscribe(value => {
    		console.log(value);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<MenuImageLinks> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ imageLinks, $imageLinks });
    	return [$imageLinks];
    }

    class MenuImageLinks extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MenuImageLinks",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/nav-content/menu/MainMenu.svelte generated by Svelte v3.59.2 */
    const file$6 = "src/nav-content/menu/MainMenu.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    // (63:8) {#if !loading}
    function create_if_block_2$3(ctx) {
    	let each_1_anchor;
    	let each_value = /*navbar*/ ctx[1].menuItems.nodes;
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
    			if (dirty & /*menuParentId, navbar, menuParentTitle*/ 2) {
    				each_value = /*navbar*/ ctx[1].menuItems.nodes;
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
    		source: "(63:8) {#if !loading}",
    		ctx
    	});

    	return block;
    }

    // (65:12) {#if link.parentId == null && link.hasChildren == false}
    function create_if_block_4$1(ctx) {
    	let a;
    	let t_value = /*link*/ ctx[11].title + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = /*link*/ ctx[11].url);
    			attr_dev(a, "class", "menu-item svelte-skm696");
    			add_location(a, file$6, 65, 16, 2068);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*navbar*/ 2 && t_value !== (t_value = /*link*/ ctx[11].title + "")) set_data_dev(t, t_value);

    			if (dirty & /*navbar*/ 2 && a_href_value !== (a_href_value = /*link*/ ctx[11].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(65:12) {#if link.parentId == null && link.hasChildren == false}",
    		ctx
    	});

    	return block;
    }

    // (68:12) {#if link.parentId == null && link.hasChildren == true}
    function create_if_block_3$1(ctx) {
    	let div;
    	let a;
    	let t0_value = /*link*/ ctx[11].title + "";
    	let t0;
    	let a_href_value;
    	let t1;
    	let svg;
    	let path;
    	let t2;
    	let mounted;
    	let dispose;

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[9](/*link*/ ctx[11]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t2 = space();
    			attr_dev(a, "href", a_href_value = /*link*/ ctx[11].url);
    			attr_dev(a, "class", "svelte-skm696");
    			add_location(a, file$6, 72, 20, 2414);
    			attr_dev(path, "d", "M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z");
    			attr_dev(path, "fill", "#fff");
    			attr_dev(path, "class", "svelte-skm696");
    			add_location(path, file$6, 78, 25, 2691);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "13.922");
    			attr_dev(svg, "height", "16.245");
    			attr_dev(svg, "viewBox", "0 0 13.922 16.245");
    			attr_dev(svg, "class", "svelte-skm696");
    			add_location(svg, file$6, 73, 20, 2471);
    			attr_dev(div, "class", "menu-item svelte-skm696");
    			add_location(div, file$6, 68, 16, 2224);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, t0);
    			append_dev(div, t1);
    			append_dev(div, svg);
    			append_dev(svg, path);
    			append_dev(div, t2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", click_handler_2, false, false, false, false),
    					listen_dev(div, "keydown", /*keydown_handler_2*/ ctx[4], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*navbar*/ 2 && t0_value !== (t0_value = /*link*/ ctx[11].title + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*navbar*/ 2 && a_href_value !== (a_href_value = /*link*/ ctx[11].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(68:12) {#if link.parentId == null && link.hasChildren == true}",
    		ctx
    	});

    	return block;
    }

    // (64:8) {#each navbar.menuItems.nodes as link}
    function create_each_block$3(ctx) {
    	let t;
    	let if_block1_anchor;
    	let if_block0 = /*link*/ ctx[11].parentId == null && /*link*/ ctx[11].hasChildren == false && create_if_block_4$1(ctx);
    	let if_block1 = /*link*/ ctx[11].parentId == null && /*link*/ ctx[11].hasChildren == true && create_if_block_3$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*link*/ ctx[11].parentId == null && /*link*/ ctx[11].hasChildren == false) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_4$1(ctx);
    					if_block0.c();
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*link*/ ctx[11].parentId == null && /*link*/ ctx[11].hasChildren == true) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_3$1(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(64:8) {#each navbar.menuItems.nodes as link}",
    		ctx
    	});

    	return block;
    }

    // (92:32) 
    function create_if_block_1$3(ctx) {
    	let menuimagelinks;
    	let current;
    	menuimagelinks = new MenuImageLinks({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(menuimagelinks.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(menuimagelinks, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menuimagelinks.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menuimagelinks.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(menuimagelinks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(92:32) ",
    		ctx
    	});

    	return block;
    }

    // (90:8) {#if $version == 1}
    function create_if_block$4(ctx) {
    	let sociallinks;
    	let current;
    	sociallinks = new SocialLinks({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(sociallinks.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sociallinks, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sociallinks.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sociallinks.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sociallinks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(90:8) {#if $version == 1}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div4;
    	let div2;
    	let div0;
    	let t0_value = /*interests*/ ctx[0].name + "";
    	let t0;
    	let t1;
    	let svg0;
    	let path0;
    	let t2;
    	let div1;
    	let t3;
    	let svg1;
    	let path1;
    	let t4;
    	let t5;
    	let div3;
    	let current_block_type_index;
    	let if_block1;
    	let div4_intro;
    	let div4_outro;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = !/*loading*/ ctx[2] && create_if_block_2$3(ctx);
    	const if_block_creators = [create_if_block$4, create_if_block_1$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$version*/ ctx[3] == 1) return 0;
    		if (/*$version*/ ctx[3] == 2) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t2 = space();
    			div1 = element("div");
    			t3 = text("Products\n\n            ");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t4 = space();
    			if (if_block0) if_block0.c();
    			t5 = space();
    			div3 = element("div");
    			if (if_block1) if_block1.c();
    			attr_dev(path0, "d", "M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z");
    			attr_dev(path0, "fill", "#fff");
    			attr_dev(path0, "class", "svelte-skm696");
    			add_location(path0, file$6, 42, 17, 1271);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "width", "13.922");
    			attr_dev(svg0, "height", "16.245");
    			attr_dev(svg0, "viewBox", "0 0 13.922 16.245");
    			attr_dev(svg0, "class", "svelte-skm696");
    			add_location(svg0, file$6, 37, 12, 1091);
    			attr_dev(div0, "class", "menu-item svelte-skm696");
    			add_location(div0, file$6, 34, 8, 979);
    			attr_dev(path1, "d", "M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z");
    			attr_dev(path1, "fill", "#fff");
    			attr_dev(path1, "class", "svelte-skm696");
    			add_location(path1, file$6, 56, 17, 1738);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "width", "13.922");
    			attr_dev(svg1, "height", "16.245");
    			attr_dev(svg1, "viewBox", "0 0 13.922 16.245");
    			attr_dev(svg1, "class", "svelte-skm696");
    			add_location(svg1, file$6, 51, 12, 1558);
    			attr_dev(div1, "class", "menu-item svelte-skm696");
    			add_location(div1, file$6, 48, 8, 1454);
    			add_location(div2, file$6, 33, 4, 965);
    			attr_dev(div3, "class", "version-container svelte-skm696");
    			add_location(div3, file$6, 88, 4, 2969);
    			attr_dev(div4, "class", "menu-container svelte-skm696");
    			add_location(div4, file$6, 28, 0, 850);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div2);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, svg0);
    			append_dev(svg0, path0);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, t3);
    			append_dev(div1, svg1);
    			append_dev(svg1, path1);
    			append_dev(div2, t4);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div4, t5);
    			append_dev(div4, div3);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div3, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*click_handler*/ ctx[7], false, false, false, false),
    					listen_dev(div0, "keydown", /*keydown_handler*/ ctx[6], false, false, false, false),
    					listen_dev(div1, "click", /*click_handler_1*/ ctx[8], false, false, false, false),
    					listen_dev(div1, "keydown", /*keydown_handler_1*/ ctx[5], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*interests*/ 1) && t0_value !== (t0_value = /*interests*/ ctx[0].name + "")) set_data_dev(t0, t0_value);

    			if (!/*loading*/ ctx[2]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$3(ctx);
    					if_block0.c();
    					if_block0.m(div2, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				if (if_block1) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block1 = if_blocks[current_block_type_index];

    					if (!if_block1) {
    						if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block1.c();
    					}

    					transition_in(if_block1, 1);
    					if_block1.m(div3, null);
    				} else {
    					if_block1 = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);

    			add_render_callback(() => {
    				if (!current) return;
    				if (div4_outro) div4_outro.end(1);
    				div4_intro = create_in_transition(div4, fade, { delay: 200, duration: 200 });
    				div4_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			if (div4_intro) div4_intro.invalidate();
    			div4_outro = create_out_transition(div4, fade, { duration: 200 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (if_block0) if_block0.d();

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			if (detaching && div4_outro) div4_outro.end();
    			mounted = false;
    			run_all(dispose);
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
    	let $version;
    	validate_store(version, 'version');
    	component_subscribe($$self, version, $$value => $$invalidate(3, $version = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MainMenu', slots, []);
    	let { interests } = $$props;
    	let { navbar } = $$props;
    	let loading = true;
    	let parentIds = new Set();

    	onMount(() => {
    		navbar.menuItems.nodes.forEach(item => {
    			if (item.parentId != null) {
    				parentIds.add(item.parentId);
    			}
    		});

    		navbar.menuItems.nodes.forEach(item => {
    			if (parentIds.has(item.id)) {
    				item.hasChildren = true;
    			} else {
    				item.hasChildren = false;
    			}
    		});

    		$$invalidate(2, loading = false);
    	});

    	$$self.$$.on_mount.push(function () {
    		if (interests === undefined && !('interests' in $$props || $$self.$$.bound[$$self.$$.props['interests']])) {
    			console.warn("<MainMenu> was created without expected prop 'interests'");
    		}

    		if (navbar === undefined && !('navbar' in $$props || $$self.$$.bound[$$self.$$.props['navbar']])) {
    			console.warn("<MainMenu> was created without expected prop 'navbar'");
    		}
    	});

    	const writable_props = ['interests', 'navbar'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MainMenu> was created with unknown prop '${key}'`);
    	});

    	function keydown_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler = () => activeMenu.set(1);
    	const click_handler_1 = () => activeMenu.set(2);

    	const click_handler_2 = link => {
    		menuParentId.set(link.id);
    		menuParentTitle.set(link.title);
    	};

    	$$self.$$set = $$props => {
    		if ('interests' in $$props) $$invalidate(0, interests = $$props.interests);
    		if ('navbar' in $$props) $$invalidate(1, navbar = $$props.navbar);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		activeMenu,
    		version,
    		menuParentId,
    		menuParentTitle,
    		SocialLinks,
    		MenuImageLinks,
    		onMount,
    		interests,
    		navbar,
    		loading,
    		parentIds,
    		$version
    	});

    	$$self.$inject_state = $$props => {
    		if ('interests' in $$props) $$invalidate(0, interests = $$props.interests);
    		if ('navbar' in $$props) $$invalidate(1, navbar = $$props.navbar);
    		if ('loading' in $$props) $$invalidate(2, loading = $$props.loading);
    		if ('parentIds' in $$props) parentIds = $$props.parentIds;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		interests,
    		navbar,
    		loading,
    		$version,
    		keydown_handler_2,
    		keydown_handler_1,
    		keydown_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class MainMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { interests: 0, navbar: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MainMenu",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get interests() {
    		throw new Error("<MainMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set interests(value) {
    		throw new Error("<MainMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get navbar() {
    		throw new Error("<MainMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set navbar(value) {
    		throw new Error("<MainMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/nav-content/menu/InterestMenu.svelte generated by Svelte v3.59.2 */
    const file$5 = "src/nav-content/menu/InterestMenu.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (27:4) {#each interests.menuItems.nodes as interest}
    function create_each_block$2(ctx) {
    	let a;
    	let t_value = /*interest*/ ctx[3].title + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "class", "menu-item svelte-11azvvi");
    			attr_dev(a, "href", a_href_value = /*interest*/ ctx[3].url);
    			add_location(a, file$5, 27, 8, 799);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*interests*/ 1 && t_value !== (t_value = /*interest*/ ctx[3].title + "")) set_data_dev(t, t_value);

    			if (dirty & /*interests*/ 1 && a_href_value !== (a_href_value = /*interest*/ ctx[3].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(27:4) {#each interests.menuItems.nodes as interest}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div3;
    	let div2;
    	let svg;
    	let path;
    	let t0;
    	let div0;
    	let t1_value = /*interests*/ ctx[0].name + "";
    	let t1;
    	let t2;
    	let div1;
    	let t3;
    	let div3_intro;
    	let div3_outro;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*interests*/ ctx[0].menuItems.nodes;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t0 = space();
    			div0 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			div1 = element("div");
    			t3 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(path, "d", "M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z");
    			attr_dev(path, "fill", "#fff");
    			attr_dev(path, "class", "svelte-11azvvi");
    			add_location(path, file$5, 17, 13, 518);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "13.922");
    			attr_dev(svg, "height", "16.245");
    			attr_dev(svg, "viewBox", "0 0 13.922 16.245");
    			attr_dev(svg, "class", "svelte-11azvvi");
    			add_location(svg, file$5, 12, 8, 358);
    			add_location(div0, file$5, 23, 8, 671);
    			attr_dev(div1, "class", "spacer svelte-11azvvi");
    			add_location(div1, file$5, 24, 8, 707);
    			attr_dev(div2, "class", "menu-title svelte-11azvvi");
    			add_location(div2, file$5, 11, 4, 279);
    			attr_dev(div3, "class", "menu-container svelte-11azvvi");
    			add_location(div3, file$5, 6, 0, 142);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, svg);
    			append_dev(svg, path);
    			append_dev(div2, t0);
    			append_dev(div2, div0);
    			append_dev(div0, t1);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div3, t3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div3, null);
    				}
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div2, "click", /*click_handler*/ ctx[2], false, false, false, false),
    					listen_dev(div2, "keydown", /*keydown_handler*/ ctx[1], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*interests*/ 1) && t1_value !== (t1_value = /*interests*/ ctx[0].name + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*interests*/ 1) {
    				each_value = /*interests*/ ctx[0].menuItems.nodes;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div3, null);
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
    				if (div3_outro) div3_outro.end(1);
    				div3_intro = create_in_transition(div3, fade, { axis: "x", delay: 200, duration: 200 });
    				div3_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div3_intro) div3_intro.invalidate();
    			div3_outro = create_out_transition(div3, fade, { axis: "x", duration: 200 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_each(each_blocks, detaching);
    			if (detaching && div3_outro) div3_outro.end();
    			mounted = false;
    			run_all(dispose);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InterestMenu', slots, []);
    	let { interests } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (interests === undefined && !('interests' in $$props || $$self.$$.bound[$$self.$$.props['interests']])) {
    			console.warn("<InterestMenu> was created without expected prop 'interests'");
    		}
    	});

    	const writable_props = ['interests'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InterestMenu> was created with unknown prop '${key}'`);
    	});

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler = () => activeMenu.set(0);

    	$$self.$$set = $$props => {
    		if ('interests' in $$props) $$invalidate(0, interests = $$props.interests);
    	};

    	$$self.$capture_state = () => ({ fade, activeMenu, interests });

    	$$self.$inject_state = $$props => {
    		if ('interests' in $$props) $$invalidate(0, interests = $$props.interests);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [interests, keydown_handler, click_handler];
    }

    class InterestMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { interests: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InterestMenu",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get interests() {
    		throw new Error("<InterestMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set interests(value) {
    		throw new Error("<InterestMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/nav-content/menu/ProductMenu.svelte generated by Svelte v3.59.2 */
    const file$4 = "src/nav-content/menu/ProductMenu.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    // (92:0) {:else}
    function create_else_block_2(ctx) {
    	let div3;
    	let div1;
    	let svg;
    	let g1;
    	let g0;
    	let rect;
    	let path;
    	let t0;
    	let t1;
    	let div0;
    	let t2;
    	let div2;
    	let div3_intro;
    	let div3_outro;
    	let current;
    	let mounted;
    	let dispose;

    	function select_block_type_3(ctx, dirty) {
    		if (/*categoryParentTitle*/ ctx[1] == null) return create_if_block_6;
    		return create_else_block_4;
    	}

    	let current_block_type = select_block_type_3(ctx);
    	let if_block = current_block_type(ctx);
    	let each_value_1 = /*$productCategories*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div1 = element("div");
    			svg = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			rect = svg_element("rect");
    			path = svg_element("path");
    			t0 = space();
    			if_block.c();
    			t1 = space();
    			div0 = element("div");
    			t2 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(rect, "width", "24");
    			attr_dev(rect, "height", "24");
    			attr_dev(rect, "transform", "rotate(90 12 12)");
    			attr_dev(rect, "opacity", "0");
    			add_location(rect, file$4, 101, 25, 3775);
    			attr_dev(path, "d", "M13.36 17a1 1 0 0 1-.72-.31l-3.86-4a1 1 0 0 1 0-1.4l4-4a1 1 0 1 1 1.42 1.42L10.9 12l3.18 3.3a1 1 0 0 1 0 1.41 1 1 0 0 1-.72.29z");
    			attr_dev(path, "class", "svelte-10gkwyz");
    			add_location(path, file$4, 106, 26, 3983);
    			attr_dev(g0, "data-name", "chevron-left");
    			add_location(g0, file$4, 100, 21, 3722);
    			attr_dev(g1, "data-name", "Layer 2");
    			add_location(g1, file$4, 99, 17, 3678);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "class", "svelte-10gkwyz");
    			add_location(svg, file$4, 98, 12, 3601);
    			attr_dev(div0, "class", "spacer svelte-10gkwyz");
    			add_location(div0, file$4, 117, 12, 4422);
    			attr_dev(div1, "class", "menu-title svelte-10gkwyz");
    			add_location(div1, file$4, 97, 8, 3520);
    			attr_dev(div2, "class", "category-list svelte-10gkwyz");
    			add_location(div2, file$4, 119, 8, 4468);
    			attr_dev(div3, "class", "menu-container svelte-10gkwyz");
    			add_location(div3, file$4, 92, 4, 3363);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			append_dev(div1, svg);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, rect);
    			append_dev(g0, path);
    			append_dev(div1, t0);
    			if_block.m(div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div3, t2);
    			append_dev(div3, div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div2, null);
    				}
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*resetParentCategories*/ ctx[4], false, false, false, false),
    					listen_dev(div1, "keydown", /*keydown_handler_2*/ ctx[8], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_3(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div1, t1);
    				}
    			}

    			if (dirty & /*$productCategories, versionClass, categoryParentId*/ 13) {
    				each_value_1 = /*$productCategories*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!current) return;
    				if (div3_outro) div3_outro.end(1);
    				div3_intro = create_in_transition(div3, fade, { axis: "x", delay: 200, duration: 200 });
    				div3_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div3_intro) div3_intro.invalidate();
    			div3_outro = create_out_transition(div3, fade, { axis: "x", duration: 200 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if_block.d();
    			destroy_each(each_blocks, detaching);
    			if (detaching && div3_outro) div3_outro.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(92:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (28:0) {#if categoryParentId == null}
    function create_if_block$3(ctx) {
    	let div3;
    	let div1;
    	let svg;
    	let g1;
    	let g0;
    	let rect;
    	let path;
    	let t0;
    	let t1;
    	let div0;
    	let t2;
    	let div2;
    	let div3_intro;
    	let div3_outro;
    	let current;
    	let mounted;
    	let dispose;

    	function select_block_type_1(ctx, dirty) {
    		if (/*categoryParentTitle*/ ctx[1] == null) return create_if_block_3;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);
    	let each_value = /*$productCategories*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div1 = element("div");
    			svg = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			rect = svg_element("rect");
    			path = svg_element("path");
    			t0 = space();
    			if_block.c();
    			t1 = space();
    			div0 = element("div");
    			t2 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(rect, "width", "24");
    			attr_dev(rect, "height", "24");
    			attr_dev(rect, "transform", "rotate(90 12 12)");
    			attr_dev(rect, "opacity", "0");
    			add_location(rect, file$4, 37, 25, 1061);
    			attr_dev(path, "d", "M13.36 17a1 1 0 0 1-.72-.31l-3.86-4a1 1 0 0 1 0-1.4l4-4a1 1 0 1 1 1.42 1.42L10.9 12l3.18 3.3a1 1 0 0 1 0 1.41 1 1 0 0 1-.72.29z");
    			attr_dev(path, "class", "svelte-10gkwyz");
    			add_location(path, file$4, 42, 26, 1269);
    			attr_dev(g0, "data-name", "chevron-left");
    			add_location(g0, file$4, 36, 21, 1008);
    			attr_dev(g1, "data-name", "Layer 2");
    			add_location(g1, file$4, 35, 17, 964);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "class", "svelte-10gkwyz");
    			add_location(svg, file$4, 34, 12, 887);
    			attr_dev(div0, "class", "spacer svelte-10gkwyz");
    			add_location(div0, file$4, 53, 12, 1708);
    			attr_dev(div1, "class", "menu-title svelte-10gkwyz");
    			add_location(div1, file$4, 33, 8, 804);
    			attr_dev(div2, "class", "category-list svelte-10gkwyz");
    			add_location(div2, file$4, 55, 8, 1754);
    			attr_dev(div3, "class", "menu-container svelte-10gkwyz");
    			add_location(div3, file$4, 28, 4, 647);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			append_dev(div1, svg);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, rect);
    			append_dev(g0, path);
    			append_dev(div1, t0);
    			if_block.m(div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div3, t2);
    			append_dev(div3, div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div2, null);
    				}
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*click_handler*/ ctx[9], false, false, false, false),
    					listen_dev(div1, "keydown", /*keydown_handler*/ ctx[7], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div1, t1);
    				}
    			}

    			if (dirty & /*versionClass, setParentCategories, $productCategories, categoryParentId*/ 45) {
    				each_value = /*$productCategories*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div2, null);
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
    				if (div3_outro) div3_outro.end(1);
    				div3_intro = create_in_transition(div3, fade, { axis: "x", delay: 200, duration: 200 });
    				div3_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div3_intro) div3_intro.invalidate();
    			div3_outro = create_out_transition(div3, fade, { axis: "x", duration: 200 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if_block.d();
    			destroy_each(each_blocks, detaching);
    			if (detaching && div3_outro) div3_outro.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(28:0) {#if categoryParentId == null}",
    		ctx
    	});

    	return block;
    }

    // (115:12) {:else}
    function create_else_block_4(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*categoryParentTitle*/ ctx[1]);
    			add_location(div, file$4, 115, 16, 4359);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*categoryParentTitle*/ 2) set_data_dev(t, /*categoryParentTitle*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_4.name,
    		type: "else",
    		source: "(115:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (113:12) {#if categoryParentTitle == null}
    function create_if_block_6(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Products";
    			add_location(div, file$4, 113, 16, 4303);
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
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(113:12) {#if categoryParentTitle == null}",
    		ctx
    	});

    	return block;
    }

    // (122:16) {#if category.node.parentId == categoryParentId}
    function create_if_block_4(ctx) {
    	let a;
    	let div0;
    	let t0_value = /*category*/ ctx[12].node.name + "";
    	let t0;
    	let t1;
    	let div1;
    	let t2;
    	let a_href_value;
    	let a_class_value;

    	function select_block_type_4(ctx, dirty) {
    		if (/*category*/ ctx[12].node.customFields.categoryImage) return create_if_block_5;
    		return create_else_block_3;
    	}

    	let current_block_type = select_block_type_4(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			a = element("a");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			if_block.c();
    			t2 = space();
    			attr_dev(div0, "class", "svelte-10gkwyz");
    			add_location(div0, file$4, 126, 24, 4792);
    			attr_dev(div1, "class", "category-image-container svelte-10gkwyz");
    			add_location(div1, file$4, 127, 24, 4848);
    			attr_dev(a, "href", a_href_value = /*category*/ ctx[12].node.link);
    			attr_dev(a, "class", a_class_value = "category-item " + /*versionClass*/ ctx[2] + " svelte-10gkwyz");
    			add_location(a, file$4, 122, 20, 4632);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, div0);
    			append_dev(div0, t0);
    			append_dev(a, t1);
    			append_dev(a, div1);
    			if_block.m(div1, null);
    			append_dev(a, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$productCategories*/ 8 && t0_value !== (t0_value = /*category*/ ctx[12].node.name + "")) set_data_dev(t0, t0_value);

    			if (current_block_type === (current_block_type = select_block_type_4(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			}

    			if (dirty & /*$productCategories*/ 8 && a_href_value !== (a_href_value = /*category*/ ctx[12].node.link)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*versionClass*/ 4 && a_class_value !== (a_class_value = "category-item " + /*versionClass*/ ctx[2] + " svelte-10gkwyz")) {
    				attr_dev(a, "class", a_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(122:16) {#if category.node.parentId == categoryParentId}",
    		ctx
    	});

    	return block;
    }

    // (137:28) {:else}
    function create_else_block_3(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "http://mcalpine2.local/wp-content/uploads/2023/06/wdu-1asuk-73x150.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "loading", "lazy");
    			attr_dev(img, "class", "svelte-10gkwyz");
    			add_location(img, file$4, 137, 32, 5421);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_3.name,
    		type: "else",
    		source: "(137:28) {:else}",
    		ctx
    	});

    	return block;
    }

    // (129:28) {#if category.node.customFields.categoryImage}
    function create_if_block_5(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*category*/ ctx[12].node.customFields.categoryImage.sourceUrl)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*category*/ ctx[12].node.customFields.categoryImage.sourceUrl);
    			attr_dev(img, "loading", "lazy");
    			attr_dev(img, "class", "svelte-10gkwyz");
    			add_location(img, file$4, 129, 32, 4994);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$productCategories*/ 8 && !src_url_equal(img.src, img_src_value = /*category*/ ctx[12].node.customFields.categoryImage.sourceUrl)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*$productCategories*/ 8 && img_alt_value !== (img_alt_value = /*category*/ ctx[12].node.customFields.categoryImage.sourceUrl)) {
    				attr_dev(img, "alt", img_alt_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(129:28) {#if category.node.customFields.categoryImage}",
    		ctx
    	});

    	return block;
    }

    // (121:12) {#each $productCategories as category}
    function create_each_block_1(ctx) {
    	let if_block_anchor;
    	let if_block = /*category*/ ctx[12].node.parentId == /*categoryParentId*/ ctx[0] && create_if_block_4(ctx);

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
    			if (/*category*/ ctx[12].node.parentId == /*categoryParentId*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_4(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
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
    		source: "(121:12) {#each $productCategories as category}",
    		ctx
    	});

    	return block;
    }

    // (51:12) {:else}
    function create_else_block_1(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*categoryParentTitle*/ ctx[1]);
    			add_location(div, file$4, 51, 16, 1645);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*categoryParentTitle*/ 2) set_data_dev(t, /*categoryParentTitle*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(51:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (49:12) {#if categoryParentTitle == null}
    function create_if_block_3(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Products";
    			add_location(div, file$4, 49, 16, 1589);
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
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(49:12) {#if categoryParentTitle == null}",
    		ctx
    	});

    	return block;
    }

    // (58:16) {#if category.node.parentId == categoryParentId}
    function create_if_block_1$2(ctx) {
    	let div2;
    	let div0;
    	let t0_value = /*category*/ ctx[12].node.name + "";
    	let t0;
    	let t1;
    	let div1;
    	let t2;
    	let div2_class_value;
    	let mounted;
    	let dispose;

    	function select_block_type_2(ctx, dirty) {
    		if (/*category*/ ctx[12].node.customFields.categoryImage) return create_if_block_2$2;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type(ctx);

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[10](/*category*/ ctx[12]);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			if_block.c();
    			t2 = space();
    			attr_dev(div0, "class", "svelte-10gkwyz");
    			add_location(div0, file$4, 68, 24, 2315);
    			attr_dev(div1, "class", "category-image-container svelte-10gkwyz");
    			add_location(div1, file$4, 69, 24, 2371);
    			attr_dev(div2, "class", div2_class_value = "category-item " + /*versionClass*/ ctx[2] + " svelte-10gkwyz");
    			add_location(div2, file$4, 58, 20, 1918);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			if_block.m(div1, null);
    			append_dev(div2, t2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div2, "click", click_handler_1, false, false, false, false),
    					listen_dev(div2, "keydown", /*keydown_handler_1*/ ctx[6], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$productCategories*/ 8 && t0_value !== (t0_value = /*category*/ ctx[12].node.name + "")) set_data_dev(t0, t0_value);

    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			}

    			if (dirty & /*versionClass*/ 4 && div2_class_value !== (div2_class_value = "category-item " + /*versionClass*/ ctx[2] + " svelte-10gkwyz")) {
    				attr_dev(div2, "class", div2_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(58:16) {#if category.node.parentId == categoryParentId}",
    		ctx
    	});

    	return block;
    }

    // (79:28) {:else}
    function create_else_block$1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "http://mcalpine2.local/wp-content/uploads/2023/06/wdu-1asuk-73x150.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "loading", "lazy");
    			attr_dev(img, "class", "svelte-10gkwyz");
    			add_location(img, file$4, 79, 32, 2944);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(79:28) {:else}",
    		ctx
    	});

    	return block;
    }

    // (71:28) {#if category.node.customFields.categoryImage}
    function create_if_block_2$2(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*category*/ ctx[12].node.customFields.categoryImage.sourceUrl)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*category*/ ctx[12].node.customFields.categoryImage.sourceUrl);
    			attr_dev(img, "loading", "lazy");
    			attr_dev(img, "class", "svelte-10gkwyz");
    			add_location(img, file$4, 71, 32, 2517);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$productCategories*/ 8 && !src_url_equal(img.src, img_src_value = /*category*/ ctx[12].node.customFields.categoryImage.sourceUrl)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*$productCategories*/ 8 && img_alt_value !== (img_alt_value = /*category*/ ctx[12].node.customFields.categoryImage.sourceUrl)) {
    				attr_dev(img, "alt", img_alt_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(71:28) {#if category.node.customFields.categoryImage}",
    		ctx
    	});

    	return block;
    }

    // (57:12) {#each $productCategories as category}
    function create_each_block$1(ctx) {
    	let if_block_anchor;
    	let if_block = /*category*/ ctx[12].node.parentId == /*categoryParentId*/ ctx[0] && create_if_block_1$2(ctx);

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
    			if (/*category*/ ctx[12].node.parentId == /*categoryParentId*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
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
    		source: "(57:12) {#each $productCategories as category}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$3, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*categoryParentId*/ ctx[0] == null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
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
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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
    	let $version;
    	let $productCategories;
    	validate_store(version, 'version');
    	component_subscribe($$self, version, $$value => $$invalidate(11, $version = $$value));
    	validate_store(productCategories, 'productCategories');
    	component_subscribe($$self, productCategories, $$value => $$invalidate(3, $productCategories = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ProductMenu', slots, []);
    	let categoryParentId = null;
    	let categoryParentTitle = null;

    	function resetParentCategories() {
    		$$invalidate(0, categoryParentId = null);
    		$$invalidate(1, categoryParentTitle = null);
    	}

    	function setParentCategories(id, title) {
    		$$invalidate(0, categoryParentId = id);
    		$$invalidate(1, categoryParentTitle = title);
    	}

    	let versionClass;

    	if ($version == 1) {
    		versionClass = "version-one";
    	}

    	if ($version == 2) {
    		versionClass = "version-two";
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ProductMenu> was created with unknown prop '${key}'`);
    	});

    	function keydown_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler = () => activeMenu.set(0);

    	const click_handler_1 = category => {
    		setParentCategories(category.node.id, category.node.name);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		activeMenu,
    		productCategories,
    		version,
    		categoryParentId,
    		categoryParentTitle,
    		resetParentCategories,
    		setParentCategories,
    		versionClass,
    		$version,
    		$productCategories
    	});

    	$$self.$inject_state = $$props => {
    		if ('categoryParentId' in $$props) $$invalidate(0, categoryParentId = $$props.categoryParentId);
    		if ('categoryParentTitle' in $$props) $$invalidate(1, categoryParentTitle = $$props.categoryParentTitle);
    		if ('versionClass' in $$props) $$invalidate(2, versionClass = $$props.versionClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		categoryParentId,
    		categoryParentTitle,
    		versionClass,
    		$productCategories,
    		resetParentCategories,
    		setParentCategories,
    		keydown_handler_1,
    		keydown_handler,
    		keydown_handler_2,
    		click_handler,
    		click_handler_1
    	];
    }

    class ProductMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProductMenu",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/nav-content/menu/Menu.svelte generated by Svelte v3.59.2 */
    const file$3 = "src/nav-content/menu/Menu.svelte";

    // (31:31) 
    function create_if_block_2$1(ctx) {
    	let productmenu;
    	let current;
    	productmenu = new ProductMenu({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(productmenu.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(productmenu, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(productmenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(productmenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(productmenu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(31:31) ",
    		ctx
    	});

    	return block;
    }

    // (29:31) 
    function create_if_block_1$1(ctx) {
    	let interestsmenu;
    	let current;

    	interestsmenu = new InterestMenu({
    			props: { interests: /*interests*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(interestsmenu.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(interestsmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const interestsmenu_changes = {};
    			if (dirty & /*interests*/ 1) interestsmenu_changes.interests = /*interests*/ ctx[0];
    			interestsmenu.$set(interestsmenu_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(interestsmenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(interestsmenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(interestsmenu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(29:31) ",
    		ctx
    	});

    	return block;
    }

    // (27:4) {#if $activeMenu == 0}
    function create_if_block$2(ctx) {
    	let mainmenu;
    	let current;

    	mainmenu = new MainMenu({
    			props: {
    				interests: /*interests*/ ctx[0],
    				navbar: /*$navBarMenu*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(mainmenu.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(mainmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const mainmenu_changes = {};
    			if (dirty & /*interests*/ 1) mainmenu_changes.interests = /*interests*/ ctx[0];
    			if (dirty & /*$navBarMenu*/ 4) mainmenu_changes.navbar = /*$navBarMenu*/ ctx[2];
    			mainmenu.$set(mainmenu_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mainmenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mainmenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(mainmenu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(27:4) {#if $activeMenu == 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let div_intro;
    	let div_outro;
    	let current;
    	const if_block_creators = [create_if_block$2, create_if_block_1$1, create_if_block_2$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$activeMenu*/ ctx[1] == 0) return 0;
    		if (/*$activeMenu*/ ctx[1] == 1) return 1;
    		if (/*$activeMenu*/ ctx[1] == 2) return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "menu-container svelte-19o7avo");
    			add_location(div, file$3, 21, 0, 570);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			add_render_callback(() => {
    				if (!current) return;
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, fade, { duration: 200, delay: 200 });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, fade, { duration: 200 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			if (detaching && div_outro) div_outro.end();
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
    	let $menus;
    	let $activeMenu;
    	let $navBarMenu;
    	validate_store(menus, 'menus');
    	component_subscribe($$self, menus, $$value => $$invalidate(3, $menus = $$value));
    	validate_store(activeMenu, 'activeMenu');
    	component_subscribe($$self, activeMenu, $$value => $$invalidate(1, $activeMenu = $$value));
    	validate_store(navBarMenu, 'navBarMenu');
    	component_subscribe($$self, navBarMenu, $$value => $$invalidate(2, $navBarMenu = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Menu', slots, []);
    	let interests;

    	$menus.forEach(menu => {
    		if (menu.name == "Interest") {
    			$$invalidate(0, interests = menu);
    		}

    		if (menu.name == "Navbar") {
    			navBarMenu.set(menu);
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Menu> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		menus,
    		activeMenu,
    		navBarMenu,
    		MainMenu,
    		InterestsMenu: InterestMenu,
    		ProductMenu,
    		fade,
    		interests,
    		$menus,
    		$activeMenu,
    		$navBarMenu
    	});

    	$$self.$inject_state = $$props => {
    		if ('interests' in $$props) $$invalidate(0, interests = $$props.interests);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [interests, $activeMenu, $navBarMenu];
    }

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menu",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/nav-content/menu/SubMenu.svelte generated by Svelte v3.59.2 */
    const file$2 = "src/nav-content/menu/SubMenu.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (28:8) {#if item.parentId == $menuParentId}
    function create_if_block$1(ctx) {
    	let a;
    	let t_value = /*item*/ ctx[5].title + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "class", "menu-item svelte-9qkumy");
    			attr_dev(a, "href", a_href_value = /*item*/ ctx[5].url);
    			add_location(a, file$2, 28, 12, 857);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$navBarMenu*/ 2 && t_value !== (t_value = /*item*/ ctx[5].title + "")) set_data_dev(t, t_value);

    			if (dirty & /*$navBarMenu*/ 2 && a_href_value !== (a_href_value = /*item*/ ctx[5].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(28:8) {#if item.parentId == $menuParentId}",
    		ctx
    	});

    	return block;
    }

    // (27:4) {#each $navBarMenu.menuItems.nodes as item}
    function create_each_block(ctx) {
    	let if_block_anchor;
    	let if_block = /*item*/ ctx[5].parentId == /*$menuParentId*/ ctx[2] && create_if_block$1(ctx);

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
    			if (/*item*/ ctx[5].parentId == /*$menuParentId*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(27:4) {#each $navBarMenu.menuItems.nodes as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div3;
    	let div2;
    	let svg;
    	let path;
    	let t0;
    	let div0;
    	let t1;
    	let t2;
    	let div1;
    	let t3;
    	let div3_intro;
    	let div3_outro;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*$navBarMenu*/ ctx[1].menuItems.nodes;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t0 = space();
    			div0 = element("div");
    			t1 = text(/*$menuParentTitle*/ ctx[0]);
    			t2 = space();
    			div1 = element("div");
    			t3 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(path, "d", "M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z");
    			attr_dev(path, "fill", "#fff");
    			attr_dev(path, "class", "svelte-9qkumy");
    			add_location(path, file$2, 17, 13, 527);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "13.922");
    			attr_dev(svg, "height", "16.245");
    			attr_dev(svg, "viewBox", "0 0 13.922 16.245");
    			attr_dev(svg, "class", "svelte-9qkumy");
    			add_location(svg, file$2, 12, 8, 367);
    			add_location(div0, file$2, 23, 8, 680);
    			attr_dev(div1, "class", "spacer svelte-9qkumy");
    			add_location(div1, file$2, 24, 8, 718);
    			attr_dev(div2, "class", "menu-title svelte-9qkumy");
    			add_location(div2, file$2, 11, 4, 285);
    			attr_dev(div3, "class", "menu-container svelte-9qkumy");
    			add_location(div3, file$2, 6, 0, 148);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, svg);
    			append_dev(svg, path);
    			append_dev(div2, t0);
    			append_dev(div2, div0);
    			append_dev(div0, t1);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div3, t3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div3, null);
    				}
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div2, "click", /*click_handler*/ ctx[4], false, false, false, false),
    					listen_dev(div2, "keydown", /*keydown_handler*/ ctx[3], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*$menuParentTitle*/ 1) set_data_dev(t1, /*$menuParentTitle*/ ctx[0]);

    			if (dirty & /*$navBarMenu, $menuParentId*/ 6) {
    				each_value = /*$navBarMenu*/ ctx[1].menuItems.nodes;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div3, null);
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
    				if (div3_outro) div3_outro.end(1);
    				div3_intro = create_in_transition(div3, fade, { axis: "x", delay: 200, duration: 200 });
    				div3_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div3_intro) div3_intro.invalidate();
    			div3_outro = create_out_transition(div3, fade, { axis: "x", duration: 200 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_each(each_blocks, detaching);
    			if (detaching && div3_outro) div3_outro.end();
    			mounted = false;
    			run_all(dispose);
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
    	let $menuParentTitle;
    	let $navBarMenu;
    	let $menuParentId;
    	validate_store(menuParentTitle, 'menuParentTitle');
    	component_subscribe($$self, menuParentTitle, $$value => $$invalidate(0, $menuParentTitle = $$value));
    	validate_store(navBarMenu, 'navBarMenu');
    	component_subscribe($$self, navBarMenu, $$value => $$invalidate(1, $navBarMenu = $$value));
    	validate_store(menuParentId, 'menuParentId');
    	component_subscribe($$self, menuParentId, $$value => $$invalidate(2, $menuParentId = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SubMenu', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SubMenu> was created with unknown prop '${key}'`);
    	});

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler = () => menuParentId.set("");

    	$$self.$capture_state = () => ({
    		menuParentId,
    		menuParentTitle,
    		navBarMenu,
    		fade,
    		$menuParentTitle,
    		$navBarMenu,
    		$menuParentId
    	});

    	return [$menuParentTitle, $navBarMenu, $menuParentId, keydown_handler, click_handler];
    }

    class SubMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SubMenu",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/nav-content/Content.svelte generated by Svelte v3.59.2 */
    const file$1 = "src/nav-content/Content.svelte";

    // (12:0) {#if $open}
    function create_if_block(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let div_intro;
    	let div_outro;
    	let current;
    	const if_block_creators = [create_if_block_1, create_if_block_2, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$searchOpen*/ ctx[2]) return 0;
    		if (/*$menuParentId*/ ctx[3] == '') return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "nav-content-container svelte-n56jxg");
    			add_location(div, file$1, 12, 4, 336);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			add_render_callback(() => {
    				if (!current) return;
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, slide, { axis: "y", duration: 300 });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, slide, { axis: "y", duration: 300 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(12:0) {#if $open}",
    		ctx
    	});

    	return block;
    }

    // (23:11) {:else}
    function create_else_block(ctx) {
    	let submenu;
    	let current;
    	submenu = new SubMenu({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(submenu.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(submenu, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(submenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(submenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(submenu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(23:11) {:else}",
    		ctx
    	});

    	return block;
    }

    // (21:12) {#if $menuParentId == ''}
    function create_if_block_2(ctx) {
    	let menu;
    	let current;
    	menu = new Menu({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(menu.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(menu, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(menu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(21:12) {#if $menuParentId == ''}",
    		ctx
    	});

    	return block;
    }

    // (18:8) {#if $searchOpen}
    function create_if_block_1(ctx) {
    	let results;
    	let current;

    	results = new Results({
    			props: { form: /*form*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(results.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(results, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const results_changes = {};
    			if (dirty & /*form*/ 1) results_changes.form = /*form*/ ctx[0];
    			results.$set(results_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(results.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(results.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(results, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(18:8) {#if $searchOpen}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$open*/ ctx[1] && create_if_block(ctx);

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
    			if (/*$open*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$open*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
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
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $open;
    	let $searchOpen;
    	let $menuParentId;
    	validate_store(open, 'open');
    	component_subscribe($$self, open, $$value => $$invalidate(1, $open = $$value));
    	validate_store(searchOpen, 'searchOpen');
    	component_subscribe($$self, searchOpen, $$value => $$invalidate(2, $searchOpen = $$value));
    	validate_store(menuParentId, 'menuParentId');
    	component_subscribe($$self, menuParentId, $$value => $$invalidate(3, $menuParentId = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Content', slots, []);
    	let { form } = $$props;
    	const menus = {};

    	$$self.$$.on_mount.push(function () {
    		if (form === undefined && !('form' in $$props || $$self.$$.bound[$$self.$$.props['form']])) {
    			console.warn("<Content> was created without expected prop 'form'");
    		}
    	});

    	const writable_props = ['form'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Content> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('form' in $$props) $$invalidate(0, form = $$props.form);
    	};

    	$$self.$capture_state = () => ({
    		Results,
    		Menu,
    		SubMenu,
    		open,
    		searchOpen,
    		menuParentId,
    		slide,
    		form,
    		menus,
    		$open,
    		$searchOpen,
    		$menuParentId
    	});

    	$$self.$inject_state = $$props => {
    		if ('form' in $$props) $$invalidate(0, form = $$props.form);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [form, $open, $searchOpen, $menuParentId, menus];
    }

    class Content extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { form: 0, menus: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Content",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get form() {
    		throw new Error("<Content>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set form(value) {
    		throw new Error("<Content>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get menus() {
    		return this.$$.ctx[4];
    	}

    	set menus(value) {
    		throw new Error("<Content>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.59.2 */

    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let form_1;
    	let controls;
    	let t;
    	let content;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[13]);
    	controls = new Controls({ $$inline: true });

    	content = new Content({
    			props: { form: /*form*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			form_1 = element("form");
    			create_component(controls.$$.fragment);
    			t = space();
    			create_component(content.$$.fragment);
    			attr_dev(form_1, "method", "get");
    			attr_dev(form_1, "action", /*siteUrl*/ ctx[0]);
    			attr_dev(form_1, "role", "search");

    			set_style(form_1, "height", /*$open*/ ctx[3]
    			? /*innerHeight*/ ctx[2] + 'px'
    			: '60px');

    			attr_dev(form_1, "class", "svelte-1pbe2yp");
    			add_location(form_1, file, 51, 0, 1156);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form_1, anchor);
    			mount_component(controls, form_1, null);
    			append_dev(form_1, t);
    			mount_component(content, form_1, null);
    			/*form_1_binding*/ ctx[14](form_1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "resize", /*onwindowresize*/ ctx[13]),
    					listen_dev(form_1, "submit", prevent_default(/*submit_handler*/ ctx[12]), false, true, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const content_changes = {};
    			if (dirty & /*form*/ 2) content_changes.form = /*form*/ ctx[1];
    			content.$set(content_changes);

    			if (!current || dirty & /*siteUrl*/ 1) {
    				attr_dev(form_1, "action", /*siteUrl*/ ctx[0]);
    			}

    			if (!current || dirty & /*$open, innerHeight*/ 12) {
    				set_style(form_1, "height", /*$open*/ ctx[3]
    				? /*innerHeight*/ ctx[2] + 'px'
    				: '60px');
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(controls.$$.fragment, local);
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(controls.$$.fragment, local);
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form_1);
    			destroy_component(controls);
    			destroy_component(content);
    			/*form_1_binding*/ ctx[14](null);
    			mounted = false;
    			run_all(dispose);
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

    const graphQlUrl = "/graphql";

    function instance($$self, $$props, $$invalidate) {
    	let $open;
    	validate_store(open, 'open');
    	component_subscribe($$self, open, $$value => $$invalidate(3, $open = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	onMount(async () => {
    		await getData(graphQlUrl, menus, query, productCategories);
    	});

    	let form;
    	let { siteUrl = "" } = $$props;
    	let { ajaxUrlProp = "" } = $$props;
    	let { versionProp = 1 } = $$props;
    	let { facebookLink } = $$props;
    	facebook.set(facebookLink);
    	let { twitterLink } = $$props;
    	twitter.set(twitterLink);
    	let { instagramLink } = $$props;
    	instagram.set(instagramLink);
    	let { linkedinLink } = $$props;
    	linkedin.set(linkedinLink);
    	let { youtubeLink } = $$props;
    	youtube.set(youtubeLink);
    	let { emailLink } = $$props;
    	email.set(emailLink);
    	version.set(versionProp);
    	ajaxUrl.set(ajaxUrlProp);
    	let innerHeight;

    	$$self.$$.on_mount.push(function () {
    		if (facebookLink === undefined && !('facebookLink' in $$props || $$self.$$.bound[$$self.$$.props['facebookLink']])) {
    			console.warn("<App> was created without expected prop 'facebookLink'");
    		}

    		if (twitterLink === undefined && !('twitterLink' in $$props || $$self.$$.bound[$$self.$$.props['twitterLink']])) {
    			console.warn("<App> was created without expected prop 'twitterLink'");
    		}

    		if (instagramLink === undefined && !('instagramLink' in $$props || $$self.$$.bound[$$self.$$.props['instagramLink']])) {
    			console.warn("<App> was created without expected prop 'instagramLink'");
    		}

    		if (linkedinLink === undefined && !('linkedinLink' in $$props || $$self.$$.bound[$$self.$$.props['linkedinLink']])) {
    			console.warn("<App> was created without expected prop 'linkedinLink'");
    		}

    		if (youtubeLink === undefined && !('youtubeLink' in $$props || $$self.$$.bound[$$self.$$.props['youtubeLink']])) {
    			console.warn("<App> was created without expected prop 'youtubeLink'");
    		}

    		if (emailLink === undefined && !('emailLink' in $$props || $$self.$$.bound[$$self.$$.props['emailLink']])) {
    			console.warn("<App> was created without expected prop 'emailLink'");
    		}
    	});

    	const writable_props = [
    		'siteUrl',
    		'ajaxUrlProp',
    		'versionProp',
    		'facebookLink',
    		'twitterLink',
    		'instagramLink',
    		'linkedinLink',
    		'youtubeLink',
    		'emailLink'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function submit_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function onwindowresize() {
    		$$invalidate(2, innerHeight = window.innerHeight);
    	}

    	function form_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			form = $$value;
    			$$invalidate(1, form);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('siteUrl' in $$props) $$invalidate(0, siteUrl = $$props.siteUrl);
    		if ('ajaxUrlProp' in $$props) $$invalidate(4, ajaxUrlProp = $$props.ajaxUrlProp);
    		if ('versionProp' in $$props) $$invalidate(5, versionProp = $$props.versionProp);
    		if ('facebookLink' in $$props) $$invalidate(6, facebookLink = $$props.facebookLink);
    		if ('twitterLink' in $$props) $$invalidate(7, twitterLink = $$props.twitterLink);
    		if ('instagramLink' in $$props) $$invalidate(8, instagramLink = $$props.instagramLink);
    		if ('linkedinLink' in $$props) $$invalidate(9, linkedinLink = $$props.linkedinLink);
    		if ('youtubeLink' in $$props) $$invalidate(10, youtubeLink = $$props.youtubeLink);
    		if ('emailLink' in $$props) $$invalidate(11, emailLink = $$props.emailLink);
    	};

    	$$self.$capture_state = () => ({
    		Controls,
    		Content,
    		onMount,
    		open,
    		ajaxUrl,
    		menus,
    		getData,
    		query,
    		version,
    		productCategories,
    		facebook,
    		twitter,
    		instagram,
    		linkedin,
    		youtube,
    		email,
    		graphQlUrl,
    		form,
    		siteUrl,
    		ajaxUrlProp,
    		versionProp,
    		facebookLink,
    		twitterLink,
    		instagramLink,
    		linkedinLink,
    		youtubeLink,
    		emailLink,
    		innerHeight,
    		$open
    	});

    	$$self.$inject_state = $$props => {
    		if ('form' in $$props) $$invalidate(1, form = $$props.form);
    		if ('siteUrl' in $$props) $$invalidate(0, siteUrl = $$props.siteUrl);
    		if ('ajaxUrlProp' in $$props) $$invalidate(4, ajaxUrlProp = $$props.ajaxUrlProp);
    		if ('versionProp' in $$props) $$invalidate(5, versionProp = $$props.versionProp);
    		if ('facebookLink' in $$props) $$invalidate(6, facebookLink = $$props.facebookLink);
    		if ('twitterLink' in $$props) $$invalidate(7, twitterLink = $$props.twitterLink);
    		if ('instagramLink' in $$props) $$invalidate(8, instagramLink = $$props.instagramLink);
    		if ('linkedinLink' in $$props) $$invalidate(9, linkedinLink = $$props.linkedinLink);
    		if ('youtubeLink' in $$props) $$invalidate(10, youtubeLink = $$props.youtubeLink);
    		if ('emailLink' in $$props) $$invalidate(11, emailLink = $$props.emailLink);
    		if ('innerHeight' in $$props) $$invalidate(2, innerHeight = $$props.innerHeight);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		siteUrl,
    		form,
    		innerHeight,
    		$open,
    		ajaxUrlProp,
    		versionProp,
    		facebookLink,
    		twitterLink,
    		instagramLink,
    		linkedinLink,
    		youtubeLink,
    		emailLink,
    		submit_handler,
    		onwindowresize,
    		form_1_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance, create_fragment, safe_not_equal, {
    			siteUrl: 0,
    			ajaxUrlProp: 4,
    			versionProp: 5,
    			facebookLink: 6,
    			twitterLink: 7,
    			instagramLink: 8,
    			linkedinLink: 9,
    			youtubeLink: 10,
    			emailLink: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get siteUrl() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set siteUrl(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ajaxUrlProp() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ajaxUrlProp(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get versionProp() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set versionProp(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get facebookLink() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set facebookLink(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get twitterLink() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set twitterLink(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get instagramLink() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set instagramLink(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get linkedinLink() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set linkedinLink(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get youtubeLink() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set youtubeLink(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get emailLink() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set emailLink(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    return App;

}));
//# sourceMappingURL=mobile-nav.js.map
