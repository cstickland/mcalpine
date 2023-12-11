
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Search = factory());
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

    /* src/Submit.svelte generated by Svelte v3.59.2 */

    const file$3 = "src/Submit.svelte";

    function create_fragment$3(ctx) {
    	let button;
    	let div0;
    	let t0;
    	let div1;
    	let t2;
    	let div3;
    	let div2;
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			button = element("button");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			div1.textContent = "View All Results";
    			t2 = space();
    			div3 = element("div");
    			div2 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(div0, "class", "result-count svelte-o89x2o");
    			add_location(div0, file$3, 6, 4, 121);
    			attr_dev(div1, "class", "view-all-text svelte-o89x2o");
    			add_location(div1, file$3, 8, 8, 163);
    			attr_dev(path, "d", "M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z");
    			attr_dev(path, "fill", "#fff");
    			add_location(path, file$3, 16, 17, 471);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "13.922");
    			attr_dev(svg, "height", "16.245");
    			attr_dev(svg, "viewBox", "0 0 13.922 16.245");
    			attr_dev(svg, "class", "svelte-o89x2o");
    			add_location(svg, file$3, 11, 12, 291);
    			attr_dev(div2, "class", "view-all-chevron svelte-o89x2o");
    			add_location(div2, file$3, 10, 8, 248);
    			attr_dev(div3, "class", "view-all svelte-o89x2o");
    			add_location(div3, file$3, 9, 4, 217);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "id", "search-submit");
    			attr_dev(button, "class", "search-submit submit-btn svelte-o89x2o");
    			button.value = "view all results";
    			add_location(button, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, div0);
    			append_dev(button, t0);
    			append_dev(button, div1);
    			append_dev(button, t2);
    			append_dev(button, div3);
    			append_dev(div3, div2);
    			append_dev(div2, svg);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
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
    	validate_slots('Submit', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Submit> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Submit extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Submit",
    			options,
    			id: create_fragment$3.name
    		});
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

    function highlightResults(searchQuery, result) {
      let textToSearch = searchQuery;
      let paragraph = result;

      textToSearch = textToSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      let pattern = new RegExp(`${textToSearch}`, 'ig');

      paragraph = paragraph.replace(pattern, (match) => `<b>${match}</b>`);
      return paragraph
    }

    async function getResults(searchTerm, previousSuggestions) {
      searchTerm = searchTerm.replace('&', '&amp;');

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
                distances[i - 1][j - 1]
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
          searchTerm
        ),
      }));

      wordDistances.sort((a, b) => a.distance - b.distance);

      return wordDistances.map((wd) => wd.product)
    }

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
          searchTerm.toLowerCase()
        ),
      }));
      wordDistances.sort((a, b) => a.distance - b.distance);

      return wordDistances.map((wd) => wd.other)
    }

    const previousSuggestions = writable([]);
    const results = writable({});
    const searchQuery = writable('');

    const menuQuery = `{
  menus(where: {slug: "interest"}) {
    edges {
      node {
        id
        menuItems {
          nodes {
            url
            label
          }
        }
        name
      }
    }
  }
}`;

    async function getData(query) {
      const fetchPromise = await fetch('/graphql', {
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
      return response
    }

    /* src/Results.svelte generated by Svelte v3.59.2 */
    const file$2 = "src/Results.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	child_ctx[7] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[7] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	child_ctx[7] = i;
    	return child_ctx;
    }

    // (9:0) {#if $searchQuery.length > 0}
    function create_if_block$1(ctx) {
    	let div3;
    	let t0;
    	let div1;
    	let div0;
    	let t2;
    	let t3;
    	let t4;
    	let div2;
    	let t5;
    	let submit;
    	let current;
    	let if_block0 = /*$results*/ ctx[0]?.data?.productCategories?.length > 0 && /*$results*/ ctx[0]?.data?.productCategories[0] != /*$searchQuery*/ ctx[2] && create_if_block_9(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*$results*/ ctx[0]?.data?.products?.nodes.length > 0) return create_if_block_6;
    		return create_else_block_2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type(ctx);
    	let if_block2 = /*$results*/ ctx[0]?.data?.other != null && /*$results*/ ctx[0]?.data?.other?.length > 0 && create_if_block_1$1(ctx);

    	submit = new Submit({
    			props: { totalResults: /*totalResults*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div3 = element("div");
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
    			div2 = element("div");
    			t5 = space();
    			create_component(submit.$$.fragment);
    			attr_dev(div0, "class", "result-title svelte-1wybhjw");
    			add_location(div0, file$2, 29, 12, 1260);
    			attr_dev(div1, "class", "search-results__section-title svelte-1wybhjw");
    			add_location(div1, file$2, 28, 8, 1204);
    			attr_dev(div2, "id", "search-results__other");
    			add_location(div2, file$2, 89, 8, 4036);
    			attr_dev(div3, "class", "results-container show svelte-1wybhjw");
    			attr_dev(div3, "id", "results-container");
    			add_location(div3, file$2, 9, 4, 297);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			if (if_block0) if_block0.m(div3, null);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			append_dev(div1, t2);
    			if_block1.m(div1, null);
    			append_dev(div3, t3);
    			if (if_block2) if_block2.m(div3, null);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div3, t5);
    			mount_component(submit, div3, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*$results*/ ctx[0]?.data?.productCategories?.length > 0 && /*$results*/ ctx[0]?.data?.productCategories[0] != /*$searchQuery*/ ctx[2]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_9(ctx);
    					if_block0.c();
    					if_block0.m(div3, t0);
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

    			if (/*$results*/ ctx[0]?.data?.other != null && /*$results*/ ctx[0]?.data?.other?.length > 0) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_1$1(ctx);
    					if_block2.c();
    					if_block2.m(div3, t4);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			const submit_changes = {};
    			if (dirty & /*totalResults*/ 2) submit_changes.totalResults = /*totalResults*/ ctx[1];
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
    			if (detaching) detach_dev(div3);
    			if (if_block0) if_block0.d();
    			if_block1.d();
    			if (if_block2) if_block2.d();
    			destroy_component(submit);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(9:0) {#if $searchQuery.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (11:8) {#if $results?.data?.productCategories?.length > 0 && $results?.data?.productCategories[0] != $searchQuery}
    function create_if_block_9(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let each_value_2 = /*$results*/ ctx[0]?.data?.productCategories;
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

    			attr_dev(div0, "class", "result-title svelte-1wybhjw");
    			add_location(div0, file$2, 12, 16, 545);
    			attr_dev(div1, "class", "search-results__section-title svelte-1wybhjw");
    			add_location(div1, file$2, 11, 12, 485);
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
    			if (dirty & /*searchQuery, $results, highlightResults, $searchQuery*/ 5) {
    				each_value_2 = /*$results*/ ctx[0]?.data?.productCategories;
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
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(11:8) {#if $results?.data?.productCategories?.length > 0 && $results?.data?.productCategories[0] != $searchQuery}",
    		ctx
    	});

    	return block;
    }

    // (15:20) {#if i < 3 && $searchQuery != category}
    function create_if_block_10(ctx) {
    	let div;
    	let html_tag;
    	let raw_value = highlightResults(/*$searchQuery*/ ctx[2], /*category*/ ctx[10]) + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[4](/*category*/ ctx[10]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			html_tag = new HtmlTag(false);
    			t = space();
    			html_tag.a = t;
    			attr_dev(div, "class", "suggestion svelte-1wybhjw");
    			add_location(div, file$2, 15, 24, 746);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			html_tag.m(raw_value, div);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "keydown", /*keydown_handler*/ ctx[3], false, false, false, false),
    					listen_dev(div, "click", click_handler, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$searchQuery, $results*/ 5 && raw_value !== (raw_value = highlightResults(/*$searchQuery*/ ctx[2], /*category*/ ctx[10]) + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(15:20) {#if i < 3 && $searchQuery != category}",
    		ctx
    	});

    	return block;
    }

    // (14:16) {#each $results?.data?.productCategories as category, i}
    function create_each_block_2(ctx) {
    	let if_block_anchor;
    	let if_block = /*i*/ ctx[7] < 3 && /*$searchQuery*/ ctx[2] != /*category*/ ctx[10] && create_if_block_10(ctx);

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
    			if (/*i*/ ctx[7] < 3 && /*$searchQuery*/ ctx[2] != /*category*/ ctx[10]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_10(ctx);
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
    		source: "(14:16) {#each $results?.data?.productCategories as category, i}",
    		ctx
    	});

    	return block;
    }

    // (59:12) {:else}
    function create_else_block_2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "No Products Found";
    			attr_dev(div, "class", "suggestion svelte-1wybhjw");
    			add_location(div, file$2, 59, 16, 2702);
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
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(59:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (31:12) {#if $results?.data?.products?.nodes.length > 0}
    function create_if_block_6(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*$results*/ ctx[0]?.data?.products?.nodes;
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
    			if (dirty & /*$results, highlightResults, $searchQuery*/ 5) {
    				each_value_1 = /*$results*/ ctx[0]?.data?.products?.nodes;
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
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(31:12) {#if $results?.data?.products?.nodes.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (33:20) {#if i < 3}
    function create_if_block_7(ctx) {
    	let a;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let t1_value = /*product*/ ctx[8]?.customFields2?.skus.length + "";
    	let t1;
    	let t2;
    	let t3;
    	let div1;
    	let raw_value = highlightResults(/*$searchQuery*/ ctx[2], /*product*/ ctx[8]?.title) + "";
    	let t4;
    	let a_href_value;

    	function select_block_type_1(ctx, dirty) {
    		if (/*product*/ ctx[8]?.customFields2?.skus.length > 1) return create_if_block_8;
    		return create_else_block_1;
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
    			if (!src_url_equal(img.src, img_src_value = /*product*/ ctx[8]?.customFields2?.skus[0]?.productImages[0]?.productImage?.mediaItemUrl)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "result-image svelte-1wybhjw");
    			add_location(img, file$2, 34, 28, 1571);
    			attr_dev(div0, "class", "c-red search-product-sku-count svelte-1wybhjw");
    			add_location(div0, file$2, 43, 28, 2008);
    			add_location(div1, file$2, 49, 28, 2353);
    			attr_dev(a, "href", a_href_value = /*product*/ ctx[8]?.link);
    			attr_dev(a, "class", "search-product-result svelte-1wybhjw");
    			add_location(a, file$2, 33, 24, 1488);
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
    			if (dirty & /*$results*/ 1 && !src_url_equal(img.src, img_src_value = /*product*/ ctx[8]?.customFields2?.skus[0]?.productImages[0]?.productImage?.mediaItemUrl)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*$results*/ 1 && t1_value !== (t1_value = /*product*/ ctx[8]?.customFields2?.skus.length + "")) set_data_dev(t1, t1_value);

    			if (current_block_type !== (current_block_type = select_block_type_1(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			}

    			if (dirty & /*$searchQuery, $results*/ 5 && raw_value !== (raw_value = highlightResults(/*$searchQuery*/ ctx[2], /*product*/ ctx[8]?.title) + "")) div1.innerHTML = raw_value;
    			if (dirty & /*$results*/ 1 && a_href_value !== (a_href_value = /*product*/ ctx[8]?.link)) {
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
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(33:20) {#if i < 3}",
    		ctx
    	});

    	return block;
    }

    // (48:32) {:else}
    function create_else_block_1(ctx) {
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
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(48:32) {:else}",
    		ctx
    	});

    	return block;
    }

    // (46:32) {#if product?.customFields2?.skus.length > 1}
    function create_if_block_8(ctx) {
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
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(46:32) {#if product?.customFields2?.skus.length > 1}",
    		ctx
    	});

    	return block;
    }

    // (32:16) {#each $results?.data?.products?.nodes as product, i}
    function create_each_block_1(ctx) {
    	let if_block_anchor;
    	let if_block = /*i*/ ctx[7] < 3 && create_if_block_7(ctx);

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
    			if (/*i*/ ctx[7] < 3) if_block.p(ctx, dirty);
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
    		source: "(32:16) {#each $results?.data?.products?.nodes as product, i}",
    		ctx
    	});

    	return block;
    }

    // (63:8) {#if $results?.data?.other != null && $results?.data?.other?.length > 0}
    function create_if_block_1$1(ctx) {
    	let div1;
    	let div0;
    	let t1;

    	function select_block_type_2(ctx, dirty) {
    		if (/*$results*/ ctx[0]?.data?.other) return create_if_block_2$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Other";
    			t1 = space();
    			if_block.c();
    			attr_dev(div0, "class", "result-title svelte-1wybhjw");
    			add_location(div0, file$2, 64, 16, 2936);
    			attr_dev(div1, "class", "search-results__section-title svelte-1wybhjw");
    			add_location(div1, file$2, 63, 12, 2876);
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
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(63:8) {#if $results?.data?.other != null && $results?.data?.other?.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (85:16) {:else}
    function create_else_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "No other pages found";
    			add_location(div, file$2, 85, 20, 3941);
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
    		source: "(85:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (66:16) {#if $results?.data?.other}
    function create_if_block_2$1(ctx) {
    	let each_1_anchor;
    	let each_value = /*$results*/ ctx[0]?.data?.other;
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
    			if (dirty & /*$results, highlightResults, $searchQuery*/ 5) {
    				each_value = /*$results*/ ctx[0]?.data?.other;
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
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(66:16) {#if $results?.data?.other}",
    		ctx
    	});

    	return block;
    }

    // (68:24) {#if i < 3}
    function create_if_block_3(ctx) {
    	let a;
    	let div0;
    	let raw_value = highlightResults(/*$searchQuery*/ ctx[2], /*other*/ ctx[5]?.title) + "";
    	let t0;
    	let div1;
    	let t1;
    	let a_href_value;

    	function select_block_type_3(ctx, dirty) {
    		if (/*other*/ ctx[5]?.postType == "post") return create_if_block_4;
    		if (/*other*/ ctx[5]?.postType == "page") return create_if_block_5;
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
    			add_location(div0, file$2, 72, 32, 3333);
    			attr_dev(div1, "class", "other-post-type svelte-1wybhjw");
    			add_location(div1, file$2, 78, 32, 3617);
    			attr_dev(a, "href", a_href_value = /*other*/ ctx[5]?.permalink);
    			attr_dev(a, "class", "search-product-result other svelte-1wybhjw");
    			add_location(a, file$2, 68, 28, 3144);
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
    			if (dirty & /*$searchQuery, $results*/ 5 && raw_value !== (raw_value = highlightResults(/*$searchQuery*/ ctx[2], /*other*/ ctx[5]?.title) + "")) div0.innerHTML = raw_value;
    			if (current_block_type !== (current_block_type = select_block_type_3(ctx))) {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			}

    			if (dirty & /*$results*/ 1 && a_href_value !== (a_href_value = /*other*/ ctx[5]?.permalink)) {
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
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(68:24) {#if i < 3}",
    		ctx
    	});

    	return block;
    }

    // (80:110) 
    function create_if_block_5(ctx) {
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
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(80:110) ",
    		ctx
    	});

    	return block;
    }

    // (80:36) {#if other?.postType == "post"}
    function create_if_block_4(ctx) {
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
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(80:36) {#if other?.postType == \\\"post\\\"}",
    		ctx
    	});

    	return block;
    }

    // (67:20) {#each $results?.data?.other as other, i}
    function create_each_block$1(ctx) {
    	let if_block_anchor;
    	let if_block = /*i*/ ctx[7] < 3 && create_if_block_3(ctx);

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
    			if (/*i*/ ctx[7] < 3) if_block.p(ctx, dirty);
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
    		source: "(67:20) {#each $results?.data?.other as other, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$searchQuery*/ ctx[2].length > 0 && create_if_block$1(ctx);

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
    			if (/*$searchQuery*/ ctx[2].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$searchQuery*/ 4) {
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
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let totalResults;
    	let $results;
    	let $searchQuery;
    	validate_store(results, 'results');
    	component_subscribe($$self, results, $$value => $$invalidate(0, $results = $$value));
    	validate_store(searchQuery, 'searchQuery');
    	component_subscribe($$self, searchQuery, $$value => $$invalidate(2, $searchQuery = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Results', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Results> was created with unknown prop '${key}'`);
    	});

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler = async category => {
    		searchQuery.set(category);
    	};

    	$$self.$capture_state = () => ({
    		Submit,
    		highlightResults,
    		results,
    		searchQuery,
    		totalResults,
    		$results,
    		$searchQuery
    	});

    	$$self.$inject_state = $$props => {
    		if ('totalResults' in $$props) $$invalidate(1, totalResults = $$props.totalResults);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$results*/ 1) {
    			$$invalidate(1, totalResults = $results?.data?.products?.nodes?.length + $results.data.other.length);
    		}
    	};

    	return [$results, totalResults, $searchQuery, keydown_handler, click_handler];
    }

    class Results extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Results",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Logo.svelte generated by Svelte v3.59.2 */

    const file$1 = "src/Logo.svelte";

    function create_fragment$1(ctx) {
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

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			defs = svg_element("defs");
    			style = svg_element("style");
    			t = text(".cls-1 {\n                fill: #e63228;\n                stroke-width: 0px;\n            }\n        ");
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
    			add_location(style, file$1, 6, 8, 114);
    			add_location(defs, file$1, 5, 4, 99);
    			attr_dev(rect, "class", "cls-1");
    			attr_dev(rect, "x", "465.55");
    			attr_dev(rect, "width", "36.42");
    			attr_dev(rect, "height", "114.15");
    			add_location(rect, file$1, 15, 12, 324);
    			attr_dev(polygon0, "class", "cls-1");
    			attr_dev(polygon0, "points", "662.08 71.55 687.57 71.55 699.12 42.6 662.08 42.6 662.08 28.95 688.17 28.95 699.73 0 662.08 0 636.51 0 625.66 0 625.66 114.15 636.51 114.15 662.08 114.15 688.17 114.15 699.73 85.2 662.08 85.2 662.08 71.55");
    			add_location(polygon0, file$1, 16, 12, 400);
    			attr_dev(polygon1, "class", "cls-1");
    			attr_dev(polygon1, "points", "346.9 0 310.48 0 310.48 114.15 328.69 114.15 346.9 114.15 362.39 114.15 373.94 82.9 346.9 82.9 346.9 0");
    			add_location(polygon1, file$1, 20, 12, 696);
    			attr_dev(polygon2, "class", "cls-1");
    			attr_dev(polygon2, "points", "576.94 47.83 550.68 0 514.26 0 514.26 114.15 550.68 114.15 550.68 66.32 576.94 114.15 613.36 114.15 613.36 0 576.94 0 576.94 47.83");
    			add_location(polygon2, file$1, 24, 12, 890);
    			attr_dev(path0, "class", "cls-1");
    			attr_dev(path0, "d", "m435.72,0h-54.1v114.15h36.42v-28.71h17.69c10.15,0,18.38-8.23,18.38-18.38V18.38c0-10.15-8.23-18.38-18.38-18.38Zm-8.26,48.73c0,4.3-3.36,8.35-9.42,8.35v-31.16c4.71,0,9.42,3.26,9.42,7.96v14.85Z");
    			add_location(path0, file$1, 28, 12, 1112);
    			attr_dev(path1, "class", "cls-1");
    			attr_dev(path1, "d", "m257.76,0h-36.42l-16.6,114.15h36.42l2.04-14.06h18.12l2.04,14.06h36.42L283.18,0h-25.43Zm-11.81,81.19l6.31-43.39,6.31,43.39h-12.62Z");
    			add_location(path1, file$1, 32, 12, 1385);
    			attr_dev(polygon3, "class", "cls-1");
    			attr_dev(polygon3, "points", "125.83 0 108.15 0 89.42 0 80.58 60.76 71.75 0 53.02 0 35.33 0 16.6 0 0 114.15 36.42 114.15 44.17 60.81 51.93 114.15 72.82 114.15 88.35 114.15 109.24 114.15 116.99 60.81 124.75 114.15 161.17 114.15 144.57 0 125.83 0");
    			add_location(polygon3, file$1, 36, 12, 1598);
    			attr_dev(path2, "class", "cls-1");
    			attr_dev(path2, "d", "m161.31,17.91h0v33.7h0c0,9.89,8.02,17.91,17.91,17.91h23.01v-17.91h-3.9c-5.37,0-9.72-4.35-9.72-9.72v-14.26c0-5.37,4.35-9.72,9.72-9.72h3.9V0h-23.01c-9.89,0-17.91,8.02-17.91,17.91Z");
    			add_location(path2, file$1, 40, 12, 1904);
    			attr_dev(g0, "id", "McAlpine_Logo_-_New");
    			add_location(g0, file$1, 14, 8, 283);
    			attr_dev(g1, "id", "Layer_1-2");
    			add_location(g1, file$1, 13, 4, 256);
    			attr_dev(svg, "id", "Layer_2");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 699.73 114.15");
    			add_location(svg, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
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
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Logo', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Logo> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Logo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Logo",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
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

    /* src/App.svelte generated by Svelte v3.59.2 */
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (72:8) {#if interestsOpen}
    function create_if_block_1(ctx) {
    	let div;
    	let div_transition;
    	let current;
    	let if_block = /*menu*/ ctx[1]?.menuItems?.nodes && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "interest-links svelte-8fyihs");
    			add_location(div, file, 72, 12, 1947);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*menu*/ ctx[1]?.menuItems?.nodes) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					if_block.m(div, null);
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
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, { duration: 200 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, slide, { duration: 200 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(72:8) {#if interestsOpen}",
    		ctx
    	});

    	return block;
    }

    // (74:16) {#if menu?.menuItems?.nodes}
    function create_if_block_2(ctx) {
    	let each_1_anchor;
    	let each_value = /*menu*/ ctx[1]?.menuItems?.nodes;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
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
    			if (dirty & /*menu*/ 2) {
    				each_value = /*menu*/ ctx[1]?.menuItems?.nodes;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
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
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(74:16) {#if menu?.menuItems?.nodes}",
    		ctx
    	});

    	return block;
    }

    // (75:20) {#each menu?.menuItems?.nodes as item}
    function create_each_block(ctx) {
    	let a;
    	let t_value = /*item*/ ctx[9].label + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = /*item*/ ctx[9].url);
    			attr_dev(a, "class", "svelte-8fyihs");
    			add_location(a, file, 75, 24, 2141);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*menu*/ 2 && t_value !== (t_value = /*item*/ ctx[9].label + "")) set_data_dev(t, t_value);

    			if (dirty & /*menu*/ 2 && a_href_value !== (a_href_value = /*item*/ ctx[9].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(75:20) {#each menu?.menuItems?.nodes as item}",
    		ctx
    	});

    	return block;
    }

    // (94:8) {#if $results?.data != null || $results?.other?.length > 0}
    function create_if_block(ctx) {
    	let results_1;
    	let current;
    	results_1 = new Results({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(results_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(results_1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(results_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(results_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(results_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(94:8) {#if $results?.data != null || $results?.other?.length > 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let form;
    	let div0;
    	let a;
    	let logo;
    	let t0;
    	let div2;
    	let div1;
    	let t1;
    	let svg;
    	let g1;
    	let g0;
    	let rect;
    	let path;
    	let t2;
    	let div2_class_value;
    	let t3;
    	let div3;
    	let span;
    	let t5;
    	let input;
    	let t6;
    	let t7;
    	let div4;
    	let t8;
    	let div5;
    	let current;
    	let mounted;
    	let dispose;
    	logo = new Logo({ $$inline: true });
    	let if_block0 = /*interestsOpen*/ ctx[2] && create_if_block_1(ctx);
    	let if_block1 = (/*$results*/ ctx[4]?.data != null || /*$results*/ ctx[4]?.other?.length > 0) && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			form = element("form");
    			div0 = element("div");
    			a = element("a");
    			create_component(logo.$$.fragment);
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			t1 = text("Select Interest\n            ");
    			svg = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			rect = svg_element("rect");
    			path = svg_element("path");
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			div3 = element("div");
    			span = element("span");
    			span.textContent = "Search for:";
    			t5 = space();
    			input = element("input");
    			t6 = space();
    			if (if_block1) if_block1.c();
    			t7 = space();
    			div4 = element("div");
    			t8 = space();
    			div5 = element("div");
    			attr_dev(a, "href", "/");
    			attr_dev(a, "class", "site-logo svelte-8fyihs");
    			add_location(a, file, 47, 8, 1070);
    			add_location(div0, file, 46, 4, 1056);
    			attr_dev(rect, "width", "24");
    			attr_dev(rect, "height", "24");
    			attr_dev(rect, "opacity", "0");
    			attr_dev(rect, "class", "svelte-8fyihs");
    			add_location(rect, file, 64, 25, 1604);
    			attr_dev(path, "d", "M12 15.5a1 1 0 0 1-.71-.29l-4-4a1 1 0 1 1 1.42-1.42L12 13.1l3.3-3.18a1 1 0 1 1 1.38 1.44l-4 3.86a1 1 0 0 1-.68.28z");
    			attr_dev(path, "class", "svelte-8fyihs");
    			add_location(path, file, 64, 68, 1647);
    			attr_dev(g0, "data-name", "chevron-down");
    			add_location(g0, file, 63, 21, 1551);
    			attr_dev(g1, "data-name", "Layer 2");
    			add_location(g1, file, 62, 17, 1507);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "class", "svelte-8fyihs");
    			add_location(svg, file, 61, 12, 1430);
    			attr_dev(div1, "class", "interest-title svelte-8fyihs");
    			add_location(div1, file, 59, 8, 1361);
    			attr_dev(div2, "name", "interest");
    			attr_dev(div2, "class", div2_class_value = "select-interest " + (/*interestsOpen*/ ctx[2] ? 'open' : 'closed') + " svelte-8fyihs");
    			add_location(div2, file, 51, 4, 1150);
    			attr_dev(span, "class", "screen-reader-text");
    			add_location(span, file, 83, 8, 2317);
    			attr_dev(input, "type", "search");
    			attr_dev(input, "placeholder", "Search a product name, SKU or term…");
    			attr_dev(input, "autocomplete", "off");
    			attr_dev(input, "id", "search-field");
    			attr_dev(input, "class", "search-field svelte-8fyihs");
    			attr_dev(input, "name", "s");
    			add_location(input, file, 84, 8, 2377);
    			attr_dev(div3, "class", "search-form__input svelte-8fyihs");
    			add_location(div3, file, 82, 4, 2276);
    			add_location(div4, file, 97, 4, 2758);
    			add_location(div5, file, 98, 4, 2770);
    			attr_dev(form, "class", "search-form svelte-8fyihs");
    			attr_dev(form, "id", "search-form");
    			attr_dev(form, "role", "search");
    			attr_dev(form, "method", "get");
    			attr_dev(form, "action", /*siteUrl*/ ctx[0]);
    			add_location(form, file, 39, 0, 943);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, div0);
    			append_dev(div0, a);
    			mount_component(logo, a, null);
    			append_dev(form, t0);
    			append_dev(form, div2);
    			append_dev(div2, div1);
    			append_dev(div1, t1);
    			append_dev(div1, svg);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, rect);
    			append_dev(g0, path);
    			append_dev(div2, t2);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(form, t3);
    			append_dev(form, div3);
    			append_dev(div3, span);
    			append_dev(div3, t5);
    			append_dev(div3, input);
    			set_input_value(input, /*$searchQuery*/ ctx[3]);
    			append_dev(div3, t6);
    			if (if_block1) if_block1.m(div3, null);
    			append_dev(form, t7);
    			append_dev(form, div4);
    			append_dev(form, t8);
    			append_dev(form, div5);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div2, "click", /*click_handler*/ ctx[6], false, false, false, false),
    					listen_dev(div2, "keydown", /*keydown_handler*/ ctx[5], false, false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[7])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*interestsOpen*/ ctx[2]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*interestsOpen*/ 4) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div2, null);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*interestsOpen*/ 4 && div2_class_value !== (div2_class_value = "select-interest " + (/*interestsOpen*/ ctx[2] ? 'open' : 'closed') + " svelte-8fyihs")) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (dirty & /*$searchQuery*/ 8 && input.value !== /*$searchQuery*/ ctx[3]) {
    				set_input_value(input, /*$searchQuery*/ ctx[3]);
    			}

    			if (/*$results*/ ctx[4]?.data != null || /*$results*/ ctx[4]?.other?.length > 0) {
    				if (if_block1) {
    					if (dirty & /*$results*/ 16) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div3, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*siteUrl*/ 1) {
    				attr_dev(form, "action", /*siteUrl*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(logo.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(logo.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_component(logo);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
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

    function instance($$self, $$props, $$invalidate) {
    	let $searchQuery;
    	let $results;
    	validate_store(searchQuery, 'searchQuery');
    	component_subscribe($$self, searchQuery, $$value => $$invalidate(3, $searchQuery = $$value));
    	validate_store(results, 'results');
    	component_subscribe($$self, results, $$value => $$invalidate(4, $results = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { siteUrl = "" } = $$props;
    	let menu = {};
    	let interestsOpen = false;
    	let timer;

    	onMount(async () => {
    		let fetchMenu = await getData(menuQuery);
    		$$invalidate(1, menu = fetchMenu.data.menus.edges[0].node);
    	});

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

    	const writable_props = ['siteUrl'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler = () => {
    		$$invalidate(2, interestsOpen = !interestsOpen);
    	};

    	function input_input_handler() {
    		$searchQuery = this.value;
    		searchQuery.set($searchQuery);
    	}

    	$$self.$$set = $$props => {
    		if ('siteUrl' in $$props) $$invalidate(0, siteUrl = $$props.siteUrl);
    	};

    	$$self.$capture_state = () => ({
    		siteUrl,
    		Results,
    		Logo,
    		onMount,
    		slide,
    		menuQuery,
    		getData,
    		previousSuggestions,
    		results,
    		searchQuery,
    		getResults,
    		menu,
    		interestsOpen,
    		timer,
    		$searchQuery,
    		$results
    	});

    	$$self.$inject_state = $$props => {
    		if ('siteUrl' in $$props) $$invalidate(0, siteUrl = $$props.siteUrl);
    		if ('menu' in $$props) $$invalidate(1, menu = $$props.menu);
    		if ('interestsOpen' in $$props) $$invalidate(2, interestsOpen = $$props.interestsOpen);
    		if ('timer' in $$props) timer = $$props.timer;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		siteUrl,
    		menu,
    		interestsOpen,
    		$searchQuery,
    		$results,
    		keydown_handler,
    		click_handler,
    		input_input_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { siteUrl: 0 });

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
    }

    return App;

}));
//# sourceMappingURL=search.js.map
