
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.SearchArchive = factory());
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
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
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

    function cubicInOut(t) {
        return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
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

    /* src/InsightCard.svelte generated by Svelte v3.59.2 */
    const file$6 = "src/InsightCard.svelte";

    // (26:8) {#if insight.item.postType == "page"}
    function create_if_block_1$3(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Page";
    			attr_dev(h6, "class", "insight-identifier");
    			add_location(h6, file$6, 26, 12, 850);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(26:8) {#if insight.item.postType == \\\"page\\\"}",
    		ctx
    	});

    	return block;
    }

    // (29:8) {#if insight.item.postType == "post"}
    function create_if_block$5(ctx) {
    	let h6;
    	let t;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			t = text(/*identifier*/ ctx[1]);
    			attr_dev(h6, "class", "insight-identifier");
    			add_location(h6, file$6, 29, 12, 963);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    			append_dev(h6, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*identifier*/ 2) set_data_dev(t, /*identifier*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(29:8) {#if insight.item.postType == \\\"post\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div5;
    	let div0;
    	let t0;
    	let t1;
    	let h3;
    	let raw_value = /*insight*/ ctx[0].item.node.title + "";
    	let t2;
    	let div2;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t3;
    	let div1;
    	let t4;
    	let div4;
    	let a;
    	let span;
    	let t6;
    	let div3;
    	let svg;
    	let path;
    	let a_href_value;
    	let div5_class_value;
    	let div5_intro;
    	let if_block0 = /*insight*/ ctx[0].item.postType == "page" && create_if_block_1$3(ctx);
    	let if_block1 = /*insight*/ ctx[0].item.postType == "post" && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			h3 = element("h3");
    			t2 = space();
    			div2 = element("div");
    			img = element("img");
    			t3 = space();
    			div1 = element("div");
    			t4 = space();
    			div4 = element("div");
    			a = element("a");
    			span = element("span");
    			span.textContent = "View Resource";
    			t6 = space();
    			div3 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(h3, "class", "insight-card-title");
    			add_location(h3, file$6, 31, 8, 1034);
    			attr_dev(div0, "class", "insight-card-text");
    			add_location(div0, file$6, 24, 4, 760);
    			attr_dev(img, "class", "insight-card-background-image");

    			if (!src_url_equal(img.src, img_src_value = (/*insight*/ ctx[0]?.item?.node?.featuredImage?.node?.sourceUrl)
    			? /*insight*/ ctx[0]?.item?.node?.featuredImage?.node?.sourceUrl
    			: "")) attr_dev(img, "src", img_src_value);

    			attr_dev(img, "alt", img_alt_value = (/*insight*/ ctx[0]?.item?.node?.featuredImage?.node?.altText)
    			? /*insight*/ ctx[0]?.item?.node?.featuredImage?.node?.altText
    			: "");

    			add_location(img, file$6, 35, 8, 1177);
    			attr_dev(div1, "class", "insight-card-hover-gradient");
    			add_location(div1, file$6, 44, 8, 1569);
    			attr_dev(div2, "class", "insight-card-image-container");
    			add_location(div2, file$6, 33, 4, 1117);
    			add_location(span, file$6, 49, 13, 1745);
    			attr_dev(path, "d", "M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z");
    			attr_dev(path, "fill", "#fff");
    			add_location(path, file$6, 56, 21, 2033);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "13.922");
    			attr_dev(svg, "height", "16.245");
    			attr_dev(svg, "viewBox", "0 0 13.922 16.245");
    			add_location(svg, file$6, 51, 16, 1833);
    			attr_dev(div3, "class", "insight-link-arrow");
    			add_location(div3, file$6, 50, 12, 1784);

    			attr_dev(a, "href", a_href_value = /*insight*/ ctx[0].item.node.link
    			? /*insight*/ ctx[0].item.node.link
    			: "");

    			add_location(a, file$6, 48, 8, 1669);
    			attr_dev(div4, "class", "insight-card-link");
    			add_location(div4, file$6, 47, 4, 1629);
    			attr_dev(div5, "class", div5_class_value = "insight-card mobile-show col-" + /*insight*/ ctx[0].columnWidth);
    			add_location(div5, file$6, 21, 0, 643);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t0);
    			if (if_block1) if_block1.m(div0, null);
    			append_dev(div0, t1);
    			append_dev(div0, h3);
    			h3.innerHTML = raw_value;
    			append_dev(div5, t2);
    			append_dev(div5, div2);
    			append_dev(div2, img);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div5, t4);
    			append_dev(div5, div4);
    			append_dev(div4, a);
    			append_dev(a, span);
    			append_dev(a, t6);
    			append_dev(a, div3);
    			append_dev(div3, svg);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*insight*/ ctx[0].item.postType == "page") {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_1$3(ctx);
    					if_block0.c();
    					if_block0.m(div0, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*insight*/ ctx[0].item.postType == "post") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$5(ctx);
    					if_block1.c();
    					if_block1.m(div0, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*insight*/ 1 && raw_value !== (raw_value = /*insight*/ ctx[0].item.node.title + "")) h3.innerHTML = raw_value;
    			if (dirty & /*insight*/ 1 && !src_url_equal(img.src, img_src_value = (/*insight*/ ctx[0]?.item?.node?.featuredImage?.node?.sourceUrl)
    			? /*insight*/ ctx[0]?.item?.node?.featuredImage?.node?.sourceUrl
    			: "")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*insight*/ 1 && img_alt_value !== (img_alt_value = (/*insight*/ ctx[0]?.item?.node?.featuredImage?.node?.altText)
    			? /*insight*/ ctx[0]?.item?.node?.featuredImage?.node?.altText
    			: "")) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*insight*/ 1 && a_href_value !== (a_href_value = /*insight*/ ctx[0].item.node.link
    			? /*insight*/ ctx[0].item.node.link
    			: "")) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*insight*/ 1 && div5_class_value !== (div5_class_value = "insight-card mobile-show col-" + /*insight*/ ctx[0].columnWidth)) {
    				attr_dev(div5, "class", div5_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (!div5_intro) {
    				add_render_callback(() => {
    					div5_intro = create_in_transition(div5, fade, { duration: 300, delay: 300 });
    					div5_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
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
    	validate_slots('InsightCard', slots, []);
    	let { insight = [] } = $$props;
    	let identifier = "";

    	onMount(() => {
    		if (insight.item.postType == "post") {
    			insight.item.node.terms.nodes.forEach(term => {
    				if (term.name.toLowerCase() == "faq") {
    					$$invalidate(0, insight.item.node.link = `/faq/?id=${insight.item.node.postId}`, insight);
    					$$invalidate(1, identifier = term.name);
    				}
    			});

    			if (identifier == "") {
    				$$invalidate(1, identifier = insight.item.node.terms.nodes[0].name);
    			}
    		}
    	});

    	const writable_props = ['insight'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InsightCard> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('insight' in $$props) $$invalidate(0, insight = $$props.insight);
    	};

    	$$self.$capture_state = () => ({ insight, fade, onMount, identifier });

    	$$self.$inject_state = $$props => {
    		if ('insight' in $$props) $$invalidate(0, insight = $$props.insight);
    		if ('identifier' in $$props) $$invalidate(1, identifier = $$props.identifier);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [insight, identifier];
    }

    class InsightCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { insight: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InsightCard",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get insight() {
    		throw new Error("<InsightCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set insight(value) {
    		throw new Error("<InsightCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/ProductCard.svelte generated by Svelte v3.59.2 */
    const file$5 = "src/ProductCard.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (22:20) {#if product.item.customFields2.skus.length == 1}
    function create_if_block_1$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("SKU");
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
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(22:20) {#if product.item.customFields2.skus.length == 1}",
    		ctx
    	});

    	return block;
    }

    // (23:32) {#if product.item.customFields2.skus.length > 1}
    function create_if_block$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("SKUs");
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
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(23:32) {#if product.item.customFields2.skus.length > 1}",
    		ctx
    	});

    	return block;
    }

    // (42:16) {#each product.item.customFields2.skus as sku}
    function create_each_block$2(ctx) {
    	let span;
    	let a;
    	let t0_value = /*sku*/ ctx[7].sku + "";
    	let t0;
    	let a_href_value;
    	let t1;

    	const block = {
    		c: function create() {
    			span = element("span");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(a, "href", a_href_value = `${/*product*/ ctx[0].item.link}/?sku=${/*sku*/ ctx[7].sku}`);
    			add_location(a, file$5, 43, 24, 1792);
    			add_location(span, file$5, 42, 20, 1761);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, a);
    			append_dev(a, t0);
    			append_dev(span, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*product*/ 1 && t0_value !== (t0_value = /*sku*/ ctx[7].sku + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*product*/ 1 && a_href_value !== (a_href_value = `${/*product*/ ctx[0].item.link}/?sku=${/*sku*/ ctx[7].sku}`)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(42:16) {#each product.item.customFields2.skus as sku}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div8;
    	let div7;
    	let div2;
    	let a0;
    	let img;
    	let img_src_value;
    	let a0_href_value;
    	let t0;
    	let div0;
    	let raw0_value = /*product*/ ctx[0].item.title + "";
    	let t1;
    	let div1;
    	let span0;
    	let t2_value = /*product*/ ctx[0].item.customFields2.skus.length + "";
    	let t2;
    	let t3;
    	let if_block0_anchor;
    	let t4;
    	let span1;
    	let t6;
    	let a1;
    	let svg0;
    	let path0;
    	let a1_href_value;
    	let t7;
    	let div6;
    	let div3;
    	let t8;
    	let div4;
    	let raw1_value = /*product*/ ctx[0].item.title + "";
    	let t9;
    	let div5;
    	let svg1;
    	let g1;
    	let g0;
    	let rect;
    	let path1;
    	let t10;
    	let a2;
    	let svg2;
    	let path2;
    	let a2_href_value;
    	let div7_class_value;
    	let t11;
    	let a3;
    	let raw2_value = /*product*/ ctx[0].item.title + "";
    	let a3_href_value;
    	let div8_intro;
    	let mounted;
    	let dispose;
    	let if_block0 = /*product*/ ctx[0].item.customFields2.skus.length == 1 && create_if_block_1$2(ctx);
    	let if_block1 = /*product*/ ctx[0].item.customFields2.skus.length > 1 && create_if_block$4(ctx);
    	let each_value = /*product*/ ctx[0].item.customFields2.skus;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			div7 = element("div");
    			div2 = element("div");
    			a0 = element("a");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			t1 = space();
    			div1 = element("div");
    			span0 = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			if (if_block0) if_block0.c();
    			if_block0_anchor = empty();
    			if (if_block1) if_block1.c();
    			t4 = space();
    			span1 = element("span");
    			span1.textContent = "SKUs";
    			t6 = space();
    			a1 = element("a");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t7 = space();
    			div6 = element("div");
    			div3 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			div4 = element("div");
    			t9 = space();
    			div5 = element("div");
    			svg1 = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			rect = svg_element("rect");
    			path1 = svg_element("path");
    			t10 = space();
    			a2 = element("a");
    			svg2 = svg_element("svg");
    			path2 = svg_element("path");
    			t11 = space();
    			a3 = element("a");
    			if (!src_url_equal(img.src, img_src_value = /*product*/ ctx[0]?.item?.customFields2?.skus[0]?.productImages[0]?.productImage?.mediaItemUrl)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$5, 10, 62, 385);
    			attr_dev(a0, "class", "product-image-link");
    			attr_dev(a0, "href", a0_href_value = /*product*/ ctx[0].link);
    			add_location(a0, file$5, 10, 12, 335);
    			attr_dev(div0, "class", "product-title");
    			add_location(div0, file$5, 11, 12, 506);
    			attr_dev(span0, "class", "sku-count-default");
    			add_location(span0, file$5, 19, 16, 760);
    			attr_dev(span1, "class", "sku-count-small");
    			add_location(span1, file$5, 24, 16, 1055);
    			attr_dev(div1, "class", "sku-count");
    			add_location(div1, file$5, 12, 12, 578);
    			attr_dev(path0, "d", "M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z");
    			attr_dev(path0, "fill", "#fff");
    			add_location(path0, file$5, 32, 21, 1394);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "width", "13.922");
    			attr_dev(svg0, "height", "16.245");
    			attr_dev(svg0, "viewBox", "0 0 13.922 16.245");
    			add_location(svg0, file$5, 27, 16, 1194);
    			attr_dev(a1, "class", "product-card-link");
    			attr_dev(a1, "href", a1_href_value = /*product*/ ctx[0].link);
    			add_location(a1, file$5, 26, 12, 1128);
    			attr_dev(div2, "class", "product-block-image");
    			add_location(div2, file$5, 9, 8, 289);
    			attr_dev(div3, "class", "sku-list");
    			add_location(div3, file$5, 40, 12, 1655);
    			attr_dev(div4, "class", "product-title");
    			add_location(div4, file$5, 47, 12, 1938);
    			attr_dev(rect, "width", "24");
    			attr_dev(rect, "height", "24");
    			attr_dev(rect, "transform", "rotate(180 12 12)");
    			attr_dev(rect, "opacity", "0");
    			add_location(rect, file$5, 58, 29, 2372);
    			attr_dev(path1, "d", "M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z");
    			add_location(path1, file$5, 63, 30, 2601);
    			attr_dev(g0, "data-name", "close");
    			add_location(g0, file$5, 57, 25, 2322);
    			attr_dev(g1, "data-name", "Layer 2");
    			add_location(g1, file$5, 56, 21, 2274);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			add_location(svg1, file$5, 55, 16, 2193);
    			attr_dev(div5, "class", "sku-close");
    			add_location(div5, file$5, 48, 12, 2010);
    			attr_dev(path2, "d", "M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z");
    			attr_dev(path2, "fill", "#fff");
    			add_location(path2, file$5, 76, 21, 3236);
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "width", "13.922");
    			attr_dev(svg2, "height", "16.245");
    			attr_dev(svg2, "viewBox", "0 0 13.922 16.245");
    			add_location(svg2, file$5, 71, 16, 3036);
    			attr_dev(a2, "class", "product-card-link");
    			attr_dev(a2, "href", a2_href_value = /*product*/ ctx[0].item.link);
    			add_location(a2, file$5, 70, 12, 2965);
    			attr_dev(div6, "class", "sku-list-container");
    			add_location(div6, file$5, 39, 8, 1610);
    			attr_dev(div7, "class", div7_class_value = "product-card " + /*openClass*/ ctx[2]);
    			add_location(div7, file$5, 8, 4, 241);
    			attr_dev(a3, "href", a3_href_value = /*product*/ ctx[0].item.link);
    			attr_dev(a3, "class", "product-title-small");
    			add_location(a3, file$5, 84, 4, 3459);
    			attr_dev(div8, "class", "product-card-container");
    			add_location(div8, file$5, 7, 0, 161);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div7);
    			append_dev(div7, div2);
    			append_dev(div2, a0);
    			append_dev(a0, img);
    			append_dev(div2, t0);
    			append_dev(div2, div0);
    			div0.innerHTML = raw0_value;
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, span0);
    			append_dev(span0, t2);
    			append_dev(span0, t3);
    			if (if_block0) if_block0.m(span0, null);
    			append_dev(span0, if_block0_anchor);
    			if (if_block1) if_block1.m(span0, null);
    			append_dev(div1, t4);
    			append_dev(div1, span1);
    			append_dev(div2, t6);
    			append_dev(div2, a1);
    			append_dev(a1, svg0);
    			append_dev(svg0, path0);
    			append_dev(div7, t7);
    			append_dev(div7, div6);
    			append_dev(div6, div3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div3, null);
    				}
    			}

    			append_dev(div6, t8);
    			append_dev(div6, div4);
    			div4.innerHTML = raw1_value;
    			append_dev(div6, t9);
    			append_dev(div6, div5);
    			append_dev(div5, svg1);
    			append_dev(svg1, g1);
    			append_dev(g1, g0);
    			append_dev(g0, rect);
    			append_dev(g0, path1);
    			append_dev(div6, t10);
    			append_dev(div6, a2);
    			append_dev(a2, svg2);
    			append_dev(svg2, path2);
    			append_dev(div8, t11);
    			append_dev(div8, a3);
    			a3.innerHTML = raw2_value;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*click_handler*/ ctx[5], false, false, false, false),
    					listen_dev(div1, "keydown", /*keydown_handler*/ ctx[4], false, false, false, false),
    					listen_dev(div5, "click", /*click_handler_1*/ ctx[6], false, false, false, false),
    					listen_dev(div5, "keydown", /*keydown_handler_1*/ ctx[3], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*product*/ 1 && !src_url_equal(img.src, img_src_value = /*product*/ ctx[0]?.item?.customFields2?.skus[0]?.productImages[0]?.productImage?.mediaItemUrl)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*product*/ 1 && a0_href_value !== (a0_href_value = /*product*/ ctx[0].link)) {
    				attr_dev(a0, "href", a0_href_value);
    			}

    			if (dirty & /*product*/ 1 && raw0_value !== (raw0_value = /*product*/ ctx[0].item.title + "")) div0.innerHTML = raw0_value;			if (dirty & /*product*/ 1 && t2_value !== (t2_value = /*product*/ ctx[0].item.customFields2.skus.length + "")) set_data_dev(t2, t2_value);

    			if (/*product*/ ctx[0].item.customFields2.skus.length == 1) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_1$2(ctx);
    					if_block0.c();
    					if_block0.m(span0, if_block0_anchor);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*product*/ ctx[0].item.customFields2.skus.length > 1) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block$4(ctx);
    					if_block1.c();
    					if_block1.m(span0, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*product*/ 1 && a1_href_value !== (a1_href_value = /*product*/ ctx[0].link)) {
    				attr_dev(a1, "href", a1_href_value);
    			}

    			if (dirty & /*product*/ 1) {
    				each_value = /*product*/ ctx[0].item.customFields2.skus;
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

    			if (dirty & /*product*/ 1 && raw1_value !== (raw1_value = /*product*/ ctx[0].item.title + "")) div4.innerHTML = raw1_value;
    			if (dirty & /*product*/ 1 && a2_href_value !== (a2_href_value = /*product*/ ctx[0].item.link)) {
    				attr_dev(a2, "href", a2_href_value);
    			}

    			if (dirty & /*openClass*/ 4 && div7_class_value !== (div7_class_value = "product-card " + /*openClass*/ ctx[2])) {
    				attr_dev(div7, "class", div7_class_value);
    			}

    			if (dirty & /*product*/ 1 && raw2_value !== (raw2_value = /*product*/ ctx[0].item.title + "")) a3.innerHTML = raw2_value;
    			if (dirty & /*product*/ 1 && a3_href_value !== (a3_href_value = /*product*/ ctx[0].item.link)) {
    				attr_dev(a3, "href", a3_href_value);
    			}
    		},
    		i: function intro(local) {
    			if (!div8_intro) {
    				add_render_callback(() => {
    					div8_intro = create_in_transition(div8, fade, { delay: 300, duration: 300 });
    					div8_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_each(each_blocks, detaching);
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
    	let openClass;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ProductCard', slots, []);
    	let { product = [] } = $$props;
    	let open = false;
    	const writable_props = ['product'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ProductCard> was created with unknown prop '${key}'`);
    	});

    	function keydown_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler = () => {
    		$$invalidate(1, open = true);
    	};

    	const click_handler_1 = () => {
    		$$invalidate(1, open = false);
    	};

    	$$self.$$set = $$props => {
    		if ('product' in $$props) $$invalidate(0, product = $$props.product);
    	};

    	$$self.$capture_state = () => ({ fade, product, open, openClass });

    	$$self.$inject_state = $$props => {
    		if ('product' in $$props) $$invalidate(0, product = $$props.product);
    		if ('open' in $$props) $$invalidate(1, open = $$props.open);
    		if ('openClass' in $$props) $$invalidate(2, openClass = $$props.openClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*open*/ 2) {
    			$$invalidate(2, openClass = open ? "open" : "closed");
    		}
    	};

    	return [
    		product,
    		open,
    		openClass,
    		keydown_handler_1,
    		keydown_handler,
    		click_handler,
    		click_handler_1
    	];
    }

    class ProductCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { product: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProductCard",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get product() {
    		throw new Error("<ProductCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set product(value) {
    		throw new Error("<ProductCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/PlaceholderCard.svelte generated by Svelte v3.59.2 */
    const file$4 = "src/PlaceholderCard.svelte";

    function create_fragment$4(ctx) {
    	let div3;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let t2;
    	let svg;
    	let g1;
    	let g0;
    	let rect;
    	let path;
    	let circle;
    	let div3_outro;
    	let current;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			t2 = space();
    			svg = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			rect = svg_element("rect");
    			path = svg_element("path");
    			circle = svg_element("circle");
    			attr_dev(div0, "class", "placeholder-link");
    			add_location(div0, file$4, 6, 4, 134);
    			attr_dev(div1, "class", "placeholder-sku-count svelte-m4neoh");
    			add_location(div1, file$4, 7, 4, 171);
    			attr_dev(div2, "class", "placeholder-card-link svelte-m4neoh");
    			add_location(div2, file$4, 8, 4, 213);
    			attr_dev(rect, "width", "24");
    			attr_dev(rect, "height", "24");
    			attr_dev(rect, "opacity", "0");
    			attr_dev(rect, "class", "svelte-m4neoh");
    			add_location(rect, file$4, 9, 134, 385);
    			attr_dev(path, "d", "M18 3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3zM6 5h12a1 1 0 0 1 1 1v8.36l-3.2-2.73a2.77 2.77 0 0 0-3.52 0L5 17.7V6a1 1 0 0 1 1-1z");
    			attr_dev(path, "class", "svelte-m4neoh");
    			add_location(path, file$4, 9, 176, 427);
    			attr_dev(circle, "cx", "8");
    			attr_dev(circle, "cy", "8.5");
    			attr_dev(circle, "r", "1.5");
    			attr_dev(circle, "class", "svelte-m4neoh");
    			add_location(circle, file$4, 9, 343, 594);
    			attr_dev(g0, "data-name", "image");
    			attr_dev(g0, "class", "svelte-m4neoh");
    			add_location(g0, file$4, 9, 113, 364);
    			attr_dev(g1, "data-name", "Layer 2");
    			attr_dev(g1, "class", "svelte-m4neoh");
    			add_location(g1, file$4, 9, 90, 341);
    			attr_dev(svg, "class", "placeholder-image svelte-m4neoh");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$4, 9, 4, 255);
    			attr_dev(div3, "class", "placeholder-card svelte-m4neoh");
    			add_location(div3, file$4, 5, 0, 71);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div3, t2);
    			append_dev(div3, svg);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, rect);
    			append_dev(g0, path);
    			append_dev(g0, circle);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			if (div3_outro) div3_outro.end(1);
    			current = true;
    		},
    		o: function outro(local) {
    			div3_outro = create_out_transition(div3, fade, { duration: 300 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (detaching && div3_outro) div3_outro.end();
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
    	validate_slots('PlaceholderCard', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PlaceholderCard> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ fade, slide });
    	return [];
    }

    class PlaceholderCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PlaceholderCard",
    			options,
    			id: create_fragment$4.name
    		});
    	}
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

    const filters = writable(new Set());
    const allItems = writable([]);
    const urlParams = new URLSearchParams(window.location.search);

    const currentPage = writable(parseInt(urlParams.get('page')) || 1);

    function divideItemsIntoPages(
      postsPerPage,
      items,
      currentPage,
      filters
    ) {
      let page = [];
      let pagesArray = [];
      let currentItems = [];

      if (filters.size == 0) {
        currentItems = items;
      }

      if (filters.size > 0) {
        currentItems = [];
        items.forEach((insight) => {
          if (insight.item.postType == 'post') {
            insight.item.node.terms.nodes.forEach((term) => {
              if (filters.has(term.name)) {
                currentItems.push(insight);
                return
              }
            });
          }
          if (insight.postType == 'product') {
            insight.item.terms.nodes.forEach((term) => {
              if (filters.has(term.name)) {
                currentItems.push(insight);
                return
              }
            });
          }
        });
      }

      currentItems.forEach((item) => {
        page.push(item);

        if (page.length == postsPerPage) {
          pagesArray.push(page);
          page = [];
          return
        }
      });
      if (page.length > 0) {
        pagesArray.push(page);
      }
      return pagesArray
    }

    /* src/Pagination.svelte generated by Svelte v3.59.2 */

    const { console: console_1 } = globals;
    const file$3 = "src/Pagination.svelte";

    // (28:0) {:else}
    function create_else_block_1(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Prev";
    			attr_dev(button, "class", "prev-next-button");
    			button.disabled = true;
    			add_location(button, file$3, 28, 4, 761);
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
    			add_location(button, file$3, 21, 4, 599);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[3], false, false, false, false);
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
    			add_location(button, file$3, 33, 8, 921);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[4], false, false, false, false);
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
    			add_location(button, file$3, 41, 8, 1151);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[5], false, false, false, false);
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
    			add_location(button, file$3, 54, 8, 1495);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_3*/ ctx[6], false, false, false, false);
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
    			add_location(button, file$3, 62, 8, 1744);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_4*/ ctx[7], false, false, false, false);
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
    function create_if_block_1$1(ctx) {
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
    			add_location(span, file$3, 70, 47, 2044);
    			attr_dev(div, "class", "pagination-seperator-dots");
    			add_location(div, file$3, 70, 8, 2005);
    			attr_dev(button, "class", "pagination-button");
    			add_location(button, file$3, 71, 8, 2075);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button, anchor);
    			append_dev(button, t2);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_5*/ ctx[8], false, false, false, false);
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
    		id: create_if_block_1$1.name,
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
    			add_location(button, file$3, 90, 4, 2478);
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
    			add_location(button, file$3, 81, 4, 2302);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_6*/ ctx[9], false, false, false, false);
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

    function create_fragment$3(ctx) {
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
    	let if_block5 = /*$currentPage*/ ctx[1] < /*totalPages*/ ctx[0] - 1 && /*totalPages*/ ctx[0] > 3 && create_if_block_1$1(ctx);

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
    			add_location(button, file$3, 49, 4, 1351);
    			attr_dev(div, "class", "page-number-buttons");
    			add_location(div, file$3, 31, 0, 824);
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
    					if_block5 = create_if_block_1$1(ctx);
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
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $currentPage;
    	validate_store(currentPage, 'currentPage');
    	component_subscribe($$self, currentPage, $$value => $$invalidate(1, $currentPage = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Pagination', slots, []);
    	let { totalPages } = $$props;

    	function setCurrentcurrentPage(newPage) {
    		scrollTo({
    			element: ".insight-archive-grid-container",
    			duration: 200
    		});

    		// setTimeout(() => {
    		currentPage.set(newPage);

    		console.log($currentPage);
    		const url = new URL(location);
    		url.searchParams.set("page", newPage);
    		history.pushState({}, "", url);
    	} // }, 600);

    	$$self.$$.on_mount.push(function () {
    		if (totalPages === undefined && !('totalPages' in $$props || $$self.$$.bound[$$self.$$.props['totalPages']])) {
    			console_1.warn("<Pagination> was created without expected prop 'totalPages'");
    		}
    	});

    	const writable_props = ['totalPages'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Pagination> was created with unknown prop '${key}'`);
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
    	};

    	$$self.$capture_state = () => ({
    		animateScroll,
    		currentPage,
    		totalPages,
    		setCurrentcurrentPage,
    		$currentPage
    	});

    	$$self.$inject_state = $$props => {
    		if ('totalPages' in $$props) $$invalidate(0, totalPages = $$props.totalPages);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		totalPages,
    		$currentPage,
    		setCurrentcurrentPage,
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
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { totalPages: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pagination",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get totalPages() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set totalPages(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Filters.svelte generated by Svelte v3.59.2 */
    const file$2 = "src/Filters.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    // (38:12) {:else}
    function create_else_block$1(ctx) {
    	let svg;
    	let g1;
    	let g0;
    	let rect;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			rect = svg_element("rect");
    			path = svg_element("path");
    			attr_dev(rect, "width", "24");
    			attr_dev(rect, "height", "24");
    			attr_dev(rect, "opacity", "0");
    			add_location(rect, file$2, 41, 29, 1497);
    			attr_dev(path, "d", "M12 15.5a1 1 0 0 1-.71-.29l-4-4a1 1 0 1 1 1.42-1.42L12 13.1l3.3-3.18a1 1 0 1 1 1.38 1.44l-4 3.86a1 1 0 0 1-.68.28z");
    			add_location(path, file$2, 41, 72, 1540);
    			attr_dev(g0, "data-name", "chevron-down");
    			add_location(g0, file$2, 40, 25, 1440);
    			attr_dev(g1, "data-name", "Layer 2");
    			add_location(g1, file$2, 39, 21, 1392);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$2, 38, 16, 1311);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, rect);
    			append_dev(g0, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(38:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (23:12) {#if open}
    function create_if_block_1(ctx) {
    	let svg;
    	let g1;
    	let g0;
    	let rect;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			rect = svg_element("rect");
    			path = svg_element("path");
    			attr_dev(rect, "width", "24");
    			attr_dev(rect, "height", "24");
    			attr_dev(rect, "transform", "rotate(180 12 12)");
    			attr_dev(rect, "opacity", "0");
    			add_location(rect, file$2, 26, 29, 755);
    			attr_dev(path, "d", "M16 14.5a1 1 0 0 1-.71-.29L12 10.9l-3.3 3.18a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.42l4-3.86a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.42 1 1 0 0 1-.69.28z");
    			add_location(path, file$2, 31, 30, 984);
    			attr_dev(g0, "data-name", "chevron-up");
    			add_location(g0, file$2, 25, 25, 700);
    			attr_dev(g1, "data-name", "Layer 2");
    			add_location(g1, file$2, 24, 21, 652);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$2, 23, 16, 571);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, rect);
    			append_dev(g0, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(23:12) {#if open}",
    		ctx
    	});

    	return block;
    }

    // (50:8) {#if open}
    function create_if_block$2(ctx) {
    	let ul;
    	let ul_transition;
    	let current;
    	let each_value_1 = /*categoriesArray*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "insight-archive-filter-dropdown");
    			add_location(ul, file$2, 50, 12, 1869);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$filters, categoriesArray*/ 6) {
    				each_value_1 = /*categoriesArray*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
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
    				if (!ul_transition) ul_transition = create_bidirectional_transition(ul, slide, { duration: 200 }, true);
    				ul_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!ul_transition) ul_transition = create_bidirectional_transition(ul, slide, { duration: 200 }, false);
    			ul_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    			if (detaching && ul_transition) ul_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(50:8) {#if open}",
    		ctx
    	});

    	return block;
    }

    // (55:16) {#each categoriesArray as category}
    function create_each_block_1(ctx) {
    	let li;
    	let div1;
    	let div0;
    	let div1_class_value;
    	let t0;
    	let t1_value = /*category*/ ctx[13] + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[8](/*category*/ ctx[13]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(div0, "class", "toggle-circle");
    			add_location(div0, file$2, 71, 28, 2796);

    			attr_dev(div1, "class", div1_class_value = "category-toggle " + (/*$filters*/ ctx[2].has(/*category*/ ctx[13])
    			? 'checked'
    			: 'unchecked'));

    			add_location(div1, file$2, 66, 24, 2570);
    			add_location(li, file$2, 55, 20, 2068);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div1);
    			append_dev(div1, div0);
    			append_dev(li, t0);
    			append_dev(li, t1);
    			append_dev(li, t2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(li, "click", click_handler_1, false, false, false, false),
    					listen_dev(li, "keydown", /*keydown_handler*/ ctx[5], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*$filters, categoriesArray*/ 6 && div1_class_value !== (div1_class_value = "category-toggle " + (/*$filters*/ ctx[2].has(/*category*/ ctx[13])
    			? 'checked'
    			: 'unchecked'))) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (dirty & /*categoriesArray*/ 2 && t1_value !== (t1_value = /*category*/ ctx[13] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(55:16) {#each categoriesArray as category}",
    		ctx
    	});

    	return block;
    }

    // (81:8) {#each [...$filters] as filter}
    function create_each_block$1(ctx) {
    	let li;
    	let t0_value = /*filter*/ ctx[10] + "";
    	let t0;
    	let t1;
    	let svg;
    	let g1;
    	let g0;
    	let rect;
    	let path;
    	let t2;
    	let mounted;
    	let dispose;

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[9](/*filter*/ ctx[10]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			svg = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			rect = svg_element("rect");
    			path = svg_element("path");
    			t2 = space();
    			attr_dev(rect, "width", "24");
    			attr_dev(rect, "height", "24");
    			attr_dev(rect, "transform", "rotate(180 12 12)");
    			attr_dev(rect, "opacity", "0");
    			add_location(rect, file$2, 94, 29, 3523);
    			attr_dev(path, "d", "M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z");
    			add_location(path, file$2, 99, 30, 3752);
    			attr_dev(g0, "data-name", "close");
    			add_location(g0, file$2, 93, 25, 3473);
    			attr_dev(g1, "data-name", "Layer 2");
    			add_location(g1, file$2, 92, 21, 3425);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$2, 91, 16, 3344);
    			add_location(li, file$2, 81, 12, 3086);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    			append_dev(li, svg);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, rect);
    			append_dev(g0, path);
    			append_dev(li, t2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(li, "keydown", /*keydown_handler_1*/ ctx[4], false, false, false, false),
    					listen_dev(li, "click", click_handler_2, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$filters*/ 4 && t0_value !== (t0_value = /*filter*/ ctx[10] + "")) set_data_dev(t0, t0_value);
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
    		source: "(81:8) {#each [...$filters] as filter}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let t0;
    	let t1;
    	let t2;
    	let ul;
    	let current;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*open*/ ctx[0]) return create_if_block_1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*open*/ ctx[0] && create_if_block$2(ctx);
    	let each_value = [.../*$filters*/ ctx[2]];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text("Categories\n            ");
    			if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "dropdown-toggle");
    			add_location(div0, file$2, 12, 8, 306);
    			attr_dev(div1, "class", "insight-archive-filter-categories");
    			add_location(div1, file$2, 11, 4, 250);
    			attr_dev(ul, "class", "insight-archive-rounded-buttons");
    			add_location(ul, file$2, 79, 4, 2989);
    			attr_dev(div2, "class", "insight-archive-filters");
    			add_location(div2, file$2, 10, 0, 208);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			if_block0.m(div0, null);
    			append_dev(div1, t1);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div2, t2);
    			append_dev(div2, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*click_handler*/ ctx[6], false, false, false, false),
    					listen_dev(div0, "keydown", /*keydown_handler_2*/ ctx[7], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div0, null);
    				}
    			}

    			if (/*open*/ ctx[0]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*open*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*$filters*/ 4) {
    				each_value = [.../*$filters*/ ctx[2]];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
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
    			if (detaching) detach_dev(div2);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_each(each_blocks, detaching);
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
    	let categoriesArray;
    	let $filters;
    	validate_store(filters, 'filters');
    	component_subscribe($$self, filters, $$value => $$invalidate(2, $filters = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Filters', slots, []);
    	let { categories = [] } = $$props;
    	let open = false;
    	const writable_props = ['categories'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Filters> was created with unknown prop '${key}'`);
    	});

    	function keydown_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler = () => {
    		$$invalidate(0, open = !open);
    	};

    	const keydown_handler_2 = () => {
    		$$invalidate(0, open = !open);
    	};

    	const click_handler_1 = category => {
    		if (!$filters.has(category)) {
    			set_store_value(filters, $filters = $filters.add(category), $filters);
    		} else {
    			if ($filters.delete(category)) {
    				filters.set($filters);
    			}
    		}
    	};

    	const click_handler_2 = filter => {
    		if ($filters.delete(filter)) {
    			filters.set($filters);
    		}
    	};

    	$$self.$$set = $$props => {
    		if ('categories' in $$props) $$invalidate(3, categories = $$props.categories);
    	};

    	$$self.$capture_state = () => ({
    		slide,
    		filters,
    		categories,
    		open,
    		categoriesArray,
    		$filters
    	});

    	$$self.$inject_state = $$props => {
    		if ('categories' in $$props) $$invalidate(3, categories = $$props.categories);
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    		if ('categoriesArray' in $$props) $$invalidate(1, categoriesArray = $$props.categoriesArray);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*categories*/ 8) {
    			$$invalidate(1, categoriesArray = [...categories]);
    		}
    	};

    	return [
    		open,
    		categoriesArray,
    		$filters,
    		categories,
    		keydown_handler_1,
    		keydown_handler,
    		click_handler,
    		keydown_handler_2,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class Filters extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { categories: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Filters",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get categories() {
    		throw new Error("<Filters>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set categories(value) {
    		throw new Error("<Filters>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Hero.svelte generated by Svelte v3.59.2 */

    const file$1 = "src/Hero.svelte";

    // (16:20) {:else}
    function create_else_block(ctx) {
    	let div4;
    	let div3;
    	let div2;
    	let div1;
    	let div0;
    	let t;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t = text("\n                        results");
    			attr_dev(div0, "class", "dot-flashing svelte-11d2hsp");
    			add_location(div0, file$1, 20, 40, 821);
    			attr_dev(div1, "class", "stage");
    			add_location(div1, file$1, 19, 36, 761);
    			attr_dev(div2, "class", "snippet");
    			attr_dev(div2, "data-title", "dot-flashing");
    			add_location(div2, file$1, 18, 32, 677);
    			attr_dev(div3, "class", "col-3");
    			add_location(div3, file$1, 17, 28, 625);
    			attr_dev(div4, "class", "loading-total svelte-11d2hsp");
    			add_location(div4, file$1, 16, 24, 569);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(16:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (14:20) {#if totalResults != ""}
    function create_if_block$1(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(" results");
    			add_location(span, file$1, 14, 24, 475);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			span.innerHTML = /*totalResults*/ ctx[1];
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*totalResults*/ 2) span.innerHTML = /*totalResults*/ ctx[1];		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(14:20) {#if totalResults != \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div4;
    	let div2;
    	let div0;
    	let t1;
    	let h1;
    	let t2;
    	let t3;
    	let div1;
    	let p0;
    	let t4;
    	let span;
    	let t5;
    	let t6;
    	let t7;
    	let p1;
    	let t9;
    	let div3;

    	function select_block_type(ctx, dirty) {
    		if (/*totalResults*/ ctx[1] != "") return create_if_block$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "You searched for:";
    			t1 = space();
    			h1 = element("h1");
    			t2 = text(/*searchTerm*/ ctx[0]);
    			t3 = space();
    			div1 = element("div");
    			p0 = element("p");
    			t4 = text("Your query returned\n                ");
    			span = element("span");
    			if_block.c();
    			t5 = space();
    			t6 = text(".");
    			t7 = space();
    			p1 = element("p");
    			p1.textContent = "To search again, edit your query above.";
    			t9 = space();
    			div3 = element("div");
    			attr_dev(div0, "class", "search-hero__subtitle");
    			add_location(div0, file$1, 7, 8, 172);
    			add_location(h1, file$1, 8, 8, 239);
    			attr_dev(span, "class", "search-hero__highlight");
    			add_location(span, file$1, 12, 16, 368);
    			add_location(p0, file$1, 10, 12, 312);
    			add_location(p1, file$1, 29, 12, 1110);
    			attr_dev(div1, "class", "search-hero-text");
    			add_location(div1, file$1, 9, 8, 269);
    			attr_dev(div2, "class", "search-hero-content");
    			add_location(div2, file$1, 6, 4, 130);
    			attr_dev(div3, "class", "search-hero-image-container");
    			add_location(div3, file$1, 32, 4, 1187);
    			attr_dev(div4, "class", "search-hero-block animate");
    			add_location(div4, file$1, 5, 0, 86);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, h1);
    			append_dev(h1, t2);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, p0);
    			append_dev(p0, t4);
    			append_dev(p0, span);
    			if_block.m(span, null);
    			append_dev(span, t5);
    			append_dev(p0, t6);
    			append_dev(div1, t7);
    			append_dev(div1, p1);
    			append_dev(div4, t9);
    			append_dev(div4, div3);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*searchTerm*/ 1) set_data_dev(t2, /*searchTerm*/ ctx[0]);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(span, t5);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if_block.d();
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
    	validate_slots('Hero', slots, []);
    	let { searchTerm = "" } = $$props;
    	let { totalResults = "" } = $$props;
    	const writable_props = ['searchTerm', 'totalResults'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Hero> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('searchTerm' in $$props) $$invalidate(0, searchTerm = $$props.searchTerm);
    		if ('totalResults' in $$props) $$invalidate(1, totalResults = $$props.totalResults);
    	};

    	$$self.$capture_state = () => ({ searchTerm, totalResults });

    	$$self.$inject_state = $$props => {
    		if ('searchTerm' in $$props) $$invalidate(0, searchTerm = $$props.searchTerm);
    		if ('totalResults' in $$props) $$invalidate(1, totalResults = $$props.totalResults);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [searchTerm, totalResults];
    }

    class Hero extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { searchTerm: 0, totalResults: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hero",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get searchTerm() {
    		throw new Error("<Hero>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set searchTerm(value) {
    		throw new Error("<Hero>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get totalResults() {
    		throw new Error("<Hero>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set totalResults(value) {
    		throw new Error("<Hero>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function getQuery(searchTerm) {
      searchTerm = searchTerm.replace('&', '&amp;');
      searchTerm = searchTerm.replace('”', '%22');
      searchTerm = searchTerm.replace('″', '%22');

      return `{
  posts(where: {search: "${searchTerm}"}, first: 100) {
    edges {
      node {
        link
        title
        featuredImage {
          node {
            sourceUrl(size: MEDIUM)
            altText
          }
        }
        terms {
          nodes {
            name
          }
        }
        postId
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
            terms {
              nodes {
                name
              }
            }
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
      terms {
        nodes {
          name
        }
      }
    }
  }
  pages(where: {search: "${searchTerm}"}) {
    edges {
      node {
        title
        link
        featuredImage {
          node {
            sourceUrl(size: MEDIUM)
          }
        }
      }
    }
  }
}`
    }

    // fetch the data from the server
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

    // Sort an array by closest comparison to string
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
                distances[i - 1][j - 1]
              ) + 1;
          }
        }
      }
      // Return the final distance
      return distances[a.length][b.length]
    }

    function determineProductResults(results) {
      const productResultsNumber = results?.data?.products?.nodes?.length || 0;
      const categoryProductResultsNumber =
        results?.data?.productCategories?.edges[0]?.node?.products?.nodes?.length ||
        0;

      if (productResultsNumber > categoryProductResultsNumber) {
        return results.data.products.nodes
      } else {
        return results?.data?.productCategories?.edges[0]?.node?.products.nodes
      }
    }

    function getProductsLevenshtein(products, term) {
      let productsWithDistances = products.map((product) => ({
        item: product,
        distance: getProductDistance(product, term),
        postType: 'product',
      }));

      return productsWithDistances
    }

    // determine the lowest levelshtein distance of a product
    function getProductDistance(product, term) {
      let items = [];
      let distances = [];

      items.push(product.title.toLowerCase());
      product.customFields2.skus.forEach((sku) => {
        items.push(sku.sku.toLowerCase());
      });

      items.forEach((item) => {
        let distance = levenshteinDistance(item.toLowerCase(), term.toLowerCase());
        distances.push(distance);
      });

      const lowest = Math.min(...distances);
      return lowest
    }

    function getOthersLevenshtein(items, term) {
      let othersWithDistances = items.map((item) => ({
        item: item,
        distance: item.node.title.toLowerCase().includes(term.toLowerCase())
          ? 0
          : levenshteinDistance(item.node.title.toLowerCase(), term.toLowerCase()),
        postType: 'other',
      }));
      return othersWithDistances
    }

    /* src/App.svelte generated by Svelte v3.59.2 */
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    // (134:16) {#each Array(12) as _}
    function create_each_block(ctx) {
    	let placeholdercard;
    	let current;
    	placeholdercard = new PlaceholderCard({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(placeholdercard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(placeholdercard, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(placeholdercard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(placeholdercard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(placeholdercard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(134:16) {#each Array(12) as _}",
    		ctx
    	});

    	return block;
    }

    // (141:8) {#if totalPages > 1}
    function create_if_block(ctx) {
    	let pagination;
    	let current;

    	pagination = new Pagination({
    			props: { totalPages: /*totalPages*/ ctx[3] },
    			$$inline: true
    		});

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
    			if (dirty & /*totalPages*/ 8) pagination_changes.totalPages = /*totalPages*/ ctx[3];
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
    		source: "(141:8) {#if totalPages > 1}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let hero;
    	let t0;
    	let div0;
    	let filters_1;
    	let t1;
    	let section;
    	let div1;
    	let ul;
    	let t2;
    	let div2;
    	let current;

    	hero = new Hero({
    			props: {
    				searchTerm: /*searchTerm*/ ctx[0],
    				totalResults: /*totalResults*/ ctx[2]
    			},
    			$$inline: true
    		});

    	filters_1 = new Filters({
    			props: { categories: /*categories*/ ctx[1] },
    			$$inline: true
    		});

    	let each_value = Array(12);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	let if_block = /*totalPages*/ ctx[3] > 1 && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			create_component(hero.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			create_component(filters_1.$$.fragment);
    			t1 = space();
    			section = element("section");
    			div1 = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			div2 = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "insight-archive-filters-container");
    			add_location(div0, file, 118, 0, 3408);
    			attr_dev(ul, "class", "insight-archive-grid");
    			add_location(ul, file, 123, 8, 3583);
    			attr_dev(div1, "class", "insight-archive-grid-container");
    			add_location(div1, file, 122, 4, 3530);
    			attr_dev(div2, "class", "pagination-container");
    			add_location(div2, file, 139, 4, 4328);
    			attr_dev(section, "class", "insight-archive");
    			add_location(section, file, 121, 0, 3492);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(hero, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div0, anchor);
    			mount_component(filters_1, div0, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, section, anchor);
    			append_dev(section, div1);
    			append_dev(div1, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}

    			append_dev(section, t2);
    			append_dev(section, div2);
    			if (if_block) if_block.m(div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const hero_changes = {};
    			if (dirty & /*searchTerm*/ 1) hero_changes.searchTerm = /*searchTerm*/ ctx[0];
    			if (dirty & /*totalResults*/ 4) hero_changes.totalResults = /*totalResults*/ ctx[2];
    			hero.$set(hero_changes);
    			const filters_1_changes = {};
    			if (dirty & /*categories*/ 2) filters_1_changes.categories = /*categories*/ ctx[1];
    			filters_1.$set(filters_1_changes);

    			if (/*totalPages*/ ctx[3] > 1) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*totalPages*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div2, null);
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
    			transition_in(hero.$$.fragment, local);
    			transition_in(filters_1.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(hero.$$.fragment, local);
    			transition_out(filters_1.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(hero, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div0);
    			destroy_component(filters_1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
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

    function setPostType(items, type) {
    	items.forEach(item => {
    		item.postType = type;
    	});
    }

    function instance($$self, $$props, $$invalidate) {
    	let insightsDividedIntoPages;
    	let $allItems;
    	let $currentPage;
    	let $filters;
    	validate_store(allItems, 'allItems');
    	component_subscribe($$self, allItems, $$value => $$invalidate(4, $allItems = $$value));
    	validate_store(currentPage, 'currentPage');
    	component_subscribe($$self, currentPage, $$value => $$invalidate(5, $currentPage = $$value));
    	validate_store(filters, 'filters');
    	component_subscribe($$self, filters, $$value => $$invalidate(6, $filters = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { searchTerm = "" } = $$props;
    	let postsPerPage = 12;
    	let categories;
    	let totalResults = '';
    	let firstLoad = true;

    	onMount(async () => {
    		let productsWithDistances = [];
    		const query = getQuery(searchTerm);
    		const data = await getData(query);
    		const productResults = determineProductResults(data);

    		if (productResults && productResults.length > 0) {
    			productsWithDistances = getProductsLevenshtein(productResults, searchTerm);
    		}

    		setPostType(data.data.pages.edges, "page");
    		setPostType(data.data.posts.edges, "post");
    		const otherResults = [...data.data.pages.edges, ...data.data.posts.edges];
    		const othersWithDistances = getOthersLevenshtein(otherResults, searchTerm);
    		const allResults = [...productsWithDistances, ...othersWithDistances].sort((a, b) => a.distance - b.distance);
    		allItems.set(allResults);
    		$$invalidate(2, totalResults = $allItems.length);
    		$$invalidate(1, categories = getCategories());
    	});

    	let totalPages = 0;

    	allItems.subscribe(value => {
    		insightsDividedIntoPages = divideItemsIntoPages(postsPerPage, value, $currentPage, $filters);
    		$$invalidate(3, totalPages = insightsDividedIntoPages.length);
    	});

    	filters.subscribe(value => {
    		insightsDividedIntoPages = divideItemsIntoPages(postsPerPage, $allItems, $currentPage, value);

    		if (!firstLoad) {
    			currentPage.set(1);
    			firstLoad = false;
    		}

    		$$invalidate(3, totalPages = insightsDividedIntoPages.length);
    	});

    	function getCategories() {
    		let categories = new Set();

    		$allItems.forEach(insight => {
    			if (insight.item.postType == "post") {
    				insight.item.node.terms.nodes.forEach(term => {
    					categories.add(term.name);
    				});
    			}

    			if (insight.postType == "product") {
    				insight.item.terms.nodes.forEach(term => {
    					categories.add(term.name);
    				});
    			}
    		});

    		const sortedCategories = new Set(Array.from(categories).sort());
    		return sortedCategories;
    	}

    	const writable_props = ['searchTerm'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('searchTerm' in $$props) $$invalidate(0, searchTerm = $$props.searchTerm);
    	};

    	$$self.$capture_state = () => ({
    		searchTerm,
    		onMount,
    		InsightCard,
    		ProductCard,
    		PLaceholderCard: PlaceholderCard,
    		Pagination,
    		Filters,
    		Hero,
    		filters,
    		divideItemsIntoPages,
    		allItems,
    		currentPage,
    		getQuery,
    		getData,
    		determineProductResults,
    		getProductsLevenshtein,
    		getOthersLevenshtein,
    		PlaceholderCard,
    		postsPerPage,
    		categories,
    		totalResults,
    		firstLoad,
    		setPostType,
    		totalPages,
    		getCategories,
    		insightsDividedIntoPages,
    		$allItems,
    		$currentPage,
    		$filters
    	});

    	$$self.$inject_state = $$props => {
    		if ('searchTerm' in $$props) $$invalidate(0, searchTerm = $$props.searchTerm);
    		if ('postsPerPage' in $$props) $$invalidate(9, postsPerPage = $$props.postsPerPage);
    		if ('categories' in $$props) $$invalidate(1, categories = $$props.categories);
    		if ('totalResults' in $$props) $$invalidate(2, totalResults = $$props.totalResults);
    		if ('firstLoad' in $$props) firstLoad = $$props.firstLoad;
    		if ('totalPages' in $$props) $$invalidate(3, totalPages = $$props.totalPages);
    		if ('insightsDividedIntoPages' in $$props) insightsDividedIntoPages = $$props.insightsDividedIntoPages;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$allItems, $currentPage, $filters*/ 112) {
    			insightsDividedIntoPages = divideItemsIntoPages(postsPerPage, $allItems, $currentPage, $filters);
    		}
    	};

    	return [
    		searchTerm,
    		categories,
    		totalResults,
    		totalPages,
    		$allItems,
    		$currentPage,
    		$filters
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { searchTerm: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get searchTerm() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set searchTerm(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    return App;

}));
//# sourceMappingURL=search-archive.js.map
