
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Archive = factory());
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
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
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

    /* src/ProductCard.svelte generated by Svelte v3.59.2 */
    const file$7 = "src/ProductCard.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (22:20) {#if product.skus.length == 1}
    function create_if_block_1$4(ctx) {
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
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(22:20) {#if product.skus.length == 1}",
    		ctx
    	});

    	return block;
    }

    // (23:32) {#if product.skus.length > 1}
    function create_if_block$5(ctx) {
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
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(23:32) {#if product.skus.length > 1}",
    		ctx
    	});

    	return block;
    }

    // (42:16) {#each product.skus as sku}
    function create_each_block$3(ctx) {
    	let span;
    	let t0_value = /*sku*/ ctx[7] + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			add_location(span, file$7, 42, 20, 1549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*product*/ 1 && t0_value !== (t0_value = /*sku*/ ctx[7] + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(42:16) {#each product.skus as sku}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div8;
    	let div7;
    	let div2;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let raw0_value = /*product*/ ctx[0].title + "";
    	let t1;
    	let div1;
    	let span0;
    	let t2_value = /*product*/ ctx[0].skus.length + "";
    	let t2;
    	let t3;
    	let if_block0_anchor;
    	let t4;
    	let span1;
    	let t6;
    	let a0;
    	let svg0;
    	let path0;
    	let a0_href_value;
    	let t7;
    	let div6;
    	let div3;
    	let t8;
    	let div4;
    	let raw1_value = /*product*/ ctx[0].title + "";
    	let t9;
    	let div5;
    	let svg1;
    	let g1;
    	let g0;
    	let rect;
    	let path1;
    	let t10;
    	let a1;
    	let svg2;
    	let path2;
    	let a1_href_value;
    	let div7_class_value;
    	let div7_intro;
    	let t11;
    	let a2;
    	let raw2_value = /*product*/ ctx[0].title + "";
    	let a2_href_value;
    	let mounted;
    	let dispose;
    	let if_block0 = /*product*/ ctx[0].skus.length == 1 && create_if_block_1$4(ctx);
    	let if_block1 = /*product*/ ctx[0].skus.length > 1 && create_if_block$5(ctx);
    	let each_value = /*product*/ ctx[0].skus;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			div7 = element("div");
    			div2 = element("div");
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
    			a0 = element("a");
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
    			a1 = element("a");
    			svg2 = svg_element("svg");
    			path2 = svg_element("path");
    			t11 = space();
    			a2 = element("a");
    			if (!src_url_equal(img.src, img_src_value = /*product*/ ctx[0].image_url)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$7, 10, 12, 324);
    			attr_dev(div0, "class", "product-title");
    			add_location(div0, file$7, 11, 12, 375);
    			attr_dev(span0, "class", "sku-count-default");
    			add_location(span0, file$7, 19, 16, 624);
    			attr_dev(span1, "class", "sku-count-small");
    			add_location(span1, file$7, 24, 16, 862);
    			attr_dev(div1, "class", "sku-count");
    			add_location(div1, file$7, 12, 12, 442);
    			attr_dev(path0, "d", "M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z");
    			attr_dev(path0, "fill", "#fff");
    			add_location(path0, file$7, 32, 21, 1201);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "width", "13.922");
    			attr_dev(svg0, "height", "16.245");
    			attr_dev(svg0, "viewBox", "0 0 13.922 16.245");
    			add_location(svg0, file$7, 27, 16, 1001);
    			attr_dev(a0, "class", "product-card-link");
    			attr_dev(a0, "href", a0_href_value = /*product*/ ctx[0].link);
    			add_location(a0, file$7, 26, 12, 935);
    			attr_dev(div2, "class", "product-block-image");
    			add_location(div2, file$7, 9, 8, 278);
    			attr_dev(div3, "class", "sku-list");
    			add_location(div3, file$7, 40, 12, 1462);
    			attr_dev(div4, "class", "product-title");
    			add_location(div4, file$7, 47, 12, 1669);
    			attr_dev(rect, "width", "24");
    			attr_dev(rect, "height", "24");
    			attr_dev(rect, "transform", "rotate(180 12 12)");
    			attr_dev(rect, "opacity", "0");
    			add_location(rect, file$7, 58, 29, 2098);
    			attr_dev(path1, "d", "M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z");
    			add_location(path1, file$7, 63, 30, 2327);
    			attr_dev(g0, "data-name", "close");
    			add_location(g0, file$7, 57, 25, 2048);
    			attr_dev(g1, "data-name", "Layer 2");
    			add_location(g1, file$7, 56, 21, 2000);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			add_location(svg1, file$7, 55, 16, 1919);
    			attr_dev(div5, "class", "sku-close");
    			add_location(div5, file$7, 48, 12, 1736);
    			attr_dev(path2, "d", "M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z");
    			attr_dev(path2, "fill", "#fff");
    			add_location(path2, file$7, 76, 21, 2957);
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "width", "13.922");
    			attr_dev(svg2, "height", "16.245");
    			attr_dev(svg2, "viewBox", "0 0 13.922 16.245");
    			add_location(svg2, file$7, 71, 16, 2757);
    			attr_dev(a1, "class", "product-card-link");
    			attr_dev(a1, "href", a1_href_value = /*product*/ ctx[0].link);
    			add_location(a1, file$7, 70, 12, 2691);
    			attr_dev(div6, "class", "sku-list-container");
    			add_location(div6, file$7, 39, 8, 1417);
    			attr_dev(div7, "class", div7_class_value = "product-card " + /*openClass*/ ctx[2]);
    			add_location(div7, file$7, 8, 4, 203);
    			attr_dev(a2, "href", a2_href_value = /*product*/ ctx[0].link);
    			attr_dev(a2, "class", "product-title-small");
    			add_location(a2, file$7, 84, 4, 3180);
    			attr_dev(div8, "class", "product-card-container");
    			add_location(div8, file$7, 7, 0, 162);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div7);
    			append_dev(div7, div2);
    			append_dev(div2, img);
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
    			append_dev(div2, a0);
    			append_dev(a0, svg0);
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
    			append_dev(div6, a1);
    			append_dev(a1, svg2);
    			append_dev(svg2, path2);
    			append_dev(div8, t11);
    			append_dev(div8, a2);
    			a2.innerHTML = raw2_value;

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
    			if (dirty & /*product*/ 1 && !src_url_equal(img.src, img_src_value = /*product*/ ctx[0].image_url)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*product*/ 1 && raw0_value !== (raw0_value = /*product*/ ctx[0].title + "")) div0.innerHTML = raw0_value;			if (dirty & /*product*/ 1 && t2_value !== (t2_value = /*product*/ ctx[0].skus.length + "")) set_data_dev(t2, t2_value);

    			if (/*product*/ ctx[0].skus.length == 1) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_1$4(ctx);
    					if_block0.c();
    					if_block0.m(span0, if_block0_anchor);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*product*/ ctx[0].skus.length > 1) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block$5(ctx);
    					if_block1.c();
    					if_block1.m(span0, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*product*/ 1 && a0_href_value !== (a0_href_value = /*product*/ ctx[0].link)) {
    				attr_dev(a0, "href", a0_href_value);
    			}

    			if (dirty & /*product*/ 1) {
    				each_value = /*product*/ ctx[0].skus;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div3, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*product*/ 1 && raw1_value !== (raw1_value = /*product*/ ctx[0].title + "")) div4.innerHTML = raw1_value;
    			if (dirty & /*product*/ 1 && a1_href_value !== (a1_href_value = /*product*/ ctx[0].link)) {
    				attr_dev(a1, "href", a1_href_value);
    			}

    			if (dirty & /*openClass*/ 4 && div7_class_value !== (div7_class_value = "product-card " + /*openClass*/ ctx[2])) {
    				attr_dev(div7, "class", div7_class_value);
    			}

    			if (dirty & /*product*/ 1 && raw2_value !== (raw2_value = /*product*/ ctx[0].title + "")) a2.innerHTML = raw2_value;
    			if (dirty & /*product*/ 1 && a2_href_value !== (a2_href_value = /*product*/ ctx[0].link)) {
    				attr_dev(a2, "href", a2_href_value);
    			}
    		},
    		i: function intro(local) {
    			if (!div7_intro) {
    				add_render_callback(() => {
    					div7_intro = create_in_transition(div7, fade, { duration: 300 });
    					div7_intro.start();
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
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
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

    	$$self.$capture_state = () => ({ product, fade, open, openClass });

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
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { product: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProductCard",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get product() {
    		throw new Error("<ProductCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set product(value) {
    		throw new Error("<ProductCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
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

    const postsPerPage = writable(12);
    const childFilters = writable(new Set([]));
    const parentFilters = writable(new Set([]));
    const currentPage = writable(1);

    /* src/Pagination.svelte generated by Svelte v3.59.2 */
    const file$6 = "src/Pagination.svelte";

    // (16:0) {:else}
    function create_else_block_1$1(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Prev";
    			attr_dev(button, "class", "prev-next-button");
    			button.disabled = true;
    			add_location(button, file$6, 16, 4, 359);
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
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(16:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (10:0) {#if $currentPage > 1}
    function create_if_block_6(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Prev";
    			attr_dev(button, "class", "prev-next-button");
    			add_location(button, file$6, 10, 4, 205);
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
    		source: "(10:0) {#if $currentPage > 1}",
    		ctx
    	});

    	return block;
    }

    // (21:4) {#if $currentPage == totalPages && totalPages > 2}
    function create_if_block_5$1(ctx) {
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
    			add_location(button, file$6, 21, 8, 519);
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
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(21:4) {#if $currentPage == totalPages && totalPages > 2}",
    		ctx
    	});

    	return block;
    }

    // (28:4) {#if $currentPage > 1}
    function create_if_block_4$1(ctx) {
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
    			add_location(button, file$6, 28, 8, 736);
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
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(28:4) {#if $currentPage > 1}",
    		ctx
    	});

    	return block;
    }

    // (38:4) {#if $currentPage < totalPages}
    function create_if_block_3$1(ctx) {
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
    			add_location(button, file$6, 38, 8, 1057);
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
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(38:4) {#if $currentPage < totalPages}",
    		ctx
    	});

    	return block;
    }

    // (44:4) {#if $currentPage == 1 && totalPages > 2}
    function create_if_block_2$2(ctx) {
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
    			add_location(button, file$6, 44, 8, 1278);
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
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(44:4) {#if $currentPage == 1 && totalPages > 2}",
    		ctx
    	});

    	return block;
    }

    // (52:4) {#if $currentPage < totalPages - 1 && totalPages > 3}
    function create_if_block_1$3(ctx) {
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
    			add_location(span, file$6, 52, 47, 1566);
    			attr_dev(div, "class", "pagination-seperator-dots");
    			add_location(div, file$6, 52, 8, 1527);
    			attr_dev(button, "class", "pagination-button");
    			add_location(button, file$6, 53, 8, 1597);
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
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(52:4) {#if $currentPage < totalPages - 1 && totalPages > 3}",
    		ctx
    	});

    	return block;
    }

    // (72:0) {:else}
    function create_else_block$3(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Next";
    			attr_dev(button, "class", "prev-next-button");
    			button.disabled = true;
    			add_location(button, file$6, 72, 4, 1981);
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
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(72:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (64:0) {#if $currentPage < totalPages}
    function create_if_block$4(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Next";
    			attr_dev(button, "class", "prev-next-button");
    			add_location(button, file$6, 64, 4, 1813);
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
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(64:0) {#if $currentPage < totalPages}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
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
    		return create_else_block_1$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*$currentPage*/ ctx[1] == /*totalPages*/ ctx[0] && /*totalPages*/ ctx[0] > 2 && create_if_block_5$1(ctx);
    	let if_block2 = /*$currentPage*/ ctx[1] > 1 && create_if_block_4$1(ctx);
    	let if_block3 = /*$currentPage*/ ctx[1] < /*totalPages*/ ctx[0] && create_if_block_3$1(ctx);
    	let if_block4 = /*$currentPage*/ ctx[1] == 1 && /*totalPages*/ ctx[0] > 2 && create_if_block_2$2(ctx);
    	let if_block5 = /*$currentPage*/ ctx[1] < /*totalPages*/ ctx[0] - 1 && /*totalPages*/ ctx[0] > 3 && create_if_block_1$3(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*$currentPage*/ ctx[1] < /*totalPages*/ ctx[0]) return create_if_block$4;
    		return create_else_block$3;
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
    			add_location(button, file$6, 35, 4, 923);
    			attr_dev(div, "class", "page-number-buttons");
    			add_location(div, file$6, 19, 0, 422);
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
    					if_block1 = create_if_block_5$1(ctx);
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
    					if_block2 = create_if_block_4$1(ctx);
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
    					if_block3 = create_if_block_3$1(ctx);
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
    					if_block4 = create_if_block_2$2(ctx);
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
    					if_block5 = create_if_block_1$3(ctx);
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
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $currentPage;
    	validate_store(currentPage, 'currentPage');
    	component_subscribe($$self, currentPage, $$value => $$invalidate(1, $currentPage = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Pagination', slots, []);
    	let { totalPages } = $$props;

    	function setCurrentcurrentPage(newPage) {
    		currentPage.set(newPage);
    	}

    	$$self.$$.on_mount.push(function () {
    		if (totalPages === undefined && !('totalPages' in $$props || $$self.$$.bound[$$self.$$.props['totalPages']])) {
    			console.warn("<Pagination> was created without expected prop 'totalPages'");
    		}
    	});

    	const writable_props = ['totalPages'];

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
    	};

    	$$self.$capture_state = () => ({
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
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { totalPages: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pagination",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get totalPages() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set totalPages(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/CardsPerPage.svelte generated by Svelte v3.59.2 */
    const file$5 = "src/CardsPerPage.svelte";

    function create_fragment$5(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "min", "1");
    			attr_dev(input, "max", "144");
    			add_location(input, file$5, 4, 0, 68);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*$postsPerPage*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[1]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$postsPerPage*/ 1 && to_number(input.value) !== /*$postsPerPage*/ ctx[0]) {
    				set_input_value(input, /*$postsPerPage*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
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
    	let $postsPerPage;
    	validate_store(postsPerPage, 'postsPerPage');
    	component_subscribe($$self, postsPerPage, $$value => $$invalidate(0, $postsPerPage = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CardsPerPage', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CardsPerPage> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		$postsPerPage = to_number(this.value);
    		postsPerPage.set($postsPerPage);
    	}

    	$$self.$capture_state = () => ({ postsPerPage, $postsPerPage });
    	return [$postsPerPage, input_input_handler];
    }

    class CardsPerPage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardsPerPage",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/GridToggleButtons.svelte generated by Svelte v3.59.2 */

    const file$4 = "src/GridToggleButtons.svelte";

    // (14:0) {:else}
    function create_else_block$2(ctx) {
    	let button0;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let t2;
    	let div3;
    	let t3;
    	let div4;
    	let t4;
    	let div5;
    	let t5;
    	let div6;
    	let t6;
    	let div7;
    	let t7;
    	let div8;
    	let t8;
    	let button1;
    	let div9;
    	let t9;
    	let div10;
    	let t10;
    	let div11;
    	let t11;
    	let div12;
    	let t12;
    	let div13;
    	let t13;
    	let div14;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			t2 = space();
    			div3 = element("div");
    			t3 = space();
    			div4 = element("div");
    			t4 = space();
    			div5 = element("div");
    			t5 = space();
    			div6 = element("div");
    			t6 = space();
    			div7 = element("div");
    			t7 = space();
    			div8 = element("div");
    			t8 = space();
    			button1 = element("button");
    			div9 = element("div");
    			t9 = space();
    			div10 = element("div");
    			t10 = space();
    			div11 = element("div");
    			t11 = space();
    			div12 = element("div");
    			t12 = space();
    			div13 = element("div");
    			t13 = space();
    			div14 = element("div");
    			attr_dev(div0, "class", "square");
    			add_location(div0, file$4, 16, 4, 394);
    			attr_dev(div1, "class", "square");
    			add_location(div1, file$4, 17, 4, 421);
    			attr_dev(div2, "class", "square");
    			add_location(div2, file$4, 18, 4, 448);
    			attr_dev(div3, "class", "square");
    			add_location(div3, file$4, 19, 4, 475);
    			attr_dev(div4, "class", "square");
    			add_location(div4, file$4, 20, 4, 502);
    			attr_dev(div5, "class", "square");
    			add_location(div5, file$4, 21, 4, 529);
    			attr_dev(div6, "class", "square");
    			add_location(div6, file$4, 22, 4, 556);
    			attr_dev(div7, "class", "square");
    			add_location(div7, file$4, 23, 4, 583);
    			attr_dev(div8, "class", "square");
    			add_location(div8, file$4, 24, 4, 610);
    			attr_dev(button0, "class", "layout-button grid-layout-button");
    			add_location(button0, file$4, 14, 0, 303);
    			attr_dev(div9, "class", "square");
    			add_location(div9, file$4, 27, 4, 733);
    			attr_dev(div10, "class", "square");
    			add_location(div10, file$4, 28, 4, 760);
    			attr_dev(div11, "class", "square");
    			add_location(div11, file$4, 29, 4, 787);
    			attr_dev(div12, "class", "square");
    			add_location(div12, file$4, 30, 4, 814);
    			attr_dev(div13, "class", "square");
    			add_location(div13, file$4, 31, 4, 841);
    			attr_dev(div14, "class", "square");
    			add_location(div14, file$4, 32, 4, 868);
    			attr_dev(button1, "class", "layout-button row-layout-button");
    			add_location(button1, file$4, 26, 0, 643);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button0, anchor);
    			append_dev(button0, div0);
    			append_dev(button0, t0);
    			append_dev(button0, div1);
    			append_dev(button0, t1);
    			append_dev(button0, div2);
    			append_dev(button0, t2);
    			append_dev(button0, div3);
    			append_dev(button0, t3);
    			append_dev(button0, div4);
    			append_dev(button0, t4);
    			append_dev(button0, div5);
    			append_dev(button0, t5);
    			append_dev(button0, div6);
    			append_dev(button0, t6);
    			append_dev(button0, div7);
    			append_dev(button0, t7);
    			append_dev(button0, div8);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, button1, anchor);
    			append_dev(button1, div9);
    			append_dev(button1, t9);
    			append_dev(button1, div10);
    			append_dev(button1, t10);
    			append_dev(button1, div11);
    			append_dev(button1, t11);
    			append_dev(button1, div12);
    			append_dev(button1, t12);
    			append_dev(button1, div13);
    			append_dev(button1, t13);
    			append_dev(button1, div14);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler_1*/ ctx[4], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_2*/ ctx[5], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(14:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (8:0) {#if innerWidth < 650}
    function create_if_block$3(ctx) {
    	let button;
    	let div0;
    	let t;
    	let div1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			attr_dev(div0, "class", "square");
    			add_location(div0, file$4, 10, 4, 235);
    			attr_dev(div1, "class", "square");
    			add_location(div1, file$4, 11, 4, 262);
    			attr_dev(button, "class", "layout-button grid-layout-button-mobile");
    			add_location(button, file$4, 8, 0, 131);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, div0);
    			append_dev(button, t);
    			append_dev(button, div1);

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
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(8:0) {#if innerWidth < 650}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let if_block_anchor;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[2]);

    	function select_block_type(ctx, dirty) {
    		if (/*innerWidth*/ ctx[1] < 650) return create_if_block$3;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);

    			if (!mounted) {
    				dispose = listen_dev(window, "resize", /*onwindowresize*/ ctx[2]);
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
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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
    	validate_slots('GridToggleButtons', slots, []);
    	let { gridStyle } = $$props;
    	let innerWidth;

    	$$self.$$.on_mount.push(function () {
    		if (gridStyle === undefined && !('gridStyle' in $$props || $$self.$$.bound[$$self.$$.props['gridStyle']])) {
    			console.warn("<GridToggleButtons> was created without expected prop 'gridStyle'");
    		}
    	});

    	const writable_props = ['gridStyle'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GridToggleButtons> was created with unknown prop '${key}'`);
    	});

    	function onwindowresize() {
    		$$invalidate(1, innerWidth = window.innerWidth);
    	}

    	const click_handler = () => $$invalidate(0, gridStyle = !gridStyle);
    	const click_handler_1 = () => $$invalidate(0, gridStyle = true);
    	const click_handler_2 = () => $$invalidate(0, gridStyle = false);

    	$$self.$$set = $$props => {
    		if ('gridStyle' in $$props) $$invalidate(0, gridStyle = $$props.gridStyle);
    	};

    	$$self.$capture_state = () => ({ gridStyle, innerWidth });

    	$$self.$inject_state = $$props => {
    		if ('gridStyle' in $$props) $$invalidate(0, gridStyle = $$props.gridStyle);
    		if ('innerWidth' in $$props) $$invalidate(1, innerWidth = $$props.innerWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		gridStyle,
    		innerWidth,
    		onwindowresize,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class GridToggleButtons extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { gridStyle: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GridToggleButtons",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get gridStyle() {
    		throw new Error("<GridToggleButtons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gridStyle(value) {
    		throw new Error("<GridToggleButtons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/FilterSection.svelte generated by Svelte v3.59.2 */
    const file$3 = "src/FilterSection.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    // (66:8) {:else}
    function create_else_block_1(ctx) {
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
    			add_location(rect, file$3, 70, 28, 2323);
    			attr_dev(path, "d", "M12 15.5a1 1 0 0 1-.71-.29l-4-4a1 1 0 1 1 1.42-1.42L12 13.1l3.3-3.18a1 1 0 1 1 1.38 1.44l-4 3.86a1 1 0 0 1-.68.28z");
    			add_location(path, file$3, 71, 28, 2395);
    			attr_dev(g0, "data-name", "chevron-down");
    			add_location(g0, file$3, 69, 24, 2266);
    			attr_dev(g1, "data-name", "Layer 2");
    			add_location(g1, file$3, 68, 20, 2218);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$3, 67, 16, 2137);
    			add_location(span, file$3, 66, 12, 2114);
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
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(66:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (49:8) {#if openCategory}
    function create_if_block_2$1(ctx) {
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
    			add_location(rect, file$3, 53, 29, 1546);
    			attr_dev(path, "d", "M16 14.5a1 1 0 0 1-.71-.29L12 10.9l-3.3 3.18a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.42l4-3.86a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.42 1 1 0 0 1-.69.28z");
    			add_location(path, file$3, 58, 30, 1775);
    			attr_dev(g0, "data-name", "chevron-up");
    			add_location(g0, file$3, 52, 25, 1491);
    			attr_dev(g1, "data-name", "Layer 2");
    			add_location(g1, file$3, 51, 21, 1443);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$3, 50, 17, 1362);
    			add_location(span, file$3, 49, 12, 1339);
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
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(49:8) {#if openCategory}",
    		ctx
    	});

    	return block;
    }

    // (81:4) {#if openCategory}
    function create_if_block$2(ctx) {
    	let div;
    	let div_transition;
    	let current;
    	let each_value = /*categories*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "product-archive-category-list");
    			add_location(div, file$3, 81, 8, 2739);
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
    			if (dirty & /*toggleFilter, categories, $parentFilters, isParent, $childFilters*/ 117) {
    				each_value = /*categories*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
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
    		source: "(81:4) {#if openCategory}",
    		ctx
    	});

    	return block;
    }

    // (103:20) {:else}
    function create_else_block$1(ctx) {
    	let div1;
    	let div0;
    	let div1_class_value;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "class", "toggle-circle");
    			add_location(div0, file$3, 110, 28, 3853);

    			attr_dev(div1, "class", div1_class_value = "category-toggle " + (/*$childFilters*/ ctx[4].has(/*category*/ ctx[11].id)
    			? 'checked'
    			: 'unchecked'));

    			add_location(div1, file$3, 103, 24, 3557);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$childFilters, categories*/ 17 && div1_class_value !== (div1_class_value = "category-toggle " + (/*$childFilters*/ ctx[4].has(/*category*/ ctx[11].id)
    			? 'checked'
    			: 'unchecked'))) {
    				attr_dev(div1, "class", div1_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(103:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (93:20) {#if isParent}
    function create_if_block_1$2(ctx) {
    	let div1;
    	let div0;
    	let div1_class_value;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "class", "toggle-circle");
    			add_location(div0, file$3, 100, 28, 3444);

    			attr_dev(div1, "class", div1_class_value = "category-toggle " + (/*$parentFilters*/ ctx[5].has(/*category*/ ctx[11].id)
    			? 'checked'
    			: 'unchecked'));

    			add_location(div1, file$3, 93, 24, 3147);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$parentFilters, categories*/ 33 && div1_class_value !== (div1_class_value = "category-toggle " + (/*$parentFilters*/ ctx[5].has(/*category*/ ctx[11].id)
    			? 'checked'
    			: 'unchecked'))) {
    				attr_dev(div1, "class", div1_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(93:20) {#if isParent}",
    		ctx
    	});

    	return block;
    }

    // (86:12) {#each categories as category}
    function create_each_block$2(ctx) {
    	let li;
    	let t0;
    	let html_tag;
    	let raw_value = /*category*/ ctx[11].name + "";
    	let t1;
    	let mounted;
    	let dispose;

    	function select_block_type_1(ctx, dirty) {
    		if (/*isParent*/ ctx[2]) return create_if_block_1$2;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[10](/*category*/ ctx[11]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			if_block.c();
    			t0 = space();
    			html_tag = new HtmlTag(false);
    			t1 = space();
    			html_tag.a = t1;
    			add_location(li, file$3, 86, 16, 2923);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			if_block.m(li, null);
    			append_dev(li, t0);
    			html_tag.m(raw_value, li);
    			append_dev(li, t1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(li, "click", click_handler_1, false, false, false, false),
    					listen_dev(li, "keydown", /*keydown_handler*/ ctx[8], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(li, t0);
    				}
    			}

    			if (dirty & /*categories*/ 1 && raw_value !== (raw_value = /*category*/ ctx[11].name + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(86:12) {#each categories as category}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
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
    		if (/*openCategory*/ ctx[3]) return create_if_block_2$1;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*openCategory*/ ctx[3] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			button = element("button");
    			h5 = element("h5");
    			t0 = text(/*title*/ ctx[1]);
    			t1 = space();
    			if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			add_location(h5, file$3, 47, 8, 1283);
    			attr_dev(button, "class", "filter-category-title");
    			add_location(button, file$3, 41, 4, 1144);
    			attr_dev(ul, "class", "product-archive-filters-section");
    			add_location(ul, file$3, 40, 0, 1095);
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
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[9], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 2) set_data_dev(t0, /*title*/ ctx[1]);

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
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $childFilters;
    	let $parentFilters;
    	validate_store(childFilters, 'childFilters');
    	component_subscribe($$self, childFilters, $$value => $$invalidate(4, $childFilters = $$value));
    	validate_store(parentFilters, 'parentFilters');
    	component_subscribe($$self, parentFilters, $$value => $$invalidate(5, $parentFilters = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FilterSection', slots, []);
    	let { categories = [] } = $$props;
    	let { title = "title" } = $$props;
    	let { isParent } = $$props;
    	let openCategory = false;
    	let filters = [];

    	function toggleFilter(id) {
    		if (isParent) {
    			if ($parentFilters.has(id)) {
    				if ($parentFilters.delete(id)) {
    					parentFilters.set($parentFilters);
    				}
    			} else {
    				set_store_value(parentFilters, $parentFilters = $parentFilters.add(id), $parentFilters);
    			}

    			$$invalidate(7, filters = [...$parentFilters]);
    			return;
    		}

    		if ($childFilters.has(id)) {
    			if ($childFilters.delete(id)) {
    				childFilters.set($childFilters);
    			}
    		} else {
    			set_store_value(childFilters, $childFilters = $childFilters.add(id), $childFilters);
    		}

    		$$invalidate(7, filters = [...$childFilters]);
    	}

    	$$self.$$.on_mount.push(function () {
    		if (isParent === undefined && !('isParent' in $$props || $$self.$$.bound[$$self.$$.props['isParent']])) {
    			console.warn("<FilterSection> was created without expected prop 'isParent'");
    		}
    	});

    	const writable_props = ['categories', 'title', 'isParent'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FilterSection> was created with unknown prop '${key}'`);
    	});

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler = () => {
    		$$invalidate(3, openCategory = !openCategory);
    	};

    	const click_handler_1 = category => {
    		toggleFilter(category.id);
    	};

    	$$self.$$set = $$props => {
    		if ('categories' in $$props) $$invalidate(0, categories = $$props.categories);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('isParent' in $$props) $$invalidate(2, isParent = $$props.isParent);
    	};

    	$$self.$capture_state = () => ({
    		slide,
    		childFilters,
    		parentFilters,
    		currentPage,
    		categories,
    		title,
    		isParent,
    		openCategory,
    		filters,
    		toggleFilter,
    		$childFilters,
    		$parentFilters
    	});

    	$$self.$inject_state = $$props => {
    		if ('categories' in $$props) $$invalidate(0, categories = $$props.categories);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('isParent' in $$props) $$invalidate(2, isParent = $$props.isParent);
    		if ('openCategory' in $$props) $$invalidate(3, openCategory = $$props.openCategory);
    		if ('filters' in $$props) $$invalidate(7, filters = $$props.filters);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*filters*/ 128) {
    			if (filters.length && filters) {
    				currentPage.set(1);
    			}
    		}

    		if ($$self.$$.dirty & /*isParent, filters*/ 132) {
    			if (isParent && filters.length) {
    				childFilters.set(new Set());
    			}
    		}
    	};

    	return [
    		categories,
    		title,
    		isParent,
    		openCategory,
    		$childFilters,
    		$parentFilters,
    		toggleFilter,
    		filters,
    		keydown_handler,
    		click_handler,
    		click_handler_1
    	];
    }

    class FilterSection extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { categories: 0, title: 1, isParent: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FilterSection",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get categories() {
    		throw new Error("<FilterSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set categories(value) {
    		throw new Error("<FilterSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<FilterSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<FilterSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isParent() {
    		throw new Error("<FilterSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isParent(value) {
    		throw new Error("<FilterSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Filters.svelte generated by Svelte v3.59.2 */
    const file$2 = "src/Filters.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let filtersection0;
    	let updating_currentPage;
    	let t;
    	let filtersection1;
    	let div_transition;
    	let current;

    	function filtersection0_currentPage_binding(value) {
    		/*filtersection0_currentPage_binding*/ ctx[5](value);
    	}

    	let filtersection0_props = {
    		title: "Category",
    		categories: /*parentCategories*/ ctx[2],
    		isParent: true
    	};

    	if (/*currentPage*/ ctx[1] !== void 0) {
    		filtersection0_props.currentPage = /*currentPage*/ ctx[1];
    	}

    	filtersection0 = new FilterSection({
    			props: filtersection0_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(filtersection0, 'currentPage', filtersection0_currentPage_binding));

    	filtersection1 = new FilterSection({
    			props: {
    				title: "Subcategory",
    				categories: /*currentChildCategories*/ ctx[0],
    				isParent: false
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(filtersection0.$$.fragment);
    			t = space();
    			create_component(filtersection1.$$.fragment);
    			attr_dev(div, "class", "product-archive-filters");
    			add_location(div, file$2, 24, 0, 665);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(filtersection0, div, null);
    			append_dev(div, t);
    			mount_component(filtersection1, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const filtersection0_changes = {};
    			if (dirty & /*parentCategories*/ 4) filtersection0_changes.categories = /*parentCategories*/ ctx[2];

    			if (!updating_currentPage && dirty & /*currentPage*/ 2) {
    				updating_currentPage = true;
    				filtersection0_changes.currentPage = /*currentPage*/ ctx[1];
    				add_flush_callback(() => updating_currentPage = false);
    			}

    			filtersection0.$set(filtersection0_changes);
    			const filtersection1_changes = {};
    			if (dirty & /*currentChildCategories*/ 1) filtersection1_changes.categories = /*currentChildCategories*/ ctx[0];
    			filtersection1.$set(filtersection1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filtersection0.$$.fragment, local);
    			transition_in(filtersection1.$$.fragment, local);

    			add_render_callback(() => {
    				if (!current) return;
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, { duration: 300 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filtersection0.$$.fragment, local);
    			transition_out(filtersection1.$$.fragment, local);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, slide, { duration: 300 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(filtersection0);
    			destroy_component(filtersection1);
    			if (detaching && div_transition) div_transition.end();
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
    	let $parentFilters;
    	validate_store(parentFilters, 'parentFilters');
    	component_subscribe($$self, parentFilters, $$value => $$invalidate(4, $parentFilters = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Filters', slots, []);
    	let { parentCategories = [] } = $$props;
    	let { childCategories = [] } = $$props;
    	let { currentPage } = $$props;
    	let { currentChildCategories = [] } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (currentPage === undefined && !('currentPage' in $$props || $$self.$$.bound[$$self.$$.props['currentPage']])) {
    			console.warn("<Filters> was created without expected prop 'currentPage'");
    		}
    	});

    	const writable_props = ['parentCategories', 'childCategories', 'currentPage', 'currentChildCategories'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Filters> was created with unknown prop '${key}'`);
    	});

    	function filtersection0_currentPage_binding(value) {
    		currentPage = value;
    		$$invalidate(1, currentPage);
    	}

    	$$self.$$set = $$props => {
    		if ('parentCategories' in $$props) $$invalidate(2, parentCategories = $$props.parentCategories);
    		if ('childCategories' in $$props) $$invalidate(3, childCategories = $$props.childCategories);
    		if ('currentPage' in $$props) $$invalidate(1, currentPage = $$props.currentPage);
    		if ('currentChildCategories' in $$props) $$invalidate(0, currentChildCategories = $$props.currentChildCategories);
    	};

    	$$self.$capture_state = () => ({
    		FilterSection,
    		slide,
    		parentFilters,
    		childFilters,
    		parentCategories,
    		childCategories,
    		currentPage,
    		currentChildCategories,
    		$parentFilters
    	});

    	$$self.$inject_state = $$props => {
    		if ('parentCategories' in $$props) $$invalidate(2, parentCategories = $$props.parentCategories);
    		if ('childCategories' in $$props) $$invalidate(3, childCategories = $$props.childCategories);
    		if ('currentPage' in $$props) $$invalidate(1, currentPage = $$props.currentPage);
    		if ('currentChildCategories' in $$props) $$invalidate(0, currentChildCategories = $$props.currentChildCategories);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$parentFilters, childCategories, currentChildCategories*/ 25) {
    			if ($parentFilters.size > 0) {
    				$$invalidate(0, currentChildCategories = []);

    				childCategories.forEach(category => {
    					if ($parentFilters.has(category.parent)) {
    						currentChildCategories.push(category);
    					}
    				});
    			} else {
    				$$invalidate(0, currentChildCategories = childCategories);
    			}
    		}
    	};

    	return [
    		currentChildCategories,
    		currentPage,
    		parentCategories,
    		childCategories,
    		$parentFilters,
    		filtersection0_currentPage_binding
    	];
    }

    class Filters extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			parentCategories: 2,
    			childCategories: 3,
    			currentPage: 1,
    			currentChildCategories: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Filters",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get parentCategories() {
    		throw new Error("<Filters>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set parentCategories(value) {
    		throw new Error("<Filters>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get childCategories() {
    		throw new Error("<Filters>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set childCategories(value) {
    		throw new Error("<Filters>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get currentPage() {
    		throw new Error("<Filters>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentPage(value) {
    		throw new Error("<Filters>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get currentChildCategories() {
    		throw new Error("<Filters>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentChildCategories(value) {
    		throw new Error("<Filters>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/ActiveFilters.svelte generated by Svelte v3.59.2 */
    const file$1 = "src/ActiveFilters.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (19:4) {#if $childFilters.size == 0 && $parentFilters.size > 0}
    function create_if_block_1$1(ctx) {
    	let each_1_anchor;
    	let each_value_1 = [.../*$parentFilters*/ ctx[1]];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
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
    			if (dirty & /*removeFilter, $parentFilters*/ 6) {
    				each_value_1 = [.../*$parentFilters*/ ctx[1]];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
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
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(19:4) {#if $childFilters.size == 0 && $parentFilters.size > 0}",
    		ctx
    	});

    	return block;
    }

    // (20:8) {#each [...$parentFilters] as filter}
    function create_each_block_1(ctx) {
    	let li;
    	let t0_value = /*filter*/ ctx[7] + "";
    	let t0;
    	let t1;
    	let span;
    	let svg;
    	let g1;
    	let g0;
    	let rect;
    	let path;
    	let t2;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[5](/*filter*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			span = element("span");
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
    			add_location(rect, file$1, 31, 33, 980);
    			attr_dev(path, "d", "M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z");
    			add_location(path, file$1, 36, 34, 1229);
    			attr_dev(g0, "data-name", "close");
    			add_location(g0, file$1, 30, 29, 926);
    			attr_dev(g1, "data-name", "Layer 2");
    			add_location(g1, file$1, 29, 25, 874);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$1, 28, 20, 789);
    			add_location(span, file$1, 27, 16, 762);
    			add_location(li, file$1, 20, 12, 581);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    			append_dev(li, span);
    			append_dev(span, svg);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, rect);
    			append_dev(g0, path);
    			append_dev(li, t2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(li, "keydown", /*keydown_handler*/ ctx[4], false, false, false, false),
    					listen_dev(li, "click", click_handler, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$parentFilters*/ 2 && t0_value !== (t0_value = /*filter*/ ctx[7] + "")) set_data_dev(t0, t0_value);
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
    		source: "(20:8) {#each [...$parentFilters] as filter}",
    		ctx
    	});

    	return block;
    }

    // (47:4) {#if $childFilters.size > 0}
    function create_if_block$1(ctx) {
    	let each_1_anchor;
    	let each_value = [.../*$childFilters*/ ctx[0]];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
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
    			if (dirty & /*removeFilter, $childFilters*/ 5) {
    				each_value = [.../*$childFilters*/ ctx[0]];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
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
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(47:4) {#if $childFilters.size > 0}",
    		ctx
    	});

    	return block;
    }

    // (48:8) {#each [...$childFilters] as filter}
    function create_each_block$1(ctx) {
    	let li;
    	let t0_value = /*filter*/ ctx[7] + "";
    	let t0;
    	let t1;
    	let span;
    	let svg;
    	let g1;
    	let g0;
    	let rect;
    	let path;
    	let t2;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[6](/*filter*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			span = element("span");
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
    			add_location(rect, file$1, 59, 33, 2139);
    			attr_dev(path, "d", "M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z");
    			add_location(path, file$1, 64, 34, 2388);
    			attr_dev(g0, "data-name", "close");
    			add_location(g0, file$1, 58, 29, 2085);
    			attr_dev(g1, "data-name", "Layer 2");
    			add_location(g1, file$1, 57, 25, 2033);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$1, 56, 20, 1948);
    			add_location(span, file$1, 55, 16, 1921);
    			add_location(li, file$1, 48, 12, 1740);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    			append_dev(li, span);
    			append_dev(span, svg);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, rect);
    			append_dev(g0, path);
    			append_dev(li, t2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(li, "keydown", /*keydown_handler_1*/ ctx[3], false, false, false, false),
    					listen_dev(li, "click", click_handler_1, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$childFilters*/ 1 && t0_value !== (t0_value = /*filter*/ ctx[7] + "")) set_data_dev(t0, t0_value);
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
    		source: "(48:8) {#each [...$childFilters] as filter}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let ul;
    	let t;
    	let if_block0 = /*$childFilters*/ ctx[0].size == 0 && /*$parentFilters*/ ctx[1].size > 0 && create_if_block_1$1(ctx);
    	let if_block1 = /*$childFilters*/ ctx[0].size > 0 && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			attr_dev(ul, "class", "active-filters");
    			add_location(ul, file$1, 17, 0, 434);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);
    			if (if_block0) if_block0.m(ul, null);
    			append_dev(ul, t);
    			if (if_block1) if_block1.m(ul, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$childFilters*/ ctx[0].size == 0 && /*$parentFilters*/ ctx[1].size > 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					if_block0.m(ul, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*$childFilters*/ ctx[0].size > 0) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					if_block1.m(ul, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
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
    	let $childFilters;
    	let $parentFilters;
    	validate_store(childFilters, 'childFilters');
    	component_subscribe($$self, childFilters, $$value => $$invalidate(0, $childFilters = $$value));
    	validate_store(parentFilters, 'parentFilters');
    	component_subscribe($$self, parentFilters, $$value => $$invalidate(1, $parentFilters = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ActiveFilters', slots, []);

    	function removeFilter(id) {
    		if ($parentFilters.has(id)) {
    			if ($parentFilters.delete(id)) {
    				parentFilters.set($parentFilters);
    			}
    		}

    		if ($childFilters.has(id)) {
    			if ($childFilters.delete(id)) {
    				childFilters.set($childFilters);
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ActiveFilters> was created with unknown prop '${key}'`);
    	});

    	function keydown_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler = filter => {
    		removeFilter(filter);
    	};

    	const click_handler_1 = filter => {
    		removeFilter(filter);
    	};

    	$$self.$capture_state = () => ({
    		parentFilters,
    		childFilters,
    		removeFilter,
    		$childFilters,
    		$parentFilters
    	});

    	return [
    		$childFilters,
    		$parentFilters,
    		removeFilter,
    		keydown_handler_1,
    		keydown_handler,
    		click_handler,
    		click_handler_1
    	];
    }

    class ActiveFilters extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ActiveFilters",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.59.2 */

    const { console: console_1 } = globals;

    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	child_ctx[24] = i;
    	return child_ctx;
    }

    // (71:4) {#if showFilters}
    function create_if_block_3(ctx) {
    	let div10;
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
    	let t6;
    	let t7;
    	let if_block1_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = (/*$parentFilters*/ ctx[6].size > 0 || /*$childFilters*/ ctx[7].size > 0) && create_if_block_5(ctx);
    	let if_block1 = /*openFilters*/ ctx[4] && create_if_block_4(ctx);

    	const block = {
    		c: function create() {
    			div10 = element("div");
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
    			t5 = text("\n                Filters");
    			t6 = space();
    			if (if_block0) if_block0.c();
    			t7 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			attr_dev(div0, "class", "filter-line-black");
    			add_location(div0, file, 80, 24, 2511);
    			attr_dev(div1, "class", "filter-line-red");
    			add_location(div1, file, 81, 24, 2569);
    			attr_dev(div2, "class", "filter-line line-one");
    			add_location(div2, file, 79, 20, 2452);
    			attr_dev(div3, "class", "filter-line-black");
    			add_location(div3, file, 84, 24, 2707);
    			attr_dev(div4, "class", "filter-line-red");
    			add_location(div4, file, 85, 24, 2765);
    			attr_dev(div5, "class", "filter-line line-two");
    			add_location(div5, file, 83, 20, 2648);
    			attr_dev(div6, "class", "filter-line-black");
    			add_location(div6, file, 88, 24, 2905);
    			attr_dev(div7, "class", "filter-line-red");
    			add_location(div7, file, 89, 24, 2963);
    			attr_dev(div8, "class", "filter-line line-three");
    			add_location(div8, file, 87, 20, 2844);
    			attr_dev(div9, "class", "filters-icon");
    			add_location(div9, file, 78, 16, 2405);
    			attr_dev(button, "class", "filters-heading-open");
    			add_location(button, file, 72, 12, 2221);
    			attr_dev(div10, "class", "filters-heading");
    			add_location(div10, file, 71, 8, 2179);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			append_dev(div10, button);
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
    			append_dev(div10, t6);
    			if (if_block0) if_block0.m(div10, null);
    			insert_dev(target, t7, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[19], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*$parentFilters*/ ctx[6].size > 0 || /*$childFilters*/ ctx[7].size > 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_5(ctx);
    					if_block0.c();
    					if_block0.m(div10, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*openFilters*/ ctx[4]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*openFilters*/ 16) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_4(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
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
    			if (detaching) detach_dev(div10);
    			if (if_block0) if_block0.d();
    			if (detaching) detach_dev(t7);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(71:4) {#if showFilters}",
    		ctx
    	});

    	return block;
    }

    // (95:12) {#if $parentFilters.size > 0 || $childFilters.size > 0}
    function create_if_block_5(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Clear selection";
    			attr_dev(div, "class", "clear-filters");
    			add_location(div, file, 95, 16, 3175);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", /*click_handler_1*/ ctx[20], false, false, false, false),
    					listen_dev(div, "keydown", /*keydown_handler*/ ctx[18], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(95:12) {#if $parentFilters.size > 0 || $childFilters.size > 0}",
    		ctx
    	});

    	return block;
    }

    // (107:8) {#if openFilters}
    function create_if_block_4(ctx) {
    	let filters;
    	let current;

    	filters = new Filters({
    			props: {
    				childCategories: /*childCategories*/ ctx[0],
    				parentCategories: /*parentCategories*/ ctx[1]
    			},
    			$$inline: true
    		});

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
    			if (dirty & /*childCategories*/ 1) filters_changes.childCategories = /*childCategories*/ ctx[0];
    			if (dirty & /*parentCategories*/ 2) filters_changes.parentCategories = /*parentCategories*/ ctx[1];
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
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(107:8) {#if openFilters}",
    		ctx
    	});

    	return block;
    }

    // (115:11) {:else}
    function create_else_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			add_location(div, file, 115, 11, 3756);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(115:11) {:else}",
    		ctx
    	});

    	return block;
    }

    // (113:8) {#if $parentFilters.size > 0 || $childFilters.size > 0}
    function create_if_block_2(ctx) {
    	let activefilters;
    	let current;
    	activefilters = new ActiveFilters({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(activefilters.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(activefilters, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(activefilters.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(activefilters.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(activefilters, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(113:8) {#if $parentFilters.size > 0 || $childFilters.size > 0}",
    		ctx
    	});

    	return block;
    }

    // (130:16) {#if i >= postRangeLow && i < postRangeHigh}
    function create_if_block_1(ctx) {
    	let productcard;
    	let current;

    	productcard = new ProductCard({
    			props: { product: /*product*/ ctx[22] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(productcard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(productcard, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const productcard_changes = {};
    			if (dirty & /*allProductsList*/ 8) productcard_changes.product = /*product*/ ctx[22];
    			productcard.$set(productcard_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(productcard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(productcard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(productcard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(130:16) {#if i >= postRangeLow && i < postRangeHigh}",
    		ctx
    	});

    	return block;
    }

    // (129:12) {#each allProductsList as product, i}
    function create_each_block(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*i*/ ctx[24] >= /*postRangeLow*/ ctx[11] && /*i*/ ctx[24] < /*postRangeHigh*/ ctx[5] && create_if_block_1(ctx);

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
    			if (/*i*/ ctx[24] >= /*postRangeLow*/ ctx[11] && /*i*/ ctx[24] < /*postRangeHigh*/ ctx[5]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*postRangeLow, postRangeHigh*/ 2080) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
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
    		id: create_each_block.name,
    		type: "each",
    		source: "(129:12) {#each allProductsList as product, i}",
    		ctx
    	});

    	return block;
    }

    // (137:8) {#if totalPages > 1}
    function create_if_block(ctx) {
    	let pagination;
    	let current;

    	pagination = new Pagination({
    			props: { totalPages: /*totalPages*/ ctx[12] },
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
    			if (dirty & /*totalPages*/ 4096) pagination_changes.totalPages = /*totalPages*/ ctx[12];
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
    		source: "(137:8) {#if totalPages > 1}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let section;
    	let t0;
    	let div1;
    	let current_block_type_index;
    	let if_block1;
    	let t1;
    	let div0;
    	let cardsperpage;
    	let t2;
    	let gridtogglebuttons;
    	let updating_gridStyle;
    	let t3;
    	let div2;
    	let ul;
    	let ul_class_value;
    	let t4;
    	let div3;
    	let section_class_value;
    	let current;
    	let if_block0 = /*showFilters*/ ctx[2] && create_if_block_3(ctx);
    	const if_block_creators = [create_if_block_2, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$parentFilters*/ ctx[6].size > 0 || /*$childFilters*/ ctx[7].size > 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	cardsperpage = new CardsPerPage({ $$inline: true });

    	function gridtogglebuttons_gridStyle_binding(value) {
    		/*gridtogglebuttons_gridStyle_binding*/ ctx[21](value);
    	}

    	let gridtogglebuttons_props = {};

    	if (/*gridStyle*/ ctx[8] !== void 0) {
    		gridtogglebuttons_props.gridStyle = /*gridStyle*/ ctx[8];
    	}

    	gridtogglebuttons = new GridToggleButtons({
    			props: gridtogglebuttons_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(gridtogglebuttons, 'gridStyle', gridtogglebuttons_gridStyle_binding));
    	let each_value = /*allProductsList*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let if_block2 = /*totalPages*/ ctx[12] > 1 && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div1 = element("div");
    			if_block1.c();
    			t1 = space();
    			div0 = element("div");
    			create_component(cardsperpage.$$.fragment);
    			t2 = space();
    			create_component(gridtogglebuttons.$$.fragment);
    			t3 = space();
    			div2 = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			div3 = element("div");
    			if (if_block2) if_block2.c();
    			attr_dev(div0, "class", "archive-controls-button-container");
    			add_location(div0, file, 117, 8, 3790);
    			attr_dev(div1, "class", "archive-controls");
    			add_location(div1, file, 111, 4, 3602);

    			attr_dev(ul, "class", ul_class_value = /*gridStyle*/ ctx[8]
    			? "product-archive-grid columns"
    			: "product-archive-grid rows");

    			add_location(ul, file, 123, 8, 3999);
    			attr_dev(div2, "class", "product-archive-grid-container");
    			add_location(div2, file, 122, 4, 3946);
    			attr_dev(div3, "class", "pagination-container");
    			add_location(div3, file, 135, 4, 4366);
    			attr_dev(section, "class", section_class_value = "product-archive " + /*filtersClass*/ ctx[9] + " " + /*filtersClosedClass*/ ctx[10]);
    			add_location(section, file, 69, 0, 2079);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			if (if_block0) if_block0.m(section, null);
    			append_dev(section, t0);
    			append_dev(section, div1);
    			if_blocks[current_block_type_index].m(div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			mount_component(cardsperpage, div0, null);
    			append_dev(div0, t2);
    			mount_component(gridtogglebuttons, div0, null);
    			append_dev(section, t3);
    			append_dev(section, div2);
    			append_dev(div2, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}

    			append_dev(section, t4);
    			append_dev(section, div3);
    			if (if_block2) if_block2.m(div3, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*showFilters*/ ctx[2]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*showFilters*/ 4) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(section, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div1, t1);
    			}

    			const gridtogglebuttons_changes = {};

    			if (!updating_gridStyle && dirty & /*gridStyle*/ 256) {
    				updating_gridStyle = true;
    				gridtogglebuttons_changes.gridStyle = /*gridStyle*/ ctx[8];
    				add_flush_callback(() => updating_gridStyle = false);
    			}

    			gridtogglebuttons.$set(gridtogglebuttons_changes);

    			if (dirty & /*allProductsList, postRangeLow, postRangeHigh*/ 2088) {
    				each_value = /*allProductsList*/ ctx[3];
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

    			if (!current || dirty & /*gridStyle*/ 256 && ul_class_value !== (ul_class_value = /*gridStyle*/ ctx[8]
    			? "product-archive-grid columns"
    			: "product-archive-grid rows")) {
    				attr_dev(ul, "class", ul_class_value);
    			}

    			if (/*totalPages*/ ctx[12] > 1) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*totalPages*/ 4096) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div3, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*filtersClass, filtersClosedClass*/ 1536 && section_class_value !== (section_class_value = "product-archive " + /*filtersClass*/ ctx[9] + " " + /*filtersClosedClass*/ ctx[10])) {
    				attr_dev(section, "class", section_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(cardsperpage.$$.fragment, local);
    			transition_in(gridtogglebuttons.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(cardsperpage.$$.fragment, local);
    			transition_out(gridtogglebuttons.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (if_block0) if_block0.d();
    			if_blocks[current_block_type_index].d();
    			destroy_component(cardsperpage);
    			destroy_component(gridtogglebuttons);
    			destroy_each(each_blocks, detaching);
    			if (if_block2) if_block2.d();
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
    	let totalProducts;
    	let totalPages;
    	let postRangeHigh;
    	let postRangeLow;
    	let $parentFilters;
    	let $childFilters;
    	let $postsPerPage;
    	let $currentPage;
    	validate_store(parentFilters, 'parentFilters');
    	component_subscribe($$self, parentFilters, $$value => $$invalidate(6, $parentFilters = $$value));
    	validate_store(childFilters, 'childFilters');
    	component_subscribe($$self, childFilters, $$value => $$invalidate(7, $childFilters = $$value));
    	validate_store(postsPerPage, 'postsPerPage');
    	component_subscribe($$self, postsPerPage, $$value => $$invalidate(16, $postsPerPage = $$value));
    	validate_store(currentPage, 'currentPage');
    	component_subscribe($$self, currentPage, $$value => $$invalidate(17, $currentPage = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { allProducts = [] } = $$props;
    	let { childCategories = [] } = $$props;
    	let { parentCategories = [] } = $$props;
    	let { showFilters = true } = $$props;
    	let allProductsList;
    	let gridStyle = true;
    	let openFilters = true;
    	let filtersClass;
    	let filtersClosedClass;

    	if (showFilters) {
    		filtersClass = "";
    	} else {
    		filtersClass = "hide-filters";
    	}

    	function resetFilters() {
    		parentFilters.set(new Set());
    		childFilters.set(new Set());
    	}

    	const writable_props = ['allProducts', 'childCategories', 'parentCategories', 'showFilters'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler = () => {
    		$$invalidate(4, openFilters = !openFilters);
    	};

    	const click_handler_1 = () => {
    		resetFilters();
    	};

    	function gridtogglebuttons_gridStyle_binding(value) {
    		gridStyle = value;
    		$$invalidate(8, gridStyle);
    	}

    	$$self.$$set = $$props => {
    		if ('allProducts' in $$props) $$invalidate(14, allProducts = $$props.allProducts);
    		if ('childCategories' in $$props) $$invalidate(0, childCategories = $$props.childCategories);
    		if ('parentCategories' in $$props) $$invalidate(1, parentCategories = $$props.parentCategories);
    		if ('showFilters' in $$props) $$invalidate(2, showFilters = $$props.showFilters);
    	};

    	$$self.$capture_state = () => ({
    		allProducts,
    		childCategories,
    		parentCategories,
    		showFilters,
    		ProductCard,
    		Pagination,
    		CardsPerPage,
    		GridToggleButtons,
    		Filters,
    		ActiveFilters,
    		parentFilters,
    		childFilters,
    		currentPage,
    		postsPerPage,
    		allProductsList,
    		gridStyle,
    		openFilters,
    		filtersClass,
    		filtersClosedClass,
    		resetFilters,
    		postRangeHigh,
    		postRangeLow,
    		totalProducts,
    		totalPages,
    		$parentFilters,
    		$childFilters,
    		$postsPerPage,
    		$currentPage
    	});

    	$$self.$inject_state = $$props => {
    		if ('allProducts' in $$props) $$invalidate(14, allProducts = $$props.allProducts);
    		if ('childCategories' in $$props) $$invalidate(0, childCategories = $$props.childCategories);
    		if ('parentCategories' in $$props) $$invalidate(1, parentCategories = $$props.parentCategories);
    		if ('showFilters' in $$props) $$invalidate(2, showFilters = $$props.showFilters);
    		if ('allProductsList' in $$props) $$invalidate(3, allProductsList = $$props.allProductsList);
    		if ('gridStyle' in $$props) $$invalidate(8, gridStyle = $$props.gridStyle);
    		if ('openFilters' in $$props) $$invalidate(4, openFilters = $$props.openFilters);
    		if ('filtersClass' in $$props) $$invalidate(9, filtersClass = $$props.filtersClass);
    		if ('filtersClosedClass' in $$props) $$invalidate(10, filtersClosedClass = $$props.filtersClosedClass);
    		if ('postRangeHigh' in $$props) $$invalidate(5, postRangeHigh = $$props.postRangeHigh);
    		if ('postRangeLow' in $$props) $$invalidate(11, postRangeLow = $$props.postRangeLow);
    		if ('totalProducts' in $$props) $$invalidate(15, totalProducts = $$props.totalProducts);
    		if ('totalPages' in $$props) $$invalidate(12, totalPages = $$props.totalPages);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*openFilters*/ 16) {
    			if (openFilters) {
    				$$invalidate(10, filtersClosedClass = 'filters-open');
    			} else {
    				$$invalidate(10, filtersClosedClass = 'filters-closed');
    			}
    		}

    		if ($$self.$$.dirty & /*$childFilters, $parentFilters, allProducts*/ 16576) {
    			if ($childFilters.size == 0 && $parentFilters.size == 0) {
    				$$invalidate(3, allProductsList = [...allProducts]);
    			}
    		}

    		if ($$self.$$.dirty & /*$childFilters, allProducts, allProductsList*/ 16520) {
    			if ($childFilters.size > 0) {
    				$$invalidate(3, allProductsList = allProducts.filter(function (product) {
    					let productFound = false;

    					product.subcategoryId.forEach(subCategory => {
    						if ($childFilters.has(subCategory)) {
    							productFound = true;
    						}
    					});

    					console.log($childFilters);
    					return productFound;
    				}));

    				console.log(allProductsList);
    			}
    		}

    		if ($$self.$$.dirty & /*$parentFilters, $childFilters, allProducts*/ 16576) {
    			if ($parentFilters.size > 0 && $childFilters.size == 0) {
    				$$invalidate(3, allProductsList = allProducts.filter(function (product) {
    					return $parentFilters.has(product.categoryId);
    				}));
    			}
    		}

    		if ($$self.$$.dirty & /*allProductsList*/ 8) {
    			$$invalidate(15, totalProducts = allProductsList.length);
    		}

    		if ($$self.$$.dirty & /*totalProducts, $postsPerPage*/ 98304) {
    			$$invalidate(12, totalPages = Math.ceil(totalProducts / $postsPerPage));
    		}

    		if ($$self.$$.dirty & /*$currentPage, $postsPerPage*/ 196608) {
    			$$invalidate(5, postRangeHigh = $currentPage * $postsPerPage);
    		}

    		if ($$self.$$.dirty & /*postRangeHigh, $postsPerPage*/ 65568) {
    			$$invalidate(11, postRangeLow = postRangeHigh - $postsPerPage);
    		}
    	};

    	return [
    		childCategories,
    		parentCategories,
    		showFilters,
    		allProductsList,
    		openFilters,
    		postRangeHigh,
    		$parentFilters,
    		$childFilters,
    		gridStyle,
    		filtersClass,
    		filtersClosedClass,
    		postRangeLow,
    		totalPages,
    		resetFilters,
    		allProducts,
    		totalProducts,
    		$postsPerPage,
    		$currentPage,
    		keydown_handler,
    		click_handler,
    		click_handler_1,
    		gridtogglebuttons_gridStyle_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance, create_fragment, safe_not_equal, {
    			allProducts: 14,
    			childCategories: 0,
    			parentCategories: 1,
    			showFilters: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get allProducts() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set allProducts(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get childCategories() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set childCategories(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get parentCategories() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set parentCategories(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showFilters() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showFilters(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    return App;

}));
//# sourceMappingURL=bundle.js.map
